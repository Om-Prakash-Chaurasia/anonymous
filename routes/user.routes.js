const express = require("express");
const router = new express.Router();

const userController = require("../controllers/user.controllers");
const auth = require("../middleware/auth");

// Register
router.post("/register", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

// Update User
router.post("/update", auth, userController.updateUser);

// Delete User
router.delete("/delete", auth, userController.deleteUser);

// Forgot Password

// Reset Password

module.exports = router;
