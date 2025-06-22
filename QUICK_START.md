# M4T Learning Platform - Quick Start

## 🎯 Get Running in 5 Minutes

### Step 1: Install Required Software
1. **Node.js**: Download from https://nodejs.org (choose LTS version)
2. **Docker Desktop**: Download from https://docker.com/products/docker-desktop

### Step 2: Start the Platform
```bash
# Open terminal in this folder and run:
npm install
docker-compose up -d postgres
npm run db:push
npm run dev
```

### Step 3: Access Your Platform
- Open browser: http://localhost:3000
- Login with: `student` / `student123`

### Step 4: Customize & Deploy
1. Edit `.env` file for your settings
2. See `DEPLOYMENT_GUIDE.md` for going live
3. Customize branding in the client folder

## 🆘 Need Help?
- Check `SETUP_GUIDE.md` for detailed instructions
- All documentation is included in this package
- No technical experience required!

Your learning platform is ready! 🎓
