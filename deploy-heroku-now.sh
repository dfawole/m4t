#!/bin/bash

echo "M4T Learning Platform - Heroku Deployment Script"
echo "================================================"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI not found. Please install it first:"
    echo "- macOS: brew tap heroku/brew && brew install heroku"
    echo "- Windows: Download from https://devcenter.heroku.com/articles/heroku-cli"
    echo "- Linux: curl https://cli-assets.heroku.com/install.sh | sh"
    exit 1
fi

# Login to Heroku
echo "Logging into Heroku..."
heroku login

# Create Heroku app
echo "Creating Heroku application..."
APP_NAME="m4t-learning-platform-$(date +%s)"
heroku create $APP_NAME

# Add PostgreSQL addon
echo "Adding PostgreSQL database..."
heroku addons:create heroku-postgresql:mini --app $APP_NAME

# Generate and set environment variables
echo "Setting environment variables..."
JWT_SECRET=$(openssl rand -hex 32)
heroku config:set JWT_SECRET=$JWT_SECRET --app $APP_NAME
heroku config:set NODE_ENV=production --app $APP_NAME

# Deploy to Heroku
echo "Deploying to Heroku..."
git push heroku main

echo ""
echo "Heroku Deployment Complete!"
echo ""
echo "Application URL: https://$APP_NAME.herokuapp.com"
echo ""
echo "Next steps:"
echo "1. Add your API keys:"
echo "   heroku config:set STRIPE_SECRET_KEY=sk_test_your_key --app $APP_NAME"
echo "   heroku config:set SENDGRID_API_KEY=SG.your_key --app $APP_NAME"
echo ""
echo "2. Test your deployment:"
echo "   curl https://$APP_NAME.herokuapp.com/health"
echo ""
echo "3. Open application:"
echo "   heroku open --app $APP_NAME"