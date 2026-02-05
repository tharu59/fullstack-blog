const express = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const { addComment } = require("../controllers/commentController");

const commentRoutes = express.Router();

// add Comment₺ route
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);

module.exports = commentRoutes;
