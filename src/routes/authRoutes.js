import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Register route
router.post('/register', isNotAuthenticated, register);

// Login route
router.post('/login', isNotAuthenticated, login);

// Logout route
router.post('/logout', isAuthenticated, logout);

// Get current user
router.get('/current-user', isAuthenticated, getCurrentUser);

export default router;
