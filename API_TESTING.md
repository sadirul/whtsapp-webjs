# WhatsApp Web JS Platform - Manual API Testing

## ⚠️ API Authentication Required

**All Public API endpoints require the `x-api-key` header.**

```bash
# Example: Include this header in all API requests
-H "x-api-key: YOUR_API_KEY_HERE"
```

Get your API key:
1. Register/Login at http://localhost:3000
2. View your API key in the Settings tab
3. Include it in every public API call

---

## Prerequisites
- Server running on http://localhost:3000
- `curl` installed
- `jq` installed (for JSON formatting)
- Valid API key from registered user

## 1. Register New User

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

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please login.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "api_key": "abc123def456..."
  }
}
```

## 2. Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the API key from response - you'll need it for public API calls.

## 3. Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/current-user \
  -b cookies.txt \
  -H "Content-Type: application/json"
```

## 4. Initialize WhatsApp

```bash
curl -X POST http://localhost:3000/whatsapp/init \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 5. Get QR Code

```bash
curl -X GET http://localhost:3000/whatsapp/qr \
  -b cookies.txt \
  -H "Content-Type: application/json"
```

Response will include base64 encoded QR code image.

## 6. Check WhatsApp Status

```bash
curl -X GET http://localhost:3000/whatsapp/status \
  -b cookies.txt \
  -H "Content-Type: application/json"
```

## 7. Send Message (Public API)

**Note:** Replace with actual API key from registration

```bash
curl -X POST http://localhost:3000/api/send-message \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -d '{
    "to": "919876543210",
    "message": "Hello from WhatsApp Web JS!"
  }'
```

**Response:**
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

## 8. Get Status (Public API)

```bash
curl -X GET http://localhost:3000/api/status \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json"
```

## 9. Logout WhatsApp

```bash
curl -X POST http://localhost:3000/whatsapp/logout \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 10. Logout User

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Important Notes

1. **Cookie Management**: Use `-c cookies.txt` to save cookies and `-b cookies.txt` to send them with requests
2. **API Key Authentication**: Use `-H "x-api-key: YOUR_API_KEY"` header for public API endpoints
3. **Session-Based**: Login creates a session cookie automatically
4. **Phone Number Format**: Accept 10-15 digit numbers, with or without country code
5. **JSON Formatting**: Pipe response to `jq .` for pretty printing

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login first."
}
```

### Invalid Phone Number
```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

### WhatsApp Not Connected
```json
{
  "success": false,
  "message": "WhatsApp is not connected. Please connect first."
}
```

### Missing API Key
```json
{
  "success": false,
  "message": "API key is required. Use x-api-key header."
}
```

## Test Workflow

1. Start server: `npm run dev`
2. Register a new user (saves API key)
3. Login with the user
4. Initialize WhatsApp
5. Scan QR code with phone
6. Wait for connection
7. Send test message using API key
8. Check message delivery on WhatsApp

---

For more detailed API documentation, see README.md
