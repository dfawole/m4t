# Heroku Deployment - Complete Guide

## Quick Commands

```bash
# 1. Install Heroku CLI (if needed)
# macOS: brew tap heroku/brew && brew install heroku
# Windows: Download from heroku.com
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login and create app
heroku login
heroku create m4t-learning-platform

# 3. Add PostgreSQL database
heroku addons:create heroku-postgresql:mini

# 4. Set environment variables
./env-setup-heroku.sh m4t-learning-platform

# 5. Deploy
git push heroku main
```

## Required Environment Variables

| Variable | Value | Auto-Generated |
|----------|--------|----------------|
| DATABASE_URL | PostgreSQL connection | Yes (by addon) |
| JWT_SECRET | 32-character random string | Yes (by script) |
| NODE_ENV | production | Yes (by script) |
| STRIPE_SECRET_KEY | sk_test_... | Manual setup |
| STRIPE_PUBLISHABLE_KEY | pk_test_... | Manual setup |
| SENDGRID_API_KEY | SG.... | Manual setup |

## Manual API Key Setup

```bash
# Add your Stripe keys
heroku config:set STRIPE_SECRET_KEY=sk_test_your_key
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Add SendGrid key
heroku config:set SENDGRID_API_KEY=SG.your_key
```

## API Keys Setup

### Stripe (Payment Processing)
1. Visit https://stripe.com → Create account
2. Dashboard → Developers → API Keys
3. Copy both test keys (pk_test_ and sk_test_)

### SendGrid (Email Service)
1. Visit https://sendgrid.com → Create account
2. Settings → API Keys → Create API Key
3. Select "Full Access" → Copy key

## Deployment URL
Your app will be available at: `https://m4t-learning-platform.herokuapp.com`

## Management Commands

```bash
# View logs
heroku logs --tail

# Check app status
heroku ps

# Scale dynos
heroku ps:scale web=1

# Open app in browser
heroku open
```

## Test After Deployment
- Health check: `/health`
- API status: `/api/status`
- Login with: admin@m4t.com / admin123

## Database Management
```bash
# View database info
heroku pg:info

# Connect to database
heroku pg:psql

# Create backup
heroku pg:backups:capture
```