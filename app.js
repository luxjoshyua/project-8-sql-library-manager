const createError = require("http-errors");
// import the sequelize instance
const { sequelize } = require("./models");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// import Sequelize and the routes
const routes = require("./routes/index");
const books = require("./routes/books");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/books", books);

// Authenticate database connection
(async () => {
  /* asynchronously connect to the database, log out a message indicating a connection has/hasn't been established
   */
  try {
    await sequelize.authenticate();
    console.log(`Successfully connected to the database`);
    // sync the model with the database
    await sequelize.sync();
  } catch (error) {
    console.error(`Unable to connect to the database, ${error}`);
  }
})();

// 404 Error Handler
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  // setup local error handlers
  res.locals.message = err.message;
  res.locals.error = err;

  res.status(err.status || 500);

  if (err.status === 404) {
    res.status(404);
    res.render("page-not-found", { err });
  }

  res.render("error", { title: err.message });
});

// console.log("Heroku app deploy test");

module.exports = app;
