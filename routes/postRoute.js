const express = require("express");
const { getPostForm, createPost } = require("../controllers/postController");
const upload = require("../config/multer");
const { ensureAuthenticated } = require("../middlewares/auth");

const postRoutes = express.Router();

// get post form
postRoutes.get("/add", getPostForm);

// post logic
postRoutes.post(
  "/add",
  ensureAuthenticated,
  upload.array("images", 5),
  createPost,
);

module.exports = postRoutes;
