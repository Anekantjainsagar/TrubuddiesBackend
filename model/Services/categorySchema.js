const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Books" }],
  },
  {
    timestamps: true,
  }
);

const BookCategory = mongoose.model("BookCategories", categorySchema);
module.exports = BookCategory;
