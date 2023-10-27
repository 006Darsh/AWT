const Library = require("../Models/Library");

const Joi = require("joi");
const User = require("../Models/Users");

// Define a validation schema
const bookSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title should be a string.",
    "any.required": "Title is required.",
  }),

  author: Joi.string().required().messages({
    "string.base": "Author should be a string.",
    "any.required": "Author is required.",
  }),

  genre: Joi.string().required().messages({
    "string.base": "Genre should be a string.",
    "any.required": "Genre is required.",
  }),

  isbn: Joi.string()
    .pattern(/^[0-9]{13}$/)
    .required()
    .messages({
      "string.base": "ISBN should be a string.",
      "string.pattern.base": "ISBN should be a 13-digit numeric string.",
      "any.required": "ISBN is required.",
    }),

  publicationDate: Joi.date().required().messages({
    "date.base": "Publication Date should be a date.",
    "any.required": "Publication Date is required.",
  }),

  description: Joi.string().messages({
    "string.base": "Description should be a string.",
  }),
});

exports.AddBook = async (req, res) => {
  const Id = req.user._id;
  const user = await User.findOne({ _id: Id });

  if (req.userType !== "user") {
    return res.status(401).send({ success: false, message: "Not Authorized." });
  }
  if (!user) {
    return res.status(400).send({
      success: false,
      message: "User account not found.",
    });
  }
  try {
    // Validate the request body
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const newBook = new Library(req.body);
    const createdBookObject = await newBook.save();
    if (createdBookObject) {
      return res.status(201).json({
        success: true,
        book: createdBookObject,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Failed to create the book.",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
};

exports.GetBooks = async (req, res) => {
  try {
    const books = await Library.find(
      {},
      {
        _id: 1,
        title: 1,
        author: 1,
        genre: 1,
        publicationDate: 1,
      }
    );
    return res.status(200).send({ success: true, books });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.GetBookByID = async (req, res) => {
  try {
    const BookId = req.params.id;
    const book = await Library.findById(BookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found." });
    }
    const responseData = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      publicationDate: book.publicationDate,
      description: book.description,
    };
    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.updateBookDetails = async (req, res) => {
  const Id = req.user._id;
  const user = await User.findOne({ _id: Id });

  if (req.userType !== "user") {
    return res.status(401).send({ success: false, message: "Not Authorized." });
  }
  if (!user) {
    return res.status(400).send({
      success: false,
      message: "User account not found.",
    });
  }
  try {
    const bookId = req.params.id;
    const { error, value } = bookSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const book = await Library.findById(bookId);

    if (value.title && value.title !== book.title) {
      book.title = value.title;
    }
    if (value.author && value.author !== book.author) {
      book.author = value.author;
    }
    if (value.isbn && value.isbn !== book.isbn) {
      book.isbn = value.isbn;
    }
    if (value.genre && value.genre !== book.genre) {
      book.genre = value.genre;
    }
    if (
      value.publicationDate &&
      value.publicationDate !== book.publicationDate
    ) {
      book.publicationDate = value.publicationDate;
    }
    if (value.description && value.description !== book.description) {
      book.description = value.description;
    }

    book.updatedAt = Date.now();
    const updatedBookDetails = await book.save();

    return res.status(200).json({ success: true, updatedBookDetails });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.DeleteBook = async (req, res) => {
  const Id = req.user._id;
  const user = await User.findOne({ _id: Id });

  if (req.userType !== "user") {
    return res.status(401).send({ success: false, message: "Not Authorized." });
  }
  if (!user) {
    return res.status(400).send({
      success: false,
      message: "User account not found.",
    });
  }
  try {
    const bookId = req.params.id;
    const Book = await Library.findById(bookId);
    if (!Book) {
      return res
        .status(400)
        .json({ success: false, message: "Book not found" });
    }
    const deletedBook = await Library.findByIdAndDelete(bookId);
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      deletedBook: deletedBook,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};
