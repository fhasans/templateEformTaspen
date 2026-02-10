-- =============================================
-- SCRIPT PEMBUATAN DATABASE & TABEL (FULL)
-- Project: Merchant Onboarding (Mandiri Taspen)
-- Database: SQL Server
-- =============================================

-- 1. Buat Database
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'TaspenOnboardingMerchantDB')
BEGIN
    CREATE DATABASE TaspenOnboardingMerchantDB;
END
GO

USE TaspenOnboardingMerchantDB;
GO

-- 2. Tabel OTP Codes
IF OBJECT_ID('otp_codes', 'U') IS NOT NULL DROP TABLE otp_codes;
CREATE TABLE otp_codes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    expires_at DATETIME,
    used BIT DEFAULT 0
);
GO

-- 3. Tabel Merchant Applications
IF OBJECT_ID('merchant_applications', 'U') IS NOT NULL DROP TABLE merchant_applications;
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
GO

-- 4. Tabel Document Uploads (Menyimpan Path File)
IF OBJECT_ID('document_uploads', 'U') IS NOT NULL DROP TABLE document_uploads;
CREATE TABLE document_uploads (
    id INT IDENTITY(1,1) PRIMARY KEY,
    merchant_id INT FOREIGN KEY REFERENCES merchant_applications(id),
    document_type VARCHAR(50), -- KTP, NPWP, SIUP, dll
    file_path VARCHAR(255),
    uploaded_at DATETIME DEFAULT GETDATE()
);
GO
