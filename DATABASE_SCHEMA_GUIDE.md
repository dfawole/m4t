# Database Schema Guide - M4T Learning Platform

## Overview
This document provides a comprehensive overview of the M4T Learning Platform database schema, relationships, and data management procedures.

## Core Tables Structure

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE,
  password VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'student',
  firstName VARCHAR,
  lastName VARCHAR,
  profileImage VARCHAR,
  companyId INTEGER REFERENCES companies(id),
  emailVerified BOOLEAN DEFAULT false,
  emailVerificationToken VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**
- Belongs to one company (optional)
- Has many enrollments
- Has many quiz attempts
- Has many user subscriptions

### Courses Table
```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  coverImage VARCHAR,
  duration INTEGER,
  level VARCHAR,
  categoryId INTEGER REFERENCES categories(id),
  instructorId VARCHAR REFERENCES users(id),
  rating VARCHAR,
  price DECIMAL(10,2),
  learningStyles TEXT[],
  prerequisites TEXT[],
  learningOutcomes TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**
- Belongs to one category
- Belongs to one instructor (user)
- Has many modules
- Has many enrollments

### Modules Table
```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  courseId INTEGER REFERENCES courses(id),
  orderIndex INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**
- Belongs to one course
- Has many lessons

### Lessons Table
```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT,
  moduleId INTEGER REFERENCES modules(id),
  videoUrl VARCHAR,
  orderIndex INTEGER NOT NULL,
  duration INTEGER,
  isPreview BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**
- Belongs to one module
- Has many lesson completions
- Has many quizzes

### Quiz System Tables

#### Quizzes Table
```sql
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  lessonId INTEGER REFERENCES lessons(id),
  title VARCHAR NOT NULL,
  description TEXT,
  timeLimit INTEGER,
  passingScore INTEGER DEFAULT 70,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Quiz Questions Table
```sql
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  quizId INTEGER REFERENCES quizzes(id),
  questionText TEXT NOT NULL,
  questionType VARCHAR DEFAULT 'multiple_choice',
  points INTEGER DEFAULT 1,
  orderIndex INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Quiz Answers Table
```sql
CREATE TABLE quiz_answers (
  id SERIAL PRIMARY KEY,
  questionId INTEGER REFERENCES quiz_questions(id),
  answerText TEXT NOT NULL,
  isCorrect BOOLEAN DEFAULT false,
  explanation TEXT,
  orderIndex INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Enrollment and Progress Tracking

#### Enrollments Table
```sql
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id),
  courseId INTEGER REFERENCES courses(id),
  enrolledAt TIMESTAMP DEFAULT NOW(),
  completedAt TIMESTAMP,
  UNIQUE(userId, courseId)
);
```

#### Lesson Completions Table
```sql
CREATE TABLE lesson_completions (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id),
  lessonId INTEGER REFERENCES lessons(id),
  enrollmentId INTEGER REFERENCES enrollments(id),
  completedAt TIMESTAMP DEFAULT NOW(),
  timeSpent INTEGER,
  UNIQUE(userId, lessonId)
);
```

#### Quiz Attempts Table
```sql
CREATE TABLE quiz_attempts (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id),
  quizId INTEGER REFERENCES quizzes(id),
  score INTEGER NOT NULL,
  totalQuestions INTEGER NOT NULL,
  timeSpent INTEGER,
  passed BOOLEAN,
  answers JSONB,
  attemptedAt TIMESTAMP DEFAULT NOW()
);
```

### Subscription and Payment Management

#### Subscription Plans Table
```sql
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL,
  features JSONB,
  stripeProductId VARCHAR,
  stripePriceId VARCHAR,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### User Subscriptions Table
```sql
CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id),
  planId INTEGER REFERENCES subscription_plans(id),
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  isActive BOOLEAN DEFAULT true,
  stripeSubscriptionId VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Company and License Management

#### Companies Table
```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  address VARCHAR,
  stripeCustomerId VARCHAR,
  stripeSubscriptionId VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Company Subscriptions Table
```sql
CREATE TABLE company_subscriptions (
  id SERIAL PRIMARY KEY,
  companyId INTEGER REFERENCES companies(id),
  planId INTEGER REFERENCES subscription_plans(id),
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  userLimit INTEGER NOT NULL,
  isActive BOOLEAN DEFAULT true,
  stripeSubscriptionId VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Licenses Table
```sql
CREATE TABLE licenses (
  id SERIAL PRIMARY KEY,
  companyId INTEGER REFERENCES companies(id),
  subscriptionId INTEGER REFERENCES company_subscriptions(id),
  licenseKey VARCHAR(100) UNIQUE NOT NULL,
  assignedUserId VARCHAR REFERENCES users(id),
  status VARCHAR DEFAULT 'active',
  assignedAt TIMESTAMP,
  expiresAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## Database Relationships Diagram

```
Users (1) ----< Enrollments >---- (1) Courses
  |                                    |
  |                                    v
  |                               Categories (1)
  |                                    |
  v                                    v
Companies (1)                     Modules (1)
  |                                    |
  v                                    v
Company_Subscriptions            Lessons (1)
  |                                    |
  v                                    v
Licenses                         Quizzes (1)
                                      |
User_Subscriptions                    v
  |                              Quiz_Questions (1)
  v                                    |
Subscription_Plans                     v
                                Quiz_Answers

Lesson_Completions
Quiz_Attempts
```

## Indexes and Performance Optimization

### Primary Indexes
All tables have primary key indexes automatically created.

### Foreign Key Indexes
Foreign key columns are indexed for optimal join performance:
- `enrollments.userId`
- `enrollments.courseId`
- `courses.categoryId`
- `courses.instructorId`
- `modules.courseId`
- `lessons.moduleId`

### Composite Indexes
```sql
-- Unique constraint indexes
CREATE UNIQUE INDEX idx_user_course_enrollment ON enrollments(userId, courseId);
CREATE UNIQUE INDEX idx_user_lesson_completion ON lesson_completions(userId, lessonId);
CREATE UNIQUE INDEX idx_license_key ON licenses(licenseKey);

-- Performance optimization indexes
CREATE INDEX idx_courses_category ON courses(categoryId);
CREATE INDEX idx_lessons_module_order ON lessons(moduleId, orderIndex);
CREATE INDEX idx_quiz_attempts_user_quiz ON quiz_attempts(userId, quizId);
```

## Data Seeding Scripts

### User Seeding
The platform includes test users for each role:
- Students: `student1`, `student2`, etc.
- Instructors: `instructor1`, `instructor2`, etc.
- Admins: `admin1`, `admin2`, etc.
- Company admins: `company_admin1`, etc.

### Course Content Seeding
Sample courses are created in categories:
- Programming (JavaScript, React, Node.js)
- Design (UI/UX, Graphic Design)
- Business (Marketing, Management)
- Data Science (Analytics, Machine Learning)

### Quiz Data Seeding
Interactive quizzes are created for lessons with:
- Multiple choice questions
- Detailed explanations
- Point values
- Time limits

## Database Maintenance Procedures

### Backup Strategy
```bash
# Daily database backup
pg_dump -h localhost -U username -d m4t_platform > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h localhost -U username -d m4t_platform < backup_20240101.sql
```

### Performance Monitoring
```sql
-- Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Data Cleanup Scripts
```sql
-- Remove expired verification tokens
DELETE FROM users 
WHERE email_verified = false 
AND created_at < NOW() - INTERVAL '24 hours';

-- Archive completed quiz attempts older than 1 year
CREATE TABLE quiz_attempts_archive AS 
SELECT * FROM quiz_attempts 
WHERE attempted_at < NOW() - INTERVAL '1 year';

DELETE FROM quiz_attempts 
WHERE attempted_at < NOW() - INTERVAL '1 year';
```

## Migration Management

### Schema Versioning
Database schema changes are managed through migration files:
```
migrations/
├── 001_initial_schema.sql
├── 002_add_quiz_system.sql
├── 003_add_company_management.sql
└── 004_add_subscription_plans.sql
```

### Migration Commands
```bash
# Apply all pending migrations
npm run db:migrate

# Create new migration
npm run db:create-migration add_new_feature

# Rollback last migration
npm run db:rollback
```

## Security Considerations

### Data Encryption
- Passwords are hashed using bcrypt
- Sensitive data encrypted at rest
- API keys stored in environment variables

### Access Control
- Row-level security for multi-tenant data
- Role-based permissions
- Audit logging for sensitive operations

### Data Privacy
- GDPR compliance features
- Data anonymization scripts
- Right to deletion implementation

## Troubleshooting Common Issues

### Connection Problems
- Verify PostgreSQL service is running
- Check connection string format
- Validate user permissions
- Test network connectivity

### Performance Issues
- Analyze query execution plans
- Check index usage
- Monitor connection pooling
- Review slow query logs

### Data Integrity
- Validate foreign key constraints
- Check for orphaned records
- Verify data type consistency
- Monitor transaction isolation levels