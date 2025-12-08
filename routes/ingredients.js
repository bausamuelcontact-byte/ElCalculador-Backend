var express = require("express");
var router = express.Router();
const Ingredient = require("");

// Recuperation de tous les ingrédients
router.get("/", (req, res) => {
  Ingredient.find()
    .then((data) => {
      res.json({ ingredient: data });
    })
    .catch((err) => console.error("Erreur de recuperation :", err));
});

// Création d'un ingrédient
router.post("/", (req, res) => {
  const newIngredient = new Ingredient({
    name: String,
    quantity: Number,
    price: Number,
    unit: String,
    tva: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  });
  newIngredient
    .save()
    .then(() => {
      res.json({ result: true, message: "Ingrédient ajouté" });
    })
    .catch((err) => console.error("Probleme ajout ingredient :", err));
});

//Modification d'un ingredient selon id
router.put("/", (req, res) => {
  Ingredient.updateOne(
    { _id: req.body.id },
    {
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      unit: req.body.unit,
      tva: req.body.tva,
    }
  )
    .then(() => {
      Ingredient.findOne({ _id: req.body.id }).then((data) => {
        res.json({ result: true, ingredient: data });
      });
    })
    .catch((err) => console.error("Erreur de recherche ingredient :", err));
});

//Suppression d'un ingredient par son id
router.delete("/", (req, res) => {
  Ingredient.deleteOne({ id: req.body.id }).then(() => {
    Ingredient.findOne({ id: req.body.id }).then((data) => {
      if (data) {
        res.json({ result: false, error: "erreur de suppression" });
      } else {
        res.json({ result: true });
      }
    });
  });
});

module.exports = router;
