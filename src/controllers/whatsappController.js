import whatsappManager from '../services/whatsappManager.js';
import userService from '../services/userService.js';

/**
 * Initialize WhatsApp client
 */
export const initWhatsApp = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Check if session already exists
    if (whatsappManager.sessionExistsOnDisk(userId) && whatsappManager.isConnected(userId)) {
      return res.json({
        success: true,
        message: 'WhatsApp is already connected',
        connected: true,
      });
    }

    // Initialize client
    const client = await whatsappManager.initializeClient(userId);

    res.json({
      success: true,
      message: 'WhatsApp client initialized. Waiting for QR code...',
      initialized: true,
    });
  } catch (error) {
    console.error('WhatsApp Init Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize WhatsApp',
      error: error.message,
    });
  }
};

/**
 * Get WhatsApp QR code
 */
export const getQRCode = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Check if already connected
    if (whatsappManager.isConnected(userId)) {
      return res.json({
        success: true,
        connected: true,
        message: 'WhatsApp is already connected',
      });
    }

    // Get QR code
    const qrCode = await whatsappManager.getQRCode(userId);

    if (!qrCode) {
      return res.json({
        success: true,
        connected: false,
        qrCode: null,
        message: 'Waiting for QR code generation...',
      });
    }

    res.json({
      success: true,
      connected: false,
      qrCode,
      message: 'QR code generated',
    });
  } catch (error) {
    console.error('Get QR Code Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get QR code',
      error: error.message,
    });
  }
};

/**
 * Get WhatsApp status
 */
export const getStatus = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

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
      error: error.message,
    });
  }
};

/**
 * Logout WhatsApp
 */
export const logoutWhatsApp = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Logout WhatsApp
    await whatsappManager.logout(userId);

    // Update user status
    await userService.updateWhatsAppStatus(userId, false);

    res.json({
      success: true,
      message: 'WhatsApp logged out successfully',
    });
  } catch (error) {
    console.error('WhatsApp Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout WhatsApp',
      error: error.message,
    });
  }
};
