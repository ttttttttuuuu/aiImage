import { ObjectId, Timestamp } from "mongodb";
import mongoose from "mongoose";

const Saved = new mongoose.Schema({
  user_id: { type: ObjectId, required: true },
  photo_id: { type: ObjectId, required: true },
  created_time: { type: Date, default: Date.now() },
  state: { type: Boolean, required: true },
});

const SaveSchema = mongoose.model("saved", Saved);
export default SaveSchema;
