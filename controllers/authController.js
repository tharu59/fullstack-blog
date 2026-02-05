const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.home = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(6);
    
    const postCount = await Post.countDocuments();
    const userCount = await User.countDocuments();
    
    // Aggregation for total views
    const viewStats = await Post.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = viewStats.length > 0 ? viewStats[0].totalViews : 0;

    res.render("home", {
      user: req.user,
      posts,
      stats: {
        posts: postCount,
        users: userCount,
        views: totalViews
      },
      title: "Home",
      error: ""
    });
  } catch (error) {
    console.log(error);
    res.render("home", {
      user: req.user,
      posts: [],
      stats: { posts: 0, users: 0, views: 0 },
      title: "Home",
      error: "Could not load data"
    });
  }
});

// Render Register Page
exports.getRegister = asyncHandler((req, res) => {
  res.render("register", {
    title: "Register",
    user: req.user,
    error: "",
    // error: null,
  });
});

// Main Logic for user Register
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "User already exists",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // save user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // redirect to login page
    res.redirect("/login");
  } catch (error) {
    res.render("register", {
      title: "Register",
      user: req.user,
      error: error.message,
    });
  }
});

// Render login page
exports.getLogin = asyncHandler((req, res) => {
  res.render("login", {
    title: "Login",
    error: "",
    user: req.user,
  });
});

// Main Logic for user login
exports.login = asyncHandler(async (req, res, next) => {
  // const { email, password } = req.body;
  // try {
  //   // check if user exists
  //   const user = await User.findOne({ email });
  //   // const isMatch = await User.findOne({ password });
  //   // compare plain password with hashed password
  //   if (!user) {
  //     res.send("User does not exist");
  //   }
  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) {
  //     return res.send("Incorrect password");
  //   }
  //   // success
  //   res.send("Login successful");
  // } catch (error) {
  //   // res.send(error);
  //   res.send(error.message);
  // }

  passport.authenticate("local", (err, user, info) => {
    // console.log({ err, user, info });
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

// Logout
exports.logout = asyncHandler((req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
