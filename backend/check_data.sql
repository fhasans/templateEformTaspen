-- ============================================================
-- Query untuk menampilkan data masing-masing tabel referensi
-- ============================================================

-- 1. Display semua data Jenis Usaha
SELECT 
    [NO],
    [JENIS_USAHA],
    [MCC],
    [DESKRIPSI],
    [KEYWORD1], [KEYWORD2], [KEYWORD3],
    [GROUP_USAHA]
FROM [T_JENIS_USAHA]
ORDER BY [NO];

-- 2. Display semua data Kategori Usaha
SELECT 
    [ID],
    [JENIS_MERCHANT],
    [KATEGORI_MERCHANT],
    [MDR],
    [SV_MIN],
    [SV_MAX]
FROM [T_KATEGORI_USAHA]
ORDER BY [JENIS_MERCHANT], [KATEGORI_MERCHANT];

-- 3. Display semua data Tipe Bisnis
SELECT 
    [ID],
    [TIPE_BISNIS]
FROM [T_TIPE_BISNIS]
ORDER BY [ID];
