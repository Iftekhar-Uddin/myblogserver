import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    selectedFile: {
      type: String,
    },
    contact: {
      type: String,
      max: 15,
    },
    desc: {
      type: String,
      max: 100,
    },
  }
);

export default mongoose.model("User", UserSchema);