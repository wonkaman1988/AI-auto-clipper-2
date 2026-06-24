const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Auto-Clipper API is running!' });
});

// Auth
app.post('/api/auth/signup', (req, res) => {
  res.json({ message: 'Signup working' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login working' });
});

// Clips
app.get('/api/clips/:userId', (req, res) => {
  res.json([{ id: 1, title: 'Sample Clip', status: 'ready' }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

