const express = require("express");
const { hashGenerator } = require("../helpers/Hashing");
const { hashValidator } = require("../helpers/Hashing");
const { JWTtokenGenerator } = require("../helpers/Token");
const AdminModel = require("../models/AdminModel");
const RegPropertyModel = require("../models/RegPropertyModel");
const userModel = require("../models/userModel");
const BuyerModel = require("../models/BuyerModel");
const formatBytes = require("../helpers/resSize");
const BannerModel = require("../models/BannerModel");

const router = express.Router();

router.post("/adminRegister", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  // console.log(req.body, "req.body");
  if (!password) {
    return res.json({
      msg: "Password Empty",
    });
  }
  AdminModel.findOne({ username: username }, async (err, isAdmin) => {
    if (err) {
      return res.json({
        msg: "Admin Registeration failed",
        error: err,
      });
    } else if (isAdmin) {
      if (!isAdmin.aflag) {
        return res.json({
          msg: "This account has been deactivated",
        });
      } else {
        console.log("Already Exist");

        return res.json({
          msg: "username Already Exist",
        });
      }
    } else {
      console.log("AdminRegister");
      const hashPassword = await hashGenerator(password);
      const queryData = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: hashPassword,
        aflag: true,
      };
      AdminModel.create(queryData, async (err, admin) => {
        if (err) {
          return res.json({
            msg: "Admin Registeration failed",
            error: err,
          });
        } else {
          return res.json({
            success: true,
            msg: "Admin Registration Sucessfull ",
            adminID: admin,
          });
        }
      });
    }
  });
});

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
    const { userID } = req.body;
    userModel.findById(userID, async (err, User) => {
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
          msg: `No User Found With Id ${userID}`,
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
      //      .populate({
      //   path:"category",
      //   select:"name",
      // })

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
  console.log("Getting Property list.......");
  RegPropertyModel.find((err, list) => {
    if (err) {
      res.json({
        msg: err,
      });
    } else if (list) {
      // console.log(formatBytes(res))
      return res.json({
        success: true,
        properties: list,
      });
    }
  });
});
router.put("/removeBuyer", async (req, res) => {
  const { userID } = req.body;
  const removeBuyer = await BuyerModel.findByIdAndUpdate(userID, {
    aflag: false,
    status: "rejected",
    lastModified: Date.now(),
  });
  console.log(removeBuyer);

  if (!removeBuyer) {
    res.status(404);
  } else {
    res.json({ success: true, removeBuyer });
  }
});
router.put("/addBuyer", async (req, res) => {
  const { userID } = req.body;
  const addBuyer = await BuyerModel.findByIdAndUpdate(userID, {
    aflag: true,
    status: "approved",
    lastModified: Date.now(),
  });
  //  console.log(removeuser)

  if (!addBuyer) {
    res.status(404);
  } else {
    res.json({ success: true, addBuyer });
  }
});
router.put("/addProperty", async (req, res) => {
  const { PropertyID } = req.body;
  const addProperty = await RegPropertyModel.findByIdAndUpdate(PropertyID, {
    aflag: true,
    status: "approved",
    lastModified: Date.now(),
  });
  if (!addProperty) {
    res.status(404);
  } else {
    res.json({ success: true, addProperty });
  }
});

router.put("/deleteImage", async (req, res) => {
  const { PropertyID, propertyPic } = req.body;
  const deletedImage = await RegPropertyModel.findByIdAndUpdate(PropertyID, {
    propertyPic,
    aflag: false,
    lastModified: Date.now(),
  });
  if (!deletedImage) {
    res.status(404);
  } else {
    res.json({ success: true, deletedImage });
  }
});

router.put("/removeUser", async (req, res) => {
  const { userID } = req.body;
  const removeUser = await userModel.findByIdAndUpdate(userID, {
    aflag: false,
    status: "rejected",
    lastModified: Date.now(),
  });
  //  console.log(removeuser)

  if (!removeUser) {
    res.status(404);
  } else {
    res.json({ success: true, removeUser });
    const propertyRes = await RegPropertyModel.updateMany(
      { regUser: userID },
      { isBlock: true, status: "rejected" }
    );
    console.log(propertyRes);
  }
});

router.put("/addUser", async (req, res) => {
  const { userID } = req.body;
  const addUser = await userModel.findByIdAndUpdate(userID, {
    aflag: true,
    status: "approved",
    lastModified: Date.now(),
  });
  //  console.log(removeuser)

  if (!addUser) {
    res.status(404);
  } else {
    res.json({ success: true, addUser });
    const propertyRes = await RegPropertyModel.updateMany(
      { regUser: userID },
      { isBlock: false, status: "approved" }
    );
    console.log(propertyRes);
  }
});

router.put("/updateTopProperty", async (req, res) => {
  const { propertyID, isPremium } = req.body;
  const topProperty = await RegPropertyModel.findByIdAndUpdate(
    propertyID,
    { isPremium },
    { new: true }
  );
  console.log("Update property .....", propertyID, isPremium);
  if (topProperty) {
    res.json({ success: true, topProperty });
  } else {
    res.status(404);
  }
});
router.put("/updateTopPromotors", async (req, res) => {
  const { promotorID, isPremium } = req.body;
  const topPromotors = await userModel.findByIdAndUpdate(
    promotorID,
    { isPremium },
    { new: true }
  );
  if (topPromotors) {
    res.json({ success: true, topPromotors });
  } else {
    res.status(404);
  }
});
router.put("/updateTopFacilators", async (req, res) => {
  const { facilatorID, isPremium } = req.body;
  const topFacilators = await userModel.findByIdAndUpdate(
    facilatorID,
    { isPremium },
    { new: true }
  );
  if (topFacilators) {
    res.json({ success: true, topFacilators });
  } else {
    res.status(404);
  }
});
router.put("/listProperty", async (req, res) => {
  const { propertyId, order } = req.body;
  const orderProperty = await RegPropertyModel.findByIdAndUpdate(
    { _id: propertyId, isPremium: true },
    { order },
    { new: true }
  );
  if (orderProperty) {
    res.json({ success: true, orderProperty });
  } else {
    res.status(404);
  }
});
router.put("/listPromotors", async (req, res) => {
  const { promotorId, order } = req.body;
  const orderPromotors = await userModel.findByIdAndUpdate(
    { _id: promotorId, isPremium: true },
    { order },
    { new: true }
  );
  if (orderPromotors) {
    res.json({ success: true, orderPromotors });
  } else {
    res.status(404);
  }
});
router.put("/listFacilators", async (req, res) => {
  const { facilatorId, order } = req.body;
  const orderFacilators = await userModel.findByIdAndUpdate(
    { _id: facilatorId, isPremium: true },
    { order },
    { new: true }
  );
  if (orderFacilators) {
    res.json({ success: true, orderFacilators });
  } else {
    res.status(404);
  }
});
router.post("/topProperty", async (req, res) => {
  let property = { aflag: true, isPremium: true, status: "approved" };
  RegPropertyModel.find(property, (err, pro) => {
    if (err) {
      res.err(404);
    } else {
      return res.json({
        success: true,
        pro,
      });
    }
  });
  //  console.log(removeuser)
});
router.post("/topPromotors", async (req, res) => {
  let role = { aflag: true, isPremium: true, status: "approved" };
  userModel.find({role:"promotors",isPremium: true}, (err, pro) => {
    if (err) {
      res.status(404);
    } else {
      return res.json({
        success: true,
        pro,
      });
    }
  });
  //  console.log(removeuser)
});
router.post("/topFacilators", async (req, res) => {
  let role = { aflag: true, isPremium: true, status: "approved" };
  userModel.find({role:"facilator",isPremium: true}, (err, pro) => {
    if (err) {
      res.err(404);
    } else {
      return res.json({
        success: true,
        pro,
      });
    }
  });
  //  console.log(removeuser)
});

router.put("/removeProperty", async (req, res) => {
  const { PropertyID } = req.body;
  const removeProperty = await RegPropertyModel.findByIdAndUpdate(PropertyID, {
    aflag: false,
    status: "rejected",
    lastModified: Date.now(),
  });
  if (!removeProperty) {
    res.status(404);
  } else {
    res.json({ success: true, removeProperty });
  }
});

router.post("/getAllUsersPage", async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.body;

    const limit = parseInt(size);
    const skip = (page - 1) * limit;

    const users = await userModel.find({}, null, { limit, skip });
    res.send({
      page,
      size,
      data: users,
    });
  } catch (err) {
    return res.json({ msg: err?.name || err });
  }
});

router.put("/adminedit", async (req, res) => {
  const {
    _id,
    Seller,
    transactionType,
    phone,
    yourName,
    category,
    propertyStatus,
    aboutProperty,
    title,
    landArea,
    streetName,
    location,
    layoutName,
    facing,
    approachRoad,
    builtArea,
    bedRoom,
    bathRoom,
    floor,
    floorDetails,
    nearFacilities,
    status,
    costSq,
    facilities,
    bargainPrice,
    negotiablePrice,
    propertyPic,
    Description,
  } = req.body;

  const queryData = {
    Seller: Seller,
    yourName: yourName,
    transactionType: transactionType,
    phone: phone,
    title: title,
    category: category,
    propertyStatus: propertyStatus,
    aboutProperty: aboutProperty,
    landArea: landArea,
    location: location,
    layoutName: layoutName,
    streetName: streetName,
    landArea: landArea,
    facing: facing,
    approachRoad: approachRoad,
    builtArea: builtArea,
    bedRoom: bedRoom,
    bathRoom: bathRoom,
    floor: floor,
    floorDetails: floorDetails,
    status: "pending",

    costSq: costSq,
    facilities: facilities,
    nearFacilities: nearFacilities,
    bargainPrice: bargainPrice,
    negotiablePrice: negotiablePrice,
    propertyPic: propertyPic,
    Description: Description,
  };
  RegPropertyModel.findByIdAndUpdate({ _id }, queryData, (err, user) => {
    if (err) {
      return res.json({
        msg: err,
      });
    } else if (user) {
      RegPropertyModel.findOne({ _id }, (err, isUser) => {
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
            msg: "Property Updated Sucessfull",
            propertyID: isUser._id,
            title: isUser.title,
            phone: isUser.phone,
            transactionType: isUser.transactionType,
            category: isUser.category,
            propertyStatus: isUser.propertyStatus,
            aboutProperty: isUser.aboutProperty,
            seller: isUser.Seller,
            yourName: isUser.yourName,
            landArea: isUser.landArea,
            streetName: isUser.streetName,
            location: isUser.location,
            layoutName,
            facing: isUser.facing,
            approachRoad: isUser.approachRoad,
            builtArea: isUser.builtArea,
            bedRoom: isUser.bedRoom,
            bathRoom: isUser.bathRoom,
            floorDetails: isUser.floorDetails,
            floor: isUser.floor,
            status: isUser.status,
            costSq: isUser.costSq,
            propertyStatus: isUser.propertyStatus,
            nearFacilities: isUser.nearFacilities,
            facilities: isUser.facilities,
            bargainPrice: isUser.bargainPrice,
            negotiablePrice: isUser.negotiablePrice,
            propertyPic: isUser.propertyPic,
            Description: isUser.Description,
          });
        }
      });
    }
  });
});
router.post("/adproperty", async (req, res) => {
  try {
    const { adminID, adpic } = req.body;
    const admin = await AdminModel.findOne({ _id: adminID });
    if (admin) {
      const queryData = {
        adminID,
        adpic: adpic,
      };

      const adproperty = await BannerModel.create(queryData);
      if (adproperty) {
        return res.json({
          success: true,
          msg: "ad upload Sucessfull",
        });
      }
    } else {
      return res.json({
        msg: "User not Found",
      });
    }
  } catch (err) {
    return res.json({ msg: err?.name || err });
  }
});
router.get("/getAdminById", async (req, res) => {
  try {
    const { adminID } = req.body;

    AdminModel.findOne({ _id: adminID }, async (err, admin) => {
      if (err) {
        return res.json({
          msg: err,
        });
      } else if (admin) {
        return res.json({
          success: true,
          admin,
        });
      } else {
        return res.json({
          msg: `No User Found With Id ${adminID}`,
        });
      }
    });
  } catch (err) {
    return res.json({
      msg: err,
    });
  }
});
router.post("/getAdproperty", async (req, res) => {
  const { adminID } = req.body;
  BannerModel.findOne({adminID }, async (err, banner) => {
    if (err) {
      return res.json({
        msg: "err",
      });
    } else {
      return res.json({
        success: true,
        banner,
      });
    }
  });
});
router.put("/adpropertyEdit", async (req, res) => {
  const {
    adminID,
    adpic
  
  } = req.body;

  const queryData = {
     adpic:adpic
  };
  BannerModel.findByIdAndUpdate({ adminID }, queryData, (err, user) => {
    if (err) {
      return res.json({
        msg: err,
      });
    } else if (user) {
      BannerModel.findOne({ adminID }, (err, isUser) => {
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
            msg: "Property Updated Sucessfull",
           adpic:isUser.adpic
          
     
          });
        }
      });
    }
  });
});
module.exports = router;
