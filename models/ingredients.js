const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  unit: String,
  TVA: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Ingredient = mongoose.model("ingredients", ingredientSchema);

module.exports = Ingredient;