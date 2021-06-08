const express = require('express');
const {
  getAllPosts,
  createPost,
  updatePost,
} = require('../controllers/postController');

const router = express.Router();

router.get('/', getAllPosts);
router.post('/post-create', createPost);
router.put('/:id', updatePost);

module.exports = router;
