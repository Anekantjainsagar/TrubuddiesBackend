const services = require("express").Router();
const library = require("../controllers/Services/library");
const yoga = require("../controllers/Services/yoga");
const meditation = require("../controllers/Services/meditation");

services.use("/library", library);
services.use("/yoga", yoga);
services.use("/meditation", meditation);

module.exports = services;
