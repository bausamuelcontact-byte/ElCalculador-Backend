var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkbody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const { log } = require("console");

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
  User.findOne({ mail: req.body.email }).then((data) => {
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
        res.json({ result: true, token: newDoc.token });
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

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["mail", "password"])) {
    res.json({ result: false, error: "Email ou mot de passe non renseigné" });
    return;
  }

  User.findOne({ mail: req.body.mail }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, id: data._id });
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
          avatar: data.avatar,
        },
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
