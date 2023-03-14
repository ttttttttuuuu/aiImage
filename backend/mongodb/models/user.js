import mongoose from "mongoose";

const User = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  created_time: { type: Date, default: Date.now() },
});

const UserSchema = mongoose.model("user", User);
export default UserSchema;
