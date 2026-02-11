-- Fix / Update otp_codes table
USE TaspenOnboardingMerchantDB;
GO

-- 1. Create table if not exists (with 'used' column)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'otp_codes')
BEGIN
    PRINT 'Creating otp_codes table...';
    CREATE TABLE otp_codes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp_code VARCHAR(10) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        used BIT DEFAULT 0  -- Added 'used' column
    );
    PRINT 'otp_codes table created successfully.';
END
ELSE
BEGIN
    PRINT 'otp_codes table already exists. Checking for missing columns...';
    
    -- 2. Add 'used' column if missing
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'otp_codes') AND name = 'used')
    BEGIN
        PRINT 'Adding missing column: used';
        ALTER TABLE otp_codes ADD used BIT DEFAULT 0;
    END
END
GO
