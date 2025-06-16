#!/bin/bash

echo "M4T Learning Platform - Vercel Deployment Script"
echo "================================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel
echo "Logging into Vercel..."
vercel login

# Build the application
echo "Building application for Vercel..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo ""
echo "Vercel Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Set up database (Supabase recommended for free tier)"
echo "2. Add environment variables in Vercel dashboard:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - STRIPE_SECRET_KEY"
echo "   - SENDGRID_API_KEY"
echo "3. Test your deployment"
echo ""
echo "Database options:"
echo "- Supabase: https://supabase.com (Free)"
echo "- Neon: https://neon.tech (Free)"
echo "- PlanetScale: https://planetscale.com (Free tier)"