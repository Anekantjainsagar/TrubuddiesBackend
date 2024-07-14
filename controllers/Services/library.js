const library = require("express").Router();
const Book = require("../../model/Services/booksSchema");
const BookCategory = require("../../model/Services/categorySchema");

library.get("/get-books", async (req, res) => {
  try {
    const data = await Book.find().populate("category");
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving books", error: error.message });
  }
});

library.post("/add-book", async (req, res) => {
  try {
    const { thumbnail, content, category, title } = req.body;

    // Create a new book
    const newBook = new Book({
      thumbnail,
      content,
      category,
      title,
    });

    // Save the book
    const savedBook = await newBook.save();

    // Add book to category
    await BookCategory.findByIdAndUpdate(category, {
      $push: { books: savedBook._id },
    });

    res.status(200).send(savedBook);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding book", error: error.message });
  }
});

library.put("/update-book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { thumbnail, content, category, title } = req.body;

    // Find and update the book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { thumbnail, content, category, title },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).send({ message: "Book not found" });
    }

    // Update the category if it has changed
    if (updatedBook.category.toString() !== category) {
      await BookCategory.findByIdAndUpdate(updatedBook.category, {
        $pull: { books: id },
      });
      await BookCategory.findByIdAndUpdate(category, { $push: { books: id } });
    }

    res.send(updatedBook);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating book", error: error.message });
  }
});

library.delete("/delete-book/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the book
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).send({ message: "Book not found" });
    }

    // Remove book from category
    await BookCategory.findByIdAndUpdate(deletedBook.category, {
      $pull: { books: id },
    });

    res.send({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting book", error: error.message });
  }
});

library.post("/add-category", async (req, res) => {
  try {
    const { title } = req.body;

    // Create a new category
    const newCategory = new BookCategory({
      title,
      books: [],
    });

    // Save the category
    const savedCategory = await newCategory.save();
    res.status(200).send(savedCategory);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding category", error: error.message });
  }
});

library.put("/update-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Find and update the category
    const updatedCategory = await BookCategory.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.send(updatedCategory);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating category", error: error.message });
  }
});

library.delete("/delete-category/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete all books related to the category
    await Book.deleteMany({ category: id });

    // Find and delete the category
    const deletedCategory = await BookCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.send({ message: "Category and related books deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting category and related books",
      error: error.message,
    });
  }
});

library.get("/get-category", async (req, res) => {
  try {
    const data = await BookCategory.find().populate("books");
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving books category",
      error: error.message,
    });
  }
});

module.exports = library;
