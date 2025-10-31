// index.js
const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const postRoutes = require('./src/routes/postRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const likeRoutes = require('./src/routes/likeRoutes');
const followRoutes = require('./src/routes/followRoutes');
const path = require('path');
const connectDB = require('./src/config/dbConnect');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
require('dotenv').config();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:9173',  // your Vite dev server
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', followRoutes);
app.use('/api/users', userRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Server Setup
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
