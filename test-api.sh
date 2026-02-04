#!/bin/bash

# WhatsApp Web JS Platform - API Testing Commands
# Replace localhost:3000 with your server URL

API_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}WhatsApp Web JS - API Testing${NC}\n"

# ============================================
# 1. REGISTER USER
# ============================================
echo -e "${GREEN}1. Register New User${NC}"
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }' \
  -w "\n\n"

# ============================================
# 2. LOGIN USER
# ============================================
echo -e "${GREEN}2. Login User${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')

echo "$RESPONSE" | jq .
API_KEY=$(echo "$RESPONSE" | jq -r '.user.api_key')
echo -e "\nAPI Key: $API_KEY\n"

# ============================================
# 3. GET CURRENT USER
# ============================================
echo -e "${GREEN}3. Get Current User Info${NC}"
curl -s -X GET "$API_URL/api/auth/current-user" \
  -b cookies.txt \
  -H "Content-Type: application/json" | jq .
echo ""

# ============================================
# 4. CHECK WHATSAPP STATUS
# ============================================
echo -e "${GREEN}4. Check WhatsApp Status${NC}"
curl -s -X GET "$API_URL/whatsapp/status" \
  -b cookies.txt \
  -H "Content-Type: application/json" | jq .
echo ""

# ============================================
# 5. INIT WHATSAPP
# ============================================
echo -e "${GREEN}5. Initialize WhatsApp${NC}"
curl -s -X POST "$API_URL/whatsapp/init" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
echo ""

# ============================================
# 6. GET QR CODE
# ============================================
echo -e "${GREEN}6. Get QR Code${NC}"
curl -s -X GET "$API_URL/whatsapp/qr" \
  -b cookies.txt \
  -H "Content-Type: application/json" | jq '.' | head -20
echo "... (truncated for brevity)"
echo ""

# ============================================
# 7. SEND MESSAGE (via API Key)
# ============================================
echo -e "${GREEN}7. Send Message via API Key${NC}"
echo "Using API Key: $API_KEY"
curl -s -X POST "$API_URL/api/send-message" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "to": "919876543210",
    "message": "Hello from WhatsApp Web JS API!"
  }' | jq .
echo ""

# ============================================
# 8. CHECK STATUS VIA API KEY
# ============================================
echo -e "${GREEN}8. Check Status via API Key${NC}"
curl -s -X GET "$API_URL/api/status" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" | jq .
echo ""

# ============================================
# 9. LOGOUT WHATSAPP
# ============================================
echo -e "${GREEN}9. Logout WhatsApp${NC}"
curl -s -X POST "$API_URL/whatsapp/logout" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
echo ""

# ============================================
# 10. LOGOUT USER
# ============================================
echo -e "${GREEN}10. Logout User${NC}"
curl -s -X POST "$API_URL/api/auth/logout" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
echo ""

# Clean up
rm -f cookies.txt

echo -e "${BLUE}API Testing Complete!${NC}"
