const express = require("express");
const admin = express.Router();

const Login = require("../../model/userSchema");
const Trubuddy = require("../../model/trubuddySchema");
const Team = require("../../model/teamSchema");
const Message = require("../../model/messageSchema");

const { validateSingin } = require("../../middlewares/auth");

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
    name: { $regex: new RegExp(search, "i") },
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

module.exports = admin;
