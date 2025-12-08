var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Recipe = require('../models/recipes');
const Category = require('../models/categories');

// Créer une nouvelle catégorie de recettes
router.post('/add', (req,res)=>{
  User.findOne({ token: req.body.token })
    .then(user => {
      const newCategory = new Category ({
        name: req.body.name,
        recipes: [],
        user: user._id,
      });

      newCategory.save().then(data =>{
        res.json({ result: true, category: data.name})
      })
    })
    .catch(err => {
      res.json({ result: false, error: 'Server error' });
    });
});

// Modifier le nom d'une catégorie existante
router.put('/update', (req,res)=>{
  Category.updateOne(
    { _id: req.body.categoryId }, 
    { name:req.body.name }
  )
    .then(()=> { res.json({ result: true }) })
    .catch(err => { res.json({ result: false }) });
});

// Afficher toutes les catégories d'un utilisateur
router.get('/', (req,res)=>{
  User.findOne({ token: req.body.token })
    .then(user => Category.find({ user: User._id }))
    .then(data => { res.json(data) })
    .catch(err => { res.json({ result: false, error: 'Server error' })});
});

// Ajouter une nouvelle recette à une catégorie
router.put('/addRecipeToCategory', (req,res)=>{
  Category.findById(req.body.categoryId)
    .then((data)=> {
        if(!data){
            return res.json({ result: false, error: 'Category not found' })
        }
        data.recipes.push(req.body.recipeId)
        Category.save();
    })
      .then(()=> { res.json({ result: true, message: `Recipe added to ${data.name}` }) })
      .catch(err => { res.json({ result: false }) });
});


// Supprimer une catégorie par ID
router.delete('/remove/:id',(req,res)=>{
  Category.findByIdAndDelete(req.params.id)
    .then(data => {
      res.json({ result: true, message: 'category deleted'})
  })
    .catch(err => {
      res.json({ result: false, error: 'Server error' });
  });
});


module.exports = router;