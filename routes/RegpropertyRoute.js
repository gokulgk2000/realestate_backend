const express = require("express");
const router = express.Router();
const config = require("../config");
const userModel = require("../models/userModel");
const RegPropertyModel = require("../models/RegPropertyModel");



router.get("/", (req, res) => res.send("Property Route"));

router.post("/Sellproperty", async (req, res) => {
    try {
      //De-Struturing values from request body
      const {
        userID,
        Seller,
        location,
        layoutName,
        landArea,
        facing,
        approachRoad,
        builtArea,
        bedRoom,
        floorDetails,
        status,
        nearTown,
        costSq,
        facilities,
        askPrice,
        propertyPic,
        Description,
      } = req.body;
      // console.log("Response :",req.body)
      //Finding user from DB collection using unique userID
      const user = await userModel.findOne({ _id: userID });
      //Executes is user found
      if (user) {
        const queryData = {
          userID,
          Seller:Seller,
          location:location,
          layoutName:layoutName,
          landArea:landArea,
          facing:facing,
          approachRoad:approachRoad,
          builtArea:builtArea,
          bedRoom:bedRoom,
          floorDetails:floorDetails,
          status:status,
          nearTown:nearTown,
          costSq:costSq,
          facilities:facilities,
          askPrice:askPrice,
          propertyPic: propertyPic,
          Description: Description,
          aflag: true,
        };
        const isAlreadyRegistered = await RegPropertyModel.find({
          Seller,
        });
        if (isAlreadyRegistered.length > 0) {
          return res.json({ msg: `${Seller} already exist` });
        } else {
          const regProperty = await RegPropertyModel.create(queryData);
          if (regProperty) {
            return res.json({
              success: true,
              msg: "Property Registration Sucessfull",
            });
            // const updatedUser = await userModel.findByIdAndUpdate(email, {
            //   propertyStatus: status,
            //   lastModified: Date.now(),
            // });
          } else {
            return res.json({ msg: "Property Registeration failed" });
          }
        }
      } else {
        return res.json({ msg: "User not found" });
      }
    } catch (err) {
      return res.json({ msg: err?.name || err });
    }
  });

  router.post("/getpropertyByUserId", async (req, res) => {
    try {
      const { userID } = req.body;
      RegPropertyModel.find({ regUser: userID })
        // .populate({
        //   path: "regUser",
        //   select:
        //     "location  layoutName Seller landArea facing approachRoad builtArea bedRoom floorDetails status nearTown costSq facilities askPrice propertyPic",
        // })
        .exec((err, isProperty) => {
          if (err) {
            return res.json({
              msg: err,
            });
          } else {
            return res.json({
              success: true,
              property: isProperty,
            });
          }
        });
    } catch (err) {
      return res.json({ msg: err });
    }
  });
  router.post("/getpropertyById", async (req, res) => {
    try {
        const { propertyId } = req.body;
        RegPropertyModel.findById(propertyId, async (err, Property) => {
          if (err) {
            return res.json({
              msg: err,
            });
          } else if (Property) {
            return res.json({
              success: true,
              Property,
            });
          } else {
            return res.json({
              msg: `No Property Found With Id ${propertyId}`,
            });
          }
        });
      } catch (err) {
        return res.json({
          msg: err,
        });
      }
    });
  
  router.post("/properties", async (req, res) => {
    const { searchText } = req.body;
    RegPropertyModel.find(
      {
        $or: [
          { location: { $regex: "^" + searchText, $options: "i" } },
          { nearTown: { $regex: "^" + searchText, $options: "i" } },
          { askPrice: { $regex: "^" + searchText, $options: "i" } },
          { bedRoom: { $regex: "^" + searchText, $options: "i" } },
          { floorDetails
            : { $regex: "^" + searchText, $options: "i" } },
          { Seller: { $regex: "^" + searchText, $options: "i" } },
        ],
      },
      null,
  
      (err, list) => {
        if (err) {
          res.json({
            msg: err,
          });
        } else {
          res.json({
            success: true,
            property: list,
          });
        }
      }
    );
  });
  module.exports = router;