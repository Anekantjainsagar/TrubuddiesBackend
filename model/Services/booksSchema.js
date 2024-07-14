const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema(
  {
    thumbnail: { type: String, require: true },
    title: { type: String, require: true },
    content: { type: String, require: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "BookCategories" },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Books", booksSchema);
module.exports = Book;
