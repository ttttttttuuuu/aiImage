import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Liked = new mongoose.Schema({
  user_id: { type: ObjectId, required: true },
  photo_id: { type: ObjectId, required: true },
  created_time: { type: Date, default: Date.now() },
  state: { type: Boolean, required: true },
});

const LikeSchema = mongoose.model("liked", Liked);
export default LikeSchema;
