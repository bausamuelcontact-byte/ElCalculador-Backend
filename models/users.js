const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  avatar: String,
  firstname: String,
  lastname: String,
  mail: String,
  tel: String,
  password: String,
  restaurantName: String,
  token: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
