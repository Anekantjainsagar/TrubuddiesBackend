const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  profile: String,
  chats: [
    {
      profile: String,
      name: String,
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
      messages: [
        {
          profile: String,
          name: String,
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
          son: String,
        },
      ],
    },
  ],
});

const GroupChat = mongoose.model("GroupChat", groupSchema);
module.exports = GroupChat;
