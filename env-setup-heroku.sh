#!/bin/bash

APP_NAME=${1:-m4t-learning-platform}

echo "Setting up environment variables for Heroku deployment..."

# Generate JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Set environment variables
heroku config:set JWT_SECRET=$JWT_SECRET --app $APP_NAME
heroku config:set NODE_ENV=production --app $APP_NAME

echo "Basic environment variables set!"
echo ""
echo "To complete setup, run these commands with your API keys:"
echo ""
echo "heroku config:set STRIPE_SECRET_KEY=sk_test_your_key --app $APP_NAME"
echo "heroku config:set STRIPE_PUBLISHABLE_KEY=pk_test_your_key --app $APP_NAME"
echo "heroku config:set SENDGRID_API_KEY=SG.your_key --app $APP_NAME"
echo ""
echo "Database URL is automatically configured by PostgreSQL addon"