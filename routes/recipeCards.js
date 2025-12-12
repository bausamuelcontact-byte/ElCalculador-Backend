var express = require("express");
var router = express.Router();
const recipeCards = require("../models/recipeCards");

  /*{
  "result": true,
  "userInfo": {
    "id": "6936ab0cee14c830750e2bea",
    "token": "pt0oyg44CsVgLGck-74jVju5Ts2fxiRL",
    "firstname": "Thomas",
    "lastname": "Morini",
    "restaurantName": "El Thomas",
    "avatar": ""
  }
}*/ 

// récupère toutes les fiches recettes (test seulement)
router.get("/", (req, res) => {
  recipeCards.find()
    .then((data) => {
      res.json({ result: true, recipeCards: data });
    })
    .catch((err) => {res.json({ result: false, error: err })});
}); 

// renvoie true et la fiche recette si la recette a une fiche recette, false sinon et une recipeCard vide avec une indication
router.get("/hasRecipeCard/:recipeId", (req, res) => {
  recipeCards.findOne({ recipe: req.params.recipeId })
    .then((data) => {
      if (data) {
        res.json({ result: true, recipeCard: data });
      } else {
        res.json({ result: false, recipeCard : ['Pas de fiche recette existante.'] });
      }
    })
    .catch((err) => {res.json({ result: false, error: err })});
});

// Recupere toutes les fiches recettes de l'utilisateur et ajoute les infos de la recette associée avec .populate sur la clé 'recipe'
router.get("/:userId", (req, res) => {
  recipeCards.find({ user: req.params.userId })
    .populate("recipe")
    .then((data) => {
      res.json({ result: true, recipeCards: data });
    })
    .catch((err) => {res.json({ result: false, error: err })});
});

// récupère une fiche recette via son id et ajoute les infos de la recette associée avec .populate sur la clé 'recipe'
router.get("/recipeCard/:id", (req, res) => {
  recipeCards.findOne({ _id: req.params.id })
    .populate("recipe")
    .then((data) => {
      if (data) {
        res.json({ result: true, recipeCard: data });
      } else {
        res.json({ result: false, error: "Fiche recette non trouvée" });
      }
    })
    .catch((err) => {res.json({ result: false, error: err })});
}); 

//Création d'une nouvelle fiche recette
router.post("/", (req, res) => {
  const newRecipeCard = new recipeCards({
    image: req.body.image,     
    description: req.body.description,
    recipe: req.body.recipeId,
    user: req.body.userId,
  });
  newRecipeCard
    .save()
    .then(() => {
      res.json({ result: true, recipeCard: newRecipeCard });
    })
    .catch((err) => {res.json({ result: false, error: err })});
})

// mise à jour d'une fiche recette liée à une recette existante
router.put("/", (req, res) => {
  recipeCards.updateOne({recipe: req.body.recipeId}, {
    image: req.body.image,
    description: req.body.description,
  })
    .catch((err) => {res.json({ result: false, error: err })})
    .then(() => {
      recipeCards.findOne({ _id: req.body.id }).then((data) => {
        if (data) {
          res.json({ result: true, recipeCard: data });
        } else {
          res.json({ result: false, error: "Fiche recette non modifiée" });
        }
      });
    });
});

// effacement d'une fiche recette
router.delete("/:id", (req, res) => {
  recipeCards.deleteOne({ _id: req.params.id})
    .then((data) => { if (data.deletedCount === 0) {
      res.json({ result: false, error: "Fiche recette non trouvée" });
    } else {
      res.json({ result: true, data: data }); 
    }})
    .catch((err) => {res.json({ result: false, error: err })});
});
   
module.exports = router;