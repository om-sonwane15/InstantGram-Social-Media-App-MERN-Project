const express = require('express');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { createPost, getFeed, getPostById, updatePost, deletePost, getUserPosts, searchPosts } = require('../controllers/postController');

const router = express.Router();

router.post('/', auth, upload.single('image'), createPost);
router.get('/feed', auth, getFeed);
router.get('/search', searchPosts);
router.get('/:id', getPostById);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.get('/user/:userId', getUserPosts);

module.exports = router;
