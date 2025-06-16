# GitHub Repository Setup

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click "+" icon → "New repository"
3. Repository name: `m4t-learning-platform`
4. Description: `AI-powered health and wellness learning platform with gamification and course management`
5. Set to Public (for free deployments) or Private
6. Do NOT initialize with README, .gitignore, or license (we have files already)
7. Click "Create repository"

## Step 2: Push Your Code

Run these commands in your project directory:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit with message
git commit -m "Initial commit: M4T Learning Platform with Railway, Vercel, Heroku deployment configs"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/m4t-learning-platform.git

# Push to GitHub
git push -u origin main
```

If you get a branch error, try:
```bash
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

Check that these files are in your GitHub repository:
- All deployment guides (deploy-railway.md, deploy-vercel.md, deploy-heroku.md)
- Configuration files (vercel.json, railway.json, Procfile)
- Environment template (.env.example)
- README.md with project information
- Complete source code (server/, client/, shared/)

## Step 4: Ready for Deployment

Once pushed to GitHub, you can immediately deploy to:

**Railway**: Connect repository at https://railway.app
**Vercel**: Run `vercel` command or connect via dashboard
**Heroku**: Run `heroku create` and `git push heroku main`

## Troubleshooting

If git push fails:
```bash
# Check remote URL
git remote -v

# Remove and re-add remote if needed
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/m4t-learning-platform.git
```

Your repository URL will be:
`https://github.com/YOUR_USERNAME/m4t-learning-platform`