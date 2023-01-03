const express = require("express");
const RequestedModels = require("../models/RequestedModels");
const userModel = require("../models/userModel");
const router = express.Router();

router.get("/", (req, res) => res.send("Requested Route"));


router.post("/requested", async (req, res) => {
  const { regUser,location, propertyType, facing, landArea, buildArea, expectedPrice } =
    req.body;

  const queryData = {
    regUser: regUser,
    location: location,
    facing: facing,
    propertyType: propertyType,
    landArea: landArea,
    buildArea: buildArea,
    expectedPrice: expectedPrice,
    aflag: true,
  };
  RequestedModels.create(queryData, async (err, requested) => {
    if (err) {
      return res.json({
        msg: "Sent Requested failed",
        error: err,
      });
    } else {
      return res.json({
        success: true,
        requested: requested,
        msg: "Request Sent Sucessfully",
      });
    }
  });
});

router.get("/getAllrequested", async (req, res) => {
  RequestedModels.find({})
    .populate([
      {
        path: "regUser",
        select: "firstname lastname email",
      },
    ])
    // null, { limit: 100 }
    .exec((err, list) => {
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
      .populate({
        path: "regUser",
        select: "firstname lastname",
      })
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
