const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
      "http://res.cloudinary.com/dfpnkqrjw/image/upload/v1699634377/ca5fyxm5hvjut3xsmifv.png",
  },
  nationality: String,
  state: String,
  city: String,
  profession: String,
  gender: String,
  languages: Array,
  discussions: Array,
  trubuddies: Array,
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
