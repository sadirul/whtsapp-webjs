# WhatsApp Web JS Messaging Platform

A fully functional WhatsApp Web JS platform with session-based authentication, admin panel, and public API for sending messages.

## ✨ Features

- **User Management**
  - Register & Login (session-based)
  - Secure password hashing (bcryptjs)
  - Unique API key generation for each user

- **WhatsApp Integration**
  - QR code-based connection
  - Session persistence (survives server restart)
  - One WhatsApp instance per user
  - Real-time connection status

- **Admin Panel**
  - User dashboard with real-time status
  - WhatsApp connection management
  - **Text message sending**
  - **Media file upload (images, videos, documents up to 16MB)**
  - **Media from URL with caption support**
  - API key display & management
  - Professional responsive design

- **Public API** (All endpoints require `x-api-key` header)
  - **MANDATORY: API key authentication via `x-api-key` header for all requests**
  - **Send text messages** (requires API key)
  - **Upload & send media files** (requires API key)
  - **Send media from URLs** (requires API key)
  - Check connection status (requires API key)
  - Phone number validation (E.164 format)
  - Full error handling and validation
  - Missing API key returns: `"API key is required. Use x-api-key header."`

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- jQuery 3.6.0

**Backend**
- Node.js (ES6 modules)
- Express.js 4.18.2
- WhatsApp Web JS 1.25.0
- Sequelize ORM 6.35.2
- MySQL 8.0

**Authentication**
- Express-session
- bcryptjs
- No JWT - session-based only

## 📂 Project Structure

```
whatsapp-webjs/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js
│   │   └── dashboard.js
│   ├── index.html
│   └── dashboard.html
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── session.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── whatsappController.js
│   │   └── apiController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── whatsappRoutes.js
│   │   └── apiRoutes.js
│   ├── services/
│   │   ├── userService.js
│   │   └── whatsappManager.js
│   └── server.js
├── sessions/
│── logs/
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd whatsapp-webjs
npm install
```

2. **Configure database**
```bash
# Create MySQL database
CREATE DATABASE whatsapp_webjs;
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=whatsapp_webjs
DB_PORT=3306

# Session
SESSION_SECRET=your_random_secret_key_change_this

# WhatsApp
WHATSAPP_HEADLESS=true

# App
APP_URL=http://localhost:3000
```

4. **Start the server**
```bash
npm run dev    # Development with auto-reload
npm start      # Production
```

Access the platform: **http://localhost:3000**

## 🔐 API Documentation

### Authentication APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "api_key": "abc123def456..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /api/auth/logout
```

#### Get Current User
```http
GET /api/auth/current-user
```

### WhatsApp APIs (Requires Session)

#### Initialize WhatsApp
```http
POST /whatsapp/init
```

#### Get QR Code
```http
GET /whatsapp/qr
```

Response:
```json
{
  "success": true,
  "connected": false,
  "qrCode": "data:image/png;base64,..."
}
```

#### Get Status
```http
GET /whatsapp/status
```

Response:
```json
{
  "success": true,
  "connected": true,
  "clientInfo": {
    "pushname": "John Doe",
    "phone": "+1234567890",
    "connected": true
  }
}
```

#### Logout WhatsApp
```http
POST /whatsapp/logout
```

### Public API (Requires API Key)

#### Send Message
```http
POST /api/send-message
Content-Type: application/json
x-api-key: your_api_key_here

{
  "to": "919876543210",
  "message": "Hello from WhatsApp Web JS!"
}
```

Response:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "success": true,
    "messageId": "wamid...",
    "timestamp": "2025-02-04T10:30:00.000Z"
  }
}
```

#### Check Status
```http
GET /api/status
x-api-key: your_api_key_here
```

## 🔑 Key Features Explained

### Session-Based Authentication
- Uses `express-session` with secure cookies
- 24-hour session timeout
- Automatic session destruction on logout
- No JWT tokens - pure session-based approach

### WhatsApp Session Management
- Each user gets isolated WhatsApp session
- Sessions stored in `/sessions/user_{id}/` directory
- Sessions persist across server restarts
- One active client per user

### API Key Authentication
- Generated automatically on user registration
- Unique 32-character hex string
- Stored securely in MySQL
- Used via `x-api-key` header for public API

### Phone Number Validation
- Accepts 10-15 digit phone numbers
- Automatically formats to WhatsApp format
- E.164 compliance

## 🔒 Security Features

✅ Password hashing with bcryptjs (10 rounds)
✅ Session-based auth (no JWT exposure)
✅ CSRF protection via session validation
✅ Secure HTTP-only cookies
✅ Input validation on all endpoints
✅ SQL injection prevention (Sequelize parameterized queries)
✅ API key rotation support
✅ User isolation (each user has own WhatsApp instance)

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

Auto-reloads on file changes using Node's `--watch` flag.

### Database Migrations
The system uses Sequelize's auto-sync feature. For production:
```bash
# Create migration
sequelize-cli migration:create --name create_users_table
```

### Logging
- Console logs in development
- Can be extended with Winston or Pino for production

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
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

## 🚨 Troubleshooting

### WhatsApp QR Code Not Appearing
- Ensure Puppeteer dependencies are installed
- Check browser automation is not blocked
- Verify `WHATSAPP_HEADLESS=true` in .env

### Session Not Persisting
- Clear browser cookies
- Check `SESSION_SECRET` is set in .env
- Ensure cookie settings are correct (httpOnly, sameSite)

### Database Connection Error
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists: `CREATE DATABASE whatsapp_webjs;`

### WhatsApp Login Fails
- Scan QR code within 10 seconds
- Ensure phone has active WhatsApp
- Check browser console for errors

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Runtime environment |
| PORT | 3000 | Server port |
| DB_HOST | localhost | MySQL host |
| DB_USER | root | MySQL user |
| DB_PASSWORD | - | MySQL password |
| DB_NAME | whatsapp_webjs | Database name |
| DB_PORT | 3306 | MySQL port |
| SESSION_SECRET | - | Session encryption key |
| WHATSAPP_HEADLESS | true | Chrome headless mode |
| APP_URL | http://localhost:3000 | Application URL |

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements.

## 📄 License

ISC

## 💡 Tips & Best Practices

1. **Change SESSION_SECRET** before production
2. **Use strong passwords** for MySQL
3. **Enable HTTPS** in production
4. **Implement rate limiting** for API
5. **Monitor session cleanup** for inactive users
6. **Backup WhatsApp sessions** periodically
7. **Use environment-specific configs**

## 🎯 Future Enhancements

- [ ] Message history database
- [ ] Media sending support
- [ ] Group message support
- [ ] Webhook integration
- [ ] Message scheduling
- [ ] Analytics dashboard
- [ ] Multi-instance load balancing
- [ ] Docker containerization

---

Built with ❤️ using WhatsApp Web JS
#   w h t s a p p - w e b j s  
 