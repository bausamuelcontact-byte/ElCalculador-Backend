const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: String,
  price: Number,
  tva: Number,
  allergens: [String],
  ingredients: [
    {
      ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "ingredients" },
      quantity: Number,
      unit: String,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Recipe = mongoose.model("recipes", recipeSchema);

module.exports = Recipe;
