const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('📝 Register request:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ email }],
    });

    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const user = new User({
      name,
      username: name.toLowerCase().replace(/\s+/g, '') + Date.now(),
      email,
      password,
    });

    await user.save();
    console.log('✅ User created:', user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email });

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log('🔍 User found:', !!user);

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Get user with password
    const userWithPassword = await User.findOne({ email }).select('+password');
    console.log('🔑 User has password:', !!userWithPassword.password);

    // Check password
    const isPasswordCorrect = await userWithPassword.matchPassword(password);
    console.log('🔐 Password match:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log('❌ Password incorrect');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('✅ Token generated');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
