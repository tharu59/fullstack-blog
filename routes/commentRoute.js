const express = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const { addComment, deleteComment, getEditComment, updateComment } = require("../controllers/commentController");

const commentRoutes = express.Router();

// add Comment route
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

// delete Comment route
commentRoutes.get("/posts/:postId/comments/:id/delete", ensureAuthenticated, deleteComment);

// Edit Comment Form
commentRoutes.get("/posts/:postId/comments/:id/edit", ensureAuthenticated, getEditComment);

// Update Comment
commentRoutes.post("/posts/:postId/comments/:id/update", ensureAuthenticated, updateComment);

module.exports = commentRoutes;
