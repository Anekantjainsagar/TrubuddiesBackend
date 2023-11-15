const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  profile: String,
  chats: [
    {
      sender: {
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
    },
  ],
});

const GroupChat = mongoose.model("GroupChat", groupSchema);
module.exports = GroupChat;
