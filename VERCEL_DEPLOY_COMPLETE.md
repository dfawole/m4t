# Vercel Deployment - Complete Guide

## Quick Commands

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login and deploy
vercel login
vercel --prod

# 3. Set environment variables
./env-setup-vercel.sh
```

## Database Setup (Supabase Free Tier)

1. Create account at https://supabase.com
2. New project: `m4t-learning-platform`
3. Copy connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

## Required Environment Variables

| Variable | Value | Where to Get |
|----------|--------|--------------|
| DATABASE_URL | PostgreSQL connection string | Supabase dashboard |
| JWT_SECRET | 32-character random string | `openssl rand -hex 32` |
| NODE_ENV | production | Set manually |
| STRIPE_SECRET_KEY | sk_test_... | Stripe dashboard |
| STRIPE_PUBLISHABLE_KEY | pk_test_... | Stripe dashboard |
| SENDGRID_API_KEY | SG.... | SendGrid dashboard |

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
Your app will be available at: `https://m4t-learning-platform.vercel.app`

## Test After Deployment
- Health check: `/health`
- API status: `/api/status`
- Login with: admin@m4t.com / admin123

## Performance Features
- Global CDN included
- Automatic HTTPS
- Edge functions for API routes
- Real-time analytics