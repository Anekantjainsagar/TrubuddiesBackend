const support = require("express").Router();
const Support = require("../../model/Services/supportSchema");
const SupportCategory = require("../../model/Services/supportCategory");

support.get("/get-supports", async (req, res) => {
  try {
    const data = await Support.find().populate("category");
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving events", error: error.message });
  }
});

support.post("/add-support", async (req, res) => {
  try {
    const { thumbnail, date, time, category, title, location } = req.body;
    const newSupport = new Support({
      thumbnail,
      date,
      time,
      category,
      title,
      location,
    });

    const savedEvent = await newSupport.save();
    await SupportCategory.findByIdAndUpdate(category, {
      $push: { events: savedEvent._id },
    });

    res.status(200).send(savedEvent);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding event", error: error.message });
  }
});

support.put("/update-support/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { thumbnail, date, time, category, title, location } = req.body;
    const updatedEvent = await Support.findByIdAndUpdate(
      id,
      { thumbnail, date, time, category, title, location },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).send({ message: "Event not found" });
    }

    if (updatedEvent.category.toString() !== category) {
      await SupportCategory.findByIdAndUpdate(updatedEvent.category, {
        $pull: { events: id },
      });
      await SupportCategory.findByIdAndUpdate(category, {
        $push: { events: id },
      });
    }

    res.send(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating Event", error: error.message });
  }
});

support.delete("/delete-support/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Support.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).send({ message: "Event not found" });
    }
    await SupportCategory.findByIdAndUpdate(deletedEvent.category, {
      $pull: { events: id },
    });

    res.send({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting Event", error: error.message });
  }
});

support.post("/add-category", async (req, res) => {
  try {
    const { title, description } = req.body;

    // Create a new category
    const newCategory = new SupportCategory({
      title,
      description,
      events: [],
    });

    const savedCategory = await newCategory.save();
    res.status(200).send(savedCategory);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding category", error: error.message });
  }
});

support.put("/update-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find and update the category
    const updatedCategory = await SupportCategory.findByIdAndUpdate(
      id,
      { title, description },
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

support.delete("/delete-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Support.deleteMany({ category: id });
    const deletedCategory = await SupportCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.send({ message: "Category and related events deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting category and related events",
      error: error.message,
    });
  }
});

support.get("/get-category", async (req, res) => {
  try {
    const data = await SupportCategory.find().populate("events");
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving events category",
      error: error.message,
    });
  }
});

module.exports = support;
