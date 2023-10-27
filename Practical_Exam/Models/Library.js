const mongoose = require("mongoose");

const LibrarySchema = mongoose.Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  genre: {
    type: String,
  },
  isbn: {
    type: String,
  },
  publicationDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Library = mongoose.model("Library", LibrarySchema);
module.exports = Library;
