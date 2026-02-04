# WhatsApp Web JS Platform - Media Sending API Guide

## ⚠️ API Key Required for All Endpoints

**Every API request must include the `x-api-key` header with your API key.**

Missing or invalid API key will return:
```json
{
  "success": false,
  "message": "API key is required. Use x-api-key header."
}
```

### How to Get Your API Key
1. Register at http://localhost:3000
2. Login to your account
3. Go to **Settings** tab
4. Copy your **API Key**
5. Use it in the `x-api-key` header for all requests

---

## 📤 Media Sending Features

The platform now supports sending text messages, media files, and media from URLs with optional captions.

---

## 🔌 API Endpoints

### 1. Send Text Message
```http
POST /api/send-message
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "to": "919876543210",
  "message": "Hello from WhatsApp Web JS!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "success": true,
    "messageId": "wamid.xxx",
    "timestamp": "2025-02-05T10:30:00.000Z"
  }
}
```

---

### 2. Send Media File (Upload)
```http
POST /api/send-media
Content-Type: multipart/form-data
x-api-key: YOUR_API_KEY

Form Data:
- to: 919876543210 (required)
- file: [binary file] (required) - Images, videos, documents
- caption: "Your caption here" (optional)
- filename: "image.jpg" (optional)
```

**Supported File Types:**
- Images: JPG, PNG, GIF, BMP
- Videos: MP4, AVI, MOV, MKV
- Documents: PDF, DOC, DOCX, XLS, XLSX, TXT

**File Size Limit:** 16MB max

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/send-media \
  -H "x-api-key: YOUR_API_KEY" \
  -F "to=919876543210" \
  -F "file=@/path/to/image.jpg" \
  -F "caption=Check out this image!"
```

**Response:**
```json
{
  "success": true,
  "message": "Media sent successfully",
  "data": {
    "success": true,
    "messageId": "wamid.xxx",
    "timestamp": "2025-02-05T10:30:00.000Z"
  }
}
```

---

### 3. Send Media from URL
```http
POST /api/send-media-url
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "to": "919876543210",
  "url": "https://example.com/image.jpg",
  "caption": "Check out this image!"
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/send-media-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "to": "919876543210",
    "url": "https://example.com/video.mp4",
    "caption": "Amazing video!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Media sent successfully",
  "data": {
    "success": true,
    "messageId": "wamid.xxx",
    "timestamp": "2025-02-05T10:30:00.000Z"
  }
}
```

---

### 4. Get Connection Status
```http
GET /api/status
x-api-key: YOUR_API_KEY
```

**Response:**
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

---

## 🎯 Frontend Usage

### Send Text Message
```javascript
// JavaScript example
$.ajax({
  url: '/api/send-message',
  type: 'POST',
  contentType: 'application/json',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  },
  data: JSON.stringify({
    to: '919876543210',
    message: 'Hello!'
  }),
  success: function(response) {
    console.log('Message sent:', response.data.messageId);
  }
});
```

### Send Media File
```javascript
// Upload file form
const fileInput = document.getElementById('fileInput');
const formData = new FormData();
formData.append('to', '919876543210');
formData.append('file', fileInput.files[0]);
formData.append('caption', 'Check this out!');

$.ajax({
  url: '/api/send-media',
  type: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  },
  data: formData,
  contentType: false,
  processData: false,
  success: function(response) {
    console.log('Media sent:', response.data.messageId);
  }
});
```

### Send Media from URL
```javascript
$.ajax({
  url: '/api/send-media-url',
  type: 'POST',
  contentType: 'application/json',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  },
  data: JSON.stringify({
    to: '919876543210',
    url: 'https://example.com/image.jpg',
    caption: 'Beautiful image!'
  }),
  success: function(response) {
    console.log('Media sent:', response.data.messageId);
  }
});
```

---

## 🔐 Authentication

All API endpoints require API key authentication via the `x-api-key` header.

### Getting Your API Key
1. Login to the admin panel at http://localhost:3000
2. Go to **Settings** tab
3. Copy your **API Key**

### Using API Key
```bash
# In all requests, include the header:
x-api-key: YOUR_API_KEY_HERE
```

---

## ⚠️ Error Responses

### Missing API Key
```json
{
  "success": false,
  "message": "API key is required. Use x-api-key header."
}
```

### Invalid API Key
```json
{
  "success": false,
  "message": "Invalid API key"
}
```

### WhatsApp Not Connected
```json
{
  "success": false,
  "message": "WhatsApp is not connected. Please connect first."
}
```

### Invalid Phone Number
```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

### File Too Large
```json
{
  "success": false,
  "message": "File size must be less than 16MB"
}
```

### Invalid URL
```json
{
  "success": false,
  "message": "Invalid URL format"
}
```

---

## 📋 Phone Number Format

Phone numbers should include country code (E.164 format):
- ✅ Correct: `919876543210` (India)
- ✅ Correct: `12025551234` (USA)
- ❌ Incorrect: `9876543210` (missing country code)
- ❌ Incorrect: `+91 9876 543210` (spaces not allowed)

---

## 🧪 Testing with cURL

### Test Text Message
```bash
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "to": "919876543210",
    "message": "Test message from API"
  }'
```

### Test Media Upload
```bash
curl -X POST http://localhost:3000/api/send-media \
  -H "x-api-key: YOUR_API_KEY" \
  -F "to=919876543210" \
  -F "file=@test.jpg" \
  -F "caption=Test image"
```

### Test Media from URL
```bash
curl -X POST http://localhost:3000/api/send-media-url \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "to": "919876543210",
    "url": "https://example.com/test.jpg",
    "caption": "Test from URL"
  }'
```

---

## 💡 Best Practices

1. **Store API Key Securely** - Never expose in client-side code
2. **Use HTTPS in Production** - Always encrypt API requests
3. **Validate Input** - Check phone numbers before sending
4. **Handle Errors** - Implement proper error handling
5. **Rate Limiting** - Implement rate limiting for large-scale usage
6. **Monitor Usage** - Track API usage and delivery status
7. **Test First** - Test with test messages before production

---

## 🔄 Response Format

All responses follow this structure:

```json
{
  "success": true/false,
  "message": "Description of result",
  "data": {
    // Response-specific data
  }
}
```

---

## ⏱️ Delivery Status

- Message ID is returned immediately upon sending
- Actual delivery status depends on WhatsApp's confirmation
- Check WhatsApp client to verify delivery

---

## 📞 Support

For issues:
1. Check API key is valid
2. Verify WhatsApp is connected
3. Validate phone number format
4. Check file size (max 16MB)
5. Review error message for specific issue

---

**API Version:** 1.0.0
**Last Updated:** February 5, 2025
