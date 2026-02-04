# 📱 WhatsApp Web JS Platform - Setup & Usage Guide

## ✅ What's Included

Your WhatsApp Web JS messaging platform now includes:

### Backend Features
- ✅ Session-based user authentication
- ✅ MySQL database with Sequelize ORM
- ✅ WhatsApp Web JS integration with QR code
- ✅ **Text message sending API**
- ✅ **Media file upload (images, videos, documents up to 16MB)**
- ✅ **Media from URL sending with caption support**
- ✅ Public API with key authentication
- ✅ User API key management

### Frontend Features
- ✅ Login/Registration interface
- ✅ Dashboard with real-time WhatsApp status
- ✅ QR code display for connection
- ✅ **Text message sending form**
- ✅ **Media file upload form with caption**
- ✅ **Media from URL form with caption**
- ✅ Settings panel with API key display and copy functionality
- ✅ Professional responsive design

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd d:\whatsapp-webjs
npm install
```

### 2. Setup Database
Create a MySQL database:
```sql
CREATE DATABASE whatsapp_webjs;
```

### 3. Configure Environment
Create `.env` file in project root:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=whatsapp_webjs
SESSION_SECRET=your_secret_key
```

### 4. Start Server
```bash
npm start
```

Access at: **http://localhost:3000**

---

## 📝 User Guide

### Step 1: Register Account
1. Open http://localhost:3000
2. Click "Sign Up"
3. Enter name, email, password
4. Click "Register"

### Step 2: Connect WhatsApp
1. Login with your credentials
2. Click "WhatsApp" tab
3. Click "Initialize WhatsApp"
4. Scan QR code with WhatsApp mobile
5. Wait for "Connected" status

### Step 3: Send Messages
#### Text Message
1. Enter phone number (with country code, e.g., 919876543210)
2. Enter message
3. Click "Send Message"

#### Media File Upload
1. Click "Send Media File" section
2. Select file (image, video, document up to 16MB)
3. (Optional) Add caption
4. Click "Send Media"

#### Media from URL
1. Click "Send Media from URL" section
2. Paste media URL
3. (Optional) Add caption
4. Click "Send Media"

### Step 4: Get API Key
1. Go to "Settings" tab
2. Copy your API Key
3. Use in your applications

---

## 🔌 API Usage

### Authentication
All API requests require the API key header:
```
x-api-key: YOUR_API_KEY
```

### 1. Send Text Message
```bash
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "to": "919876543210",
    "message": "Hello from API!"
  }'
```

### 2. Send Media File
```bash
curl -X POST http://localhost:3000/api/send-media \
  -H "x-api-key: YOUR_API_KEY" \
  -F "to=919876543210" \
  -F "file=@image.jpg" \
  -F "caption=Check this!"
```

### 3. Send Media from URL
```bash
curl -X POST http://localhost:3000/api/send-media-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "to": "919876543210",
    "url": "https://example.com/image.jpg",
    "caption": "Image from URL"
  }'
```

### 4. Check Connection Status
```bash
curl -X GET http://localhost:3000/api/status \
  -H "x-api-key: YOUR_API_KEY"
```

---

## 📋 API Endpoints Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/current-user` | Get logged-in user | ✅ Session |
| POST | `/api/auth/logout` | Logout user | ✅ Session |
| POST | `/whatsapp/init` | Initialize WhatsApp | ✅ Session |
| GET | `/whatsapp/qr` | Get QR code | ✅ Session |
| GET | `/whatsapp/status` | Get connection status | ✅ Session |
| POST | `/whatsapp/logout` | Disconnect WhatsApp | ✅ Session |
| POST | `/api/send-message` | Send text message | ✅ API Key |
| POST | `/api/send-media` | Upload & send media | ✅ API Key |
| POST | `/api/send-media-url` | Send media from URL | ✅ API Key |
| GET | `/api/status` | Get WhatsApp status | ✅ API Key |

---

## 🎯 Feature Details

### Media File Upload (`/api/send-media`)
**Supported Types:**
- Images: JPG, PNG, GIF, BMP
- Videos: MP4, AVI, MOV, MKV
- Documents: PDF, DOC, DOCX, XLS, XLSX, TXT

**Limits:**
- Max file size: 16MB
- Caption: Optional, up to 1024 characters

**Form Data:**
```
to: Phone number with country code (required)
file: Binary file data (required)
caption: Text caption (optional)
filename: Custom filename (optional)
```

### Media from URL (`/api/send-media-url`)
**Supported:**
- Any direct media URL (HTTP/HTTPS)
- Images, videos, documents
- Cloud storage URLs (Google Drive, Dropbox, etc.)

**Parameters:**
```
{
  "to": "919876543210",
  "url": "https://example.com/media.jpg",
  "caption": "Optional caption"
}
```

### Text Messages (`/api/send-message`)
**Parameters:**
```
{
  "to": "919876543210",
  "message": "Your message text here"
}
```

**Limits:**
- Phone number: Required, 10-15 digits with country code
- Message: 1-4096 characters

---

## 🔐 Security Features

1. **Password Hashing** - bcryptjs for secure password storage
2. **Session-based Auth** - HTTP-only cookies, 24-hour timeout
3. **API Key Authentication** - Unique per user, read-only in UI
4. **CORS Protection** - Restricted to configured origins
5. **Input Validation** - All inputs validated before processing
6. **File Upload Validation** - File type and size checks
7. **Phone Number Validation** - E.164 format validation

---

## 📁 Project Structure

```
whatsapp-webjs/
├── src/
│   ├── server.js                 # Express app entry point
│   ├── config/
│   │   ├── database.js          # MySQL/Sequelize config
│   │   └── session.js           # Session configuration
│   ├── models/
│   │   └── User.js              # User database model
│   ├── services/
│   │   ├── userService.js       # User business logic
│   │   └── whatsappManager.js   # WhatsApp client manager
│   ├── controllers/
│   │   ├── authController.js    # Auth endpoints
│   │   ├── whatsappController.js # WhatsApp endpoints
│   │   └── apiController.js     # Public API endpoints
│   ├── routes/
│   │   ├── authRoutes.js        # Auth route definitions
│   │   ├── whatsappRoutes.js    # WhatsApp routes
│   │   └── apiRoutes.js         # API routes
│   └── middleware/
│       └── auth.js              # Auth middleware
├── public/
│   ├── index.html               # Login page
│   ├── dashboard.html           # Main dashboard
│   ├── css/
│   │   └── style.css            # Styling
│   └── js/
│       ├── auth.js              # Auth logic
│       └── dashboard.js         # Dashboard logic
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── README.md                    # Documentation
```

---

## ⚙️ Configuration

### Port
Default: **3000**
Change in `.env`: `PORT=8080`

### File Upload Limit
Default: **16MB**
Edit in `src/routes/apiRoutes.js`:
```javascript
const upload = multer({
  limits: {
    fileSize: 32 * 1024 * 1024  // 32MB
  }
});
```

### Session Timeout
Default: **24 hours**
Edit in `src/config/session.js`:
```javascript
maxAge: 48 * 60 * 60 * 1000  // 48 hours
```

---

## 🧪 Testing

### Test with Dashboard
1. Login to dashboard
2. Connect WhatsApp via QR code
3. Use forms to send messages/media

### Test with cURL
```bash
# Get API key from settings first

# Send text message
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"to":"919876543210","message":"Test"}'

# Send media file
curl -X POST http://localhost:3000/api/send-media \
  -H "x-api-key: YOUR_API_KEY" \
  -F "to=919876543210" \
  -F "file=@test.jpg"

# Check status
curl -X GET http://localhost:3000/api/status \
  -H "x-api-key: YOUR_API_KEY"
```

### Test with JavaScript
```javascript
// Send message
fetch('http://localhost:3000/api/send-message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    to: '919876543210',
    message: 'Hello from JavaScript!'
  })
}).then(r => r.json()).then(console.log);
```

---

## 🐛 Troubleshooting

### QR Code Not Showing
- Ensure WhatsApp app is installed on mobile
- Check browser console for errors
- Refresh page if stuck

### Can't Send Messages
- Verify WhatsApp connection status shows "Connected"
- Check phone number format (needs country code)
- Ensure file size is under 16MB for media

### API Key Not Showing
- Refresh the Settings page
- Logout and login again
- Check browser console for errors

### File Upload Error
- Check file size (max 16MB)
- Try different file format
- Check file permissions

### Database Connection Error
- Verify MySQL is running
- Check `.env` database credentials
- Ensure database `whatsapp_webjs` exists

---

## 📚 More Resources

See detailed API documentation in:
- **MEDIA_API.md** - Complete media sending API reference
- **API.md** - Full API documentation with examples
- **SETUP.md** - Detailed setup instructions

---

## 🎯 Next Steps

1. **Deploy to Production**
   - Use environment: `NODE_ENV=production`
   - Setup HTTPS (SSL certificate)
   - Use cloud database (AWS RDS, etc.)
   - Deploy to cloud platform (Heroku, AWS, DigitalOcean, etc.)

2. **Scale Up**
   - Add multiple WhatsApp accounts
   - Implement message queue (Redis)
   - Add database backups
   - Monitor API usage

3. **Add Features**
   - Message templates
   - Scheduled messages
   - Contact management
   - Message history
   - Webhooks for incoming messages

4. **Monitor & Maintain**
   - Setup error logging (Sentry)
   - Monitor API performance
   - Track message delivery
   - Regular backups

---

**Version:** 1.0.0
**Last Updated:** February 5, 2025
**Status:** Ready for Production ✅
