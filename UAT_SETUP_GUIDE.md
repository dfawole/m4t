# M4T Learning Platform - UAT Setup Guide

## 🚀 Quick Start for UAT Testing

This guide provides complete setup instructions for the M4T Learning Platform UAT environment, including all the latest authentication improvements and test data.

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ database
- **Docker** (optional, for containerized deployment)
- **Git** for version control

## 🛠️ Installation Steps

### 1. Extract and Setup Project

```bash
# Extract the ZIP file
unzip m4t-final-uat-package.zip
cd m4t-final-uat-package

# Install dependencies
npm install
```

### 2. Database Configuration

#### Option A: Local PostgreSQL

```bash
# Create database
createdb m4t_uat

# Set environment variables
cp .env.example .env
```

Edit `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/m4t_uat
NODE_ENV=development
PORT=3001
SESSION_SECRET=your-super-secret-session-key-for-uat
```

#### Option B: Docker PostgreSQL

```bash
# Using Docker Compose (recommended for UAT)
docker-compose up -d postgres

# Database will be available at:
# postgresql://m4t_user:m4t_password@localhost:5432/m4t_database
```

### 3. Database Schema Setup

```bash
# Push database schema (updates tables without losing data)
npm run db:push

# Seed complete UAT test data
npm run seed:complete
```

### 4. Start Application

#### Development Mode

```bash
npm run dev
```

#### Docker Mode (Production-like)

```bash
# Build and run with Docker
docker-compose up --build
```

Application will be available at: `http://localhost:3001`

## 👥 Test Accounts

**All test accounts use password: `password123`**

### Student Accounts

| Email | Name | Purpose |
|-------|------|---------|
| `student@test.com` | Alex Johnson | Primary student test account |
| `demo@example.com` | Demo User | Quick demo account for testing |
| `emily.davis@example.com` | Emily Davis | Additional student for enrollment testing |

### Instructor Accounts

| Email | Name | Purpose |
|-------|------|---------|
| `instructor@test.com` | Sarah Martinez | Primary instructor account |
| `robert.wilson@example.com` | Robert Wilson | Additional instructor for course creation |

### Company Admin Accounts

| Email | Name | Company | Purpose |
|-------|------|---------|---------|
| `admin@techcorp.com` | Michael Chen | TechCorp Solutions | Company license management |
| `maria.garcia@innovate.com` | Maria Garcia | Innovate Inc | Enterprise account testing |

### Platform Admin Account

| Email | Name | Role |
|-------|------|------|
| `admin@m4t.com` | Jordan Smith | Full platform administrator |

## 🏢 Company License Management Testing

### Pre-configured Test Companies

#### TechCorp Solutions (Company ID: 1)

- __Admin:__ `company_admin` / `company123`
- **Subscription:** Professional Plan (50 licenses)
- **Active Licenses:** 25 created, 10 assigned
- **Available Licenses:** 15 unassigned

#### Innovate Inc (Company ID: 2)

- __Admin:__ `enterprise_admin` / `enterprise123`
- **Subscription:** Enterprise Plan (100 licenses)
- **Active Licenses:** 50 created, 30 assigned
- **Available Licenses:** 20 unassigned

### License Management Test Scenarios

#### Scenario 1: Assign License

1. Login as `company_admin`
2. Go to Company Dashboard → License Management
3. Click "Assign License" on any available license
4. Select a user from the dropdown
5. Confirm assignment

#### Scenario 2: Revoke License

1. In License Management tab
2. Find an assigned license
3. Click "Revoke License"
4. Confirm revocation

#### Scenario 3: Create New Licenses

1. Go to License Management → Create Licenses
2. Enter quantity (e.g., 10)
3. Click "Create Licenses"
4. Verify new licenses appear in Available tab

#### Scenario 4: Bulk Operations

1. Select multiple licenses using checkboxes
2. Use bulk assign/revoke actions
3. Verify operations complete successfully

## 🔐 Authentication Testing

### Recent Authentication Improvements

The system includes several authentication enhancements:

#### Test Login Methods

1. **Email Login:** `student@test.com` + `password123`
2. **Password Visibility:** Click eye icon to show/hide password
3. **Dashboard Access:** Authentication now properly persists after login
4. **Cache Invalidation:** Login process refreshes user data correctly

#### Test Authentication Flows

1. **Cookie Persistence:** Improved cookie handling with proper path settings
2. **Token Management:** Both JWT tokens and session cookies supported
3. **Logout:** Clears authentication state properly

## 📚 Free Lessons Feature

### Testing Free Content Access

1. **Without Login:** Browse courses and access first 2 lessons of any course
2. **Course Preview:** First two lessons marked as "Free Preview"
3. **Enrollment Required:** Lessons 3+ require subscription or enrollment
4. **Mixed Access:** Free users can progress through preview content

### Role-Based Access Testing

#### Student Dashboard Access

- Login as student → Should access `/dashboard`
- Try accessing `/admin` → Should see "Access Denied"

#### Company Admin Access

- Login as company admin → Should access `/company-dashboard`
- Try accessing `/admin` → Should see "Access Denied"

#### Internal Admin Access

- Login as admin → Should access `/admin`
- Should have full platform access

## 📊 Feature Testing Checklist

### Core Learning Features

- [ ] Course enrollment and access
- [ ] Video playback with interactive features
- [ ] Quiz completion and scoring
- [ ] Progress tracking
- [ ] Certificate generation

### Gamification Features

- [ ] Points earning system
- [ ] Badge achievements
- [ ] Leaderboard functionality
- [ ] Daily/weekly challenges
- [ ] Streak tracking

### Payment Processing

- [ ] Stripe subscription creation
- [ ] PayPal payment processing
- [ ] License purchase workflows
- [ ] Subscription management

### Enterprise Features

- [ ] Company onboarding workflow
- [ ] License assignment/revocation
- [ ] User management
- [ ] Analytics and reporting

### Accessibility Features

- [ ] Voice navigation commands
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] High contrast mode

## 🐛 Common UAT Issues and Solutions

### Database Connection Issues

```bash
# Check database status
npm run db:check

# Reset database if needed
npm run db:reset
npm run seed:uat
```

### Authentication Problems

```bash
# Clear browser cookies and localStorage
# Restart the application
npm run dev
```

### License Assignment Failures

- Verify company admin has correct company association
- Check subscription plan has available licenses
- Ensure target user exists in system

### Port Conflicts

```bash
# Change port in .env file
PORT=3002

# Or kill existing processes
pkill -f "node.*3001"
```

## 📈 Performance Testing

### Load Testing Scenarios

1. **Concurrent Users:** 50+ simultaneous logins
2. **Video Streaming:** Multiple users watching videos
3. **License Operations:** Bulk license assignments
4. **Database Queries:** Heavy reporting operations

### Performance Benchmarks

- **Page Load Time:** < 2 seconds
- **API Response Time:** < 500ms
- **Video Startup:** < 3 seconds
- **Login Process:** < 1 second

## 🔄 UAT Data Reset

To reset UAT environment with fresh test data:

```bash
# Reset database and reseed
npm run db:reset
npm run seed:uat

# Clear application cache
rm -rf node_modules/.cache
npm run dev
```

## 📞 UAT Support

For UAT testing support:

- **Technical Issues:** Check console logs and browser developer tools
- **Test Data:** Use the provided test accounts and scenarios
- **Feature Questions:** Refer to feature documentation in TECHNICAL.md

## ✅ UAT Sign-off Criteria

Before production deployment, verify:

- [ ] All test accounts can login successfully
- [ ] Role-based access controls work correctly
- [ ] License management operations complete without errors
- [ ] Payment processing (with test cards) functions properly
- [ ] All core learning features are accessible
- [ ] Gamification system awards points and badges correctly
- [ ] Performance meets benchmark requirements
- [ ] Security audit passes
- [ ] Accessibility compliance verified

---

**Ready for Production:** Once all UAT criteria are met, the application is ready for production deployment using the production deployment guide.