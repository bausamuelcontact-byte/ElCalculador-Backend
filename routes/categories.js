var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
require("../models/connection");
const User = require("../models/users");
const Recipe = require("../models/recipes");
const Category = require("../models/categories");

// Créer une nouvelle catégorie de recettes
router.post("/add/:userId", (req, res) => {
  if (!req.body.name)
    return res.json({ result: false, error: "Missing field" });

  Category.findOne({ name: req.body.name, user: req.params.userId })
    .then((exestingCategory) => {
      if (exestingCategory)
        return res.json({ result: false, error: "category already exists" });

      const newCategory = new Category({
        name: req.body.name,
        recipes: [],
        user: req.params.userId,
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
router.get("/:userId", (req, res) => {
  Category.find({ user: req.params.userId })
    .then((data) => {
      res.json({ categories: data });
    })
    .catch((err) => {
      res.json({ result: false, error: "Server error" });
    });
});

// Afficher la categorie selon id d'une recette
router.get("/recipeId/:recipeId", (req, res) => {
  Category.find({ recipes: req.params.recipeId })
    .populate("recipes")
    .then((data) => {
      console.log(data);

      res.json({ category: data });
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
      // Vérifier si la recette existe déjà dans cette catégorie
      if (
        data.recipes.some((e) => e === req.body.recipeId) ||
        !req.body.recipeId
      ) {
        return res.json({
          result: false,
          message: "Recipe already registred in this category",
        });
      }
      // Ajouter la recette à la catégorie
      if (req.body.recipeId) {
        data.recipes.push(req.body.recipeId);
      }
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
