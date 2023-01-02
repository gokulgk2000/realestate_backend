const express = require("express");
const router = express.Router();
const config = require("../config");
const BuyerModel = require("../models/BuyerModel");
const IntrestedModel = require("../models/IntrestedModel");
const RegPropertyModel = require("../models/RegPropertyModel");

router.get("/", (req, res) => res.send("category route"));

router.post("/createIntrestedProperty", async (req, res) =>{
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
   }else if(intrested) {
    RegPropertyModel.findById(propertyId,(err, intrested),null,
    {populate:{path:"regUser",select:"firstname _id "}})
      if(err){
        return res.json({
        msg: " ",
        error: err,
    })}else{
    return res.json({
      success: true,
      msg: "Property Add on your intrested",
      intrested
    });
  }
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

  router.post("/getIntrestedByBuyerId", async (req, res) => {
    try {
      const { userID } = req.body;
      BuyerModel.find({regUser:userID})
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
            msg: `No buyer Found With Id ${userID}`,
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
  router.post("/IntrestedByPropertyId", async (req, res) => {
    try {
      const { propertyId } = req.body;
      IntrestedModel.findOne({propertyId})
      .populate({
        path: "regUser",
        select: "firstname email ",
      })
    
    } catch (err) {
      console.log(err)
      return res.json({
        msg: err,
      });
    }
  });

  router.post("/createInterest", async (req, res) => {
    try{
      const { regUser, propertyId } = req.body;
      const queryData = {
        regUser:regUser,
        propertyId:propertyId,
        status:"approved",
        aflag: true,
        isBlock: true,
        
      };
      IntrestedModel.create(queryData, async (err, intrested) =>{
        if(err) {
          return res.json({
          msg: " ",
          error: err,
        });

        }else if(intrested) {
          return res.json({
            success: true,
            intrested
          })
        }
      })
    }catch(err){
      console.log(err)
      return res.json({
        msg: err,
      })
    }
  });
  router.post("/getinterested", async (req, res) => {
 try{
  const {userID} = req.body;
  IntrestedModel.find({regUser:userID,aflag:true})
 
  .populate(
   {
    path: "propertyId",
    select: " category Seller phone yourName title  location  streetName layoutName landArea facing approachRoad   builtArea  bedRoom bathRoom floorDetails floor propertyStatus aboutProperty status  nearFacilities costSq facilities  bargainPrice negotiablePrice propertyPic Description"
   }
)

   .exec((err, isIntrested) => {
        if (err) {
      console.log(err)
          return res.json({
            msg: err,
          });
        } else  {
          return res.json({
            success: true,
            Intrested:isIntrested,
          });
       
          
        }
      });
 }catch(err){
  return res.json({
    msg: err,
  })
 }
   
  });

  router.put("/removeInterest", async (req, res) => {
    const {userID } = req.body;
    const removeProperty = await IntrestedModel.findByIdAndUpdate(userID,{
      aflag: false,
      status: "rejected",
      lastModified: Date.now(),
    });
    
    if (!removeProperty) {
      res.status(404);
    } else {
      res.json({ success: true, removeProperty });
    }
    console.log(removeProperty)
  });




module.exports = router;
