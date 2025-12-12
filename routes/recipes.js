var express = require("express");
var router = express.Router();
const Recipe = require("../models/recipes");

// Recupérer toutes les recettes de l'utilisateur de la session en cours
router.get("/:userId", (req, res) => {
  Recipe.find({ user: req.params.userId })
    .then((data) => {
      res.json({ result: true, recipe: data });
    })
    .catch((err) => console.error("Erreur de recherche recette :", err));
});

//Création d'une nouvelle recette
router.post("/", (req, res) => {
  const newRecipe = new Recipe({
    name: req.body.name,
    price: req.body.price,
    allergens: req.body.allergens,
    ingredients: req.body.ingredients,
    user: req.body.token,
    TVA: req.body.tva,
  });
  newRecipe
    .save()
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => console.error("Probleme ajout ingredient :", err));
});

// [{ingredient:6936a41fb4194f05f9184897, quantity: 3, unit: piece},{ingredient:6936a3f4f9e49241fec54fd3, quantity: 2, unit: gr}]
// // Modification des recettes
router.put("/", (req, res) => {
  Recipe.updateOne(
    { _id: req.body.id },
    {
      name: req.body.name,
      ingredients: req.body.ingredients,
      price: req.body.price,
      tva: req.body.tva,
      allergens: req.body.allergens,
    }
  )
    .catch((err) => console.error("Probleme de modification :", err))
    .then(() => {
      Recipe.findOne({ _id: req.body.id }).then((data) => {
        if (data) {
          res.json({ result: true, recette: data });
        } else {
          res.json({ result: false, error: "Recette non modifiée" });
        }
      });
    });
});

//Modification/Suppression Ingrédient
router.put("/ingredients", (req, res) => {
  Recipe.updateOne(
    { _id: req.body.id },
    {
      ingredients: req.body.ingredients,
    }
  )
    .catch((err) => console.error("Probleme de modification :", err))
    .then(() => {
      Recipe.findOne({ _id: req.body.id }).then((data) => {
        if (data) {
          res.json({ result: true, recette: data });
        } else {
          res.json({ result: false, error: "Recette non existante" });
        }
      });
    });
});

//Suppression d'une recette
router.delete("/", (req, res) => {
  Recipe.deleteOne({ _id: req.body.id })
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => console.error("Probleme de suppression one :", err));
});
module.exports = router;
