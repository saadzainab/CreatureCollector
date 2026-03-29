require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const creatureRoutes = require('./routes/creatures');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Allow requests from the React dev server and send cookies cross-origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Server-side session (stateful) — stores userId after login
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,   // not accessible via JS (XSS protection)
    maxAge: 3600000,  // 1 hour
  },
}));

// ─── Database ─────────────────────────────────────────────────────────────────

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅  MongoDB Atlas connected'))
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (req, res) => res.send('🐾 Creature Collector API is running'));

app.use('/auth', authRoutes);
app.use('/creatures', creatureRoutes);

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
