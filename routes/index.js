const express = require("express");
const router = express.Router();
// import Book Model
const Book = require("../models").Book;
const app = express();

// Static middleware for serving static files
router.use(express.static("public"));

// Handler function to wrap each route
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// GET home page. redirect to /books route
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // res.redirect("/books");
    res.redirect("/");
  })
);

module.exports = router;
