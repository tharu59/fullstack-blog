const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  deletePost,
  getEditPostForm,
  updatePost,
} = require("../controllers/postController");
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

// get all posts
postRoutes.get("/", getPosts);

// get post by ID
postRoutes.get("/:id", getPostById);

// delete post route
// postRoutes.delete("/:id", deletePost);
postRoutes.get("/:id/delete", ensureAuthenticated, deletePost);

// Edit post form route
postRoutes.get("/:id/edit", ensureAuthenticated, getEditPostForm);

// Update post route
postRoutes.post("/:id/update", ensureAuthenticated, upload.array("images", 5), updatePost);

module.exports = postRoutes;
