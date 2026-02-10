const sql = require('mssql');
const mockSql = require('./mock_sql'); // Import mock handler
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use true for Azure, false for local dev if self-signed certs
        trustServerCertificate: true, // Trust self-signed certificate
        connectTimeout: 30000, // Increase timeout for internal network
        requestTimeout: 30000
    }
};

const USE_MOCK = process.env.USE_MOCK_DB === 'true';

async function connectDB() {
    try {
        if (USE_MOCK) {
            console.log("🟡 Using MOCK Database (In-Memory Mode)");
            // We don't need to do anything for mock, just log it
            return;
        }

        await sql.connect(config);
        console.log("✅ Custom Backend: Connected to SQL Server");
    } catch (err) {
        console.error("❌ Database Connection Failed:", err);
        // Do not exit process, let it retry or fail on request
    }
}

// Export appropriate object based on mode
module.exports = {
    sql: USE_MOCK ? mockSql : sql,
    connectDB
};
