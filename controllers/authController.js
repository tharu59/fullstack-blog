const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.home = asyncHandler((req, res) => {
  // `Welcome to Fullstack Blog App! hosted on the server at http://${HOST}:${PORT}`,
  // `Welcome to Fullstack Blog App...!`,
  res.render("home", {
    user: req.user,
    error: "",
    title: "Home",
  });
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
