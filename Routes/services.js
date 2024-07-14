const services = require("express").Router();
const library = require("../controllers/Services/library");

services.use("/library", library);

module.exports = services;
