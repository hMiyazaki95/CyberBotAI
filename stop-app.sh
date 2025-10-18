#!/bin/bash

# CyberBot AI - Stop Script
# This script stops all running services

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║                🛑 Stopping CyberBot AI 🛑                         ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Stop Flask Backend (port 5001)
echo "🐍 Stopping Flask Backend..."
lsof -ti:5001 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Flask Backend stopped"
else
    echo "   ℹ️  Flask Backend was not running"
fi

# Stop React Frontend (port 3000)
echo ""
echo "⚛️  Stopping React Frontend..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ React Frontend stopped"
else
    echo "   ℹ️  React Frontend was not running"
fi

# Optional: Stop background services (keep them running by default)
echo ""
echo "📦 Background Services Status:"
echo ""
read -p "   Do you want to stop PostgreSQL? (y/N): " stop_postgres
if [[ $stop_postgres =~ ^[Yy]$ ]]; then
    brew services stop postgresql@14
    echo "   🛑 PostgreSQL stopped"
else
    echo "   ✅ PostgreSQL still running"
fi

read -p "   Do you want to stop MongoDB? (y/N): " stop_mongo
if [[ $stop_mongo =~ ^[Yy]$ ]]; then
    brew services stop mongodb-community
    echo "   🛑 MongoDB stopped"
else
    echo "   ✅ MongoDB still running"
fi

read -p "   Do you want to stop Ollama? (y/N): " stop_ollama
if [[ $stop_ollama =~ ^[Yy]$ ]]; then
    brew services stop ollama
    echo "   🛑 Ollama stopped"
else
    echo "   ✅ Ollama still running"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║              ✅ SERVICES STOPPED SUCCESSFULLY ✅                  ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 To start services again, run: ./start-app.sh"
echo ""
