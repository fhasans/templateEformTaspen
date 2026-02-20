const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { connectDB } = require('./db');

const authRoutes = require('./routes/authRoutes');
const merchantRoutes = require('./routes/merchantRoutes');
const bankRoutes = require('./routes/bankRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

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
app.use('/api/upload', uploadRoutes); // Register Upload Routes

const { sql } = require('./db');

// New Endpoint: Get Kategori Usaha (Filtered by Sales Volume)
app.get('/api/kategori-usaha', async (req, res) => {
    try {
        const { salesVolume } = req.query;
        let query = 'SELECT * FROM T_KATEGORI_USAHA';

        // If salesVolume is provided, filter based on range
        if (salesVolume) {
            // Remove dots and convert to number
            const volume = parseFloat(salesVolume.replace(/\./g, ''));
            if (!isNaN(volume)) {
                query += ` WHERE ${volume} >= CAST(SV_MIN AS BIGINT) AND ${volume} <= CAST(SV_MAX AS BIGINT)`;
            }
        }

        query += ' ORDER BY ID';

        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching kategori usaha:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// New Endpoint: Get Jenis Usaha (for Step 2)
app.get('/api/jenis-usaha', async (req, res) => {
    try {
        const query = 'SELECT MCC, JENIS_USAHA, DESKRIPSI, GROUP_USAHA, KEYWORD1, KEYWORD2, KEYWORD3 FROM T_JENIS_USAHA ORDER BY JENIS_USAHA';
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching jenis usaha:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New Endpoint: Get Tipe Bisnis (for Step 2)
app.get('/api/tipe-bisnis', async (req, res) => {
    try {
        const query = 'SELECT ID, TIPE_BISNIS FROM T_TIPE_BISNIS ORDER BY ID';
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching tipe bisnis:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('Merchant Onboarding API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
