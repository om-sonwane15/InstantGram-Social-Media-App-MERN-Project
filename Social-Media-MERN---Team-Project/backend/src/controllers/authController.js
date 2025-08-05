const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const upload = require('../middlewares/uploadMiddleware');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailConnect')
require('dotenv').config();



// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    if (!isPasswordValid(password)) {
      return res.status(400).json({ message: "Password must be 8-20 characters long, have at least 1 special character, 2 digits, and 1 uppercase letter." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, previousPasswords: [hashedPassword] });

    if (req.file) {
      const userFolder = path.join(__dirname, '..', 'uploads', 'users', email);
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }
      const newPath = path.join(userFolder, req.file.filename);
      fs.renameSync(req.file.path, newPath);

      newUser.profilePicture = `/uploads/users/${email}/${req.file.filename}`;
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Store reset tokens temporarily
const resetTokens = {};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
    resetTokens[user.email] = resetToken;

    const frontendURL = "http://localhost:9173";

    // Make sure your transporter is properly configured
    await transporter.sendMail({
      from: process.env.TEST_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${frontendURL}/reset-password/${resetToken}" style="padding:10px 20px; background-color:#2563eb; color:#fff; text-decoration:none; border-radius:6px;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `
    });

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error); // <-- log error to console
    res.status(500).json({ message: "Error generating reset token", error: error.message });
  }
};


// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Missing fields" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!resetTokens[email] || resetTokens[email] !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!isPasswordValid(newPassword)) {
      return res.status(400).json({ message: "Password must be 8-20 chars, include 1 uppercase, 2 digits, 1 special char." });
    }

    if (await isPasswordReused(user, newPassword)) {
      return res.status(400).json({ message: "New password cannot match the last 3 used passwords." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.previousPasswords.unshift(hashedPassword);
    if (user.previousPasswords.length > 3) user.previousPasswords.pop();

    await user.save();
    delete resetTokens[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};


// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!isPasswordValid(newPassword)) {
      return res.status(400).json({ message: "Password must be 8-20 chars, include 1 uppercase, 2 digits, 1 special char." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    if (await isPasswordReused(user, newPassword)) {
      return res.status(400).json({ message: "New password cannot match the last 3 used passwords." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.previousPasswords.unshift(hashedPassword);
    if (user.previousPasswords.length > 3) user.previousPasswords.pop();

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};


// Password validation function
const isPasswordValid = (password) => {
  return User.validatePassword(password);
};

// Check password reuse
const isPasswordReused = async (user, newPassword) => {
  const match = await Promise.all(
    user.previousPasswords.map(async (prev) => await bcrypt.compare(newPassword, prev))
  );
  return match.includes(true);
};



module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};
