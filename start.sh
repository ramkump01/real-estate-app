#!/bin/bash

echo "🚀 Starting Real Estate App..."

# Create .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📋 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "📋 Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
fi

# Start with Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "✅ Real Estate App is starting..."
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend API: http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/docs"
echo ""
echo "📝 Next steps:"
echo "1. Update .env files with your OAuth credentials"
echo "2. Visit http://localhost:5173"
echo "3. Start creating listings!"
