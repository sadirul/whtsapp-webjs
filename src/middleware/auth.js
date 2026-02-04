/**
 * Session-based authentication middleware
 */
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  res.status(401).json({
    success: false,
    message: 'Unauthorized. Please login first.',
  });
};

/**
 * API Key authentication middleware
 */
export const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required. Use x-api-key header.',
      });
    }

    const userService = (await import('../services/userService.js')).default;
    const user = await userService.getUserByApiKey(apiKey);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('API Key Auth Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Redirect authenticated users away from login/register
 */
export const isNotAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return next();
  }

  res.redirect('/dashboard');
};
