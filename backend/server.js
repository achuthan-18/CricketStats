require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const battingRoute = require('./routes/battingRoutes');
const bowlingRoute = require('./routes/bowlingRoutes');
const cors = require('cors');

const app = express();
const allowedOrigins = ['http://localhost:5173', 'https://achuthancricketstats.onrender.com'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());


connectDB();

app.use('/api/batting' , battingRoute);
app.use('/api/bowling' , bowlingRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
