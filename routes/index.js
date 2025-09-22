var express = require('express');
var router = express.Router();
const userModel = require('./users');
 const postModel = require('./posts');
const passport = require('passport');
const upload = require('./multer');
const LocalStrategy = require('passport-local').Strategy;




passport.use(new LocalStrategy(userModel.authenticate()));


/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/login', function(req, res, next) {
  // console.log(req.flash("error"))
  res.render('login',{error: req.flash('error')});
});
router.get('/feed', function(req, res, next) {
  res.render('feed');
});


router.post('/upload',isLoggedIn, upload.single("avatar"),async function(req, res, next) {
  if(!req.file){
    res.send(404).send('No files were given')} 
    // yaha tk main post upload ho gai but yaha per abhi ye define nhi hia ki yeh post kiski hai kisne usko upload kiya....
    // toh hum bole toh ye jo post hai uski UId user ko do or user UId post me save krwado jisme hum isko easily located kr skte hai.
    
    const user = await userModel.findOne({username: req.session.passport.user});
    const post = await postModel.create({
      image : req.file.filename,
      imageText: req.body.filecaption,
      user: user._id
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("profile");
});

router.get('/profile', isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({
    username:req.session.passport.user
  })
  .populate("posts")
  .populate("likedPosts")
  await res.render("profile",{user});
  // req.user is automatically populated by passport when user is authenticated
   
});

// Like a post
router.post('/like/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({username: req.session.passport.user});
    const post = await postModel.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({error: 'Post not found'});
    }
    
    // Check if user already liked this post
    if (user.likedPosts.includes(post._id)) {
      return res.status(400).json({error: 'Post already liked'});
    }
    
    // Add post to user's liked posts
    user.likedPosts.push(post._id);
    await user.save();
    
    // Add user to post's likes
    post.likes.push(user._id);
    await post.save();
    
    res.json({success: true, message: 'Post liked successfully'});
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

// Unlike a post
router.post('/unlike/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({username: req.session.passport.user});
    const post = await postModel.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({error: 'Post not found'});
    }
    
    // Check if user has liked this post
    if (!user.likedPosts.includes(post._id)) {
      return res.status(400).json({error: 'Post not liked yet'});
    }
    
    // Remove post from user's liked posts
    user.likedPosts.pull(post._id);
    await user.save();
    
    // Remove user from post's likes
    post.likes.pull(user._id);
    await post.save();
    
    res.json({success: true, message: 'Post unliked successfully'});
  } catch (error) {
    console.error('Unlike error:', error);
    res.status(500).json({error: 'Internal server error'});
  }
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});





router.post('/register', function(req, res) {
  
    const { username, email, fullname} = req.body;
    const UserData = new userModel({
      username,
      email,
      fullname,
    });
  
    userModel.register(UserData, req.body.password)
      .then(function(){
        passport.authenticate("local")(req, res, function() {
          res.redirect('/profile');
        });
      })
      .catch(function(err) {
        console.error('Registration error:', err);
        res.redirect('/login?error=' + encodeURIComponent(err.message));
      });
  
});


router.post('/login', passport.authenticate("local",{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
  }),function(req, res) {
 
});

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
}); 

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
