# Railway Deployment Guide

## Step 1: GitHub Setup
```bash
git add .
git commit -m "Railway deployment setup"
git push origin main
```

## Step 2: Railway Deployment
1. Visit https://railway.app
2. Sign up with GitHub
3. Click "Start a New Project"
4. Select "Deploy from GitHub repo"
5. Choose your m4t-learning-platform repository
6. Railway automatically detects Node.js and deploys

## Step 3: Add PostgreSQL Database
1. In project dashboard: "Add Service"
2. Select "PostgreSQL"
3. Wait for provisioning (2-3 minutes)
4. Copy the DATABASE_URL from the PostgreSQL service

## Step 4: Environment Variables
Go to your app service → Variables tab and add:

```
DATABASE_URL=postgresql://postgres:password@host:port/railway
JWT_SECRET=your-32-character-secret-key
NODE_ENV=production
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
SENDGRID_API_KEY=SG.your_sendgrid_key
```

Generate JWT secret:
```bash
openssl rand -hex 32
```

## Step 5: Deploy and Test
- Railway provides URL: https://your-app.up.railway.app
- Test endpoints:
  - /health
  - /api/status
  - Root URL for application

## Database Initialization
The app automatically creates test accounts and sample data on first startup.

## Test Login
- Admin: admin@m4t.com / admin123
- Student: student@m4t.com / student123