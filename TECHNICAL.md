# M4T Technical Documentation

This document provides detailed technical information about the M4T e-learning platform, intended for developers working on the project.

## Architecture Overview

The application follows a client-server architecture:

- **Frontend**: React single-page application
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM

The application uses a monorepo structure with shared types between the frontend and backend.

## Database Schema

The database schema is defined in `shared/schema.ts` using Drizzle ORM. Key entities include:

- **Users**: Authentication and profile information
- **Courses**: Course metadata and content organization
- **Lessons**: Individual learning units within courses
- **Enrollments**: User enrollment in courses
- **Completions**: Tracking which lessons users have completed
- **Subscriptions**: Subscription plans and user subscriptions
- **Payments**: Payment history
- **Gamification**: Badges, challenges, points, etc.

## Authentication

The application supports multiple authentication mechanisms:

1. **Session-based authentication**: Using Passport.js and Express sessions
2. **JWT authentication**: For API access and mobile applications
3. **Social login**: Through Replit's OpenID Connect provider

Authentication flow:

1. User credentials are validated
2. On successful authentication:
   - Session is created and stored in the database
   - JWT tokens are generated (if using JWT auth)
3. Protected routes check for valid session or JWT

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Log in with username/password
- `POST /api/logout` - Log out current user
- `GET /api/user` - Get current authenticated user
- `GET /api/auth/verify-email/:token` - Verify email with token
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/check-verification` - Check email verification status

### Courses

- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:id/lessons` - Get lessons for a course
- `POST /api/courses` - Create a new course (instructor/admin only)
- `PUT /api/courses/:id` - Update a course (instructor/admin only)
- `DELETE /api/courses/:id` - Delete a course (instructor/admin only)

### Lessons

- `GET /api/lessons/:id` - Get lesson details
- `POST /api/lessons/:id/complete` - Mark lesson as completed
- `POST /api/lessons/:id/quiz-result` - Submit quiz result

### Enrollments

- `POST /api/enrollments` - Enroll in a course
- `GET /api/user/enrollments` - Get user's enrolled courses
- `DELETE /api/enrollments/:courseId` - Unenroll from a course

### Subscriptions

- `GET /api/subscription-plans` - List available subscription plans
- `GET /api/user/subscription` - Get user's current subscription
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/create-subscription` - Create a subscription
- `POST /api/cancel-subscription` - Cancel a subscription

### PayPal Integration

- `GET /paypal/setup` - Load PayPal configuration
- `POST /paypal/order` - Create PayPal order
- `POST /paypal/order/:orderID/capture` - Capture PayPal payment

### Gamification

- `GET /api/badges` - Get all badges
- `GET /api/badges/category/:category` - Get badges by category
- `GET /api/user/badges` - Get user's earned badges
- `GET /api/user/points` - Get user's points
- `GET /api/user/point-history` - Get user's point history
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/challenges/active` - Get active challenges
- `GET /api/user/challenges/active` - Get user's active challenges
- `GET /api/user/challenges/completed` - Get user's completed challenges
- `POST /api/challenges/:id/progress` - Update challenge progress
- `GET /api/user/streak` - Get user's learning streak
- `POST /api/user/streak/check-in` - Check in for daily streak

### License Management (for Company Admins)

- `POST /api/company/licenses` - Create licenses for subscription
- `GET /api/company/licenses` - Get company licenses
- `GET /api/company/licenses/available` - Get available licenses
- `GET /api/company/licenses/assigned` - Get assigned licenses
- `POST /api/company/licenses/assign` - Assign license to user
- `POST /api/company/licenses/revoke` - Revoke license from user

## Frontend Structure

The frontend code is organized as follows:

- `client/src/components/` - Reusable UI components
  - `layout/` - Layout components (header, footer, etc.)
  - `ui/` - Shadcn UI components
  - `course/` - Course-related components
  - `video/` - Video player and related components
- `client/src/hooks/` - Custom React hooks
- `client/src/contexts/` - React context providers
- `client/src/lib/` - Utility functions
- `client/src/pages/` - Page components

## State Management

The application uses a combination of state management approaches:

1. **React Query**: For server state (API data)
2. **React Context**: For global UI state
3. **Local state**: For component-specific state

## Data Flow

1. API requests are made through the React Query client
2. The backend handles requests through route handlers
3. Route handlers use the storage layer to interact with the database
4. Responses are sent back to the client as JSON

## Testing

### Unit Testing

Unit tests are written using Jest and React Testing Library.

- Component tests: `client/src/__tests__/components/`
- Hook tests: `client/src/__tests__/hooks/`
- Utility tests: `client/src/__tests__/lib/`
- API tests: `server/__tests__/`

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Deployment

### Environment Variables

The following environment variables must be set in production:

```
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
SESSION_SECRET=your_session_secret

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email
SENDGRID_API_KEY=your_sendgrid_api_key

# Optional Analytics
VITE_GA_MEASUREMENT_ID=your_google_analytics_id
```

### Deployment Steps

1. Set environment variables
2. Build the frontend: `npm run build`
3. Start the server: `npm start`

## Performance Considerations

1. **Database Indexing**: Indexes are defined on frequently queried fields
2. **Caching**: React Query provides client-side caching for API responses
3. **Code Splitting**: Implemented for larger page components
4. **Lazy Loading**: Used for images and other heavy content
5. **Server-Side Optimizations**: Query optimizations and pagination

## Security Considerations

1. **Authentication**: Secure session management and JWT implementation
2. **Authorization**: Role-based access control for all endpoints
3. **Input Validation**: Zod schemas for request validation
4. **CSRF Protection**: CSRF tokens for form submissions
5. **XSS Protection**: React's built-in XSS protection
6. **Rate Limiting**: API rate limiting to prevent abuse
7. **Data Encryption**: Sensitive data encrypted in the database
8. **HTTPS**: All production traffic served over HTTPS

## Development Workflow

1. **Feature Development**:
   - Update schema if needed
   - Implement backend endpoints
   - Implement frontend components
   - Add tests

2. **Code Reviews**:
   - Ensure type safety
   - Verify role-based access control
   - Check for performance issues
   - Validate against security concerns

3. **Testing**:
   - Run unit tests
   - Perform UAT testing
   - Test in different browsers

4. **Deployment**:
   - Deploy to staging environment
   - Perform smoke tests
   - Deploy to production

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   - Verify DATABASE_URL is correct
   - Check database server is running
   - Verify network connectivity

2. **Authentication Issues**:
   - Check SESSION_SECRET is set
   - Verify session store is configured correctly
   - Clear browser cookies and try again

3. **Payment Processing Issues**:
   - Verify API keys are set correctly
   - Check Stripe/PayPal dashboard for errors
   - Use test mode for development

4. **Video Playback Issues**:
   - Check browser console for errors
   - Verify video URLs are accessible
   - Check network tab for failed requests

## API Design Guidelines

1. **Naming Conventions**:
   - Use plural nouns for resources (e.g., `/courses` not `/course`)
   - Use kebab-case for multi-word paths (e.g., `/subscription-plans`)
   - Use camelCase for query parameters and request bodies

2. **Response Format**:
   - Success: `{ data: ... }`
   - Error: `{ error: { message: '...' } }`

3. **Status Codes**:
   - 200: OK (Success)
   - 201: Created (Resource created)
   - 400: Bad Request (Invalid input)
   - 401: Unauthorized (Authentication required)
   - 403: Forbidden (Insufficient permissions)
   - 404: Not Found (Resource not found)
   - 500: Internal Server Error

4. **Pagination**:
   - Query parameters: `page` and `limit`
   - Response format: `{ data: [...], pagination: { total, page, limit } }`

5. **Filtering and Sorting**:
   - Query parameters: `filter[field]=value` and `sort=field:asc|desc`

## Component Development Guidelines

1. **Component Structure**:
   - Keep components focused on a single responsibility
   - Use composition over inheritance
   - Extract reusable logic to custom hooks

2. **Styling**:
   - Use Tailwind utility classes
   - Follow the project's color scheme and design system
   - Ensure responsive design

3. **Accessibility**:
   - Use semantic HTML elements
   - Include aria attributes where necessary
   - Ensure keyboard navigation works
   - Maintain proper contrast ratios

4. **Performance**:
   - Memoize expensive calculations
   - Use virtualization for long lists
   - Lazy load components when appropriate

## Version Control Guidelines

1. **Branch Naming**:
   - Feature branches: `feature/description`
   - Bug fixes: `fix/description`
   - Releases: `release/version`

2. **Commit Messages**:
   - Format: `type(scope): description`
   - Types: feat, fix, docs, style, refactor, test, chore
   - Example: `feat(auth): implement JWT authentication`

3. **Pull Requests**:
   - Include a clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

## Migration to Next.js (Planned)

The team is planning to migrate the frontend from React + Vite to Next.js. Key considerations:

1. **Pages to Routes Conversion**:
   - Convert `client/src/pages/` to Next.js pages directory
   - Implement dynamic routes where needed

2. **Server Components**:
   - Identify components that can be server components
   - Move data fetching to server components where appropriate

3. **API Routes**:
   - Implement API routes for backend functionality
   - Ensure authentication and authorization still work

4. **State Management**:
   - Continue using React Query for data fetching
   - Adapt to Next.js data fetching patterns

5. **Deployment**:
   - Configure for deployment on Vercel or similar platform

## UAT Testing Procedures

1. **Test Account Setup**:
   - Run `npm run seed:uat` to generate test data
   - Use provided test accounts for different roles

2. **Test Scenarios**:
   - User registration and login
   - Course browsing and enrollment
   - Lesson completion and progress tracking
   - Subscription management
   - Payment processing
   - Gamification features
   - Admin functionality

3. **Browser Testing**:
   - Test on Chrome, Firefox, Safari, and Edge
   - Test on mobile browsers

4. **Reporting Issues**:
   - Document steps to reproduce
   - Include screenshots
   - Note browser and device information

## Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [PayPal API Documentation](https://developer.paypal.com/docs/api/overview/)
- [Shadcn UI Documentation](https://ui.shadcn.com/)