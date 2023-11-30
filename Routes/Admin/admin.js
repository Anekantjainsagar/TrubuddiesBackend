const express = require("express");
const admin = express.Router();

const Login = require("../../model/userSchema");
const Trubuddy = require("../../model/trubuddySchema");
const Team = require("../../model/teamSchema");
const Message = require("../../model/messageSchema");
const Admin = require("../../model/adminSchema");
const Social = require("../../model/socialSchema");

const { validateSingin } = require("../../middlewares/auth");
const jwt = require("jsonwebtoken");

admin.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  let data = await Admin.findOne({ email });

  if (data) {
    const matched = password == data.password;

    if (matched) {
      const jwtToken = jwt.sign(
        {
          user: data._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({ jwtToken });
    } else {
      res.status(203).json({ data: "Invalid credentials", success: false });
    }
  } else {
    res.status(203).json({ data: "Invalid credentials", success: false });
  }
});

admin.get("/get-users", async (req, res) => {
  let { search } = req.query;

  if (!search) {
    search = "";
  }

  const users = await Login.find({ name: { $regex: new RegExp(search, "i") } });
  res.status(200).send(users);
});

admin.post("/get-trubuddies", async (req, res) => {
  let { search } = req.query;

  if (!search) {
    search = "";
  }

  let users = await Trubuddy.find({
    anonymous: { $regex: new RegExp(search, "i") },
  });

  res.status(200).send(users);
});

admin.get("/get-teams", async (req, res) => {
  let { search } = req.query;

  if (!search) {
    search = "";
  }

  const users = await Team.find({
    name: { $regex: new RegExp(search, "i") },
  });
  res.status(200).send(users);
});

admin.post("/add-social-media", async (req, res) => {
  const { id, facebook, instagram, whatsapp, linkedin, telegram } = req.body;

  const response = await Social.updateOne(
    { _id: id },
    { facebook, instagram, whatsapp, linkedin, telegram }
  );

  res.status(200).send(response);
});

admin.post("/get-social/:id", async (req, res) => {
  const { id } = req.params;

  const response = await Social.findOne({ _id: id });

  res.status(200).send(response);
});

module.exports = admin;
