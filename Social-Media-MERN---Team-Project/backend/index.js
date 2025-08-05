// index.js
const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const postRoutes = require('./src/routes/postRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes')

const path = require('path');
const connectDB = require('./src/config/dbConnect')
const cors = require('cors/lib/index.js');

const app = express();

require('dotenv').config();
connectDB()

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:9173', credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gallery', galleryRoutes);

// Server Setup
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
