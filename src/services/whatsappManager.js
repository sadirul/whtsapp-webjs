import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, Events, MessageMedia } = pkg;
import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WhatsAppManager {
  constructor() {
    this.clients = new Map();
    this.qrCodes = new Map();
    this.sessionsDir = path.join(__dirname, '../../sessions');
    
    // Ensure sessions directory exists
    if (!fs.existsSync(this.sessionsDir)) {
      fs.mkdirSync(this.sessionsDir, { recursive: true });
    }
  }

  /**
   * Initialize WhatsApp client for a user
   */
  async initializeClient(userId) {
    try {
      // Return existing client if already initialized
      if (this.clients.has(userId)) {
        return this.clients.get(userId);
      }

      const userSessionPath = path.join(this.sessionsDir, `user_${userId}`);

      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: `user_${userId}`,
          dataPath: userSessionPath,
        }),
        puppeteer: {
          headless: process.env.WHATSAPP_HEADLESS !== 'false',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      });

      // QR Code Event
      client.on(Events.QR_RECEIVED, (qr) => {
        this.qrCodes.set(userId, qr);
        console.log(`QR Code received for user ${userId}`);
      });

      // Ready Event
      client.on(Events.READY, () => {
        console.log(`WhatsApp client ready for user ${userId}`);
        this.qrCodes.delete(userId);
      });

      // Authenticated Event
      client.on(Events.AUTHENTICATED, () => {
        console.log(`User ${userId} authenticated`);
      });

      // Auth Failure
      client.on(Events.AUTH_FAILURE, (msg) => {
        console.error(`Authentication failed for user ${userId}:`, msg);
        this.qrCodes.delete(userId);
      });

      // Disconnected Event
      client.on(Events.DISCONNECTED, () => {
        console.log(`User ${userId} disconnected`);
        this.clients.delete(userId);
        this.qrCodes.delete(userId);
      });

      // Initialize client
      await client.initialize();
      
      this.clients.set(userId, client);
      return client;
    } catch (error) {
      console.error(`Error initializing client for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get QR code for a user
   */
  async getQRCode(userId) {
    try {
      if (!this.qrCodes.has(userId)) {
        return null;
      }

      const qr = this.qrCodes.get(userId);
      const qrDataURL = await qrcode.toDataURL(qr);
      return qrDataURL;
    } catch (error) {
      console.error(`Error generating QR code for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if client is connected
   */
  isConnected(userId) {
    const client = this.clients.get(userId);
    if (!client) return false;
    return client.info ? true : false;
  }

  /**
   * Send message
   */
  async sendMessage(userId, phoneNumber, message) {
    try {
      const client = this.clients.get(userId);
      
      if (!client) {
        throw new Error('WhatsApp client not initialized');
      }

      if (!this.isConnected(userId)) {
        throw new Error('WhatsApp client not connected');
      }

      // Validate phone number format (basic validation)
      if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ''))) {
        throw new Error('Invalid phone number format');
      }

      // Format phone number for WhatsApp
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      const chatId = `${formattedNumber}@c.us`;

      const response = await client.sendMessage(chatId, message);
      
      return {
        success: true,
        messageId: response.id._serialized,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error sending message for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Send media file
   */
  async sendMedia(userId, phoneNumber, fileBuffer, caption = '', filename = 'file') {
    try {
      const client = this.clients.get(userId);
      
      if (!client) {
        throw new Error('WhatsApp client not initialized');
      }

      if (!this.isConnected(userId)) {
        throw new Error('WhatsApp client not connected');
      }

      // Validate phone number format
      if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ''))) {
        throw new Error('Invalid phone number format');
      }

      // Format phone number for WhatsApp
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      const chatId = `${formattedNumber}@c.us`;

      // Create MessageMedia from buffer
      // Detect MIME type from filename or use default
      let mimeType = 'application/octet-stream';
      const ext = filename.split('.').pop().toLowerCase();
      
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'mkv': 'video/x-matroska',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'txt': 'text/plain'
      };

      if (mimeTypes[ext]) {
        mimeType = mimeTypes[ext];
      }

      // Create MessageMedia object
      const media = new MessageMedia(mimeType, fileBuffer.toString('base64'), filename);

      const messageOptions = {
        sendMediaAsDocument: false
      };

      if (caption) {
        messageOptions.caption = caption;
      }

      const response = await client.sendMessage(chatId, media, messageOptions);
      
      return {
        success: true,
        messageId: response.id._serialized,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error sending media for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Send media from URL
   */
  async sendMediaUrl(userId, phoneNumber, mediaUrl, caption = '') {
    try {
      const client = this.clients.get(userId);
      
      if (!client) {
        throw new Error('WhatsApp client not initialized');
      }

      if (!this.isConnected(userId)) {
        throw new Error('WhatsApp client not connected');
      }

      // Validate phone number format
      if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ''))) {
        throw new Error('Invalid phone number format');
      }

      // Download file from URL
      console.log(`Downloading media from URL: ${mediaUrl}`);
      const response = await fetch(mediaUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download media: ${response.statusText}`);
      }

      // Get MIME type from response headers
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      // Get filename from URL or use default
      let filename = 'media';
      try {
        const urlPath = new URL(mediaUrl).pathname;
        filename = urlPath.split('/').pop() || 'media';
      } catch (e) {
        console.warn('Could not extract filename from URL');
      }

      // Convert response to buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(`Media downloaded: ${filename}, size: ${buffer.length} bytes, type: ${contentType}`);

      // Format phone number for WhatsApp
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      const chatId = `${formattedNumber}@c.us`;

      // Create MessageMedia from downloaded buffer
      const media = new MessageMedia(contentType, buffer.toString('base64'), filename);

      const messageOptions = {
        sendMediaAsDocument: false
      };

      if (caption) {
        messageOptions.caption = caption;
      }

      const result = await client.sendMessage(chatId, media, messageOptions);
      
      return {
        success: true,
        messageId: result.id._serialized,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error sending media URL for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Logout/Disconnect user
   */
  async logout(userId) {
    try {
      const client = this.clients.get(userId);
      
      if (client) {
        await client.logout();
        this.clients.delete(userId);
        this.qrCodes.delete(userId);
      }
    } catch (error) {
      console.error(`Error logging out user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get client info
   */
  getClientInfo(userId) {
    const client = this.clients.get(userId);
    if (!client || !client.info) {
      return null;
    }

    // Extract phone number from various possible sources
    let phone = null;
    
    // Try to get from info.phone
    if (client.info.phone) {
      phone = client.info.phone;
    }
    // Try to get from info.user (JID format: "919876543210@c.us")
    else if (client.info.user) {
      // Remove @c.us suffix to get phone number
      phone = client.info.user.replace('@c.us', '').replace('@s.whatsapp.net', '');
    }
    // Try to get from info.wid (similar format)
    else if (client.info.wid) {
      phone = client.info.wid.user || client.info.wid._serialized?.split('@')[0];
    }
    // Log for debugging
    console.log(`Client info for user ${userId}:`, {
      pushname: client.info.pushname,
      phone: phone,
      user: client.info.user,
      wid: client.info.wid
    });

    return {
      pushname: client.info.pushname || 'Unknown',
      phone: phone || 'N/A',
      connected: true,
    };
  }

  /**
   * Check if session exists on disk
   */
  sessionExistsOnDisk(userId) {
    const sessionPath = path.join(this.sessionsDir, `user_${userId}`);
    return fs.existsSync(sessionPath);
  }
}

export default new WhatsAppManager();
