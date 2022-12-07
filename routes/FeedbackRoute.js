const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const BuyerModel = require("../models/BuyerModel");
const RegPropertyModel = require("../models/RegPropertyModel");
const FeedbackModel = require("../models/FeedbackModel");

router.get("/", (req, res) => res.send("Feedback Route"));

router.post("/feedbackregister", async (req, res) => {
  const { category, budgetfrom, to, area, propertyType, comment, phonenumber } =
    req.body;
  console.log("Register");
  const queryData = {
    category: category,
    budgetfrom: budgetfrom,
    to: to,
    area: area,
    propertyType: propertyType,
    comment: comment,
    phonenumber: phonenumber,
    aflag: true,
  };
  FeedbackModel.create(queryData, async (err, user) => {
    if (err) {
      return res.json({
        msg: "Buyer login failed",
        error: err,
      });
    } else {
      return res.json({
        success: true,
        msg: "Feedback Sent Sucessfully",
        category: user.category,
        budgetfrom: user.budgetfrom,
        to: user.to,
        area: user.area,
        propertyType: user.propertyType,
        comment: user.comment,
        phonenumber: user.phonenumber,
      });
    }
  });
});

module.exports = router;
