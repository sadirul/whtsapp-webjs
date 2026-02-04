# WhatsApp Web JS - Quick Reference Guide

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create MySQL database
mysql -u root
CREATE DATABASE whatsapp_webjs;
EXIT;

# 3. Update .env file
# Edit .env with your database credentials

# 4. Start server
npm start
# or with auto-reload
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

---

## 📝 File Overview

### Core Backend Files

| File | Purpose | Key Functions |
|------|---------|---|
| `src/server.js` | Express app entry point | Middleware setup, route registration, server start |
| `src/config/database.js` | Sequelize config | DB connection, connection pooling |
| `src/config/session.js` | Session setup | Cookie config, session timeout |
| `src/models/User.js` | User data model | User schema definition |
| `src/services/userService.js` | User logic | Register, login, API key management |
| `src/services/whatsappManager.js` | WhatsApp logic | QR code, session persistence, messaging |
| `src/middleware/auth.js` | Auth checks | Session validation, API key validation |
| `src/controllers/authController.js` | Auth handlers | Register/login/logout endpoints |
| `src/controllers/whatsappController.js` | WhatsApp handlers | QR/status/init endpoints |
| `src/controllers/apiController.js` | API handlers | Message sending, status checking |

### Frontend Files

| File | Purpose | Key Features |
|------|---------|---|
| `public/index.html` | Auth page | Login & registration forms |
| `public/dashboard.html` | Main dashboard | Status, QR, messaging, settings |
| `public/css/style.css` | Styling | Responsive design, animations |
| `public/js/auth.js` | Auth logic | Form submission, validation |
| `public/js/dashboard.js` | Dashboard logic | Status polling, QR scanning, messaging |

---

## 🔌 API Endpoints Cheat Sheet

### Auth (No auth required)
```
POST   /api/auth/register         → Register user
POST   /api/auth/login            → Login user
POST   /api/auth/logout           → Logout user
GET    /api/auth/current-user     → Get user info
```

### WhatsApp (Session auth required)
```
POST   /whatsapp/init             → Initialize WhatsApp
GET    /whatsapp/qr               → Get QR code
GET    /whatsapp/status           → Check status
POST   /whatsapp/logout           → Disconnect WhatsApp
```

### Public API (API Key auth required - MANDATORY)
```
POST   /api/send-message          → Send message (x-api-key REQUIRED)
POST   /api/send-media            → Send media file (x-api-key REQUIRED)
POST   /api/send-media-url        → Send media from URL (x-api-key REQUIRED)
GET    /api/status                → Check connection (x-api-key REQUIRED)
```

**IMPORTANT:** Every API endpoint REQUIRES the `x-api-key` header:
```bash
-H "x-api-key: YOUR_API_KEY_HERE"
```

---

## 🔐 Authentication

### Session-Based (Frontend)
```javascript
// Login creates automatic session
POST /api/auth/login
// Returns user + session cookie
// Use in subsequent requests automatically
```

### API Key (Backend) - MANDATORY for All Public API Calls
```bash
# Include in EVERY request to public API endpoints
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -d '{"to": "919876543210", "message": "Hello"}'

# Missing x-api-key header returns:
# {"success": false, "message": "API key is required. Use x-api-key header."}
```

---

## 💾 Important Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=whatsapp_webjs

# Session (CHANGE THIS!)
SESSION_SECRET=random_string_here

# Server
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
```

---

## 📂 Directory Structure Explained

```
src/
  ├── config/        → Database & session setup
  ├── controllers/   → HTTP request handlers
  ├── middleware/    → Auth & validation
  ├── models/        → Database schemas
  ├── routes/        → API endpoint definitions
  ├── services/      → Business logic
  └── server.js      → App entry point

public/
  ├── css/           → Styling
  ├── js/            → jQuery logic
  ├── index.html     → Login page
  └── dashboard.html → Main dashboard

sessions/           → WhatsApp session storage
logs/               → Application logs
```

---

## 🛠️ Common Tasks

### Register & Login Flow
```
1. User fills registration form
2. POST /api/auth/register
3. User created + API key generated
4. User fills login form
5. POST /api/auth/login
6. Session created
7. Redirect to /dashboard
```

### WhatsApp Connection Flow
```
1. POST /whatsapp/init
2. GET /whatsapp/qr (poll every 1.5s)
3. User scans QR with phone
4. GET /whatsapp/status shows connected=true
5. User can now send messages
```

### Send Message Flow
```
1. User fills message form
2. POST /api/send-message with API key
3. WhatsApp client sends message
4. Response with messageId returned
5. Message delivered on WhatsApp
```

---

## 🧪 Testing Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "pass123",
    "confirmPassword": "pass123"
  }'
```

### Send Message
```bash
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "to": "919876543210",
    "message": "Hello!"
  }'
```

### Check Status
```bash
curl -X GET http://localhost:3000/api/status \
  -H "x-api-key: YOUR_API_KEY"
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` → `kill -9 <PID>` |
| DB connection fails | Check MySQL running, verify credentials in .env |
| QR code not showing | Clear cache, check browser console errors |
| Can't send message | Ensure WhatsApp connected, check API key |
| Session expires quickly | Increase maxAge in session config |

---

## 📊 Code Statistics

| Component | Lines | Modules |
|-----------|-------|---------|
| Backend | ~900 | 13 files |
| Frontend | ~1,100 | 5 files |
| Config | ~100 | 3 files |
| **Total** | **~2,100** | **21 files** |

---

## 🔒 Security Checklist

- [ ] Change SESSION_SECRET before production
- [ ] Use strong MySQL password
- [ ] Enable HTTPS in production
- [ ] Set NODE_ENV=production
- [ ] Backup /sessions directory
- [ ] Implement rate limiting
- [ ] Monitor API usage
- [ ] Update dependencies regularly

---

## 📚 Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime |
| Express | 4.18.2 | Web framework |
| Sequelize | 6.35.2 | ORM |
| MySQL | 8.0 | Database |
| WhatsApp Web JS | 1.25.0 | WhatsApp client |
| bcryptjs | 2.4.3 | Password hashing |
| express-session | 1.17.3 | Session management |

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create database: `mysql`
3. ✅ Configure .env: Update credentials
4. ✅ Start server: `npm start`
5. ✅ Register account: Go to http://localhost:3000
6. ✅ Connect WhatsApp: Scan QR code
7. ✅ Send test message: Try messaging
8. ✅ Test API: Use cURL with API key

---

## 📞 Need Help?

- API testing: See `API_TESTING.md`
- Setup issues: See `SETUP.md`
- Full docs: See `README.md`
- Code details: See `COMPLETION_SUMMARY.md`

---

## 💡 Pro Tips

1. **Auto-reload in development**
   ```bash
   npm run dev
   ```

2. **View server logs**
   ```bash
   # Check terminal output
   # Enable debug: NODE_DEBUG=express npm start
   ```

3. **Test API quickly**
   ```bash
   # Use test-api.sh
   bash test-api.sh
   ```

4. **Backup WhatsApp sessions**
   ```bash
   cp -r sessions sessions.backup
   ```

5. **Reset database**
   ```bash
   # Drop and recreate
   DROP DATABASE whatsapp_webjs;
   CREATE DATABASE whatsapp_webjs;
   ```

---

**Last Updated:** February 4, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅
