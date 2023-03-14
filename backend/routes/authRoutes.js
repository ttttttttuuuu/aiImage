"use strict";
import express from "express";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import Auth from "../mongodb/models/user.js";
import authUser from "../func/auth.js";
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

// SIGN IN
router.route("/").post(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const result = await Auth.findOne({ email });
    console.log(result);
    if (result) {
      if (bcrypt.compareSync(password, result.password)) {
        const token = jwt.sign(
          {
            _id: result._id,
            email: result.email,
            username: result.username,
          },
          "jwtSecret"
        );
        res.status(200).json({
          success: true,
          token: token,
          username: result.username,
          _id: result._id,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Wrong email/password combination!",
        });
      }
    } else {
      res.status(500).json({ message: "your Email address won't !!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Please Sign Up !" });
  }
});

// SIGN UP
router.route("/signup").post(async (req, res) => {
  try {
    const { email, password, username } = req.body;
    console.log(email, password, username);
    const result = await Auth.find({ email });
    console.log(result);
    if (result.length >= 1) {
      res
        .status(200)
        .json({ success: false, message: "This email address already used !" });
    } else {
      const saltRounds = 10;
      const hashPass = bcrypt.hashSync(password, saltRounds);
      const newUser = await Auth.create({
        email,
        password: hashPass,
        username,
      });

      const token = jwt.sign(
        {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        "jwtSecret"
      );
      res.status(200).json({
        success: true,
        token: token,
        username: newUser.username,
        _id: newUser._id,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

// CHECK LOGIN?
router.route("/checkLogin").post(authUser, async (req, res) => {
  const { email } = req.decoded;

  try {
    const result = await Auth.find({ email });
    if (result) {
      res.status(200).json({ success: true });
    } else {
      res
        .status(200)
        .json({ success: false, message: "your Email address won't !!" });
    }
  } catch (error) {
    res.status(200).json({ success: false, message: "error" });
  }
});

export default router;
