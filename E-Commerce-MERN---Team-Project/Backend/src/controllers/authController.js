const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const transporter = require("../config/mailConnect.js");

const register = async (req, res) => {
    try {
        const { username, password, isAdmin, image } = req.body;

        if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(409).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, isAdmin, image });

        await newUser.save();
        res.status(201).json({ message: `User registered with username: ${username}` });
    } catch (error) {
        res.status(500).json({ message: "Registration unsuccessful", error });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: `User with username:${username} not found` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: `Password does not match` });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "5h",
        });
        res.status(200).json({
            token,
            user: {
              username: user.username,
              image: user.image,
              isAdmin: user.isAdmin
            }
          });
          
    } catch (error) {
        res.status(500).json({ message: "Login unsuccessful" });
    }
};

// Store reset tokens temporarily
const resetTokens = {};


// Forgot Password - Generate Reset Token
const forgotPassword = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ msg: "No username provided" });

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Generate reset token (valid for 15 mins)
        const resetToken = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Store token in memory (for simplicity)
        resetTokens[user.username] = resetToken;

        const frontendURL = "http://localhost:5173";

        await transporter.sendMail({
            from: process.env.TEST_EMAIL,
            to: `${username}@gmail.com`,
            subject: "Reset your password",
            html: `
              <h3>Reset Password</h3>
              <p>Click the button below to reset your password: </p>
              <a href="${frontendURL}/reset-password/${resetToken}" style="padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 8px;">
                Reset Password
              </a>
              <p>This link will expire in 15 minutes.</p>
            `,
        });
        res.status(200).json({ msg: "Your token has been sent to the email" });
    } catch (error) {
        res.status(500).json({ message: "Error in forgot password" });
    }
};



// Reset Password - Update Password
const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      if (!token || !newPassword)
        return res.status(400).json({ msg: "Missing fields" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.username;
  
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      delete resetTokens[username];
  
      res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password" });
    }
  };
  


// Change Password - Update Current Password
const changePassword = async (req, res) => {
    try {
      const userId = req.user.id; // ID from decoded token
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ msg: "Old and new passwords are required" });
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Old password is incorrect" });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Error changing password" });
    }
  };
  

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
};
