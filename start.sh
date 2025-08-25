#!/bin/bash

# The Chimera Protocol Control Panel Server Startup Script (Linux/Mac)

echo "====================================="
echo "   🔥 THE CHIMERA PROTOCOL SERVER     "
echo "====================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ Error: Python not found"
        echo "💡 Please install Python 3.x first"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# Check if in correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found"
    echo "💡 Please run this script in The Chimera Protocol project directory"
    exit 1
fi

echo "✅ Python check passed"
echo "🚀 Starting server..."
echo

# Start Python server
$PYTHON_CMD scripts/server.py

echo
echo "👋 Server stopped"