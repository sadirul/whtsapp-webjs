import whatsappManager from '../services/whatsappManager.js';
import userService from '../services/userService.js';

/**
 * Send message via WhatsApp
 */
export const sendMessage = async (req, res) => {
  try {
    const { to, message } = req.body;
    const userId = req.user.id;

    // Validation
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and message are required',
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    // Check if WhatsApp is connected
    if (!whatsappManager.isConnected(userId)) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp is not connected. Please connect first.',
      });
    }

    // Send message
    const result = await whatsappManager.sendMessage(userId, to, message);

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Send Message Error:', error);

    const statusCode = error.message.includes('not connected') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to send message',
    });
  }
};

/**
 * Send media file via WhatsApp
 */
export const sendMedia = async (req, res) => {
  try {
    const { to, caption } = req.body;
    const userId = req.user.id;

    // Validation
    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    // Check if WhatsApp is connected
    if (!whatsappManager.isConnected(userId)) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp is not connected. Please connect first.',
      });
    }

    // Send media - pass req.file.buffer, caption, and filename
    const result = await whatsappManager.sendMedia(userId, to, req.file.buffer, caption, req.file.originalname);

    res.json({
      success: true,
      message: 'Media sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Send Media Error:', error);

    const statusCode = error.message.includes('not connected') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to send media',
    });
  }
};

/**
 * Send media from URL via WhatsApp
 */
export const sendMediaUrl = async (req, res) => {
  try {
    const { to, url, caption } = req.body;
    const userId = req.user.id;

    // Validation
    if (!to || !url) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and URL are required',
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format',
      });
    }

    // Check if WhatsApp is connected
    if (!whatsappManager.isConnected(userId)) {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp is not connected. Please connect first.',
      });
    }

    // Send media from URL
    const result = await whatsappManager.sendMediaUrl(userId, to, url, caption);

    res.json({
      success: true,
      message: 'Media sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Send Media URL Error:', error);

    const statusCode = error.message.includes('not connected') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to send media',
    });
  }
};

/**
 * Get user WhatsApp status (for API)
 */
export const getStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const connected = whatsappManager.isConnected(userId);
    const clientInfo = whatsappManager.getClientInfo(userId);

    res.json({
      success: true,
      connected,
      clientInfo,
    });
  } catch (error) {
    console.error('Get Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get WhatsApp status',
    });
  }
};
