const mongoose = require("mongoose");

const connect = () => {
  console.log("Connecting...");
  mongoose
    .connect(process.env.MONGO_URI)
    .then((res) => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connect;
