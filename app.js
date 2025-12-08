<<<<<<< HEAD
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
=======
require('dotenv').config();
require("./models/connection");

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
>>>>>>> ad42b0f8f52b95c74656afdd3736c862cecf70e4

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var ingredientsRouter = require("./routes/ingredients");
var recipesRouter = require("./routes/recipes");

var app = express();

<<<<<<< HEAD
app.use(logger("dev"));
=======
const cors = require("cors");
app.use(cors());

app.use(logger('dev'));
>>>>>>> ad42b0f8f52b95c74656afdd3736c862cecf70e4
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/recipes", recipesRouter);

module.exports = app;
