const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  avatar: String,
  name: String,
  username: String,
  mail: String,
  tel: String,
  password: String,
  restaurantName: String,
  token: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
