const express = require("express");
const RequestedModels = require("../models/RequestedModels");
const userModel = require("../models/userModel");
const router = express.Router();

router.get("/", (req, res) => res.send("Requested Route"));

router.post("/requested", async (req, res) => {
    try{
        const{
            regUser,
            facing,
            location,
            nearTown,
            askPrice,
        }=req.body;
        const user = await userModel.findOne({_id:regUser,aflag:true});
        if(user){
            const queryData ={
            regUser,
            facing: facing,
            location: location,
            nearTown: nearTown,
            askPrice: askPrice,
            aflag:true,
            };
            const requested = await RequestedModels.create(queryData);
            console.log("queryData",queryData )
            if(requested){
                return res.json({
                    success: true,
                    requested:requested ,
                    msg: "Request Sent Sucessfully",
                  });
            }else {
                return res.json({ msg: "Sent Requested failed" });
              }
        }else {
            return res.json({ msg: "User not found" });
          }
    }catch (err) {
        console.log("err msg:",err?.message)
        console.log("err :",err)
  
  
        return res.json({ msg: err?.name || err });
      }
      });

      router.get("/requested", async (req, res) => {
        RequestedModels.find({}, null, { limit: 100 }, (err, list) => {
    if (err) {
      res.json({
        msg: err,
      });
    } else {
      res.json({
        success: true,
        requested: list,
      });
    }
  });
});

router.post("/getrequestedByUserId", async (req, res) => {
    try {
      const { userID } = req.body;
     
      RequestedModels.find({ regUser: userID })
        // .populate({
        //   path: "regUser",
        //   select:
        //     "location  layoutName Seller landArea facing approachRoad builtArea bedRoom floorDetails status nearTown costSq facilities askPrice propertyPic",
        // })
        .exec((err, isRequested) => {
          if (err) {
            return res.json({
              msg: err,
            });
          } else {
            return res.json({
              success: true,
              requested: isRequested,
            });
          }
        });
    } catch (err) {
      return res.json({ msg: err });
    }
  });

  module.exports = router;
