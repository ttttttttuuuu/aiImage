"use strict";
import express from "express";
import * as dotenv from "dotenv";
import authUser from "../func/auth.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";
import Liked from "../mongodb/models/liked.js";
import Saved from "../mongodb/models/saved.js";
import { ObjectId } from "mongodb";
dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL POST
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// CREATE A POST
router.route("/").post(authUser, async (req, res) => {
  try {
    const { name, prompt, photo, type } = req.body;
    console.log(name, prompt, photo, type);
    const { _id } = req.decoded;
    const photoURL = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name,
      user_id: _id,
      prompt,
      photo: photoURL.url,
      count: 0,
      type,
    });
    res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

// LIKED A POST
router.route("/liked").post(authUser, async (req, res) => {
  try {
    const { photo_id } = req.body;
    const { _id } = req.decoded;

    const result = await Liked.findOne({
      photo_id: new ObjectId(photo_id),
      user_id: new ObjectId(_id),
    });
    if (result) {
      const post = await Post.findOne({ _id: new ObjectId(photo_id) });
      const filter = { _id: new ObjectId(photo_id) };

      if (post) {
        const update = { count: post.count - 1 };

        await Post.findOneAndUpdate(filter, update, {
          new: true,
        });
      }

      await Liked.deleteOne({
        user_id: new ObjectId(_id),
        photo_id: new ObjectId(photo_id),
      });

      res.status(200).json({ success: true });
    } else {
      const doc = await Liked.create({
        user_id: _id,
        photo_id,
        created_time: Date.now(),
        state: true,
      });

      const post = await Post.findOne({ _id: new ObjectId(photo_id) });

      if (post) {
        const filter = { _id: new ObjectId(photo_id) };

        const update = { count: post.count + 1 };

        let updates = await Post.findOneAndUpdate(filter, update, {
          new: true,
        });
      }

      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

// CHECK LIKED
router.route("/checkedLiked").post(authUser, async (req, res) => {
  try {
    const { _id } = req.decoded;

    const result = await Liked.find({ user_id: _id, state: true });
    if (result.length >= 1) {
      res
        .status(200)
        .json({ success: true, data: result.map((e) => e.photo_id) });
    } else {
      res.status(200).json({ success: true, data: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

// SAVED A POST
router.route("/saved").post(authUser, async (req, res) => {
  try {
    const { photo_id } = req.body;
    const { _id } = req.decoded;

    const result = await Saved.find({ photo_id, user_id: _id });

    if (result.length >= 1) {
      const filter = {
        phot_id: new ObjectId(photo_id),
        user_id: new ObjectId(_id),
      };

      const update = { state: !result[0].state };

      await Saved.findOneAndUpdate(filter, update, {
        new: true,
      });

      // await Saved.updateOne({
      //   user_id: _id,
      //   photo_id,
      //   created_time: result[0].created_time,
      //   state: !result[0].state,
      // });

      res.status(200).json({ success: true });
    } else {
      await Saved.create({
        user_id: _id,
        photo_id,
        created_time: Date.now(),
        state: true,
      });

      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

// CHECK SAVED
router.route("/checkedSaved").post(authUser, async (req, res) => {
  try {
    const { _id } = req.decoded;

    const result = await Saved.find({ user_id: _id, state: true });

    if (result.length >= 1) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: true, data: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
});

export default router;
