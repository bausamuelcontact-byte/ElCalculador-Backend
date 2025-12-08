const mongoose = require("mongoose");

const recipeCardSchema = mongoose.Schema({
  image: String,
  description: [String],
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const recipeCard = mongoose.model("recipeCards", recipeCardSchema);

module.exports = recipeCard;