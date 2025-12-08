var express = require("express");
var router = express.Router();
const Recipe = require("");

// Recupere toutes les recettes
router.get("/", (req, res) => {
  Recipe.find()
    .then(() => {
      res.json({ result: true, recipe: data });
    })
    .catch((err) => console.error("Erreur de recherche recette :", err));
});

//Création d'une nouvelle recette
router.post("/", (req, res) => {
  const newRecipe = new Recipe({});
});

module.exports = router;
