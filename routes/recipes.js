var express = require("express");
var router = express.Router();
const Recipe = require("../models/recipes");

// Recupere toutes les recettes
router.get("/search/:userId", (req, res) => {
  if (!req.params.userId)
    return res.json({ result: false, error: "Id manquant" });
  Recipe.find({ user: req.params.userId })
    .then((data) => {
      if (data) {
        res.json({ recipe: data });
      } else {
        res.json({ recipe: "Aucune recette de trouvée" });
      }
    })
    .catch((err) => console.error("Erreur de recherche recette :", err));
}); 

// récupérer les ingrédients contenus dans toutes les recettes de l'utilisateur en utilisant .populate sur la clé 'ingredients.ingredient'
router.get("/withIngredients/user/:userId", (req, res) => {
  Recipe.find({ user: req.params.userId })
    .populate("ingredients.ingredient")
    .then((data) => {
      res.json({ result: true, recipe: data });
    })
    .catch((err) => console.error("Erreur de recherche recette avec ingrédients :", err));
});

// récupérer les ingrédients d'une recette spécifique en utilisant .populate sur la clé 'ingredients.ingredient'
router.get("/withIngredients/:id", (req, res) => {
  Recipe.findOne({ _id: req.params.id })
    .populate("ingredients.ingredient")
    .then((data) => {
      if (data) {
        res.json({ result: true, recipe: data });
      } else {
        res.json({ result: false, error: "Recette non trouvée" });
      }
    })
    .catch((err) => console.error("Erreur de recherche recette avec ingrédients :", err));
});

//Création d'une nouvelle recette
router.post("/", (req, res) => {
  const { name, ingredients, price, tva, id, allergens } = req.body;

  if (!name || !ingredients || !price || !tva || !id || !allergens)
    return res.json({ result: false, error: "Missing Information" });

  Recipe.findOne({ user: req.body.id, name: req.body.name })
    .then((existingRecipe) => {
      if (existingRecipe)
        return res.json({ result: false, error: "Ingredient already exists" });
      const newRecipe = new Recipe({
        name: req.body.name,
        price: req.body.price,
        allergens: req.body.allergens,
        ingredients: req.body.ingredients,
        user: req.body.id,
        TVA: req.body.tva,
      });
      newRecipe.save().then(() => {
        res.json({ result: true });
      });
    })
    .catch((err) => console.error("Probleme ajout ingredient :", err));
});

// Modification des recettes
router.put("/", (req, res) => {
  const { name, ingredients, price, tva, user, allergens } = req.body;

  if (!name || !ingredients || !price || !tva || !user || !allergens)
    return res.json({ result: false, error: "Missing Information" });

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
  const { name, ingredients, price, tva, id, allergens } = req.body;

  if (!name || !ingredients || !price || !tva || !id || !allergens)
    return res.json({ result: false, error: "Missing Information" });

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
  if (!req.body.id) return res.json({ result: false, error: "Id manquant" });
  Recipe.deleteOne({ _id: req.body.id });
  Recipe.findOne({ _id: req.body.id })
    .then((data) => {
      if (data) {
        res.json({ result: false, error: "Erreur de suppression" });
      } else {
        res.json({ result: true });
      }
    })
    .catch((err) => console.error("Probleme de suppression one :", err));
});
module.exports = router;
