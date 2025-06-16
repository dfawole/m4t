# M4T Learning Platform - Complete Deployment Guide

## Overview
This guide provides comprehensive step-by-step instructions for deploying the M4T Learning Platform on multiple cloud platforms. The application includes a React frontend, Express.js backend, PostgreSQL database, and integrates with Stripe, SendGrid, and OpenAI.

## Prerequisites
- Node.js 18+ installed locally
- Git installed
- GitHub account
- Account on chosen deployment platform

## 1. GitHub Repository Setup

### Step 1: Create GitHub Repository
```bash
# Create new repository on GitHub (via web interface)
# Repository name: m4t-learning-platform
# Set to Public or Private as needed
```

### Step 2: Prepare Local Repository
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: M4T Learning Platform"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/m4t-learning-platform.git

# Push to GitHub
git push -u origin main
```

### Step 3: Environment Variables Setup
Create `.env.example` file in repository root:
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SendGrid
SENDGRID_API_KEY=SG...

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# Application
NODE_ENV=production
PORT=3000
```

## 2. Deployment Option 1: Vercel (Recommended)

### Why Vercel?
- Free tier available
- Automatic deployments from GitHub
- Built-in PostgreSQL database option
- Excellent for React/Next.js applications

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Create vercel.json Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow prompts:
# - Link to existing project: No
# - Project name: m4t-learning-platform
# - Directory: ./
# - Override settings: No

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add SENDGRID_API_KEY

# Deploy production
vercel --prod
```

### Step 4: Database Setup (Vercel Postgres)
```bash
# Add Vercel Postgres
vercel postgres create m4t-db

# Connect to project
vercel postgres connect m4t-db

# Get connection string and update environment
vercel env add DATABASE_URL
```

## 3. Deployment Option 2: Railway

### Why Railway?
- Simple deployment process
- Built-in database options
- Automatic scaling
- Good for full-stack applications

### Step 1: Create Railway Account
Visit https://railway.app and sign up with GitHub

### Step 2: Create railway.json
```json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

### Step 3: Deploy via GitHub
1. Connect GitHub repository to Railway
2. Select the m4t-learning-platform repository
3. Railway will automatically detect Node.js and deploy

### Step 4: Add Database
1. In Railway dashboard, click "Add Service"
2. Select "PostgreSQL"
3. Copy connection string to environment variables

### Step 5: Configure Environment Variables
In Railway dashboard:
- Add all environment variables from .env.example
- Set PORT to $PORT (Railway provides this automatically)

## 4. Deployment Option 3: Render

### Why Render?
- Free tier with limitations
- Automatic SSL certificates
- Easy database integration
- Good for full-stack applications

### Step 1: Create Render Account
Visit https://render.com and sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - Name: m4t-learning-platform
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### Step 3: Add PostgreSQL Database
1. Click "New" → "PostgreSQL"
2. Name: m4t-database
3. Copy internal database URL

### Step 4: Environment Variables
Add in Render dashboard:
- DATABASE_URL (from PostgreSQL service)
- All other variables from .env.example

## 5. Deployment Option 4: Heroku

### Why Heroku?
- Well-established platform
- Many add-ons available
- Good documentation
- Easy scaling

### Step 1: Install Heroku CLI
```bash
# Install Heroku CLI (varies by OS)
# macOS: brew tap heroku/brew && brew install heroku
# Windows: Download from heroku.com
```

### Step 2: Create Heroku Application
```bash
# Login to Heroku
heroku login

# Create app
heroku create m4t-learning-platform

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set STRIPE_SECRET_KEY=your-stripe-key
heroku config:set SENDGRID_API_KEY=your-sendgrid-key
```

### Step 3: Create Procfile
```
web: npm start
```

### Step 4: Deploy
```bash
# Push to Heroku
git push heroku main

# Open application
heroku open
```

## 6. Deployment Option 5: DigitalOcean App Platform

### Why DigitalOcean?
- Predictable pricing
- Good performance
- Managed databases
- Easy scaling

### Step 1: Create DigitalOcean Account
Visit https://digitalocean.com and sign up

### Step 2: Create App
1. Go to App Platform
2. Create App from GitHub repository
3. Configure:
   - Source: GitHub repository
   - Branch: main
   - Autodeploy: Yes

### Step 3: Configure Build Settings
- Build Command: `npm install && npm run build`
- Run Command: `npm start`
- Environment Variables: Add all from .env.example

### Step 4: Add Database
1. Create managed PostgreSQL database
2. Add connection string to app environment

## 7. Local Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/m4t-learning-platform.git
cd m4t-learning-platform
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
```

### Step 4: Database Setup
```bash
# Install PostgreSQL locally or use cloud database
# Update DATABASE_URL in .env

# Run database migrations
npm run db:push
```

### Step 5: Start Development Server
```bash
npm run dev
```

## 8. Required Environment Variables

### Database
- `DATABASE_URL`: PostgreSQL connection string

### Authentication
- `JWT_SECRET`: Secret key for JWT tokens (generate with: `openssl rand -hex 32`)

### Payment Processing
- `STRIPE_SECRET_KEY`: Stripe secret key (get from Stripe dashboard)
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

### Email Service
- `SENDGRID_API_KEY`: SendGrid API key for email functionality

### Optional Services
- `OPENAI_API_KEY`: For AI-powered features
- `NODE_ENV`: Set to 'production' for production deployments
- `PORT`: Port number (automatically set by most platforms)

## 9. Database Migration

### For New Deployments
```bash
# Push schema to database
npm run db:push

# Seed initial data (if needed)
npm run db:seed
```

### For Existing Deployments
```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

## 10. Monitoring and Maintenance

### Health Checks
The application includes health check endpoints:
- `/health`: Basic health status
- `/api/status`: Detailed system status

### Logging
Monitor application logs through your platform's dashboard:
- Vercel: Functions tab
- Railway: Deployments tab
- Render: Logs tab
- Heroku: `heroku logs --tail`

### Performance Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for user session recording
- New Relic for performance monitoring

## 11. Security Considerations

### Environment Variables
- Never commit .env files to repository
- Use platform-specific environment variable management
- Rotate API keys regularly

### Database Security
- Use SSL connections for database
- Implement proper backup strategies
- Monitor for unusual access patterns

### Application Security
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs

## 12. Troubleshooting Common Issues

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are listed in package.json
- Check for TypeScript compilation errors

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall settings
- Ensure database server is running

### Environment Variable Issues
- Verify all required variables are set
- Check for typos in variable names
- Ensure proper encoding of special characters

## Recommendation

For quick testing and deployment, I recommend **Vercel** as it offers:
- Fastest deployment process
- Excellent React/Node.js support
- Built-in database options
- Free tier suitable for testing
- Automatic HTTPS and CDN

The deployment process would be:
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy with one click

Would you like me to help you set up deployment on any specific platform?