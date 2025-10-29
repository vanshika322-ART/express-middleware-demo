const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Global Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Bearer Token Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or incorrect' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== 'mysecrettoken') {
    return res.status(403).json({ message: 'Invalid token' });
  }

  // token ok -> attach user info if needed
  req.user = { tokenOwner: 'demoUser' };
  next();
}

// Public route
app.get('/public', (req, res) => {
  res.status(200).send('This is a public route. No authentication required.');
});

// Protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).send('You have accessed a protected route with a valid Bearer token!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
