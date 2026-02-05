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
  const { title, content, category } = req.body;

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
    category,
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
  const query = {};
  let pageTitle = "Explore Posts";
  
  if (req.query.author) {
    query.author = req.query.author;
    // Find author name for title (optional but nice)
    const authorUser = await require("../models/User").findById(req.query.author);
    if(authorUser) {
      pageTitle = `Posts by ${authorUser.username}`;
    }
  }

  const posts = await Post.find(query)
    .populate("author", "username")
    .sort({ createdAt: -1 });

  res.render("posts", {
    title: "Posts",
    pageTitle, 
    posts,
    user: req.user,
    success: "",
    error: "",
  });
});

// get post by ID
exports.getPostById = asyncHandler(async (req, res) => {
  // Update views count and get post
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    });
  // console.log(post);
  res.render("postDetails", {
    title: "Posts",
    post,
    user: req.user,
    success: "",
    error: "",
  });
});

// delete post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  // validation
  if (!post) {
    res.render("postDetails", {
      title: "Posts",
      post,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});

// Get Edit Post Form
exports.getEditPostForm = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    return res.redirect("/posts");
  }
  // Check ownership
  if (post.author.toString() !== req.user._id.toString()) {
    return res.redirect("/posts");
  }

  res.render("editPost", {
    title: "Edit Post",
    post,
    user: req.user,
    error: ""
  });
});

// Update Post logic
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.redirect("/posts");
  }
  // Check ownership
  if (post.author.toString() !== req.user._id.toString()) {
    return res.redirect("/posts");
  }

  // Handle new images
  if (req.files && req.files.length > 0) {
    const newImages = await Promise.all(
      req.files.map(async (file) => {
        const newFile = new File({
          url: file.path,
          public_id: file.filename,
          uploaded_by: req.user._id,
        });
        await newFile.save();
        return {
          url: newFile.url,
          public_id: newFile.public_id,
        };
      })
    );
    // Add new images to existing ones
    post.images.push(...newImages);
  }

  post.title = title;
  post.content = content;
  post.category = category;

  await post.save();
  res.redirect(`/posts/${post._id}`);
});
