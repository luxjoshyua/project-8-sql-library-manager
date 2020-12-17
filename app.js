// const createError = require("http-errors");
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
  const err = new Error();
  err.status === 404;
  res.status(404);
  console.log("404 error handler called");
  err.message = `Page cannot be found`;
  // res.render("page-not-found", { title: "Page Not Found" });
  res.render("page-not-found", { err });
  // pass the error up
  // next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err) {
    console.log("Global error handler called");
  }

  if (err.status === 404) {
    res.status(404);
    res.render("page-not-found", { err });
  } else {
    console.log(
      `Error status is ${err.status}, Error message is ${err.message}`
    );
    // set the error message to the given message, or specify a general default message
    err.message = err.message || `Something broke, we're working on it!`;
    // set response status to the given error status, or set it to 500 by default if no error is set
    res.status(err.status || 500);
    // render the error view, passing it the error object
    res.render("error", { err });
  }
});

console.log("Heroku app deploy test");

module.exports = app;
