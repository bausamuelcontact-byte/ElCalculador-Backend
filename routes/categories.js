var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
require("../models/connection");
const User = require("../models/users");
const Recipe = require("../models/recipes");
const Category = require("../models/categories");

// Créer une nouvelle catégorie de recettes
router.post("/add", (req, res) => {
  if (!req.body.name)
    return res.json({ result: false, error: "Missing field" });

  Category.findOne({ name: req.body.name, user: req.body.userId })
    .then((exestingCategory) => {
      if (exestingCategory)
        return res.json({ result: false, error: "category already exists" });

      const newCategory = new Category({
        name: req.body.name,
        recipes: [],
        user: req.body.userId,
      });

      newCategory.save().then((data) => {
        res.json({ result: true, category: data.name });
      });
    })
    .catch((err) => {
      res.json({ result: false, error: "Server error" });
    });
});

// Modifier le nom d'une catégorie existante
router.put("/update", (req, res) => {
  Category.updateOne({ _id: req.body.categoryId }, { name: req.body.name })
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => {
      res.json({ error: "Erreur de modification de l'ingredient" });
    });
});

// Afficher toutes les catégories d'un utilisateur
router.get("/:id", (req, res) => {
  Category.find({ user: req.params.id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ result: false, error: "Server error" });
    });
});

// Ajouter une nouvelle recette à une catégorie
router.put("/addRecipeToCategory", (req, res) => {
  Category.findById(req.body.categoryId)
    .then((data) => {
      if (!data) {
        return res.json({ result: false, error: "Category not found" });
      }
      if (data.recipes.some((e) => e.toString() === req.body.recipeId)) {
        return res.json({
          result: false,
          error: "Recipe already registred in this category",
        });
      }
      data.recipes.push(new mongoose.Types.ObjectId(req.body.recipeId));
      data.save().then((data) => {
        res.json({ result: true, message: `Recipe added to ${data.name}` });
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ result: false });
    });
});

// Enlever une recette d'une catégorie
router.delete("/removeRecipeFromCategory", (req, res) => {
  Category.findById(req.body.categoryId)
    .then((data) => {
      if (!data) {
        return res.json({ result: false, error: "Category not found" });
      }
      data.recipes = data.recipes.filter(
        (e) => e.toString() !== req.body.recipeId.toString()
      );
      data.save().then((data) => {
        res.json({ result: true, message: `Recipe removed from ${data.name}` });
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ result: false });
    });
});

// Supprimer une catégorie par ID
router.delete("/remove/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.json({ result: true, message: "category deleted" });
    })
    .catch((err) => {
      res.json({ result: false, error: "Server error" });
    });
});

module.exports = router;
