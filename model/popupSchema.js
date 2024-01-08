const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema(
  {
    photo: String,
  },
  {
    timestamps: true,
  }
);

const Popup = mongoose.model("Popup", popupSchema);
module.exports = Popup;
