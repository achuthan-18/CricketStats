require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const battingRoute = require('./routes/battingRoutes');
const bowlingRoute = require('./routes/bowlingRoutes');
const cors = require('cors');

const app = express();

// Allow only these origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://achuthancricketstats.onrender.com'
];

// CORS middleware setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // optional, only if you're using cookies or authorization headers
}));

// Handle preflight requests for all routes
app.options('*', cors());

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/batting', battingRoute);
app.use('/api/bowling', bowlingRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
