const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  searchUsers,
  followUser,
  unfollowUser,
  getUserFeed,
} = require('../controllers/userController');

// ⚠️ IMPORTANT: Put specific routes BEFORE dynamic routes

// Feed route (comes first - specific)
router.get('/feed', auth, getUserFeed);

// Search route (comes next - specific)
router.get('/search', auth, searchUsers);

// Follow/Unfollow routes (dynamic routes - come last)
router.post('/:userId/follow', auth, followUser);
router.post('/:userId/unfollow', auth, unfollowUser);

module.exports = router;
