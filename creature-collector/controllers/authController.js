const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── POST /auth/register ──────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Hash the password before storing (salt rounds = 10)
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashed });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully! You can now log in.' });
  } catch (err) {
    // Mongoose duplicate key error code
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already exists. Please choose another.' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user in DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare plain password with hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // ── JWT (stateless) ──────────────────────────────────────────────────────
    // Token is self-contained: carries userId, verified by secret on each request.
    // Stored in HTTP-only cookie so JS cannot read it (XSS protection).
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour in ms
    });

    // ── Session (stateful) ───────────────────────────────────────────────────
    // Server stores the userId; only a session ID is sent in a cookie.
    // Unlike JWT, the server must look up the session on every request.
    req.session.userId = user._id;

    res.json({ message: 'Login successful', username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

// ─── POST /auth/logout ────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token');

  // Destroy the server-side session
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Could not log out' });
    res.json({ message: 'Logged out successfully' });
  });
};
