# API Testing Guide - M4T Learning Platform

## Overview
This guide provides comprehensive testing procedures for all API endpoints in the M4T Learning Platform.

## Authentication Endpoints

### POST /api/register
**Purpose:** Create new user account
**Test Data:**
```json
{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "securepassword123",
  "role": "student"
}
```
**Expected Response:** 201 Created with user data

### POST /api/login
**Purpose:** User authentication
**Test Data:**
```json
{
  "username": "student1",
  "password": "password123"
}
```
**Expected Response:** 200 OK with authentication token

### GET /api/user
**Purpose:** Get current user profile
**Headers:** Authorization required
**Expected Response:** User profile data

## Course Management Endpoints

### GET /api/courses
**Purpose:** Retrieve all available courses
**Expected Response:** Array of course objects with metadata

### GET /api/courses/:id
**Purpose:** Get specific course details
**Parameters:** Course ID
**Expected Response:** Complete course data including modules and lessons

### POST /api/courses/:id/enroll
**Purpose:** Enroll user in course
**Headers:** Authentication required
**Expected Response:** Enrollment confirmation

## Quiz System Endpoints

### GET /api/quizzes/lesson/:lessonId
**Purpose:** Get quiz questions for specific lesson
**Parameters:** Lesson ID
**Expected Response:** Quiz questions with options

### POST /api/quiz-attempts
**Purpose:** Submit quiz answers
**Test Data:**
```json
{
  "quizId": 1,
  "answers": [
    {"questionId": 1, "selectedAnswer": "A"},
    {"questionId": 2, "selectedAnswer": "C"}
  ]
}
```
**Expected Response:** Quiz results with score

## Payment Integration Endpoints

### POST /api/create-payment-intent
**Purpose:** Initialize Stripe payment
**Test Data:**
```json
{
  "amount": 2999,
  "currency": "usd",
  "courseId": 1
}
```
**Expected Response:** Payment intent with client secret

### POST /api/paypal/order
**Purpose:** Create PayPal order
**Test Data:**
```json
{
  "amount": "29.99",
  "currency": "USD",
  "intent": "CAPTURE"
}
```
**Expected Response:** PayPal order ID

## Subscription Management

### GET /api/subscriptions/plans
**Purpose:** Get available subscription plans
**Expected Response:** Array of subscription plans

### POST /api/subscriptions/create
**Purpose:** Create user subscription
**Test Data:**
```json
{
  "planId": 1,
  "paymentMethodId": "pm_test_123"
}
```
**Expected Response:** Subscription details

## Testing Procedures

### 1. Authentication Flow Testing
1. Register new user
2. Verify email confirmation
3. Login with credentials
4. Access protected endpoints
5. Test token expiration

### 2. Course Enrollment Testing
1. Browse available courses
2. View course details
3. Enroll in course
4. Access course content
5. Track progress

### 3. Quiz System Testing
1. Start lesson with quiz
2. Answer quiz questions
3. Submit responses
4. View results and explanations
5. Verify progress tracking

### 4. Payment Processing Testing
1. Select course for purchase
2. Choose payment method
3. Complete payment flow
4. Verify enrollment activation
5. Test subscription billing

## Error Scenarios to Test

### Authentication Errors
- Invalid credentials
- Expired tokens
- Missing authorization headers
- Rate limiting

### Validation Errors
- Invalid input data
- Missing required fields
- Data type mismatches
- Constraint violations

### Business Logic Errors
- Duplicate enrollments
- Insufficient permissions
- Payment failures
- Subscription conflicts

## Load Testing Considerations

### High Traffic Scenarios
- Multiple concurrent logins
- Simultaneous course enrollments
- Bulk quiz submissions
- Payment processing under load

### Performance Metrics
- Response times under 200ms for GET requests
- Payment processing under 3 seconds
- Quiz submission under 1 second
- Video streaming latency minimal

## Security Testing

### Input Validation
- SQL injection attempts
- XSS payload testing
- File upload restrictions
- Rate limiting effectiveness

### Authentication Security
- Password strength enforcement
- Session management
- CORS policy validation
- API key protection

## Test Data Management

### Database Seeding
Use the provided seed script to create consistent test data:
```bash
npm run db:seed
```

### Test User Accounts
- Student: student1 / password123
- Instructor: instructor1 / password123  
- Admin: admin1 / password123

### Sample Course Data
The seed script creates courses in:
- JavaScript Programming
- React Development
- Node.js Backend
- Database Design

## Monitoring and Logging

### Key Metrics to Monitor
- API response times
- Error rates by endpoint
- User authentication success rates
- Payment completion rates
- Quiz completion statistics

### Log Analysis
- Check server logs for errors
- Monitor database query performance
- Track user behavior patterns
- Identify bottlenecks

## Troubleshooting Common Issues

### Database Connection Errors
- Verify PostgreSQL is running
- Check connection string in .env
- Ensure database exists
- Validate user permissions

### Payment Integration Issues
- Verify Stripe/PayPal API keys
- Check webhook configurations
- Test in sandbox mode first
- Monitor payment provider dashboards

### Authentication Problems
- Check JWT secret configuration
- Verify session storage
- Test token generation/validation
- Monitor login attempt logs