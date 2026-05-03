require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const trustRoutes = require('./src/routes/trustRoutes');

// ── App & HTTP Server ─────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Socket.io (real-time alerts) ──────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Attach io to app so controllers can emit events
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // Each store joins its own room for targeted alerts
  socket.on('join_store', (storeId) => {
    socket.join(storeId);
    console.log(`Store ${storeId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log(`⚡ Socket disconnected: ${socket.id}`);
  });
});

// ── Security Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
  },
});
app.use('/api', limiter);

// ── General Middleware ────────────────────────────────────────────
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'E-Trust PK API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trust', trustRoutes);

// ── 404 Handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found.`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  });
});

// ── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║        E-Trust PK API Server         ║
║  🚀 Running on http://localhost:${PORT}  ║
║  📦 Environment: ${process.env.NODE_ENV || 'development'}         ║
╚══════════════════════════════════════╝
    `);
  });
});

module.exports = { app, io };
