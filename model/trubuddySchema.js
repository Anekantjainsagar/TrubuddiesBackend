const mongoose = require("mongoose");

const trubuddySchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  profile: {
    type: String,
    default:
      "http://res.cloudinary.com/dfpnkqrjw/image/upload/v1699527987/sawjznhs6l48mxt5hh34.png",
  },
  city: String,
  state: String,
  expertise: String,
  otherExpertise: Array,
  languages: Array,
  availability: String,
  anonymous: String,
  gender: {
    type: String,
    deafult: "Male",
  },
  status: {
    type: String,
    default: "Online",
  },
  stage: {
    type: String,
    default: "Active",
  },
  buddies: Array,
  bio: String,
});

const Trubuddy = mongoose.model("Trubuddy", trubuddySchema);
module.exports = Trubuddy;
