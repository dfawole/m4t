#!/bin/bash
echo "🚀 Installing M4T Learning Platform..."
echo ""

echo "📦 Installing Node.js dependencies..."
npm install

echo "🐘 Starting database..."
docker-compose up -d postgres

echo "📊 Setting up database..."
sleep 10
npm run db:push

echo "🌟 Starting development server..."
npm run dev

echo ""
echo "✅ M4T Learning Platform is running!"
echo "🌐 Open http://localhost:3000 in your browser"
