import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing - 必須在路由之前
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check - 放在最前面
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Plan B Portfolio API is running',
    port: process.env.PORT || 'not set',
    nodeEnv: process.env.NODE_ENV || 'not set',
    mongoUri: process.env.MONGODB_URI ? 'set' : 'not set'
  });
});

// Root path handler
app.get('/', (req, res) => {
  const acceptHeader = req.headers.accept || '';
  
  if (acceptHeader.includes('text/html')) {
    // HTML response for browser requests
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plan B Portfolio API</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f5f5f5; 
          }
          .container { 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
          }
          h1 { color: #2c3e50; margin-bottom: 20px; }
          .status { 
            background: #27ae60; 
            color: white; 
            padding: 10px 20px; 
            border-radius: 5px; 
            display: inline-block; 
            margin-bottom: 20px; 
          }
          .endpoint { 
            background: #ecf0f1; 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 5px; 
            border-left: 4px solid #3498db; 
          }
          .endpoint strong { color: #2c3e50; }
          .json-link { 
            color: #3498db; 
            text-decoration: none; 
            margin-left: 20px; 
          }
          .json-link:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Plan B Portfolio API</h1>
          <div class="status">✅ Service Running</div>
          <p>Welcome to the Plan B Portfolio Management API. This service provides endpoints for portfolio tracking, stock quotes, and investment insights.</p>
          
          <h2>Available Endpoints:</h2>
          <div class="endpoint">
            <strong>Health Check:</strong> <code>/health</code> - Service status and diagnostics
          </div>
          <div class="endpoint">
            <strong>API Test:</strong> <code>/api/test</code> - Basic API functionality test
          </div>
          <div class="endpoint">
            <strong>Portfolio:</strong> <code>/api/portfolio/*</code> - Portfolio management endpoints
          </div>
          <div class="endpoint">
            <strong>Stocks:</strong> <code>/api/stocks/*</code> - Stock quote and data endpoints
          </div>
          <div class="endpoint">
            <strong>Auth:</strong> <code>/api/auth/*</code> - Authentication endpoints
          </div>
          
          <p><a href="/?format=json" class="json-link">View JSON Response</a></p>
        </div>
      </body>
      </html>
    `);
  } else {
    // JSON response for API requests
    res.json({
      message: 'Welcome to Plan B Portfolio API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        api: '/api/*',
        test: '/api/test'
      },
      documentation: 'API endpoints for portfolio management and stock tracking'
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

import marketSentimentRouter from './routes/marketSentiment.js';
app.use('/api/market-sentiment', marketSentimentRouter);
import feedbackRouter from './routes/feedback.js';
app.use('/api/feedback', feedbackRouter);
import portfolioRouter from './routes/portfolio.js';
app.use('/api/portfolio', portfolioRouter);
import authRouter from './routes/auth.js';
app.use('/api/auth', authRouter);
import quoteRouter from './routes/quote.js';
app.use('/api/quote', quoteRouter);

// Stock routes
app.get('/api/stocks/quote/:symbol', (req, res) => {
  const { symbol } = req.params;
  // Mock response for now
  res.json({
    symbol: symbol,
    price: 150.00,
    change: 2.50,
    changePercent: 1.67,
    volume: 1000000,
    lastUpdated: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

// 改進的啟動邏輯
const startServer = async () => {
  try {
    // 嘗試連接數據庫
    console.log('🔌 Attempting to connect to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // 啟動服務器
    app.listen(PORT, () => {
      console.log(`🚀 Plan B Backend running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 MongoDB URI: ${process.env.MONGODB_URI ? 'configured' : 'NOT CONFIGURED'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 