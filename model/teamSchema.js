const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  designation: {
    type: String,
    require: true,
  },
  gender: String,
  profile: String,
});

const Team = mongoose.model("teams", teamSchema);
module.exports = Team;
