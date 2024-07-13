const express = require("express");
const support = express.Router();

const Support = require("../../model/supportSchema");
const Query = require("../../model/querySchema");

support.post("/", (req, res) => {
  const { name, email, phone, amount, message } = req.body;

  const supportUs = Support({ name, email, phone, amount, message });

  supportUs
    .save()
    .then((result) => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
});

support.get("/", async (req, res) => {
  const data = await Support.find();
  res.send(data);
});

support.get("/get-query", async (req, res) => {
  const data = await Query.find();
  res.send(data);
});

support.post("/query", (req, res) => {
  const { name, email, phone, message } = req.body;

  const supportUs = Query({ name, email, phone, message });

  supportUs
    .save()
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => {
      res.status(500).send("Internal server error");
    });
});

module.exports = support;
