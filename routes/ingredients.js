var express = require("express");
var router = express.Router();
const Ingredient = require("../models/ingredients");

// Recuperation de tous les ingrédients selon user
router.get("/search/:id", (req, res) => {
  Ingredient.find({ user: req.params.id })
    .then((data) => {
      if (data) {
        res.json({ ingredient: data });
      } else {
        res.json({ ingredient: "aucun ingrédient trouvé" });
      }
    })
    .catch((err) => console.error("Erreur de recuperation :", err));
});

// Création d'un ingrédient
router.post("/", (req, res) => {
  const newIngredient = new Ingredient({
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
    unit: req.body.unit,
    TVA: req.body.tva,
    user: req.body.user,
  });
  newIngredient
    .save()
    .then(() => {
      res.json({ result: true });
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
  Ingredient.deleteOne({ _id: req.body.id }).then(() => {
    Ingredient.findOne({ _id: req.body.id }).then((data) => {
      if (data) {
        res.json({ result: false, error: "erreur de suppression" });
      } else {
        res.json({ result: true });
      }
    });
  });
});

module.exports = router;
