"use strict";
import mongoose from "mongoose";

const connectDB = (url) => {
  // working with search func
  mongoose.set("strictQuery", true);

  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

export default connectDB;
