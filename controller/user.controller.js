const express = require("express");
const User = require("../model/user.model");
const router = express.Router();
const ErrorHandler = require("../utils/Errorhandler");
const cloudinary = require('cloudinary');
const jwt = require("jsonwebtoken");
const path = require("path");
const sendMail =require("../utils/mailsender");
const catchAsyncErrors=require("../middleware/AsyncErrors");
const sendToken=require("../utils/sendjwttoken");
const {isAuthenticated} = require("../middleware/authentication.js");

//Create User Sign Up
router.post("/user-Sign-up", async (req, res, next) => {
      const { name, email, password } = req.body;
      try {
      let userEmail = await User.findOne({ email });
      if (userEmail) {
        return res.status(400).json({
          success: false,
          message: "User already exists Please try to SignUp with different Email",
        });
      }
      const newuser = await User.create({name, email, password });
      // sendToken(userEmail, 201, res);     
      if(newuser._id){
        const user = {
          name: name,
          email: email,
          password: password
        };
        // try {
            await sendMail({
            email: user.email,
            subject: "QuickMemo Account Creation Successfull",
            message: `Hello ${user.name}, Account Creation towards QuickMemo platform is Successful.\nLog in to enjoy the features in QuickMemo`,
          });
            return  res.status(201).json({
                  success: true,
                  message: `Hello ${user.name} QuickMemo account Created Successfully, Log in now.`,
                });
             }else{
              return res.status(404).json({
                success: false,
                message: "New user Register Failed Try again later",
              });
              // return res.json({
              //   status: "error",
              //   success: false,
              //   message: "User Creation failed!!!",
              // });
             } 
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
  });

  // create activation token for user
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET_KEY, {
      expiresIn: "15m",
    });
  };
  
// activate user
  router.post("/activation",catchAsyncErrors(async (req, res, next) => {
      try {
        const { activation_token } = req.body;
  
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET_KEY);
        if (!newUser) {
          return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, avatar,mobile } = newUser;
        let Existeduser = await User.findOne({ email });
        if (Existeduser) {
          return next(new ErrorHandler("User already exists", 400));
        }
        // else{
          Existeduser = await User.create({name, email, password, avatar,mobile});
            sendToken(Existeduser, 201, res);
        // }
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );

// User Sign In
router.post("/user-Sign-In",catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Login Credentials Missing !",
        });
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User doesn't exists !",
        });
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return  res.status(400).json({
          success: false,
          message: "Password Doesnot Match!, Please Provide Valid Information !",
        });
      }
      return  res.status(200).json({
        success: true,
        message: "Log in Successfull...",
        data:user
      });
      // sendToken(user, 201, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

// get  user Details
router.get("/getuser",isAuthenticated,catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User does not exists", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;