import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // 暫時禁用 CSP 以支持前端
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing - 必須在路由之前
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 靜態文件服務 - 提供前端構建文件
app.use(express.static(path.join(__dirname, '../public')));

// 老師的 debug 代碼
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
 
  app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
}

// Health check - 放在最前面
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Plan B Portfolio API is running',
    port: process.env.PORT || 'not set',
    nodeEnv: process.env.NODE_ENV || 'not set',
    mongoUri: process.env.MONGODB_URI ? 'set' : 'NOT CONFIGURED'
  });
});

// API 路由
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

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

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

// 前端路由處理 - 必須在所有 API 路由之後
app.get('*', (req, res) => {
  // 如果是 API 請求，返回 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // 否則提供前端頁面
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
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
      console.log(`🌐 Frontend will be served from: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 