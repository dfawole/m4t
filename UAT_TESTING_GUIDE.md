# M4T Learning Platform - UAT Testing Guide

## Quick Setup for Local Testing

### 1. Database Setup & Seeding

After setting up your local environment, run these commands in order:

```bash
# Navigate to the M4T platform directory
cd m4t-learning-platform

# Install dependencies
npm install

# Create database tables
npm run db:push

# Seed database with test data
npm run db:seed

# Start the application
npm run dev
```

### 2. Test Accounts

All test accounts use the password: **password123**

#### Available Test Accounts:

| Role | Username | Email | Description |
|------|----------|-------|-------------|
| Student | `student` | `student@test.com` | Student with Professional subscription |
| Instructor | `instructor` | `instructor@test.com` | Course instructor with content creation access |
| Company Admin | `company_admin` | `admin@techcorp.com` | Company administrator with team management |
| Internal Admin | `admin` | `admin@m4t.com` | Platform administrator with full access |

#### Login Options:
- You can login using either **username** OR **email**
- Both fields accept either format for convenience

### 3. What Gets Created

The seeding script creates:

- **4 verified user accounts** (all roles covered)
- **2 course categories** (Web Development, Data Science)
- **2 sample courses** with modules and lessons
- **3 subscription plans** (Basic, Professional, Team)
- **Active subscriptions** for student and company admin
- **Sample enrollments** and progress tracking
- **1 company** (TechCorp Solutions)

### 4. Testing Scenarios

#### Student Testing (`student` / `student@test.com`)
- Browse available courses
- Enroll in courses (already enrolled in sample courses)
- Watch video lessons
- Track learning progress
- Access Professional subscription features

#### Instructor Testing (`instructor` / `instructor@test.com`)
- Access instructor dashboard
- View created courses
- Manage course content
- Monitor student progress
- Access instructor analytics

#### Company Admin Testing (`company_admin` / `admin@techcorp.com`)
- Access company dashboard
- Manage team members
- View company analytics
- Access Team subscription features
- Monitor team learning progress

#### Internal Admin Testing (`admin` / `admin@m4t.com`)
- Access full platform administration
- Manage all users and content
- View platform-wide analytics
- Configure system settings
- Monitor platform health

### 5. Key Features to Test

#### Authentication System
- Login with username or email
- Password visibility toggle
- Email verification status
- Role-based access control
- Session management

#### Course Management
- Course browsing and filtering
- Course enrollment process
- Video playback functionality
- Progress tracking
- Module and lesson navigation

#### Subscription System
- Subscription plan comparison
- Payment processing (test mode)
- Subscription status checking
- Feature access based on plan
- Subscription renewal

#### User Experience
- Responsive design (mobile/tablet/desktop)
- Navigation and sidebar functionality
- Loading states and animations
- Error handling and messaging
- Accessibility features

### 6. Common Issues & Solutions

#### Login Issues
- **Problem**: Cannot login with test accounts
- **Solution**: Ensure database seeding completed successfully
- **Check**: Run `npm run db:seed` again if needed

#### Course Data Issues
- **Problem**: Courses not displaying properly
- **Solution**: Verify database connection and seeding
- **Check**: Console logs for any API errors

#### Subscription Issues
- **Problem**: Subscription features not accessible
- **Solution**: Check user subscription status in database
- **Check**: Verify subscription plan assignments

### 7. Development vs Production Differences

#### Local Development
- Uses local PostgreSQL database
- Test payment processors (Stripe/PayPal test mode)
- Debug logging enabled
- Hot reload for development

#### Production Environment
- Uses production database
- Live payment processing
- Optimized builds
- Enhanced security measures

### 8. Browser Compatibility

Tested and supported browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 9. Mobile Testing

The platform is fully responsive. Test on:
- Mobile phones (320px - 767px)
- Tablets (768px - 1023px)
- Desktop (1024px+)

### 10. API Testing

For advanced testing, you can use these API endpoints:

```bash
# Check user authentication
GET /api/auth/user

# Get courses list
GET /api/courses

# Get course details
GET /api/courses/:id

# Get user enrollments
GET /api/enrollments/user
```

### 11. Troubleshooting

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Verify database connection in server logs
3. Ensure all environment variables are set
4. Restart the development server
5. Clear browser cache and cookies

### 12. Support

For technical issues during UAT testing:
- Check server logs for detailed error messages
- Verify database connection and seeding
- Ensure all dependencies are installed
- Contact development team with specific error details

## Test Credentials Summary

**Remember: All accounts use password `password123`**

- **Student**: `student` or `student@test.com`
- **Instructor**: `instructor` or `instructor@test.com`  
- **Company Admin**: `company_admin` or `admin@techcorp.com`
- **Admin**: `admin` or `admin@m4t.com`

Start your testing with the student account to explore the learning experience, then test the other roles to verify administrative and management functions.