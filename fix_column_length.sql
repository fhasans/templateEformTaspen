-- FIX: Value too long for type character varying(10)
-- Masalah: Kolom kode_cabang dll terlalu pendek (10 karakter)
-- Solusi: Perlebar kolom menjadi 50-100 karakter

ALTER TABLE merchant_applications
  ALTER COLUMN kode_cabang TYPE VARCHAR(100), -- Was 10, Value "MANTAP JAKARTA" is 14
  ALTER COLUMN kode_cabang_akusisi TYPE VARCHAR(50),
  ALTER COLUMN kode_cabang_lokasi TYPE VARCHAR(50),
  ALTER COLUMN kode_mcc TYPE VARCHAR(50),
  ALTER COLUMN rt TYPE VARCHAR(10),
  ALTER COLUMN rw TYPE VARCHAR(10),
  ALTER COLUMN rt_usaha TYPE VARCHAR(10),
  ALTER COLUMN rw_usaha TYPE VARCHAR(10),
  ALTER COLUMN kode_pos TYPE VARCHAR(20),
  ALTER COLUMN kode_pos_usaha TYPE VARCHAR(20),
  ALTER COLUMN nama_pemilik TYPE VARCHAR(150),
  ALTER COLUMN nama_pemilik_rekening TYPE VARCHAR(150), 
  ALTER COLUMN nama_merchant_official TYPE VARCHAR(150),
  ALTER COLUMN nama_merchant_qr TYPE VARCHAR(150);

-- Jalankan script ini di Supabase SQL Editor
