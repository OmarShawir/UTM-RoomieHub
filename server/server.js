const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// ─── Middleware ────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/users',    require('./routes/user.routes'));
app.use('/api/listings', require('./routes/listing.routes'));
app.use('/api/chat',     require('./routes/chat.routes'));
app.use('/api/reviews',  require('./routes/review.routes'));
app.use('/api/admin',    require('./routes/admin.routes'));
app.use('/api/matching', require('./routes/matching.routes'));

// ─── Health check ─────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'UTM RoomieHub API is running' });
});

// ─── 404 handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
