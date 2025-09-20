const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageText: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User' // every post must have an image
    },
   
    createdAt: [
      {
        type: Date,
        default:Date.now,
      },
    ],
    image: {
      type: String,
    },
    
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // who liked the post
      },
    ],
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
