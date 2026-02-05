const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// add Comment
exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  //   find th đe post
  const post = await Post.findById(postId);
  //   validation
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  if (!content) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Comment cannot be empty",
      success: "",
    });
  }
  //   save comment
  const comment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });
  await comment.save();
  //   push comment
  post.comments.push(comment._id);
  await post.save();
  // console.log(post);
  //   redirect
  res.redirect(`/posts/${postId}`);
});

// delete Comment
exports.deleteComment = asyncHandler(async (req, res) => {
  const { postId, id } = req.params;
  // find comment
  const comment = await Comment.findById(id);
  if (!comment) {
    return res.redirect(`/posts/${postId}`);
  }
  // check ownership
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.redirect(`/posts/${postId}`);
  }
  // delete comment
  await Comment.findByIdAndDelete(id);
  // remove from post
  await Post.findByIdAndUpdate(postId, {
    $pull: { comments: id },
  });
  res.redirect(`/posts/${postId}`);
});

// Get Edit Comment Form
exports.getEditComment = asyncHandler(async (req, res) => {
  const { postId, id } = req.params;
  const comment = await Comment.findById(id);

  if (!comment) {
    return res.redirect(`/posts/${postId}`);
  }
  // Check ownership
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.redirect(`/posts/${postId}`);
  }

  res.render("editComment", {
    title: "Edit Comment",
    comment,
    postId,
    user: req.user,
    error: ""
  });
});

// Update Comment
exports.updateComment = asyncHandler(async (req, res) => {
  const { postId, id } = req.params;
  const { content } = req.body;
  
  const comment = await Comment.findById(id);

  if (!comment) {
    return res.redirect(`/posts/${postId}`);
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.redirect(`/posts/${postId}`);
  }

  if (!content) {
    return res.render("editComment", {
      title: "Edit Comment",
      comment,
      postId,
      user: req.user,
      error: "Content cannot be empty"
    });
  }

  comment.content = content;
  await comment.save();

  res.redirect(`/posts/${postId}`);
});
