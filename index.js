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

const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

// const options = {
//   key: fs.readFileSync("/home/ubuntu/ssl/privkey1.pem"),
//   cert: fs.readFileSync("/home/ubuntu/ssl/fullchain1.pem"),
// };

const server = https.createServer(app);
// const server = https.createServer(options, app);
const io = require("socket.io")(server, {
  pingInterval: 10000, // how often to ping/pong.
  pingTimeout: 30000,
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connect();

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_ID,
      callbackURL: "http://trubuddies:5000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// initial google ouath login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/user/dashboard",
    failureRedirect: "http://localhost:3000/",
  })
);

app.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

io.on("connection", (socket) => {
  console.log(`Connected`);

  socket.on("chat", async ({ from, id, message, profile, name }) => {
    try {
      let chat = { sender: from, message, profile, name };
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

  socket.on("user-chat", async ({ from, id, message, profile, name, _id }) => {
    try {
      let chat = { sender: from, message, profile, name, son: _id };

      let response = await GroupChat.updateOne(
        { _id: id, "chats._id": _id },
        { $push: { "chats.$.messages": chat } }
      );

      io.local.emit("user-chat", chat);
    } catch (errors) {
      console.log(errors);
    }
  });

  socket.on("join", ({ userId }) => {
    console.log(`${userId} User Joined`);
    socket.join(userId);
  });

  // socket.on("admin-message", async ({ from, to, message }) => {});

  socket.on("message", async ({ from, to, message }) => {
    try {
      let saveMessage = new Message({ sender: from, receiver: to, message });
      io.local.emit("message", saveMessage);
      await saveMessage.save();

      // let trubuddy = await Trubuddy.findOne({ _id: to });

      // if (trubuddy && trubuddy?.status == "Offline") {
      //   const transporter = nodemailer.createTransport({
      //     service: "gmail",
      //     auth: {
      //       user: process.env.EMAIL,
      //       pass: process.env.PASSWORD,
      //     },
      //   });

      //   await transporter.sendMail({
      //     to: trubuddy?.email,
      //     subject: `A BUDDY IS WAITING FOR YOU`,
      //     html: `<p>Hello ${
      //       trubuddy?.anonymous ? trubuddy?.anonymous : trubuddy?.name
      //     },</p> <p>You got a new message from a User please login to your TruBuddies Dashboard to check the message.</p> <p>Regards,</p> <p>Team TruBuddies</p>`,
      //   });
      // }

      // let user = await User.findOne({ _id: to });
      // trubuddy = await Trubuddy.findOne({ _id: from });

      // if (user && trubuddy) {
      //   const transporter = nodemailer.createTransport({
      //     service: "gmail",
      //     auth: {
      //       user: process.env.EMAIL,
      //       pass: process.env.PASSWORD,
      //     },
      //   });

      //   await transporter.sendMail({
      //     to: user?.email,
      //     subject: `YOU GOT A NEW MESSAGE FROM ${
      //       trubuddy?.anonymous
      //         ? trubuddy?.anonymous?.toUpperCase()
      //         : trubuddy?.name?.toUpperCase()
      //     }`,
      //     html: `<p>Hello ${
      //       user?.anonymous ? user?.anonymous : user?.name
      //     },</p> <p>You got a new message from a Trubuddy please login to your User Dashboard to check the message.</p> <p>Regards,</p> <p>Team TruBuddies</p>`,
      //   });
      // }
    } catch (errors) {
      console.log(errors);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected`);
  });
});

app.use("/api/trubuddy", trubuddy);
app.use("/api/login", login);
app.use("/api/support", support);
app.use("/api/chat", chat);
app.use("/api/admin", admin);

// server.listen(process.env.PORT, () => {
//   console.log(`The Combined Server running at port ${process.env.PORT}`);
// });

app.listen(process.env.PORT, () => {
  console.log(`The Combined Server running at port ${process.env.PORT}`);
});
