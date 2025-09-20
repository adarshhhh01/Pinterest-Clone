const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
// It's good practice to connect to MongoDB here once
// so you don't have to do it in every model file.
// Make sure to replace 'pinterest-clone' with your actual database name.
mongoose.connect('mongodb://127.0.0.1:27017/pinterestclone');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true // Removes whitespace from both ends of a string
  },
  password: {
    type: String
    // Note: This password should be hashed using a library like bcrypt
    // before it's saved to the database.
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullname: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, // URL to the image
    default: '/images/default_avatar.png'
  },
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board' // Tpinhis creates the relationship to the Board model
    }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post' // All posts created by the user
    }
  ],
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post' // All posts liked by the user
    }
  ],
  
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

userSchema.plugin(plm);


module.exports = mongoose.model('User', userSchema);