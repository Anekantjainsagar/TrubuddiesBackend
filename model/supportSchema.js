const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
    },
    name: {
      type: String,
      require: true,
    },
    amount: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

const Support = mongoose.model("support", supportSchema);
module.exports = Support;
