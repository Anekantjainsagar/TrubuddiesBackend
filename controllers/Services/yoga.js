const express = require("express");
const yoga = express.Router();
const Yogas = require("../../model/Services/yogaSchema");

// Insert (Create) a new Yoga
yoga.post("/", async (req, res) => {
  try {
    const { thumbnail, title, poses } = req.body;
    const newYoga = new Yogas({ thumbnail, title, poses });
    const savedYoga = await newYoga.save();
    res.status(201).json(savedYoga);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View All (Read) Yogas
yoga.get("/", async (req, res) => {
  try {
    const yogas = await Yogas.find();
    res.status(200).json(yogas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Yoga by ID
yoga.put("/:id", async (req, res) => {
  try {
    const { thumbnail, title, poses } = req.body;
    const updatedYoga = await Yogas.findByIdAndUpdate(
      req.params.id,
      { thumbnail, title, poses },
      { new: true }
    );
    if (!updatedYoga) {
      return res.status(404).json({ message: "Yoga not found" });
    }
    res.status(200).json(updatedYoga);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Yoga by ID
yoga.delete("/:id", async (req, res) => {
  try {
    const deletedYoga = await Yogas.findByIdAndDelete(req.params.id);
    if (!deletedYoga) {
      return res.status(404).json({ message: "Yoga not found" });
    }
    res.status(200).json({ message: "Yoga deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = yoga;
