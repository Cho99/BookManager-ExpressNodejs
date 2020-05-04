const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  coverUrl: String
});

const Book = mongoose.model("Book", bookSchema, "books");

module.exports = Book;