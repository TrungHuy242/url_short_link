import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import urlRoutes from './routes/url.routes.js';
import { redirectUrl } from './controllers/url.controller.js';
import { errorHandler } from './middleware/error.middleware.js';
import { startCleanupJob, stopCleanupJob } from './jobs/cleanup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', urlRoutes);

// Redirect route (must be after API routes)
app.get(/^\/([A-Za-z0-9_-]{4,20})$/, redirectUrl);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Only start server if NOT running on Vercel
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start cleanup job
    startCleanupJob();
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    stopCleanupJob();
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    stopCleanupJob();
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

export default app;
