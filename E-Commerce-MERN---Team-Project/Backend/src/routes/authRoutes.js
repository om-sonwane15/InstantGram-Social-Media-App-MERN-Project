const express = require("express");
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
} = require("../controllers/authController.js");
const verifyToken = require("../middlewares/authMiddleware.js");



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forget", forgotPassword);
router.post("/reset", resetPassword);
router.post("/changePassword",verifyToken, changePassword);

module.exports = router;
