import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studentsRouter from './routes/students.js';
import jobsRouter from './routes/jobs.js';
import applicationsRouter from './routes/applications.js';
import aiRouter from './routes/ai.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AI-Powered Student Career & Placement Management System API',
    version: '1.0.0',
    department: 'Department of Computer Science & Engineering'
  });
});

// API Routes
app.use('/api/students', studentsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred in Placement System API'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Placement Management System Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
