const express = require("express");
const trubuddy = express.Router();
const Trubuddy = require("../../model/trubuddySchema");
const Message = require("../../model/messageSchema");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateSingin } = require("../../middlewares/auth");

trubuddy.post("/create", async (req, res) => {
  let { name, email, phone, password } = req.body;
  email = email.toLowerCase();

  const data = await Trubuddy.findOne({ email });

  if (data) {
    res
      .status(203)
      .json({ data: "Email or Phone Already Exists", success: false });
  } else {
    const user = Trubuddy({ name, email, phone, password });

    user
      .save()
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

trubuddy.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  let data = await Trubuddy.findOne({ $or: [{ email }, { phone: email }] });

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

trubuddy.get("/get/:id", async (req, res) => {
  const user = await Trubuddy.findOne({_id:req.params.id});
  res.send(user);
});

trubuddy.post("/get", validateSingin, async (req, res) => {
  const { id } = req;

  const user = await Trubuddy.findById(id);
  res.send(user);
});

trubuddy.post("/get-one/:id", validateSingin, async (req, res) => {
  let { id } = req.params;

  const user = await Trubuddy.findById(id);

  const query = {
    sender: id,
    receiver: req?.id,
    seenByUser: false,
  };
  const messages = await Message.find(query);
  res.status(200).send({ ...user?._doc, unseen: messages.length });
});

trubuddy.post("/seen/:id", validateSingin, async (req, res) => {
  let { id } = req.params; // Trubuddy Id

  const response = await Message.updateMany(
    {
      $or: [
        { sender: req?.id, receiver: id },
        { sender: id, receiver: req?.id },
      ],
    },
    { seenByTrubuddy: true }
  );

  res.status(200).send(response);
});

trubuddy.post("/update", validateSingin, async (req, res) => {
  const { id } = req;
  try {
    const {
      city,
      state,
      expertise,
      availability,
      gender,
      profile,
      otherExpertise,
      personality,
      languages,
      bio,
      anonymous,
    } = req.body;

    let response = await Trubuddy.updateOne(
      { _id: id },
      {
        bio,
        city,
        state,
        expertise,
        availability,
        gender,
        profile,
        otherExpertise,
        languages,
        anonymous,
        personality,
      }
    );
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
  }
});

trubuddy.post("/status", validateSingin, async (req, res) => {
  const { id } = req;
  const { status } = req.body;

  let response = await Trubuddy.updateOne({ _id: id }, { status });
  res.status(200).send(response);
});

trubuddy.post("/stage", validateSingin, async (req, res) => {
  const { id } = req;
  const { stage } = req.body;

  let response = await Trubuddy.updateOne({ _id: id }, { stage });
  res.status(200).send(response);
});

module.exports = trubuddy;
