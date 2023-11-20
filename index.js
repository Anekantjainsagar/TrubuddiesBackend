require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");

const connect = require("./db/conn");

const login = require("./Routes/User/login");
const trubuddy = require("./Routes/trubuddy");
const chat = require("./Routes/Chat/chat");
const admin = require("./Routes/Admin/admin");
const Message = require("./model/messageSchema");
const GroupChat = require("./model/groupSchema");

// Load SSL certificate and private key
const options = {
  key: fs.readFileSync("/home/ubuntu/privkey.pem"),
  cert: fs.readFileSync("/home/ubuntu/fullchain.pem"),
};

const server = https.createServer(options, app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

connect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

io.on("connection", (socket) => {
  // console.log(`Connected`);

  socket.on("chat", async ({ from, id, message }) => {
    try {
      let chat = { sender: from, message };
      let response = await GroupChat.updateOne(
        { _id: id },
        { $push: { chats: chat } }
      );
      console.log(response.modifiedCount);
      io.local.emit("chat", chat);
    } catch (errors) {
      console.log(errors);
    }
  });

  socket.on("join", ({ userId }) => {
    // console.log(`${userId} User Joined`);
    socket.join(userId);
  });

  socket.on("message", async ({ from, to, message }) => {
    try {
      let saveMessage = new Message({ sender: from, receiver: to, message });
      await saveMessage
        .save()
        .then((res) => {
          console.log("Saved");
        })
        .catch((err) => {
          console.log(err);
        });
      io.local.emit("message", saveMessage);
      saveMessage = {};
    } catch (errors) {
      console.log(errors);
    }
  });

  socket.on("disconnect", () => {
    // console.log(`Disconnected`);
  });
});

app.use("/api/trubuddy", trubuddy);
app.use("/api/login", login);
app.use("/api/chat", chat);
app.use("/api/admin", admin);

server.listen(process.env.PORT, () => {
  console.log(`The Combined Server running at port ${process.env.PORT}`);
});
