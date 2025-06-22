# M4T Learning Platform

An advanced AI-powered health and wellness learning platform with personalised educational experiences, gamification, and comprehensive course management.

## Features

- **Learning**: Intelligent course recommendations and personalised content
- **Gamification**: Badges, challenges, streaks, and leaderboards
- **Course Management**: Complete course creation and management system
- **User Roles**: Students, instructors, company admins, and internal admins
- **Payment Integration**: Stripe payment processing with subscription plans
- **Email Notifications**: SendGrid integration for automated emails
- **Real-time Analytics**: Comprehensive learning analytics and progress tracking

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with secure session management
- **Payments**: Stripe integration
- **Email**: SendGrid API
- **Deployment**: Docker-ready, platform-agnostic

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/m4t-learning-platform.git
cd m4t-learning-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 4. Database Setup

```bash
npm run db:push
```

### 5. Start Development

```bash
npm run dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secure-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SENDGRID_API_KEY=SG...
NODE_ENV=production
PORT=3000
```

## Deployment

### Railway (Recommended for testing)

1. Connect GitHub repository to Railway
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically

### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in project directory
3. Configure environment variables
4. Deploy with `vercel --prod`

### Render

1. Create new Web Service from GitHub
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Add PostgreSQL service

### Heroku

1. Install Heroku CLI
2. `heroku create your-app-name`
3. `heroku addons:create heroku-postgresql:mini`
4. `git push heroku main`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Courses

- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (admin/instructor)
- `GET /api/courses/:id/lessons` - Get course lessons

### Gamification

- `GET /api/badges` - Get user badges
- `GET /api/challenges` - Get active challenges
- `GET /api/leaderboard` - Get leaderboard
- `POST /api/streak/checkin` - Check-in for streak

### Health Monitoring

- `GET /health` - Basic health check
- `GET /api/status` - Detailed system status

## Default Test Accounts

- **Admin**: admin@m4t.com / admin123
- **Company Admin**: company@m4t.com / company123
- **Instructor**: instructor@m4t.com / instructor123
- **Student**: student@m4t.com / student123

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub or contact the development team.
