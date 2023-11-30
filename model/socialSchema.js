const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    facebook: String,
    instagram: String,
    whatsapp: String,
    linkedin: String,
    telegram: String,
  },
  {
    timestamps: true,
  }
);

const Social = mongoose.model("Social", socialSchema);
module.exports = Social;
