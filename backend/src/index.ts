import express, { Express } from 'express';
import connectDB from './config/database';
import { config } from './config/env';
import { setupSecurity, authLimiter } from './middleware/security';
import { errorHandler, notFound } from './middleware/errorHandler';
import authRoutes from './features/auth/routes';
import quizRoutes from './features/quiz/routes';

const app: Express = express();

// Connect to MongoDB
connectDB();

// Security middleware
setupSecurity(app);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

export default app;

