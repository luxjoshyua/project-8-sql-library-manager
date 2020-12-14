const express = require("express");
const router = express.Router();
// import Book Model
const Book = require("../models").Book;
// const app = express();

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

// GET /books listing, show the full list of books
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // retrieve all books
    // const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
    const books = await Book.findAll();
    res.render("index", {
      books: books,
      title: "My collected library books!",
    });
  })
);

// GET /books/new, create a new book form
router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("new-book", {
      // populate this object
      book: {},
      title: "New Book",
    });
  })
);

// POST /books/new, posts a newly created book to the database
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      // req.body maps to the form inputs
      console.log(req.body);
      // pass the create request body
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (error) {
      // check the error
      // empty field handler
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book: book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        // error caught in the asyncHandler's catch block
        throw error;
      }
    }
  })
);

// GET /books/:id, shows book detail form
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // find the book by using the requested parameter router id
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", {
        book: book,
        title: "Edit Book",
      });
    } else {
      res.sendStatus(404);
      res.render("page-not-found");
    }
  })
);

// POST /books/:id, updates book info in the database
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    // initialise book variable that awaits the search result
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        // await is async, so it awaits the promise, then once the promise is fulfilled, do something
        // pass the request body once the promise is fulfilled
        await book.update(req.body);
        res.redirect("/");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("update-book", {
          book: book,
          errors: error.errors,
          title: "Edit Book",
        });
      } else {
        throw error;
      }
    }
  })
);

// POST /books/:id/delete, deletes a book from the database

module.exports = router;
