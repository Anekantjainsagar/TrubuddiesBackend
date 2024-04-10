const tokens = require("express").Router();
const sdk = require("api")("@cashfreedocs-new/v3#3oi9ke2mljzm0bo0");
const Payment = require("../../model/paymentSchema");
const User = require("../../model/userSchema");

tokens.post("/place", async (req, res) => {
  //   sdk.server("https://api.cashfree.com/pg");
  sdk.server("https://sandbox.cashfree.com/pg");

  let { user_id, amount } = req.body;

  const user = await User.findById(user_id);
  const order = new Payment({
    user_id,
    tokens: parseInt(amount),
    amount: parseInt(amount),
  });

  console.log(order);
  order
    .save()
    .then((resp) => {
      console.log("resp");
      sdk
        .createOrder(
          {
            order_id: order?._id,
            order_amount: amount ? parseInt(amount) : 0,
            order_currency: "INR",
            customer_details: {
              customer_id: Date.now().toString().slice(0, 40),
              customer_name: user?.name,
              customer_email: user?.email,
              customer_phone: "123456789",
            },
            order_meta: {
              //   return_url: `https://trubuddies.com/pay/{order_id}`,
              return_url: `http://localhost:3000/pay/{order_id}`,
            },
          },
          {
            "x-client-id": process.env.PAYMENT_CLIENT_ID,
            "x-client-secret": process.env.PAYMENT_SECRET_ID,
            "x-api-version": "2022-09-01",
          }
        )
        .then(async ({ data }) => {
          const update = await User.updateOne(
            { _id: user_id },
            { $inc: { tokens: amount }, $push: { orders: order?._id } }
          );
          res.status(200).send({ ...data, order: order?._id });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

tokens.post("/payment", async (req, res) => {
  const { order_id } = req.body;
  const pay = await Payment.findOne({ order_id });

  if (pay) {
    res.status(201).send("Invalid uri");
  } else {
    try {
      //   await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
      await fetch(`https://sandbox.cashfree.com/pg/orders/${order_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.PAYMENT_CLIENT_ID,
          "x-client-secret": process.env.PAYMENT_SECRET_ID,
        },
      })
        .then((res) => res.json())
        .then(async (response) => {
          if (response?.order_status === "PAID") {
            const update = await Payment.updateOne(
              { _id: order_id },
              { status: "NewOrder", payment_id: pay?._id }
            );
            res.status(200).send("This order is paid!");
          } else {
            res.status(203).send("Order has not been paid!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }
});

tokens.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Payment.findOne({ _id: id });
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = tokens;
