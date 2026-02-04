import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import sessionConfig from './config/session.js';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import models
import User from './models/User.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

// Import middleware
import { isAuthenticated } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// CORS
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));

// Session middleware
app.use(sessionConfig);

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// ============================================
// Routes
// ============================================

// API Routes
app.use('/api/auth', authRoutes);
app.use('/whatsapp', isAuthenticated, whatsappRoutes);
app.use('/api', apiRoutes);

// Frontend Routes
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/dashboard', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/settings', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/settings.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// ============================================
// Database & Server Initialization
// ============================================

async function startServer() {
  try {
    // Test database connection
    console.log('🔄 Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync models (create tables if they don't exist)
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Database models synced');

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   WhatsApp Web JS Platform Started     ║
╚════════════════════════════════════════╝

📱 Server Running:  http://localhost:${PORT}
🌐 Environment:     ${process.env.NODE_ENV || 'development'}
📊 Database:        ${process.env.DB_NAME}
🔐 Session Secret:  ${process.env.SESSION_SECRET ? '✓ Set' : '✗ Not set'}

Ready to accept connections...
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await sequelize.close();
  console.log('✓ Database connection closed');
  process.exit(0);
});

export default app;
