@echo off
chcp 65001 > nul
title The Chimera Protocol Control Panel Server

echo =====================================
echo    🔥 THE CHIMERA PROTOCOL SERVER     
echo =====================================
echo.

REM Check if Python is installed
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python not found
    echo 💡 Please install Python 3.x first
    echo 🔗 Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if in correct directory
if not exist "index.html" (
    echo ❌ Error: index.html not found
    echo 💡 Please run this script in The Chimera Protocol project directory
    pause
    exit /b 1
)

echo ✅ Python check passed
echo 🚀 Starting server...
echo.

REM Start Python server
python scripts/server.py

echo.
echo 👋 Server stopped
pause