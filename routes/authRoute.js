const express = require("express");
const userRoutes = express.Router();
const User = require("../models/User");
const {
  home,
  getLogin,
  getRegister,
  login,
  register,
  logout,
} = require("../controllers/authController");

// Example route
userRoutes.get("/", home);

//Render Login Page
userRoutes.get("/login", getLogin);

// Main Logic for user login
userRoutes.post("/login", login);

// Render Register Page
userRoutes.get("/register", getRegister);

// Main Logic for user registration
userRoutes.post("/register", register);

// Logout
userRoutes.get("/logout", logout);

module.exports = userRoutes;
