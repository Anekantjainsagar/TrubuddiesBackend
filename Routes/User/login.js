const express = require("express");
const login = express.Router();
const User = require("../../model/userSchema");
const Trubuddy = require("../../model/trubuddySchema");

// Controllers
const {
  signInUser,
  signUp,
  getUser,
  updateUser,
} = require("../../controllers/Login/index");
const { sendMail } = require("../../controllers/Login/otp");
const {
  sendUrl,
  verifyUrl,
  resetPassword,
} = require("../../controllers/Login/passwordReset");

// Middlewares
const {
  validateSignUp,
  userValidationResult,
} = require("../../middlewares/index");
const { validateSingin } = require("../../middlewares/auth");
const {
  passswordValidate,
  passswordValidationResult,
} = require("../../middlewares/passwordReset");
const Message = require("../../model/messageSchema");

// Routes
login.post("/get-user", validateSingin, getUser);
login.post("/update-user", validateSingin, updateUser);
login.post("/signup", validateSignUp, userValidationResult, signUp);
login.post("/signin", signInUser);

login.use("/otp-verification", sendMail);

login.post("/password-reset", sendUrl);
login.get("/password-reset/:id/:token", verifyUrl);
login.post(
  "/password-reset/reset/:id/:token",
  passswordValidate,
  passswordValidationResult,
  resetPassword
);

login.get("/get-profile/:id", async (req, res) => {
  const { id } = req.params;

  let data = await Trubuddy.getElementById(id);

  if (data) {
    res.status(200).send(data);
  } else {
    data = await User.getElementById(id);
    res.status(200).send(data);
  }
});

login.post("/get-one/:id", validateSingin, async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  const query = {
    receiver: req?.id,
    sender: id,
    seenByTrubuddy: false,
  };
  const messages = await Message.find(query);

  res.status(200).send({ ...user?._doc, unseen: messages.length });
});

login.post("/seen/:id", validateSingin, async (req, res) => {
  let { id } = req.params; // User Id

  const response = await Message.updateMany(
    {
      $or: [
        { sender: req?.id, receiver: id },
        { sender: id, receiver: req?.id },
      ],
    },
    { seenByUser: true }
  );

  res.status(200).send(response);
});

login.post("/start-chat/:trubuddyId", validateSingin, async (req, res) => {
  const id = req.id;
  const { trubuddyId } = req.params;

  Trubuddy.updateOne({ _id: trubuddyId }, { $push: { buddies: id } })
    .then((resp) => {
      if (resp.modifiedCount == 1) {
        User.updateOne({ _id: id }, { $push: { trubuddies: trubuddyId } })
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = login;
