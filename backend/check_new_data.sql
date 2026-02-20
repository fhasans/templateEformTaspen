-- ============================================================
-- Query untuk melihat data transaksi/registrasi terbaru
-- Jalankan di SQL Server Management Studio (SSMS)
-- ============================================================

-- 1. Cek Kode OTP Terakhir (Tabel: otp_codes)
SELECT TOP 10 * 
FROM [otp_codes]
ORDER BY [created_at] DESC;

-- 2. Cek Registrasi Utama (Tabel: T_ONBOARDING_REGISTRATION)
-- Tabel ini biasanya menyimpan status keseluruhan registrasi
SELECT TOP 10 * 
FROM [T_ONBOARDING_REGISTRATION]
ORDER BY [ID] DESC;

-- 3. Cek Data Merchant (Tabel: T_ONBOARDING_MERCHANT)
-- Menyimpan detail usaha, alamat, pemilik
SELECT TOP 10 * 
FROM [T_ONBOARDING_MERCHANT]
ORDER BY [ID] DESC;

-- 4. Cek Data Keuangan/Fintech (Tabel: T_ONBOARDING_FINTECH)
-- Menyimpan data rekening, NPWP, estimasi omset
SELECT TOP 10 * 
FROM [T_ONBOARDING_FINTECH]
ORDER BY [ID] DESC;

-- 5. Cek Dokumen Upload (Tabel: T_ONBOARDING_DOCUMENT)
-- Menyimpan path file KTP, NPWP, Foto Lokasi, dll
SELECT TOP 10 * 
FROM [T_ONBOARDING_DOCUMENT]
ORDER BY [ID] DESC;
