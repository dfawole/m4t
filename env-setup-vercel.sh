#!/bin/bash

echo "Setting up environment variables for Vercel deployment..."

# Set environment variables for Vercel
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add NODE_ENV production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PUBLISHABLE_KEY production
vercel env add SENDGRID_API_KEY production

echo "Environment variables setup complete!"
echo ""
echo "Please provide the following values when prompted:"
echo "- DATABASE_URL: Your PostgreSQL connection string from Supabase/Neon"
echo "- JWT_SECRET: Generate with 'openssl rand -hex 32'"
echo "- NODE_ENV: production"
echo "- STRIPE_SECRET_KEY: sk_test_... from Stripe dashboard"
echo "- STRIPE_PUBLISHABLE_KEY: pk_test_... from Stripe dashboard"
echo "- SENDGRID_API_KEY: SG.... from SendGrid"