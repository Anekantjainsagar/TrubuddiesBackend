const mongoose = require("mongoose");

const yogaSchema = new mongoose.Schema(
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

const Yogas = mongoose.model("Yogass", yogaSchema);
module.exports = Yogas;
