# M4T Learning Platform - Database Seeding Guide

## Overview

This guide explains how to populate your M4T learning platform with realistic course content, users, and test data for development and demonstration purposes.

## Available Seeding Scripts

### 1. Comprehensive Seed (`npm run db:seed`)
**File:** `server/seed-working.ts`

Creates a complete learning platform with:
- 7 verified user accounts (student, instructor, company admin, internal admin + 3 additional students)
- 3 detailed courses with modular structure:
  - Complete Web Development Bootcamp (40 hours)
  - Data Science with Python (35 hours) 
  - Digital Marketing Strategy (25 hours)
- Course categories and proper organization
- Realistic enrollments and progress tracking
- Subscription plans and user subscriptions
- Company data for enterprise features

**All users have email verification set to TRUE**

### 2. Quick Seed (`npm run db:seed-quick`)
**File:** `server/quick-seed.ts`

Creates minimal test data for rapid development:
- 4 basic user accounts with verified emails
- 1 sample course with lessons
- Basic subscription plan
- Sample enrollment data

## Usage Instructions

### Initial Setup
```bash
# Navigate to M4T learning platform directory
cd m4t-learning-platform

# Install dependencies
npm install

# Setup database schema and seed with full data
npm run setup
```

### Individual Commands
```bash
# Push database schema only
npm run db:push

# Run comprehensive seeding
npm run db:seed

# Run quick seeding for development
npm run db:seed-quick

# Reset database and reseed with full data
npm run db:reset
```

## Test User Accounts

After running either seeding script, you can log in with these accounts:

### Basic Accounts (Available in both scripts)
- **Student:** `student` / `password123`
- **Instructor:** `instructor` / `password123` 
- **Company Admin:** `company` / `password123`
- **Internal Admin:** `admin` / `password123`

### Additional Student Accounts (Comprehensive seed only)
- **Emily Davis:** `emily_student` / `password123`
- **Robert Wilson:** `robert_student` / `password123`
- **Maria Garcia:** `maria_student` / `password123`

**Important:** All test accounts have email verification set to `true` and can log in immediately.

## Course Content Structure

### Course Categories
- Web Development
- Data Science  
- Marketing
- Design
- Business
- Technology

### Sample Courses (Comprehensive seed)

**1. Complete Web Development Bootcamp**
- Level: Beginner
- Duration: 40 hours
- Modules: Frontend Fundamentals, React Development, Backend Development
- 8 detailed lessons covering HTML, CSS, JavaScript, React, Node.js

**2. Data Science with Python**
- Level: Intermediate
- Duration: 35 hours
- Modules: Python for Data Science, Data Analysis, Machine Learning
- 6 lessons covering Python, pandas, statistics, ML algorithms

**3. Digital Marketing Strategy**
- Level: Beginner  
- Duration: 25 hours
- Modules: Marketing Fundamentals, Organic Marketing, Paid Marketing
- 6 lessons covering SEO, content marketing, advertising

## Subscription Plans

### Basic Plan
- Price: $9.99/month
- Features: Access to basic courses, progress tracking, community access

### Professional Plan  
- Price: $19.99/month
- Features: Access to all courses, advanced analytics, priority support, certificates

## Database Structure

The seeding scripts populate these main tables:
- `users` - User accounts with authentication and preferences
- `companies` - Enterprise customer organizations
- `categories` - Course categorization system
- `courses` - Course metadata and structure
- `modules` - Course module organization
- `lessons` - Individual learning content
- `enrollments` - User course registrations with progress
- `subscription_plans` - Available subscription tiers
- `user_subscriptions` - Active user subscriptions

## Customizing Seed Data

### Adding More Courses
Edit the `courseData` array in `server/seed-working.ts`:

```typescript
const courseData = [
  {
    title: "Your Course Title",
    description: "Detailed course description",
    category: "Your Category", 
    level: "beginner|intermediate|advanced",
    duration: 1800, // minutes
    modules: [
      {
        title: "Module 1",
        lessons: [
          { title: "Lesson 1", content: "Lesson content", duration: 45 }
        ]
      }
    ]
  }
];
```

### Adding More Users
Edit the `userProfiles` array in `server/seed-working.ts`:

```typescript
{ 
  username: "newuser", 
  email: "user@example.com", 
  firstName: "First", 
  lastName: "Last", 
  role: "student|instructor|company_admin|internal_admin",
  isEmailVerified: true
}
```

## Troubleshooting

### Common Issues

**Permission Errors**
- Ensure your database user has proper permissions
- Check DATABASE_URL environment variable

**Import Errors**
- Verify all dependencies are installed: `npm install`
- Check that database schema is current: `npm run db:push`

**Seeding Failures**
- Clear existing data: `npm run db:reset`
- Check database connection and credentials
- Review error logs for specific table issues

### Environment Requirements
- Node.js 16+ 
- PostgreSQL database
- Proper DATABASE_URL configuration
- All M4T dependencies installed

## Production Considerations

**Do not run seeding scripts in production environments.**

For production deployments:
1. Use proper user registration flows
2. Import real course content through admin interfaces
3. Set up proper email verification systems
4. Configure production payment processing

The seeding scripts are designed for development, testing, and demonstration purposes only.