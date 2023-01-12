const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const BuyerModel = require("../models/BuyerModel");
const RegPropertyModel = require("../models/RegPropertyModel");
const FeedbackModel = require("../models/FeedbackModel");

router.get("/", (req, res) => res.send("Feedback Route"));

router.post("/feedbackregister", async (req, res) => {
  const {  comment,userID } =
    req.body;
  console.log("Register");
  const queryData = {
   
    comment: comment,
  
    userID,
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
       
        comment: user.comment,
        userID:user.userID,
      });
    }
  });
});

module.exports = router;
