const express = require('express');
const {
  getAllPosts,
  getPosts,
  createPost,
  updatePost,
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getAllPosts);

router.route('/:id').get(getPosts);

router.route('/post-create').post(protect, createPost);

router.route('/:id').put(protect, updatePost);

module.exports = router;
