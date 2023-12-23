const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  googleId: String,
  phone: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
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
  anonymous: String,
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
