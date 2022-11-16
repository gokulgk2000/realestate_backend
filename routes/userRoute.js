const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { hashGenerator } = require("../helpers/Hashing");
const { hashValidator } = require("../helpers/Hashing");
const { JWTtokenGenerator } = require("../helpers/Token");
const { isAuthenticated } = require("../helpers/SafeRoutes");
const config = require("../config");


router.get("/", (req, res) => res.send("User Route"));

router.post("/register", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
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
          aflag: true,
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
            // firstname: isUser.firstname,
            // lastname: isUser.lastname,
            // email: isUser.email,
            // token: "JWT " + jwtToken,
            // propertyStatus: isUser.propertyStatus,
            // propertyPic: isUser.propertyPic,
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

 router.post("/forgotpassword",async(req,res) =>{
    const{email}=req.body;
    userModel.findOne({email:email},async()=> {
        if(!email){
            return res.json({
                msg:"Please provide a valid email",
                error:err
            });
        } else if(email?.varified){
            return res.json({
                msg:"This email isn't verified yet",
            });
        } else if(email.aflag){
            return res.json({
                msg:"This registered email has been deactivated",
            })
        }else {
            const verifyToken=await JWTtokenGenerator({
                id:email,
                expire:"3600s"
            })
            const mailOptions = {
                to: email,
                subject: "Forget Password Rain Computing",
                html:
                  '<p>You requested for Reset Password from Rain Computing, kindly use this <a href="' +
                  config.FE_URL +
                  "/forgot-password?token=" +
                  verifyToken +
                  '">link</a> to reset your password</p>',
            };
            return res.json({
                success: true,
                msg: "Pleasse check your email to Reset Your Password ",
                email: email,
              });
        }
    })
 })
  
  router.post("/verifyForgetPassword", async (req, res) => {
    const { verifyToken, newPassword } = req.body;
  
    if (verifyToken) {
      jwt.verify(verifyToken, config.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          return res.json({
            msg: err?.name || "Invalid token",
            err,
          });
        } else {
          console.log("decodedToken : ", decodedToken);
          const id = decodedToken?.id;
          const hashPassword = await hashGenerator(newPassword);
          userModel.findOneAndUpdate(
            { email: id, verified: true, aflag: true },
            { password: hashPassword },
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
                  id: user._id,
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
        msg: "Invalid Action",
      });
    }
  });
  
  module.exports = router;