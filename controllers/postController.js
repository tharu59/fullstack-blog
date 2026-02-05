const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const File = require("../models/File");

// Rendering post form
exports.getPostForm = asyncHandler(async (req, res) => {
  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    success: req.query.success ? "Post created successfully" : "",
  });
});

// creating new post
// exports.createPost = asyncHandler(async (req, res) => {
//   try {
//     const { title, content } = req.body;
// from here to validation excluded
// console.log(req.files);
// const newPost = await Post.create({
//   title,
//   content,
//   author: req.user._id,
// });
// console.log(newPost);
// res.redirect("/posts");

// validation --excluded
// if (!req.files || req.files.length === 0) {
//   return res.render("newPost", {
//     title: "Create Post",
//     user: req.user,
//     error: "At least one image is required",
//   });
// }

// const images = await Promise.all(
//   req.files.map(async (file) => {
// console.log(images);
// save the images into db
//     const newFile = new File({
//       url: file.path,
//       public_id: file.filename,
//       uploaded_by: req.user._id,
//     });
//     await newFile.save();
//     // console.log(newFile);
//     return {
//       url: newFile.url,
//       public_id: newFile.public_id,
//     };
//   }),
// );

// // create post
// const newPost = new Post({
//   title,
//   content,
//   author: req.user._id,
//   images,
// });
// await newPost.save();
// res.render("newPost", {
//   title: "Create Post",
//   user: req.user,
//   success: "Post created successfully",
// });
//     res.redirect("/posts?success=true");
//   } catch (err) {
//     res.render("newPost", {
//       title: "Create Post",
//       user: req.user,
//       error: "Something went wrong",
//     });
//   }
// });

// this is real create post

// creating new post
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const images = await Promise.all(
    req.files.map(async (file) => {
      // console.log(images);
      // save the images into db
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      // console.log(newFile);
      return {
        url: newFile.url,
        public_id: newFile.public_id,
      };
    }),
  );

  // create post
  const newPost = new Post({
    title,
    content,
    author: req.user._id,
    images,
  });
  await newPost.save();
  res.render("newPost", {
    title: "Create Post",
    user: req.user,
    success: "Post created successfully",
    error: "",
  });
});

// Get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username");
  res.render("posts", {
    title: "Posts",
    posts,
    user: req.user,
    success: "",
    error: "",
  });
});

// get post by ID
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username  ",
  );
  // .populate("comments");
  res.render("postDetails", {
    title: "Posts",
    post,
    user: req.user,
    success: "",
    error: "",
  });
});
