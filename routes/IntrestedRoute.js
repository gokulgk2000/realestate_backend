const express = require("express");
const router = express.Router();
const config = require("../config");
const IntrestedModel = require("../models/IntrestedModel");

router.get("/", (req, res) => res.send("category route"));

router.post("/getPropertyIntrested", async (req, res) =>{
    const { regUser ,propertyId} = req.body
    const queryData = {
        regUser:regUser,
        propertyId,
        aflag: true,
      };
IntrestedModel.create(queryData, async (err, intrested) =>{

   if(err){
    return res.json({
    msg: " ",
    error: err,
})
   }else {
    return res.json({
      success: true,
      msg: "Property Add on your intrested",
      intrested
    });
  }})
});

router.get("/allIntrestedList", async (req, res) => {
    IntrestedModel.find({})
    .populate([
      {
        path: "propertyId",
        select: "layoutName location",
      },
    ])
    .exec ((err, list) => {
      if (err) {
        res.json({
          msg: err,
        });
      } else {
        res.json({
          success: true,
          users: list,
        });
      }
    });
  });

  router.post("/getIntrestedByUserId", async (req, res) => {
    try {
      const { userId } = req.body;
      IntrestedModel.find({regUser:userId})
      .populate({
        path: "propertyId",
        select: "layoutName location Seller landArea",
      })
      .exec((err, Intrested) => {
        if (err) {
      console.log(err)
          return res.json({
            msg: err,
          });
        } else if (Intrested) {
          return res.json({
            success: true,
            Intrested,
          });
        } else {
          return res.json({
            msg: `No User Found With Id ${userId}`,
          });
        }
      });
    } catch (err) {
      console.log(err)
      return res.json({
        msg: err,
      });
    }
  });





module.exports = router;
