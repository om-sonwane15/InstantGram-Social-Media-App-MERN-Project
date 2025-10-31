const express = require('express');
const { addComment, getComments, deleteComment, likeComment } = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:postId', auth, addComment);
router.get('/:postId', getComments);
router.delete('/:commentId', auth, deleteComment);
router.post('/:commentId/like', auth, likeComment);

module.exports = router;
