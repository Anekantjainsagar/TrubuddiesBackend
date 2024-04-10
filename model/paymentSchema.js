const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  amount: Number,
  tokens: Number,
  status: {
    type: String,
    default: "PaymentFailed",
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const Payment = mongoose.model("Payments", paymentSchema);
module.exports = Payment;
