import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerRoutes } from './routes';
import './vite';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '5000');

  // Middleware
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  console.log('Starting M4T Learning Platform...');

  // Register routes
  const server = await registerRoutes(app);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`M4T Learning Platform running on port ${PORT}`);
    console.log(`UAT test data ready with accounts:`);
    console.log(`   - student@test.com (password: password123)`);
    console.log(`   - instructor@test.com (password: password123)`);
    console.log(`   - admin@techcorp.com (password: password123)`);
    console.log(`   - admin@m4t.com (password: password123)`);
  });
}

startServer().catch(console.error);