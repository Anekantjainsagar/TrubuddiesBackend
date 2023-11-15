const express = require("express");
const chat = express.Router();
const { validateSingin } = require("../../middlewares/auth");

const GroupChat = require("../../model/groupSchema");
const Message = require("../../model/messageSchema");

chat.post("/getMessages/:userId", validateSingin, async (req, res) => {
  const { userId } = req.params;
  let { id } = req;
  id = id?.toString();

  try {
    const messages = await Message.find({
      $or: [
        { sender: id, receiver: userId },
        { sender: userId, receiver: id },
      ],
    }).sort({
      createdAt: 1,
    });

    res.send(messages);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

chat.post("/getGroupChats/:id", async (req, res) => {
  const { id } = req.params;

  const chats = await GroupChat.findOne({ _id: id });
  res.send(chats?.chats);
});

module.exports = chat;
