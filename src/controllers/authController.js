import userService from '../services/userService.js';

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Register user
    const user = await userService.register(name, email, password);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login.',
      user,
    });
  } catch (error) {
    console.error('Register Error:', error);

    if (error.message.includes('Email already registered')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Login user
    const user = await userService.login(email, password);

    // Set session
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          success: false,
          message: 'Login failed',
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        user,
      });
    });
  } catch (error) {
    console.error('Login Error:', error);

    res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

/**
 * Logout user
 */
export const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({
          success: false,
          message: 'Logout failed',
        });
      }

      res.clearCookie('connect.sid');
      res.json({
        success: true,
        message: 'Logout successful',
      });
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        api_key: user.api_key,
        whatsapp_connected: user.whatsapp_connected,
      },
    });
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user info',
    });
  }
};
