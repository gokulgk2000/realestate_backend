const express = require("express");
// const { reject } = require("lodash");
const jwt = require("jsonwebtoken");
const { hashGenerator } = require("../helpers/Hashing");
const { hashValidator } = require("../helpers/Hashing");
const { JWTtokenGenerator } = require("../helpers/token");
//const ActiveSessionModel = require("../models/activeSession");
const { isAuthenticated } = require("../helpers/safeRoutes");
const AdminModel = require("../models/AdminModel");
const RegPropertyModel = require("../models/RegPropertyModel");
const userModel = require("../models/userModel");

const router = express.Router();
router.post("/adminLogin", async (req, res) => {
  const { username, password } = req.body;

  AdminModel.findOne({ username: username }, async (err, isAdmin) => {
    if (err) {
      return res.json({
        msg: "Login failed",
        error: err,
      });
    } else if (!isAdmin) {
      return res.json({
        msg: "This  username isn't registered yet",
      });
    } else if (!isAdmin.aflag) {
      return res.json({
        msg: "This account has been deactivated",
      });
    } else {
      const result = await hashValidator(password, isAdmin.password);
      if (result) {
        console.log(result, "result");
        const jwtToken = await JWTtokenGenerator({
          id: isAdmin._id,
          expire: "30d",
        });
        const query = {
          adminId: isAdmin._id,
          firstname: isAdmin.firstname,
          lastname: isAdmin.lastname,
          aflag: true,
          token: "JWT " + jwtToken,
        };
        res.cookie("jwt", jwtToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        console.log("Setting cookie in res");
        return res.json({
          success: true,
          adminID: isAdmin._id,
          firstname: isAdmin.firstname,
          lastname: isAdmin.lastname,
          username: isAdmin.username,
          token: "JWT " + jwtToken,
        });
      } else {
        return res.json({
          msg: "Password Doesn't match",
        });
      }
    }
  });
});
router.post("/getUserById", async (req, res) => {
  try {
    const { userId } = req.body;
    userModel.findById(userId, async (err, User) => {
      if (err) {
        return res.json({
          msg: err,
        });
      } else if (User) {
        return res.json({
          success: true,
          User,
        });
      } else {
        return res.json({
          msg: `No User Found With Id ${userId}`,
        });
      }
    });
  } catch (err) {
    return res.json({
      msg: err,
    });
  }
});
router.post("/getPropertyDetailsById", async (req, res) => {
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
router.get("/allUsersList", async (req, res) => {
  userModel.find((err, list) => {
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
router.get("/allPropertiesList", async (req, res) => {
  RegPropertyModel.find((err, list) => {
    if (err) {
      res.json({
        msg: err,
      });
    } else {
      res.json({
        success: true,
        properties: list,
      });
    }
  });
});
router.put("/removeUser", async (req, res) => {
  const { userID } = req.body;
  const removeUser = await userModel.findByIdAndUpdate(userID, {
    aflag: false,
    lastModified: Date.now(),
  });
  if (!removeUser) {
    res.status(404);
  } else {
    res.json({ success: true, removeUser });
  }
});
router.put("/removeProperty", async (req, res) => {
  const { PropertyID } = req.body;
  const removeProperty = await RegPropertyModel.findByIdAndUpdate(PropertyID, {
    aflag: false,
    lastModified: Date.now(),
  });
  if (!removeProperty) {
    res.status(404);
  } else {
    res.json({ success: true, removeProperty });
  }
});
module.exports = router;
