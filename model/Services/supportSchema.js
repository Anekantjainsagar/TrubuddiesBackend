const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    thumbnail: { type: String, require: true },
    title: { type: String, require: true },
    date: { type: Date, require: true },
    time: { type: String, require: true },
    location: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "SupportCategory" },
  },
  {
    timestamps: true,
  }
);

const Support = mongoose.model("SupportEvent", supportSchema);
module.exports = Support;
