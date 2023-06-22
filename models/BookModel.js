const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema ({
  title: { type: String, required: true},
  author: { type: String},
  pages: { type: Number, required: true},
  genres: { type: Array, required: true},
  rating: { type: Number, required: true},
});

const Book = mongoose.model("books", bookSchema);

module.exports = Book;