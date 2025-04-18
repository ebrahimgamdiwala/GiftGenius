const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { 
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} = require('../controllers/authController');

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile - protected route
router.get('/profile', verifyToken, getUserProfile);

// Update user profile - protected route
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router;