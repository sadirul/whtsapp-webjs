#!/bin/bash

# WhatsApp Web JS Platform - Installation & Getting Started Script
# This script helps with initial setup

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  WhatsApp Web JS Platform - Installation Helper               ║"
echo "║  Version 1.0.0                                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created. Please edit it with your database credentials."
    else
        echo "❌ .env.example not found."
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Install dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install

# Display next steps
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Setup Complete! ✅                                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Configure Database"
echo "   MySQL Command:"
echo "   mysql -u root -p"
echo "   CREATE DATABASE whatsapp_webjs;"
echo "   EXIT;"
echo ""
echo "2️⃣  Update .env File"
echo "   Edit .env with your database credentials:"
echo "   - DB_HOST (default: localhost)"
echo "   - DB_USER (default: root)"
echo "   - DB_PASSWORD (your MySQL password)"
echo "   - SESSION_SECRET (change to random string)"
echo ""
echo "3️⃣  Start Server"
echo "   Development (with auto-reload):"
echo "   npm run dev"
echo ""
echo "   Production:"
echo "   npm start"
echo ""
echo "4️⃣  Access Application"
echo "   Open your browser: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - README.md           (Complete documentation)"
echo "   - SETUP.md            (Detailed setup guide)"
echo "   - API_TESTING.md      (API testing examples)"
echo "   - QUICK_REFERENCE.md  (Quick reference)"
echo ""
echo "🚀 You're ready to go!"
echo ""
