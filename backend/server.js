const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { connectDB } = require('./db');

const authRoutes = require('./routes/authRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const bankRoutes = require('./routes/bankRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/merchant', merchantRoutes); // Register Merchant Routes
app.use('/api/bank', bankRoutes); // Register Bank Routes

app.get('/', (req, res) => {
    res.send('Merchant Onboarding API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
