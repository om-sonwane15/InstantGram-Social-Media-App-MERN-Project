const express = require('express');
const { likePost, unlikePost, getLikes } = require('../controllers/likeController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:postId', auth, likePost);
router.delete('/:postId', auth, unlikePost);
router.get('/:postId', getLikes);

module.exports = router;
