const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: String,
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;