const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { register, login, getCurrentUser } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getCurrentUser);

module.exports = router;
