// src/routes/userRoutes.js
const express = require("express");
const verifyToken = require("../middlewares/authMiddleware.js");
const User = require("../models/userModel.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage(); // We use memory storage to control file manually
const upload = multer({ storage });

// Helper function to ensure folder
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Delete old profile picture
const deleteOldProfilePicture = (folderPath) => {
  const oldFile = path.join(folderPath, "profilepicture.jpg");
  const oldFilePng = path.join(folderPath, "profilepicture.png");

  if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
  if (fs.existsSync(oldFilePng)) fs.unlinkSync(oldFilePng);
};

// Get profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Update profile
router.put("/update-profile", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, imageUrl } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const oldUsername = user.username;
    const uploadsDir = path.join(__dirname, "..", "Uploads");

    const oldUserFolder = path.join(uploadsDir, oldUsername);
    const newUserFolder = path.join(uploadsDir, username || oldUsername);

    // If username changed, rename folder
    if (username && username !== oldUsername) {
      if (fs.existsSync(oldUserFolder)) {
        fs.renameSync(oldUserFolder, newUserFolder);
      }
      user.username = username;
    } else {
      ensureFolderExists(newUserFolder);
    }

    // If new file uploaded
    if (file) {
      ensureFolderExists(newUserFolder);
      deleteOldProfilePicture(newUserFolder);

      const ext = path.extname(file.originalname).toLowerCase();
      const savePath = path.join(newUserFolder, `profilepicture${ext}`);
      fs.writeFileSync(savePath, file.buffer);

      user.image = `/Uploads/${user.username}/profilepicture${ext}`;
    } else if (imageUrl) {
      deleteOldProfilePicture(newUserFolder);
      user.image = imageUrl;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile", error });
  }
});

module.exports = router;
