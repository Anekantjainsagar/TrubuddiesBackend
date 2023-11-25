const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
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
    message: String,
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model("Query", querySchema);
module.exports = Query;
