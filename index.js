require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");

const connect = require("./db/conn");

const login = require("./Routes/User/login");
const support = require("./Routes/User/support");
const trubuddy = require("./Routes/trubuddy");
const chat = require("./Routes/Chat/chat");
const admin = require("./Routes/Admin/admin");
const Message = require("./model/messageSchema");
const GroupChat = require("./model/groupSchema");
const Trubuddy = require("./model/trubuddySchema");
const User = require("./model/userSchema");
const nodemailer = require("nodemailer");

const options = {
  key: fs.readFileSync("/home/ubuntu/ssl/privkey1.pem"),
  cert: fs.readFileSync("/home/ubuntu/ssl/fullchain1.pem"),
};

const server = https.createServer(options, app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

connect();

app.get("/", (req, res) => {
  res.send("Hello world");
});

io.on("connection", (socket) => {
  // console.log(`Connected`);

  socket.on("chat", async ({ from, id, message, profile }) => {
    try {
      let chat = { sender: from, message, profile };
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

  // socket.on("admin-message", async ({ from, to, message }) => {});

  socket.on("message", async ({ from, to, message }) => {
    try {
      let saveMessage = new Message({ sender: from, receiver: to, message });
      let trubuddy = await Trubuddy.findOne({ _id: to });

      if (trubuddy && trubuddy?.status == "Offline") {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        await transporter.sendMail({
          to: trubuddy?.email,
          subject: `A BUDDY IS WAITING FOR YOU`,
          html: `<p>Hello ${
            trubuddy?.anonymous ? trubuddy?.anonymous : trubuddy?.name
          },</p> <p>You got a new message from a User please login to your TruBuddies Dashboard to check the message.</p> <p>Regards,</p> <p>Team TruBuddies</p>`,
        });
      }
      io.local.emit("message", saveMessage);
      await saveMessage
        .save()
        .then((res) => {
          console.log("Saved");
        })
        .catch((err) => {
          console.log(err);
        });
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
app.use("/api/support", support);
app.use("/api/chat", chat);
app.use("/api/admin", admin);

server.listen(process.env.PORT, () => {
  console.log(`The Combined Server running at port ${process.env.PORT}`);
});
