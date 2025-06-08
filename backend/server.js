require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const battingRoute = require('./routes/battingRoutes');
const bowlingRoute = require('./routes/bowlingRoutes');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    'https://achuthancricketstats.onrender.com'
}));
app.use(express.json());


connectDB();

app.use('/api/batting' , battingRoute);
app.use('/api/bowling' , bowlingRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
