import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import cryptoRandomString from 'crypto-random-string';

class UserService {
  /**
   * Register a new user
   */
  async register(name, email, password) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate unique API key
      let apiKey = cryptoRandomString({ length: 32, type: 'hex' });
      let keyExists = true;
      while (keyExists) {
        const existingKey = await User.findOne({ where: { api_key: apiKey } });
        if (!existingKey) {
          keyExists = false;
        } else {
          apiKey = cryptoRandomString({ length: 32, type: 'hex' });
        }
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        api_key: apiKey,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        api_key: user.api_key,
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp_connected: user.whatsapp_connected,
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get user by API key
   */
  async getUserByApiKey(apiKey) {
    try {
      return await User.findOne({ where: { api_key: apiKey } });
    } catch (error) {
      console.error('Error getting user by API key:', error);
      throw error;
    }
  }

  /**
   * Update WhatsApp connected status
   */
  async updateWhatsAppStatus(userId, connected) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.whatsapp_connected = connected;
      await user.save();

      return user;
    } catch (error) {
      console.error('Error updating WhatsApp status:', error);
      throw error;
    }
  }
}

export default new UserService();
