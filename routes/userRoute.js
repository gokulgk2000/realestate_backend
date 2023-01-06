const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { hashGenerator } = require("../helpers/Hashing");
const { hashValidator } = require("../helpers/Hashing");
const { JWTtokenGenerator } = require("../helpers/Token");
const { isAuthenticated } = require("../helpers/SafeRoutes");
const config = require("../config");
const RegPropertyModel = require("../models/RegPropertyModel");
const OtpModel = require("../models/OtpModel");
const { sendMail } = require("../helpers/sendMail");
const BuyerModel = require("../models/BuyerModel");
// router.use("/api/user", (req, res) => res.sendFile(path.join(__dirname, "./routes/userRoute")));
router.get("/", (req, res) => res.send("User Route"));

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password,role, profilePic,phonenumber } = req.body;
  // console.log(req.body, "req.body");
  if (!password) {
    return res.json({
      msg: "Password Empty",
    });
  }
  userModel.findOne({ email: email }, async (err, isUser) => {
    if (err) {
      return res.json({
        msg: "User Registeration failed",
        error: err,
      });
    } else if (isUser) {
      if (!isUser.aflag) {
        return res.json({
          msg: "This account has been deactivated",
        });
      } else {
        return res.json({
          msg: "Email Already Exist",
        });       
      }
    } else {
      console.log("Register");
      const hashPassword = await hashGenerator(password);
      const queryData = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashPassword,
        phonenumber:phonenumber,
        role:role,
        aflag: true,
        profilePic: profilePic,
      };
      userModel.create(queryData, async (err, user) => {
        if (err) {
          return res.json({
            msg: "User Registeration failed",
            error: err,
          });
        } else {
          return res.json({
            success: true,
            msg: "User Registration Sucessfull",
            userID: user._id,
          });
        }
      });
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email: email }, async (err, isUser) => {
    if (err) {
      return res.json({
        msg: "Login failed",
        error: err,
      });
    } else if (!isUser) {
      return res.json({
        msg: "This email isn't registered yet",
      });
    } else if (!isUser.aflag) {
      return res.json({
        msg: "This account has been deactivated",
      });
    }
    // else if(!isUser?.verified){ //For Email Verification
    //   return res.json({
    //     msg: "This account hasn't been verified yet",
    //   });
    // }
    else {
      const result = await hashValidator(password, isUser.password);
      if (result) {
        console.log(result, "result");
        const jwtToken = await JWTtokenGenerator({
          id: isUser._id,
          expire: "30d",
        });
        res.cookie("jwt", jwtToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        console.log("Setting cookie in res");
        return res.json({
          msg: "login successfull",
          success: true,
          userID: isUser._id,
          firstname: isUser.firstname,
          lastname: isUser.lastname,
          email: isUser.email,
          token: "JWT " + jwtToken,
          propertyStatus: isUser.propertyStatus,
          propertyPic: isUser.propertyPic,
        });
        //   }
        // });
      } else {
        return res.json({
          msg: "Password Doesn't match",
        });
      }
    }
  });
});
router.put("/edit", async (req, res) => {
  const { email, firstname, lastname } = req.body;
  const queryData = {
    firstname: firstname,
    lastname: lastname,
  };

  userModel.findOneAndUpdate({ email: email }, queryData, (err, user) => {
    if (err) {
      return res.json({
        msg: err,
      });
    } else if (user) {
      userModel.findOne({ email: email }, (err, isUser) => {
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
          isUser.password = null;
          isUser.__v = null;
          return res.json({
            success: true,
            userID: isUser._id,
            firstname: isUser.firstname,
            lastname: isUser.lastname,
            email: isUser.email,
            propertyStatus: isUser.propertyStatus,
          });
        }
      });
    }
  });
});

router.get("/whoiam", isAuthenticated, async (req, res) => {
  console.log("user id", req.userid);
  return res.json({ success: true, userid: req.userid });
});

router.post("/verifyEmail", async (req, res) => {
  const { verifyToken } = req.body;

  if (verifyToken) {
    jwt.verify(verifyToken, config.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.json({
          msg: err?.name || "Invalid token",
          err,
        });
      } else {
        const id = decodedToken?.id;
        userModel.findByIdAndUpdate(
          id,
          { verified: true },
          async (err, user) => {
            if (err) {
              console.log("Token error :", err);
              return res.json({
                msg: "Invalid token",
                err,
              });
            } else if (user) {
              return res.json({
                success: true,
                user,
              });
            } else {
              return res.json({
                msg: "Invalid user",
              });
            }
          }
        );
      }
    });
  } else {
    return res.json({
      msg: "Invalid Registeration",
    });
  }
});

router.get("/logout", async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
  });
  return res.json({ success: true });
});

router.post("/propertydetails", async (req, res) => {
  const { objectId } = req.body;
  // console.log("objectId" + objectId);
  RegPropertyModel.findById(objectId, (err, propertydetails) => {
    if (err) {
      res.json({
        msg: "Oops Error occurred!",
        error: err,
      });
    } else {
      res.json({
        success: true,
        msg: propertydetails,
      });
      console.log("propertydetails", res);
    }
  });
});
router.get("/properties", async (req, res) => {
  RegPropertyModel.find({}, null, { limit: 100 }, (err, list) => {
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
  });
});

router.put("/profileEdit", async (req, res) => {
  try {
    const {
      //  firstname,lastname,profilePic,
      userID,
      firstname,
      lastname,
      phoneno,
      profilePic,
      password,
    } = req.body;
    const queryData = {
      firstname: firstname,
      lastname: lastname,
      phoneno: phoneno,
      profilePic: profilePic,
      password: password,
      // profilePic: profilePic,
    };

    userModel.findByIdAndUpdate(userID, queryData, () => {
      return res.json({
        success: true,
        //  msg:updated,
        queryData,
      });

      // if (err) {
      //   return res.json({
      //     msg: "Error Occured",
      //     error: err,
      //   });
      // } else if (!user) {
      //   return res.json({
      //     msg: "User not Found",
      //   });
      // }
      // else {

      //     userID: user._id,
      //     firstname: user.firstname,
      //     lastname: user.lastname,

      // ;
      // }
    });
  } catch (err) {
    return res.json({ msg: err });
  }
});
router.put("/changepassword", async (req, res) => {
  const { userID, password } = req.body;

  const user = await userModel.findOne({ _id: userID });
  console.log("user", user);
  if (user) {
    const newPassword = await hashGenerator(password);
    const userData = await userModel.findByIdAndUpdate(
      { _id: userID },
      {
        $set: {
          password: newPassword,
        },
      }
    );
    res.status(200).send({
      success: true,
      userID: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profilePic: user.profilePic,
      msg: "password changed successfully",
    });
  } else {
    res.status(200).send({ success: false, msg: "user does not " });
  }
});
router.post("/forgotpassword", async (req, res) => {
  const data = await userModel.findOne({ email: req.body.email });
  
  const responseType = {};
  if (data) {
    
    const otpcode = Math.floor(Math.random() * 10000 + 1);
    const otpData = new OtpModel({
      email: req.body.email,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });

    let otpResponse = await otpData.save();
    responseType.statusText = "success";
    responseType.message = "please check your Email Id";
  } else {
    responseType.statusText = "error";
    responseType.message = "Email not found";
  }
  res.status(200).json(responseType);
});
router.put("/resetpassword", async (req, res) => {
  const {email,code} = req.body;
  const  data = await OtpModel.find({
    email:req.body. email,
    code: code,
  });
  const response = {};
  if (email||code) {
    const currentTime = new Date().getTime();
    const diff = data.expireIn - currentTime;
    if (diff > 0) {
      response.message = "Token Expire";
      response.statusText = "error";
    } else {
     
      const newPassword = await hashGenerator(req.body.password)
      const  userData = await userModel.findOneAndUpdate({ email: req.body.email  },{$set:{password: newPassword}});
    
      response.message = "Password Changed Successfully";
      response.statusText = "success";
    }
  } else {
    response.message = "Invalid Otp";
    response.statusText = "error";
  }
  res.status(200).send({
   
    response
  });
  console.log(data,"data");
});
// const nodemailer = new require("nodemailer");
// const mailer = async (email, otp) => {
  
//   const transporter = nodemailer.createTransport({
//     port: 465, // true for 465, false for other ports
//     host: "smtp.gmail.com",
//     auth: {
//       user: "dspadmanaban2000@gmail.com",
//       pass: "broooqkakgexwhiz",
//     },
//     secure: true,
//   });
//   const mailOptions = {
//     from: "dspadmanaban2000@gmail.com",
//     to: "gokulkrishnan0149@gmail.com",
//     subject: "Sending  Email using node js",
//     text: "ThankYou",
//   };
//   transporter.sendMail(mailOptions, function (error, Info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent" + Info.response);
//     }
//   });
// };

module.exports = router;
