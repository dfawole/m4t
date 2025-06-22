# M4T Learning Platform - Production Deployment Guide

## Quick Start for Non-Technical Users

### Option 1: Deploy to Replit (Recommended for Beginners)

This is the easiest way to get your platform online quickly!

#### Step 1: Prepare Your Project
1. Make sure you have all your files ready
2. Upload your project to GitHub (or download our ready-to-deploy package)

#### Step 2: Deploy to Replit
1. Go to [replit.com](https://replit.com)
2. Create a free account
3. Click "Create Repl"
4. Choose "Import from GitHub"
5. Paste your repository URL
6. Wait for Replit to import your project

#### Step 3: Configure Environment Variables
In your Replit project, go to the "Secrets" tab and add:

```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-long-random-secret-key-here
```

Optional (for full functionality):
```
SENDGRID_API_KEY=your-sendgrid-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-public
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
```

#### Step 4: Set Up Database
1. Click "Run" to start your application
2. The database will be automatically set up
3. Your application will be live at your Replit URL

#### Step 5: Make It Public
1. Click the "Deploy" button in Replit
2. Choose your deployment settings
3. Your platform will be available at a public URL

### Option 2: Deploy to Vercel (Good for React/Next.js)

#### Step 1: Prepare Repository
1. Upload your code to GitHub
2. Make sure all files are committed

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your repository

#### Step 3: Configure Environment
1. Add all your environment variables in Vercel's project settings
2. Make sure to set `NODE_ENV=production`

#### Step 4: Deploy
1. Vercel will automatically build and deploy
2. Your site will be live in minutes

### Option 3: Deploy to Your Own Server

#### Prerequisites
- A server with Ubuntu 20.04+ (Digital Ocean, AWS, etc.)
- A domain name pointing to your server
- Basic SSH access

#### Step 1: Server Setup
```bash
# Connect to your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER
```

#### Step 2: Deploy Application
```bash
# Clone your repository
git clone https://github.com/yourusername/m4t-platform /var/www/m4t
cd /var/www/m4t

# Install dependencies
npm install

# Set up environment
cp .env.example .env
nano .env  # Edit with your production values

# Start database
docker-compose up -d postgres

# Run database migrations
npm run db:push

# Build application
npm run build

# Start application
npm start
```

#### Step 3: Set Up Process Manager
```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start npm --name "m4t" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Step 4: Set Up Reverse Proxy (Nginx)
```bash
# Install Nginx
apt install nginx -y

# Create Nginx configuration
cat > /etc/nginx/sites-available/m4t << 'EOF'
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/m4t /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 5: Set Up SSL Certificate
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com

# Auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

## Database Configuration

### PostgreSQL Setup

#### For Local Development
```bash
# Start PostgreSQL with Docker
docker run --name m4t-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=m4t -p 5432:5432 -d postgres:13
```

#### For Production (Managed Database)
We recommend using managed database services:

1. **Supabase** (Recommended)
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from settings
   - Add to your `.env` file

2. **Railway**
   - Go to [railway.app](https://railway.app)
   - Create PostgreSQL service
   - Copy connection details

3. **Neon**
   - Go to [neon.tech](https://neon.tech)
   - Create database
   - Use provided connection string

## Environment Variables Reference

### Required Variables
```env
# Database connection
DATABASE_URL=postgresql://user:password@host:port/database

# Session security
SESSION_SECRET=your-very-long-random-secret-key-minimum-32-characters

# Node environment
NODE_ENV=production
```

### Optional Integrations
```env
# Email service (SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# Payment processing (Stripe)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-public-key

# PayPal payments
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

## API Keys Setup Guide

### SendGrid (Email Service)
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create free account (100 emails/day free)
3. Go to Settings > API Keys
4. Create new API key with "Full Access"
5. Copy the key and add to your environment variables

### Stripe (Payment Processing)
1. Go to [stripe.com](https://stripe.com)
2. Create account and complete verification
3. Go to Developers > API Keys
4. Copy both "Publishable key" and "Secret key"
5. Add both keys to your environment variables
6. **Important**: Use test keys for development, live keys for production

### PayPal (Alternative Payments)
1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Create developer account
3. Create new app in your dashboard
4. Copy Client ID and Client Secret
5. Add to your environment variables

## Security Checklist

### Before Going Live
- [ ] Change all default passwords
- [ ] Use strong, unique SESSION_SECRET
- [ ] Enable HTTPS (SSL certificate)
- [ ] Use production API keys (not test keys)
- [ ] Set up proper database backups
- [ ] Configure firewall rules
- [ ] Enable database connection encryption
- [ ] Set up monitoring and logging

### Recommended Security Headers
Add these to your Nginx configuration:
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Monitoring and Maintenance

### Health Checks
Set up monitoring for:
- Application uptime
- Database connectivity
- Response times
- Error rates

### Regular Maintenance
1. **Weekly**: Check application logs for errors
2. **Monthly**: Update dependencies (`npm update`)
3. **Quarterly**: Database performance review
4. **As needed**: Security updates

### Backup Strategy
```bash
# Daily database backup
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/m4t_backup_$TIMESTAMP.sql

# Keep only last 7 days of backups
find /backups -name "m4t_backup_*.sql" -mtime +7 -delete
```

## Troubleshooting Common Issues

### Application Won't Start
1. Check environment variables are set correctly
2. Verify database connection
3. Check application logs: `pm2 logs m4t`

### Database Connection Errors
1. Verify DATABASE_URL format
2. Check database server is running
3. Confirm firewall allows database connections

### SSL Certificate Issues
1. Verify domain DNS points to your server
2. Check Nginx configuration
3. Renew certificate: `certbot renew`

### Performance Issues
1. Check server resources (CPU, memory)
2. Optimize database queries
3. Enable Nginx caching
4. Consider using a CDN

## Getting Help

1. Check application logs first
2. Verify all environment variables
3. Test database connection separately
4. Check server resources and performance

## Success Checklist

- [ ] Application builds successfully
- [ ] Database is connected and migrated
- [ ] All environment variables configured
- [ ] SSL certificate installed
- [ ] Domain points to application
- [ ] Test accounts can log in
- [ ] All features work as expected
- [ ] Monitoring is set up
- [ ] Backups are configured

Your M4T learning platform is now ready for production use!