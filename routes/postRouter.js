const express = require('express');
const {
  getAllPosts,
  getPosts,
  createPost,
  updatePost,
} = require('../controllers/postController');

const authConroller = require('../controllers/authController')

const router = express.Router();

router
.route('/')
.get(authConroller.protect, getAllPosts);

router
.route('/:id')
.get(authConroller.protect, getPosts);

router
.route('/post-create')
.post(authConroller.protect, createPost);

router
.route('/:id')
.put(authConroller.protect, updatePost);

module.exports = router;
