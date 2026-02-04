import express from 'express';
import { initWhatsApp, getQRCode, getStatus, logoutWhatsApp } from '../controllers/whatsappController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Initialize WhatsApp
router.post('/init', isAuthenticated, initWhatsApp);

// Get QR code
router.get('/qr', isAuthenticated, getQRCode);

// Get status
router.get('/status', isAuthenticated, getStatus);

// Logout WhatsApp
router.post('/logout', isAuthenticated, logoutWhatsApp);

export default router;
