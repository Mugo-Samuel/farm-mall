const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const farmerRoutes = require('./routes/farmer.routes');
const weatherRoutes = require('./routes/weather.routes');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Farm Mall API is running 🌱' });
});

// Serve React frontend in production
// Serve React frontend in production
const frontendPath = path.join(__dirname, '../../client/dist');
console.log('Frontend path:', frontendPath);
console.log('Frontend exists:', fs.existsSync(frontendPath));

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Farm Mall API is running 🌱 - Frontend not found');
  });
}