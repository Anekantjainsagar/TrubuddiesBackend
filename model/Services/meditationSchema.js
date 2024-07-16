const mongoose = require("mongoose");

const meditationSchema = new mongoose.Schema(
  {
    thumbnail: { type: String, require: true },
    title: { type: String, require: true },
    poses: [
      {
        img: String,
        title: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Meditation = mongoose.model("Meditation", meditationSchema);
module.exports = Meditation;
