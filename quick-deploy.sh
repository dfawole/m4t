#!/bin/bash

echo "M4T Learning Platform Quick Deploy"
echo "================================="

# Check for dependencies
if ! command -v node &> /dev/null; then
    echo "Node.js is required. Please install Node.js 18+ first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "Choose deployment platform:"
echo "1. Railway (fastest, includes database)"
echo "2. Vercel (best performance)"
echo "3. Heroku (traditional)"
echo "4. Local development"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Railway Deployment Steps:"
        echo "1. Push this code to GitHub"
        echo "2. Visit https://railway.app"
        echo "3. Connect your GitHub repository"
        echo "4. Add PostgreSQL service"
        echo "5. Set environment variables from .env.example"
        echo ""
        echo "See deploy-railway.md for detailed instructions"
        ;;
    2)
        echo ""
        echo "Installing Vercel CLI and deploying..."
        npm install -g vercel
        vercel login
        vercel --prod
        echo ""
        echo "Configure environment variables:"
        ./env-setup-vercel.sh
        ;;
    3)
        echo ""
        echo "Heroku deployment..."
        ./deploy-heroku-now.sh
        ;;
    4)
        echo ""
        echo "Starting local development server..."
        echo "Make sure to configure .env file first"
        npm run dev
        ;;
esac
