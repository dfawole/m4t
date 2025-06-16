# M4T Learning Platform - Technical Documentation

## System Architecture Overview

The M4T Learning Platform is a full-stack TypeScript application built with modern web technologies, designed for scalability and maintainability.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Vite)                                         │
│  ├── Authentication & Authorization                            │
│  ├── Course Management Interface                               │
│  ├── Payment Processing (Stripe)                               │
│  ├── Gamification Dashboard                                    │
│  └── Real-time Analytics                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                         HTTP/WebSocket
                              │
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Express.js API Server                                         │
│  ├── JWT Authentication Middleware                             │
│  ├── RESTful API Routes                                        │
│  ├── WebSocket Real-time Communication                         │
│  ├── Third-party Service Integration                           │
│  │   ├── Stripe Payment Processing                             │
│  │   ├── SendGrid Email Service                                │
│  │   └── OpenAI API Integration                                │
│  └── Business Logic Layer                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                         Database ORM
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                            │
│  ├── User Management Tables                                    │
│  ├── Course & Content Storage                                  │
│  ├── Payment & Subscription Records                            │
│  ├── Gamification Data                                         │
│  └── Analytics & Reporting Tables                              │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Technologies
- **React 18**: Component-based UI library with hooks
- **TypeScript**: Type-safe JavaScript superset
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Pre-built accessible components
- **React Query**: Server state management and caching
- **Wouter**: Lightweight routing library
- **React Hook Form**: Form handling with validation
- **Framer Motion**: Animation library

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Type-safe SQL database toolkit
- **PostgreSQL**: Relational database management system
- **JWT**: JSON Web Token authentication
- **WebSocket**: Real-time bidirectional communication

### Third-Party Integrations
- **Stripe**: Payment processing and subscription management
- **SendGrid**: Email delivery service
- **OpenAI**: AI-powered content recommendations
- **PayPal**: Alternative payment processing

## Database Schema

### Core Tables Structure

```sql
-- User Management
users (id, email, password_hash, role, created_at, updated_at)
user_profiles (user_id, first_name, last_name, avatar_url, bio)
companies (id, name, subdomain, settings, created_at)
user_company_roles (user_id, company_id, role, permissions)

-- Course Management  
courses (id, title, description, instructor_id, company_id, price, status)
course_modules (id, course_id, title, order_index, content)
course_enrollments (user_id, course_id, enrolled_at, progress, completed_at)
course_progress (user_id, course_id, module_id, completed_at, score)

-- Payment & Subscriptions
subscriptions (id, user_id, plan_type, stripe_subscription_id, status)
payments (id, user_id, amount, stripe_payment_id, status, created_at)
company_licenses (company_id, license_count, used_licenses, renewal_date)

-- Gamification
user_achievements (user_id, achievement_id, earned_at, progress)
achievements (id, title, description, points, badge_icon, criteria)
user_points (user_id, total_points, level, streak_count)
challenges (id, title, description, points, start_date, end_date)

-- Analytics & Reporting
learning_analytics (user_id, course_id, session_duration, completion_rate)
user_activity (user_id, activity_type, metadata, created_at)
```

### Database Relationships

```
Users ──┬── UserProfiles (1:1)
        ├── CourseEnrollments (1:M)
        ├── Subscriptions (1:M)
        ├── UserAchievements (1:M)
        └── UserCompanyRoles (1:M)

Companies ──┬── Courses (1:M)
            ├── UserCompanyRoles (1:M)
            └── CompanyLicenses (1:1)

Courses ──┬── CourseModules (1:M)
          ├── CourseEnrollments (1:M)
          └── CourseProgress (1:M)
```

## API Architecture

### Authentication Flow

```
1. User Registration/Login
   POST /api/auth/register
   POST /api/auth/login
   
2. JWT Token Generation
   Server generates JWT with user claims
   
3. Protected Route Access
   Client sends JWT in Authorization header
   Server validates JWT middleware
   
4. Token Refresh
   POST /api/auth/refresh
```

### Core API Endpoints

```javascript
// Authentication
POST   /api/auth/register          // User registration
POST   /api/auth/login             // User login
POST   /api/auth/logout            // User logout
POST   /api/auth/refresh           // Token refresh
POST   /api/auth/forgot-password   // Password reset

// User Management
GET    /api/users/profile          // Get user profile
PUT    /api/users/profile          // Update profile
GET    /api/users/dashboard        // Dashboard data
POST   /api/users/upload-avatar    // Upload avatar

// Course Management
GET    /api/courses               // List all courses
GET    /api/courses/:id           // Get course details
POST   /api/courses               // Create course (instructor)
PUT    /api/courses/:id           // Update course
DELETE /api/courses/:id           // Delete course
POST   /api/courses/:id/enroll    // Enroll in course

// Payment Processing
POST   /api/payments/create-intent     // Create payment intent
POST   /api/payments/confirm           // Confirm payment
GET    /api/subscriptions              // Get user subscriptions
POST   /api/subscriptions/create       // Create subscription
PUT    /api/subscriptions/:id/cancel   // Cancel subscription

// Gamification
GET    /api/achievements              // Get user achievements
POST   /api/achievements/claim        // Claim achievement
GET    /api/leaderboard              // Get leaderboard
GET    /api/challenges               // Get active challenges
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── courses/         # Course-related components
│   ├── payments/        # Payment processing components
│   ├── gamification/    # Badges, achievements, leaderboard
│   └── dashboard/       # Dashboard components
├── pages/               # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── store/              # State management
```

### State Management Strategy

```javascript
// React Query for server state
const { data: courses, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: () => fetch('/api/courses').then(res => res.json())
});

// React Hook Form for form state
const form = useForm<CourseFormData>({
  resolver: zodResolver(courseSchema),
  defaultValues: { title: '', description: '' }
});

// Local state for UI interactions
const [isModalOpen, setIsModalOpen] = useState(false);
```

## Security Implementation

### Authentication & Authorization

```typescript
// JWT Middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Role-based Access Control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};
```

### Data Validation

```typescript
// Zod schemas for type-safe validation
const courseSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(0),
  modules: z.array(moduleSchema)
});

// Request validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Validation failed' });
    }
  };
};
```

## Performance Optimizations

### Frontend Optimizations

```javascript
// Code splitting with React lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));

// React Query caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false
    }
  }
});

// Image optimization
<img 
  src={imageUrl} 
  loading="lazy" 
  alt="Course thumbnail"
  className="w-full h-48 object-cover"
/>
```

### Backend Optimizations

```typescript
// Database query optimization
const getCourseWithModules = async (courseId: string) => {
  return await db.select()
    .from(courses)
    .leftJoin(courseModules, eq(courses.id, courseModules.courseId))
    .where(eq(courses.id, courseId));
};

// Response caching
app.use('/api/courses', cache('5 minutes'));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## Deployment Architecture

### Multi-Platform Deployment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Railway     │    │     Vercel      │    │     Heroku      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • GitHub Deploy │    │ • Git Deploy    │    │ • Git Deploy    │
│ • Auto Postgres │    │ • Edge Runtime  │    │ • Dyno System   │
│ • Container     │    │ • Global CDN    │    │ • Add-on Eco    │
│ • $5/month      │    │ • Serverless    │    │ • Classic Host  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Configuration

```bash
# Production Environment Variables
NODE_ENV=production
PORT=3006
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG...
OPENAI_API_KEY=sk-...
```

## Monitoring & Analytics

### Application Monitoring

```typescript
// Error tracking
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Send to monitoring service
});

// Performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

### User Analytics

```typescript
// Track user activity
const trackActivity = async (userId: string, activity: string, metadata?: any) => {
  await db.insert(userActivity).values({
    userId,
    activityType: activity,
    metadata: JSON.stringify(metadata),
    createdAt: new Date()
  });
};

// Learning progress analytics
const updateProgress = async (userId: string, courseId: string, progress: number) => {
  await db.update(courseEnrollments)
    .set({ progress, updatedAt: new Date() })
    .where(and(
      eq(courseEnrollments.userId, userId),
      eq(courseEnrollments.courseId, courseId)
    ));
};
```

## Testing Strategy

### Unit Testing

```typescript
// Component testing with React Testing Library
describe('CourseCard', () => {
  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('Course Title')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
  });
});

// API route testing
describe('POST /api/courses', () => {
  it('creates a new course', async () => {
    const response = await request(app)
      .post('/api/courses')
      .send(mockCourseData)
      .expect(201);
    
    expect(response.body.title).toBe(mockCourseData.title);
  });
});
```

### Integration Testing

```typescript
// Database integration tests
describe('Course Service', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('enrolls user in course', async () => {
    const enrollment = await enrollUserInCourse(userId, courseId);
    expect(enrollment.status).toBe('active');
  });
});
```

This technical documentation provides comprehensive coverage of the M4T Learning Platform architecture, implementation details, and deployment strategies.