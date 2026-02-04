@echo off
REM WhatsApp Web JS Platform - Installation Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  WhatsApp Web JS Platform - Installation Helper (Windows)      ║
echo ║  Version 1.0.0                                                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo 📋 Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

REM Check if .env exists
if not exist .env (
    echo.
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo ✅ .env file created. Please edit it with your database credentials.
    ) else (
        echo ❌ .env.example not found.
        pause
        exit /b 1
    )
) else (
    echo ✅ .env file exists
)

REM Install dependencies
echo.
echo 📦 Installing npm dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

REM Display next steps
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Setup Complete! ✅                                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📋 Next Steps:
echo.
echo 1️⃣  Configure Database
echo    Open MySQL Command Line and run:
echo    CREATE DATABASE whatsapp_webjs;
echo.
echo 2️⃣  Update .env File
echo    Edit .env with your database credentials:
echo    - DB_HOST (default: localhost)
echo    - DB_USER (default: root)
echo    - DB_PASSWORD (your MySQL password)
echo    - SESSION_SECRET (change to random string)
echo.
echo 3️⃣  Start Server
echo    Development (with auto-reload):
echo    npm run dev
echo.
echo    Production:
echo    npm start
echo.
echo 4️⃣  Access Application
echo    Open your browser: http://localhost:3000
echo.
echo 📚 Documentation:
echo    - README.md           (Complete documentation)
echo    - SETUP.md            (Detailed setup guide)
echo    - API_TESTING.md      (API testing examples)
echo    - QUICK_REFERENCE.md  (Quick reference)
echo.
echo 🚀 You're ready to go!
echo.
pause
