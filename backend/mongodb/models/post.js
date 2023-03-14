import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Post = new mongoose.Schema({
  name: { type: String, required: true },
  user_id: { type: ObjectId, required: true },
  prompt: { type: String, required: true },
  created_time: { type: Date, default: Date.now() },
  photo: { type: String, required: true },
  type: { type: String, required: true },
  count: { type: Number, required: true },
});

const PostSchema = mongoose.model("AIimage", Post);
export default PostSchema;
