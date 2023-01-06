const express = require("express");
const app = express();
const { identity } = require("lodash");
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51MAWn8SIJemEdI6NBLHp9Lrp2RGsrnUml4HZbFrWmzpL36Y0LToVV9ZvSFmEclEY2ZCx2l2vAZzTOR4Z8r63FeZw00JVkhnfGC"
);
const router = express.Router();
const PaymentModel = require("../models/PaymentModel");
router.get("/", (req, res) => res.send(" Payment Route"));
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 10000;
};

router.post("/create-payment-intent", async (req, res) => {
  const { items, user, email } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    customer: "cus_My1rkckxbFrHve",
    metadata: {
      user: user,
      email: email,
    },
    description: "Paying in INR",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

router.post("/getPaymentId", async (req, res) => {
  try {
    const { pi } = req.body;
    const isPaymentExist = await PaymentModel.findOne({ transactionId: pi });
    if (isPaymentExist) {
      return res.json({ success: true, isPaymentExist });
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(pi);
    // console.log("paymentIntent:", paymentIntent);
    if (paymentIntent) {
      const { metadata, status, amount } = paymentIntent;
      const paymentQuery = {
        consumerId: metadata?.user,

        payAmount: amount / 100,
        paymentStatus: status,
        transactionId: pi,
      };
      const paymentRes = await PaymentModel.create(paymentQuery);
      if (paymentRes) {
        return res.json({ success: true, paymentRes });
      }
      console.log(paymentRes, ":paymentRes");
    }
  } catch (err) {
    res.json({
      msg: err,
    });
  }
});

module.exports = router;
