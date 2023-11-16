import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    name:{
      type: String,
      required: true
    },
    title:{
      type: String,
      max: 1000,
      min: 3
    },
    desc:{
      type: String,
    },
    creatorId:{
      type: String,
    },
    postImage: {
      type: String,
    },
    categories:{
      type: Array,
    },
    likes:{
      type: [String],
      default:[]
    },
    comments:{
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  }
);

export default mongoose.model("Post", PostSchema);