const mongoose = require("mongoose");

const supportCategorySchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "SupportEvent" }],
  },
  {
    timestamps: true,
  }
);

const SupportCategory = mongoose.model(
  "SupportCategory",
  supportCategorySchema
);
module.exports = SupportCategory;
