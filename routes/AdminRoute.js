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
  const { userID} = req.body;   
  const removeUser = await userModel.findByIdAndUpdate(userID, {
    aflag: false,
    status: "Rejected",
    lastModified: Date.now(),

  }); 
  //  console.log(removeuser)

  if (!removeUser) {
    res.status(404);
  } else {

    res.json({ success: true, removeUser});
     const propertyRes = await RegPropertyModel.updateMany({regUser:userID},{isBlock:true})
  console.log(propertyRes)
 
  }
}); 

router.put("/removeProperty", async (req, res) => {
  const { PropertyID } = req.body;
  const removeProperty = await RegPropertyModel.findByIdAndUpdate(PropertyID,{
    aflag: false,
    status: "Rejected",
    lastModified: Date.now(),
  });
  if (!removeProperty) {
    res.status(404);
  } else {
    res.json({ success: true, removeProperty });
  }
});

router.post('/getAllUsersPage', async (req, res) => {
  try{
    const { page=1,size=10 }=req.body;
    
    const limit = parseInt(size);
    const skip = (page - 1) * limit

    const users =await userModel.find({},null,{limit,skip})
    res.send({
      page,
      size,
      data:users
    })
  }catch(err){
    return res.json({ msg: err?.name || err });

  }
})

router.put("/adminedit", async (req, res) => {
  const { id,Seller, landArea, location ,
    layoutName,
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
    Description,} = req.body;
  const queryData = {
    Seller:Seller,
    location: location,
    layoutName:layoutName,
    landArea: landArea,
    facing: facing,
    approachRoad:approachRoad,
    builtArea: builtArea,
    bedRoom:bedRoom,
    floorDetails: floorDetails,
    status: status,
    nearTown:nearTown,
    costSq: costSq,
    facilities:facilities,
    askPrice: askPrice,
    propertyPic: propertyPic,
    Description:Description,
  };
  RegPropertyModel.findByIdAndUpdate({ _id: id }, queryData, (err, user) => {
    if (err) {
      return res.json({
        msg: err,
      });
    } else if (user) {
      RegPropertyModel.findOne({ _id: id }, (err, isUser) => {
        if (err) {
          return res.json({
            msg: "Error Occured",
            error: err,
          });
        } else if (!isUser) {
          return res.json({
            msg: "User not Found",
          });
        } else {
          return res.json({
            success: true,
            userID: isUser._id,
            seller:isUser.Seller,
            landArea: isUser.landArea,
            location: isUser.location,
            layoutName,
    facing:isUser.facing,
    approachRoad:isUser.approachRoad,
    builtArea:isUser.builtArea,
    bedRoom:isUser.bedRoom,
    floorDetails:isUser.floorDetails,
    status:isUser.status,
    nearTown:isUser.nearTown,
    costSq: isUser.costSq,
    facilities:isUser.facilities,
    askPrice: isUser.askPrice,
    propertyPic: isUser.propertyPic,
    Description: isUser.Description,
          });
        }
      });
    }
  });
});









module.exports = router;
