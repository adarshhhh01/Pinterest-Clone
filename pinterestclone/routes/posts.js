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
    image: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // who liked the post
      },
    ],
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
