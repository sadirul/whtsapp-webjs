import express from 'express';
import multer from 'multer';
import { sendMessage, sendMedia, sendMediaUrl, getStatus } from '../controllers/apiController.js';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 16 * 1024 * 1024 // 16MB limit
  },
  storage: multer.memoryStorage()
});

// Send message (requires API key)
router.post('/send-message', apiKeyAuth, sendMessage);

// Send media file (requires API key)
router.post('/send-media', apiKeyAuth, upload.single('file'), sendMedia);

// Send media from URL (requires API key)
router.post('/send-media-url', apiKeyAuth, sendMediaUrl);

// Get WhatsApp status (requires API key)
router.get('/status', apiKeyAuth, getStatus);

export default router;
