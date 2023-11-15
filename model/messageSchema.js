const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    seenByUser: {
      type: Boolean,
      default: false,
    },
    seenByTrubuddy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("messages", messageSchema);
module.exports = Message;
