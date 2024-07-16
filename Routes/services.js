const services = require("express").Router();
const library = require("../controllers/Services/library");
const yoga = require("../controllers/Services/yoga");
const meditation = require("../controllers/Services/meditation");
const support = require("../controllers/Services/support");

services.use("/library", library);
services.use("/social-support", support);
services.use("/yoga", yoga);
services.use("/meditation", meditation);

module.exports = services;
