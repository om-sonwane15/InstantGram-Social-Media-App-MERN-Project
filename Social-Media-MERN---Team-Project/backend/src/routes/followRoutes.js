const express = require('express');
const { followUser, getFollowers, getFollowing, isFollowing } = require('../controllers/followController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:userId/follow', auth, followUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/is-following', auth, isFollowing);

module.exports = router;
