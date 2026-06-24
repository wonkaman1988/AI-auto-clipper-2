 const express = require('express');
const app = express();

app.use(express.json());

// Serve landing page
app.get('/landing-page.html', (req, res) => {
  res.sendFile(__dirname + '/landing-page.html', { root: '/' });
});

// Alternative: serve from a simpler method
app.get('/landing-page', (req, res) => {
  // Redirect to HTML file
  res.redirect('/landing-page.html');
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Auto-Clipper API is running!',
    status: 'online'
  });
});

// Auth endpoints (mock)
app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true, message: 'Signup works!' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, token: 'mock-token-123' });
});

// Clips endpoint (mock)
app.get('/api/clips/:userId', (req, res) => {
  res.json([
    { id: 1, title: 'Sample Clip', status: 'ready', duration: 30 }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
