#!/bin/bash

# CyberBot AI - Startup Script
# This script starts all required services for the application

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║                🤖 Starting CyberBot AI 🤖                         ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to check if a service is running
check_service() {
    if [ $? -eq 0 ]; then
        echo "   ✅ $1"
    else
        echo "   ❌ $1 - FAILED"
    fi
}

# 1. Check/Start PostgreSQL
echo "📦 Checking PostgreSQL..."
brew services list | grep -q "postgresql.*started"
if [ $? -eq 0 ]; then
    echo "   ✅ PostgreSQL already running"
else
    echo "   🚀 Starting PostgreSQL..."
    brew services start postgresql@14
    sleep 2
fi

# 2. Check/Start MongoDB
echo ""
echo "📦 Checking MongoDB..."
brew services list | grep -q "mongodb-community.*started"
if [ $? -eq 0 ]; then
    echo "   ✅ MongoDB already running"
else
    echo "   🚀 Starting MongoDB..."
    brew services start mongodb-community
    sleep 2
fi

# 3. Check/Start Ollama
echo ""
echo "🦙 Checking Ollama..."
brew services list | grep -q "ollama.*started"
if [ $? -eq 0 ]; then
    echo "   ✅ Ollama already running"
else
    echo "   🚀 Starting Ollama..."
    brew services start ollama
    sleep 2
fi

# 4. Start Flask Backend
echo ""
echo "🐍 Starting Flask Backend..."
lsof -ti:5001 | xargs kill -9 2>/dev/null  # Kill any existing process on port 5001
sleep 1
source venv/bin/activate
nohup python app.py > logs/flask.log 2>&1 &
FLASK_PID=$!
echo "   🚀 Flask Backend started (PID: $FLASK_PID)"
sleep 3

# Check if Flask is running
curl -s http://localhost:5001/api/test > /dev/null
check_service "Flask Backend on http://localhost:5001"

# 5. Start React Frontend
echo ""
echo "⚛️  Starting React Frontend..."
lsof -ti:3000 | xargs kill -9 2>/dev/null  # Kill any existing process on port 3000
sleep 1
nohup npm run dev -- --port 3000 > logs/react.log 2>&1 &
REACT_PID=$!
echo "   🚀 React Frontend started (PID: $REACT_PID)"
sleep 5

# Check if React is running
curl -s http://localhost:3000 > /dev/null
check_service "React Frontend on http://localhost:3000"

# Final Status
echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ ALL SERVICES STARTED ✅                      ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Service URLs:"
echo "   🌐 Frontend:  http://localhost:3000"
echo "   🔧 Backend:   http://localhost:5001"
echo "   🦙 Ollama:    http://localhost:11434"
echo ""
echo "📝 Logs:"
echo "   Flask:  tail -f logs/flask.log"
echo "   React:  tail -f logs/react.log"
echo ""
echo "🛑 To stop all services:"
echo "   ./stop-app.sh"
echo ""
echo "🎉 CyberBot AI is ready! Open http://localhost:3000 to start chatting!"
echo ""
