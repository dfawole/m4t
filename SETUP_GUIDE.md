# M4T Learning Platform - Complete Setup Guide

## Overview

This guide will help you set up the M4T learning platform on your local computer and deploy it to production. No technical background required!

## What You'll Need

- A computer with internet connection
- About 30 minutes for setup
- Docker Desktop (we'll help you install this)

## Part 1: Local Development Setup

### Step 1: Install Required Software

#### Install Node.js

1. Go to https://nodejs.org/
2. Download the "LTS" version (recommended for most users)
3. Run the installer and follow the prompts
4. Restart your computer after installation

#### Install Docker Desktop

1. Go to https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for your operating system
3. Install and start Docker Desktop
4. Create a free Docker account when prompted

#### Install Git (if not already installed)

1. Go to https://git-scm.com/downloads
2. Download and install Git for your operating system
3. Follow the installation prompts (default settings are fine)

### Step 2: Download the Project

#### Option A: Download ZIP

1. Download the project ZIP file
2. Extract it to a folder like `C:\M4T` (Windows) or `/Users/yourname/M4T` (Mac)

#### Option B: Clone with Git

```bash
git clone [your-repository-url] M4T
cd M4T
```

### Step 3: Set Up the Database

1. Open Docker Desktop and make sure it's running

2. Open Terminal/Command Prompt

3. Navigate to your project folder:

```bash
cd path/to/your/M4T/folder
```

4. Start the database:

```bash
docker-compose up -d postgres
```

5. Wait about 30 seconds for the database to start

### Step 4: Install Project Dependencies

1. In your terminal, run:

```bash
npm install
```

2. This will download all required packages (may take 2-3 minutes)

### Step 5: Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open the `.env` file in a text editor

3. Update these required settings:

```sh
DATABASE_URL=postgresql://m4t_user:your_secure_password@localhost:5432/m4t
SESSION_SECRET=your-secret-key-here-make-it-long-and-random
POSTGRES_PASSWORD=your_secure_password

```

```sh

```

__Important__: Make sure the database name is `m4t` (not `m4t_db`) to match the docker-compose configuration.

### Step 6: Set Up the Database Schema

1. Run the database migrations:

```bash
npm run db:push
```

2. Seed the database with initial data:

```bash
npm run seed
```

### Step 7: Start the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your web browser and go to: http://localhost:3000

3. You should see the M4T homepage!

### Step 8: Test Login

Use these test accounts:

- **Student**: username `student` password `student123`
- **Instructor**: username `instructor` password `instructor123`
- **Admin**: username `admin` password `admin123`

## Part 2: Production Deployment

### Option A: Deploy to Replit (Easiest)

1. Go to https://replit.com/
2. Create a free account
3. Click "Create Repl"
4. Choose "Import from GitHub" and paste your repository URL
5. Replit will automatically set up the environment
6. Add these secrets in the "Secrets" tab:
   - `DATABASE_URL`: Your production database URL
   - `SESSION_SECRET`: A long random string
   - Add any API keys you're using (Stripe, SendGrid, etc.)

7. Click "Run" to start your application
8. Click "Deploy" to make it publicly available

### Option B: Deploy to Vercel

1. Go to https://vercel.com/
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your repository
5. Configure environment variables in project settings
6. Deploy with one click

### Option C: Deploy to Your Own Server

#### Prerequisites

- A Linux server (Ubuntu 20.04+ recommended)
- Domain name pointing to your server
- Basic terminal access

#### Server Setup

1. Connect to your server via SSH

2. Install Docker and Docker Compose:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. Install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Deploy the Application

1. Clone your repository:

```bash
git clone [your-repo-url] /var/www/m4t
cd /var/www/m4t
```

2. Copy and configure environment:

```bash
cp .env.example .env
nano .env
```

3. Update the `.env` file with production values

4. Start with Docker:

```bash
docker-compose up -d
```

5. Your application will be available on port 3000

#### Set Up SSL Certificate (Optional but Recommended)

1. Install Certbot:

```bash
sudo apt install certbot
```

2. Get SSL certificate:

```bash
sudo certbot certonly --standalone -d yourdomain.com
```

## Part 3: Configuration Guide

### Required Environment Variables

Create a `.env` file with these settings:

```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Security
SESSION_SECRET=your-very-long-random-secret-key-here

# Email (Optional - for email verification)
SENDGRID_API_KEY=your-sendgrid-api-key

# Payments (Optional - for subscriptions)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# PayPal (Optional - alternative payment method)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### Optional Integrations

#### Email Setup (SendGrid)

1. Sign up at https://sendgrid.com/
2. Create an API key
3. Add `SENDGRID_API_KEY` to your `.env` file

#### Payment Setup (Stripe)

1. Sign up at https://stripe.com/
2. Get your API keys from the dashboard
3. Add both secret and public keys to `.env`

#### PayPal Setup

1. Sign up at https://developer.paypal.com/
2. Create an app and get client credentials
3. Add PayPal keys to `.env`

## Part 4: Troubleshooting

### Common Issues

#### "Database connection failed"

- Make sure Docker is running
- Check that PostgreSQL container is running: `docker ps`
- Verify DATABASE_URL in `.env` file

#### "Port 3000 already in use"

- Another application is using port 3000
- Kill the process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Or change the port in your configuration

#### "npm install fails"

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

#### "Database migration errors"

- Reset the database: `docker-compose down -v && docker-compose up -d postgres`
- Wait 30 seconds, then run: `npm run db:push`

### Getting Help

1. Check the application logs in your terminal
2. Verify all environment variables are set correctly
3. Make sure all required services (Docker, PostgreSQL) are running
4. Check that all API keys are valid and active

## Part 5: Maintenance

### Regular Updates

1. Pull latest code: `git pull origin main`
2. Update dependencies: `npm install`
3. Run migrations: `npm run db:push`
4. Restart the application

### Database Backups

1. Create backup:

```bash
docker exec postgres pg_dump -U m4t_user m4t_db > backup.sql
```

2. Restore backup:

```bash
docker exec -i postgres psql -U m4t_user m4t_db < backup.sql
```

### Monitoring

- Check application logs regularly
- Monitor database performance
- Keep dependencies updated
- Regular security updates

## Success Checklist

- [ ] Node.js installed
- [ ] Docker Desktop running
- [ ] Project downloaded and extracted
- [ ] Dependencies installed (`npm install`)
- [ ] Database running (`docker-compose up -d postgres`)
- [ ] Environment variables configured (`.env` file)
- [ ] Database schema created (`npm run db:push`)
- [ ] Application starts successfully (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can login with test accounts
- [ ] All features working as expected

Congratulations! Your M4T learning platform is now running successfully.