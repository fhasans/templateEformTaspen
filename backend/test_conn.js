const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

console.log("Testing Connection with config:", {
    ...config,
    password: '****'
});

async function testConnection() {
    try {
        await sql.connect(config);
        console.log("✅ Connection Successful!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Connection Failed. Full Error:");
        console.error(err);
        process.exit(1);
    }
}

testConnection();
