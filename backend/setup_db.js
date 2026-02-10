const sql = require('mssql');
require('dotenv').config();

// Config for connecting to MASTER database first
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: 'master', // Start with master to create DB
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const DB_NAME = process.env.DB_NAME;

async function setupDatabase() {
    try {
        console.log("🔄 Connecting to SQL Server (Master)...");
        const pool = await sql.connect(config);
        console.log("✅ Connected!");

        // 1. Create Database if not exists
        await pool.request().query(`
            IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${DB_NAME}')
            BEGIN
                CREATE DATABASE ${DB_NAME};
                PRINT 'Database created.';
            END
        `);
        console.log(`✅ Database '${DB_NAME}' checked/created.`);

        // Close master connection
        pool.close();

        // 2. Connect to the NEW Database
        console.log(`🔄 Connecting to '${DB_NAME}'...`);
        const appConfig = { ...config, database: DB_NAME };
        const appPool = await sql.connect(appConfig);
        console.log("✅ Connected to application database!");

        // 3. Create Tables
        const schemaQuery = `
        -- Tabel OTP Codes
        IF OBJECT_ID('otp_codes', 'U') IS NULL
        BEGIN
            CREATE TABLE otp_codes (
                id INT IDENTITY(1,1) PRIMARY KEY,
                email VARCHAR(100) NOT NULL,
                otp_code VARCHAR(6) NOT NULL,
                created_at DATETIME DEFAULT GETDATE(),
                expires_at DATETIME,
                used BIT DEFAULT 0
            );
            PRINT 'Table otp_codes created.';
        END

        -- Tabel Merchant Applications
        IF OBJECT_ID('merchant_applications', 'U') IS NULL
        BEGIN
            CREATE TABLE merchant_applications (
                id INT IDENTITY(1,1) PRIMARY KEY,
                ticket_id UNIQUEIDENTIFIER DEFAULT NEWID(),
                status VARCHAR(20) DEFAULT 'pending',
                submitted_at DATETIME DEFAULT GETDATE(),
                
                -- Email & Auth
                email VARCHAR(100) NOT NULL,
                email_verified BIT DEFAULT 1,
                
                -- Data Pemilik
                tipe_nasabah VARCHAR(50),
                tipe_layanan_qris VARCHAR(50),
                nama_pemilik VARCHAR(150),
                no_hp_pemilik VARCHAR(20),
                jenis_identitas VARCHAR(20),
                nomor_identitas VARCHAR(50),
                npwp_pemilik VARCHAR(30),
                alamat_pemilik TEXT,
                rt_rw_pemilik VARCHAR(20),
                kelurahan_pemilik VARCHAR(100),
                kecamatan_pemilik VARCHAR(100),
                kota_pemilik VARCHAR(100),
                kode_pos_pemilik VARCHAR(10),
                
                -- Data Usaha
                nama_usaha VARCHAR(150),
                jenis_usaha VARCHAR(100),
                bidang_usaha VARCHAR(100),
                bentuk_usaha VARCHAR(50),
                alamat_usaha TEXT,
                rt_rw_usaha VARCHAR(20),
                kelurahan_usaha VARCHAR(100),
                kecamatan_usaha VARCHAR(100),
                kota_usaha VARCHAR(100),
                kode_pos_usaha VARCHAR(10),
                no_telp_usaha VARCHAR(20),
                email_usaha VARCHAR(100),
                
                -- Data Keuangan
                nomor_rekening VARCHAR(30),
                nama_pemilik_rekening VARCHAR(150),
                bank_penerima VARCHAR(50),
                cabang_bank VARCHAR(100),
                sales_volume_per_tahun DECIMAL(18,2)
            );
            PRINT 'Table merchant_applications created.';
        END

        -- Tabel Document Uploads
        IF OBJECT_ID('document_uploads', 'U') IS NULL
        BEGIN
            CREATE TABLE document_uploads (
                id INT IDENTITY(1,1) PRIMARY KEY,
                merchant_id INT FOREIGN KEY REFERENCES merchant_applications(id),
                document_type VARCHAR(50),
                file_path VARCHAR(255),
                uploaded_at DATETIME DEFAULT GETDATE()
            );
            PRINT 'Table document_uploads created.';
        END
        `;

        await appPool.request().query(schemaQuery);
        console.log("✅ All tables verfied/created successfully!");

        appPool.close();
        console.log("🎉 Setup Finished!");

    } catch (err) {
        console.error("❌ Error Setup Database:", err);
    }
}

setupDatabase();
