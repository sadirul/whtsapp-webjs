# WhatsApp Web JS Platform - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create MySQL Database
```bash
mysql -u root -p
CREATE DATABASE whatsapp_webjs;
EXIT;
```

### 3. Configure Environment Variables
Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=whatsapp_webjs
SESSION_SECRET=change_this_to_random_string
```

### 4. Start the Server
```bash
npm start      # Production
npm run dev    # Development with auto-reload
```

### 5. Access the Application
Open your browser: http://localhost:3000

## Database Setup

### Option 1: Automatic (Recommended)
The application will create tables automatically on first run.

### Option 2: Manual SQL
```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  whatsapp_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Testing

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Send Message (with API Key):**
```bash
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "to": "919876543210",
    "message": "Hello from WhatsApp Web JS"
  }'
```

## Project Structure

```
src/
├── config/         # Database & session configuration
├── controllers/    # Request handlers
├── middleware/     # Authentication & validation
├── models/         # Sequelize models
├── routes/         # API routes
├── services/       # Business logic
└── server.js       # Main application file

public/
├── css/           # Styling
├── js/            # Frontend JavaScript
├── index.html     # Login/Register page
└── dashboard.html # Main dashboard
```

## Features Overview

### ✅ User Management
- Registration with email & password
- Login with session persistence
- Automatic API key generation
- Profile management

### ✅ WhatsApp Integration
- QR code-based login
- Session persistence (survives restart)
- Real-time connection status
- One client per user

### ✅ Admin Panel
- Dashboard with connection status
- QR code display
- Message sending interface
- Settings & API key management

### ✅ Public API
- API key authentication
- Send WhatsApp messages
- Check connection status
- Phone number validation

## Environment Variables

Required variables for `.env`:

```
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=whatsapp_webjs
DB_PORT=3306

# Session
SESSION_SECRET=your_secret_key

# WhatsApp
WHATSAPP_HEADLESS=true

# App
APP_URL=http://localhost:3000
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Database Connection Error
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists

### WhatsApp QR Not Showing
- Clear browser cache
- Check browser console for errors
- Ensure JavaScript is enabled

## Support

For issues or questions, check:
1. Console logs for error messages
2. Browser DevTools for frontend errors
3. Database connectivity

---

Happy coding! 🚀
