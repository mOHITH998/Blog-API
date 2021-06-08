const Post = require('../models/postModel');
const asyncHandler = require('../utils/catchAsync');

exports.getAllPosts = asyncHandler(async (req, res) => {
  let posts = {};
  const username = req.query.user;
  if (username) {
    posts = await Post.find({ username });
  } else {
    posts = await Post.find();
  }
  res.status(200).json({
    status: 'success',
    result: posts.length,
    posts,
  });
});

exports.createPost = asyncHandler(async (req, res) => {
  const newPost = new Post(req.body);
  const savePost = await newPost.save();
  res.status(201).json({
    status: 'success',
    savePost,
  });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const update = await Post.findById(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: 'success',
    update,
  });
});
