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
    res.redirect("/books");
  })
);

// GET /books, show the full list of books
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    // retrieve all books
    // const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    const books = await Book.findAll();
    res.render("index", {
      books: books,
      title: "My collected books!",
    });
  })
);

module.exports = router;
