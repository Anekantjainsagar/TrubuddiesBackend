const express = require("express");
const meditation = express.Router();
const Meditation = require("../../model/Services/meditationSchema");

// Insert (Create) a new meditation
meditation.post("/", async (req, res) => {
  try {
    const { thumbnail, title, poses } = req.body;
    const newmeditation = new Meditation({ thumbnail, title, poses });
    const savedmeditation = await newmeditation.save();
    res.status(201).json(savedmeditation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View All (Read) meditations
meditation.get("/", async (req, res) => {
  try {
    const meditations = await Meditation.find();
    res.status(200).json(meditations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a meditation by ID
meditation.put("/:id", async (req, res) => {
  try {
    const { thumbnail, title, poses } = req.body;
    const updatedmeditation = await Meditation.findByIdAndUpdate(
      req.params.id,
      { thumbnail, title, poses },
      { new: true }
    );
    if (!updatedmeditation) {
      return res.status(404).json({ message: "meditation not found" });
    }
    res.status(200).json(updatedmeditation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a meditation by ID
meditation.delete("/:id", async (req, res) => {
  try {
    const deletedmeditation = await Meditation.findByIdAndDelete(req.params.id);
    if (!deletedmeditation) {
      return res.status(404).json({ message: "meditation not found" });
    }
    res.status(200).json({ message: "meditation deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = meditation;
