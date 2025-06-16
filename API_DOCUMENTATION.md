# M4T Learning Platform - API Documentation

## Base URL
```
Production: https://your-app-name.railway.app
Development: http://localhost:5000
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this consistent format:
```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "error": string | null
}
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student" | "instructor" | "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "student",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token-string"
  },
  "message": "User registered successfully"
}
```

### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "student",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatarUrl": "https://example.com/avatar.jpg"
      }
    },
    "token": "jwt-token-string"
  },
  "message": "Login successful"
}
```

### POST /api/auth/refresh
Refresh JWT token.

**Headers:**
```
Authorization: Bearer <current-token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token-string"
  }
}
```

### POST /api/auth/logout
Invalidate current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Management Endpoints

### GET /api/users/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Learning enthusiast",
      "avatarUrl": "https://example.com/avatar.jpg",
      "preferences": {
        "language": "en",
        "timezone": "UTC",
        "emailNotifications": true
      }
    },
    "stats": {
      "coursesEnrolled": 5,
      "coursesCompleted": 2,
      "totalPoints": 1500,
      "currentLevel": 3
    }
  }
}
```

### PUT /api/users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio text",
  "preferences": {
    "language": "en",
    "timezone": "America/New_York",
    "emailNotifications": false
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": "updated-profile-object"
  },
  "message": "Profile updated successfully"
}
```

### POST /api/users/upload-avatar
Upload user avatar image.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
Form data with 'avatar' file field
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://example.com/uploads/avatar-uuid.jpg"
  },
  "message": "Avatar uploaded successfully"
}
```

## Course Management Endpoints

### GET /api/courses
Get list of courses with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty level
- `instructor` (string): Filter by instructor ID
- `search` (string): Search in title and description
- `sortBy` (string): Sort field (title, price, rating, created_at)
- `sortOrder` (string): asc or desc

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Introduction to JavaScript",
        "description": "Learn JavaScript fundamentals",
        "instructor": {
          "id": "uuid",
          "name": "Jane Smith",
          "avatarUrl": "https://example.com/instructor.jpg"
        },
        "price": 99.99,
        "currency": "USD",
        "difficulty": "beginner",
        "category": "programming",
        "duration": "10 hours",
        "rating": 4.8,
        "enrollmentCount": 1250,
        "thumbnailUrl": "https://example.com/course-thumb.jpg",
        "tags": ["javascript", "web-development", "programming"],
        "createdAt": "2023-01-15T10:30:00Z",
        "updatedAt": "2023-06-01T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### GET /api/courses/:id
Get detailed course information.

**Parameters:**
- `id` (string): Course UUID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Introduction to JavaScript",
    "description": "Comprehensive JavaScript course...",
    "instructor": {
      "id": "uuid",
      "name": "Jane Smith",
      "bio": "Senior Developer with 10 years experience",
      "avatarUrl": "https://example.com/instructor.jpg",
      "rating": 4.9,
      "totalCourses": 15
    },
    "price": 99.99,
    "currency": "USD",
    "difficulty": "beginner",
    "category": "programming",
    "duration": "10 hours",
    "rating": 4.8,
    "enrollmentCount": 1250,
    "thumbnailUrl": "https://example.com/course-thumb.jpg",
    "previewVideoUrl": "https://example.com/preview.mp4",
    "modules": [
      {
        "id": "uuid",
        "title": "Getting Started",
        "description": "Introduction and setup",
        "orderIndex": 1,
        "duration": "45 minutes",
        "lessons": [
          {
            "id": "uuid",
            "title": "What is JavaScript?",
            "type": "video",
            "duration": "15 minutes",
            "isFree": true
          }
        ]
      }
    ],
    "prerequisites": ["Basic HTML knowledge"],
    "learningOutcomes": [
      "Understand JavaScript fundamentals",
      "Build interactive web applications"
    ],
    "tags": ["javascript", "web-development"],
    "reviews": {
      "average": 4.8,
      "count": 523,
      "distribution": {
        "5": 340,
        "4": 120,
        "3": 45,
        "2": 12,
        "1": 6
      }
    },
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-06-01T14:20:00Z"
  }
}
```

### POST /api/courses
Create a new course (Instructor only).

**Headers:**
```
Authorization: Bearer <instructor-token>
```

**Request Body:**
```json
{
  "title": "Advanced React Patterns",
  "description": "Learn advanced React development patterns",
  "price": 149.99,
  "currency": "USD",
  "difficulty": "advanced",
  "category": "programming",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "previewVideoUrl": "https://example.com/preview.mp4",
  "prerequisites": ["React fundamentals", "JavaScript ES6+"],
  "learningOutcomes": [
    "Master advanced React patterns",
    "Implement complex state management"
  ],
  "tags": ["react", "javascript", "frontend"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "course": "created-course-object"
  },
  "message": "Course created successfully"
}
```

### PUT /api/courses/:id
Update course information (Instructor/Admin only).

**Parameters:**
- `id` (string): Course UUID

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "price": 129.99
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "course": "updated-course-object"
  },
  "message": "Course updated successfully"
}
```

### DELETE /api/courses/:id
Delete a course (Instructor/Admin only).

**Parameters:**
- `id` (string): Course UUID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

## Enrollment Endpoints

### POST /api/courses/:id/enroll
Enroll in a course.

**Parameters:**
- `id` (string): Course UUID

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "paymentMethodId": "stripe-payment-method-id"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "uuid",
      "userId": "uuid",
      "courseId": "uuid",
      "enrolledAt": "2023-06-15T10:30:00Z",
      "progress": 0,
      "status": "active"
    },
    "payment": {
      "id": "uuid",
      "amount": 99.99,
      "currency": "USD",
      "status": "completed",
      "stripePaymentId": "pi_stripe_id"
    }
  },
  "message": "Successfully enrolled in course"
}
```

### GET /api/enrollments
Get user's course enrollments.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string): Filter by enrollment status (active, completed, paused)
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "uuid",
        "course": {
          "id": "uuid",
          "title": "JavaScript Fundamentals",
          "thumbnailUrl": "https://example.com/thumb.jpg",
          "instructor": {
            "name": "Jane Smith"
          }
        },
        "enrolledAt": "2023-06-15T10:30:00Z",
        "progress": 65,
        "completedAt": null,
        "status": "active",
        "lastAccessedAt": "2023-06-20T15:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### GET /api/enrollments/:id/progress
Get detailed progress for an enrollment.

**Parameters:**
- `id` (string): Enrollment UUID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": "uuid",
      "courseId": "uuid",
      "progress": 65,
      "status": "active"
    },
    "moduleProgress": [
      {
        "moduleId": "uuid",
        "title": "Getting Started",
        "completed": true,
        "completedAt": "2023-06-16T14:30:00Z",
        "lessons": [
          {
            "lessonId": "uuid",
            "title": "Introduction",
            "completed": true,
            "completedAt": "2023-06-16T14:30:00Z",
            "timeSpent": 900
          }
        ]
      }
    ],
    "timeSpent": 7200,
    "certificateEligible": false
  }
}
```

## Payment Endpoints

### POST /api/payments/create-intent
Create payment intent for course purchase.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "courseId": "uuid",
  "currency": "USD"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_stripe_client_secret",
    "amount": 9999,
    "currency": "USD"
  }
}
```

### POST /api/payments/confirm
Confirm payment completion.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "paymentIntentId": "pi_stripe_payment_intent_id",
  "courseId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "uuid",
      "amount": 99.99,
      "status": "completed",
      "receipt": "https://stripe.com/receipt-url"
    },
    "enrollment": {
      "id": "uuid",
      "status": "active"
    }
  },
  "message": "Payment confirmed and enrollment activated"
}
```

### GET /api/payments/history
Get payment history for user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "uuid",
        "amount": 99.99,
        "currency": "USD",
        "status": "completed",
        "course": {
          "id": "uuid",
          "title": "JavaScript Fundamentals"
        },
        "createdAt": "2023-06-15T10:30:00Z",
        "receiptUrl": "https://stripe.com/receipt-url"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

## Subscription Endpoints

### GET /api/subscriptions
Get user's subscriptions.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "uuid",
        "planType": "premium",
        "status": "active",
        "currentPeriodStart": "2023-06-01T00:00:00Z",
        "currentPeriodEnd": "2023-07-01T00:00:00Z",
        "cancelAtPeriodEnd": false,
        "stripeSubscriptionId": "sub_stripe_id"
      }
    ]
  }
}
```

### POST /api/subscriptions/create
Create new subscription.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "planType": "premium",
  "paymentMethodId": "pm_stripe_payment_method_id"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "uuid",
      "planType": "premium",
      "status": "active",
      "stripeSubscriptionId": "sub_stripe_id"
    }
  },
  "message": "Subscription created successfully"
}
```

### PUT /api/subscriptions/:id/cancel
Cancel subscription.

**Parameters:**
- `id` (string): Subscription UUID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "uuid",
      "status": "canceled",
      "canceledAt": "2023-06-20T15:30:00Z"
    }
  },
  "message": "Subscription canceled successfully"
}
```

## Gamification Endpoints

### GET /api/achievements
Get user achievements.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "uuid",
        "title": "First Course Complete",
        "description": "Complete your first course",
        "badgeIcon": "🏆",
        "points": 100,
        "earnedAt": "2023-06-16T14:30:00Z",
        "progress": 100
      }
    ],
    "totalPoints": 1500,
    "currentLevel": 3,
    "nextLevelPoints": 2000
  }
}
```

### POST /api/achievements/claim
Claim an achievement.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "achievementId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "achievement": {
      "id": "uuid",
      "title": "Course Completion",
      "points": 100,
      "earnedAt": "2023-06-20T15:30:00Z"
    },
    "newTotalPoints": 1600,
    "levelUp": false
  },
  "message": "Achievement claimed successfully"
}
```

### GET /api/leaderboard
Get leaderboard rankings.

**Query Parameters:**
- `timeframe` (string): weekly, monthly, all-time (default: weekly)
- `limit` (number): Number of results (default: 50)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "avatarUrl": "https://example.com/avatar.jpg"
        },
        "points": 2500,
        "level": 5,
        "coursesCompleted": 8
      }
    ],
    "userRank": {
      "rank": 15,
      "points": 1500,
      "level": 3
    }
  }
}
```

### GET /api/challenges
Get active challenges.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "uuid",
        "title": "7-Day Learning Streak",
        "description": "Complete lessons for 7 consecutive days",
        "points": 200,
        "startDate": "2023-06-01T00:00:00Z",
        "endDate": "2023-06-30T23:59:59Z",
        "userProgress": {
          "currentStreak": 3,
          "completed": false,
          "progress": 43
        }
      }
    ]
  }
}
```

## Analytics Endpoints

### GET /api/analytics/dashboard
Get user learning analytics dashboard.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `timeframe` (string): 7d, 30d, 90d, 1y (default: 30d)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCourses": 5,
      "completedCourses": 2,
      "totalHours": 45.5,
      "averageCompletionRate": 68
    },
    "weeklyActivity": [
      {
        "date": "2023-06-12",
        "hours": 2.5,
        "coursesAccessed": 2
      }
    ],
    "subjectBreakdown": [
      {
        "category": "Programming",
        "hours": 25.5,
        "percentage": 56
      }
    ],
    "achievements": {
      "totalEarned": 8,
      "totalPoints": 1500,
      "recentAchievements": []
    }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "message": "Please provide a valid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "message": "The requested course does not exist"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 10 requests per 15 minutes per IP
- **File upload endpoints**: 5 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

## Webhooks

### Stripe Webhooks
The platform handles the following Stripe webhook events:

**Endpoint**: `/api/webhooks/stripe`

**Events:**
- `payment_intent.succeeded`
- `invoice.payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Security**: All webhooks are verified using Stripe's signature verification.

## SDK Examples

### JavaScript/TypeScript
```javascript
// Initialize API client
const api = axios.create({
  baseURL: 'https://your-app.railway.app/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Enroll in course
const enrollInCourse = async (courseId, paymentMethodId) => {
  try {
    const response = await api.post(`/courses/${courseId}/enroll`, {
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    console.error('Enrollment failed:', error.response.data);
    throw error;
  }
};

// Get course progress
const getCourseProgress = async (enrollmentId) => {
  const response = await api.get(`/enrollments/${enrollmentId}/progress`);
  return response.data;
};
```

### cURL Examples
```bash
# Login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get courses
curl -X GET "https://your-app.railway.app/api/courses?category=programming&limit=10" \
  -H "Authorization: Bearer your-jwt-token"

# Enroll in course
curl -X POST https://your-app.railway.app/api/courses/course-uuid/enroll \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId":"pm_stripe_id"}'
```

This comprehensive API documentation covers all major endpoints and provides clear examples for integration with the M4T Learning Platform.