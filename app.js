const createError = require("http-errors");
// import the sequelize instance
const { sequelize } = require("./models");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");

const app = express();

// Authenticate connection
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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use("/users", usersRouter);

// 404 Error Handler
app.use((req, res, next) => {
  const err = new Error();
  res.status(404);
  err.message = `Page cannot be found`;
  // res.render("page-not-found", { title: "Page Not Found" });
  res.render("page-not-found", { err });
  // pass the error up
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  err.message = err.message || `Something broke, we're working on it!`;
  console.log(`Error is: ${err.status}, ${err.message}`);
  res.render("error", { err });
});

module.exports = app;
