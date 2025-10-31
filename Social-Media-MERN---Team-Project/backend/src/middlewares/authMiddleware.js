// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach the decoded user id properly
    req.userId = decoded.userId;
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token is not valid',
    });
  }
};

module.exports = auth;
