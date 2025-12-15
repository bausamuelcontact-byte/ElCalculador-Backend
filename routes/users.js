var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkbody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const uniqid = require("uniqid");

router.post("/signup", (req, res) => {
  // Grabbed from emailregex.com
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Check numéro de téléphone format correct
  const PHONE_REGEX_FR = /^(0[67]\d{8}|(?:\+33)[67]\d{8})$/;

  if (
    !checkBody(req.body, [
      "firstname",
      "lastname",
      "tel",
      "mail",
      "password",
      "restaurantName",
    ])
  ) {
    res.json({
      result: false,
      error: "Un ou plusieurs champs obligatoires manquants.",
    });
    return;
  }

  if (!EMAIL_REGEX.test(req.body.mail)) {
    res.json({ result: false, error: "Format adresse mail incorrect." });
    return;
  }

  if (!PHONE_REGEX_FR.test(req.body.tel)) {
    res.json({ result: false, error: "Format numéro de téléphone incorrect." });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ mail: req.body.mail}).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        tel: req.body.tel,
        mail: req.body.mail,
        restaurantName: req.body.restaurantName,
        avatar: req.body.avatar,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token, id: newDoc._id, avatar: newDoc.avatar ?? null});
      });
    } else {
      // User already exists in database
      res.json({
        result: false,
        error: "Cette adresse mail est liée à un compte existant.",
      });
    }
  });
});

// upload avatar après signup
router.put("/avatar/:userId", async (req, res) => {
  try {
    // Vérif fichier
    if (!req.files || !req.files.avatar) {
      return res.json({ result: false, error: "No avatar uploaded" });
    }

    const avatar = req.files.avatar;

    // Fichier temporaire
    const tempPath = `/tmp/${uniqid()}.jpg`;
    await avatar.mv(tempPath);

    // Upload Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempPath, {
      folder: "avatars",
    });

    // Update user
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { avatar: uploadResult.secure_url },
      { new: true }
    );

    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Réponse
    res.json({
      result: true,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(error);
    res.json({ result: false, error: error.message });
  }
});


router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["mail", "password"])) {
    res.json({ result: false, error: "Email ou mot de passe non renseigné" });
    return;
  }

  User.findOne({ mail: req.body.mail }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, id: data._id, avatar: data.avatar ?? null});
    } else {
      res.json({
        result: false,
        error: "Adresse e-mail ou mot de passe incorrect",
      });
    }
  });
});

router.get("/isConnected/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({
        result: true,
        userInfo: {
          firstname: data.firstname,
          lastname: data.lastname,
          restaurantName: data.restaurantName,
          avatar: data.avatar ?? null,
        },
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

// test route to get all users
router.get("/", (req, res) => {
  User.find()
    .then((data) => {
      res.json({ result: true, users: data });
    })
    .catch((err) => {
      res.json({ result: false, error: err });
    });
});  

// test route to delete a user by its id
router.delete("/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((data) => {
      if (data.deletedCount > 0) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: "User not found" });
      }
    }) 
    .catch((err) => {res.json({ result: false, error: err });});
}); 

module.exports = router;
