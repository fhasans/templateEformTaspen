-- SQL Server / T-SQL Syntax
CREATE TABLE [T_JENIS_USAHA] (
    [NO] INT,
    [JENIS_USAHA] VARCHAR(512),
    [MCC] VARCHAR(50), 
    [DESKRIPSI] VARCHAR(MAX),
    [KEYWORD1] VARCHAR(512),
    [KEYWORD2] VARCHAR(512),
    [KEYWORD3] VARCHAR(512),
    [DETAIL_ENG] VARCHAR(MAX),
    [DETAIL_ID] VARCHAR(MAX),
    [GROUP_USAHA] VARCHAR(512)
);
GO

-- Notes: 
-- 1. Changed backticks ` to square brackets [] for identifiers.
-- 2. Ensure all single quotes within text are escaped as '' (e.g. "children's" -> "children''s").
-- 3. The error "MCC 6-51 may not be used..." likely has unescaped quotes around it or in preceding lines.

INSERT INTO [T_JENIS_USAHA] ([NO], [JENIS_USAHA], [MCC], [DESKRIPSI], [KEYWORD1], [KEYWORD2], [KEYWORD3], [DETAIL_ENG], [DETAIL_ID], [GROUP_USAHA]) VALUES (1, 'Agen Perjalanan', '4722', 'TRAVEL AGENCIES & TOUR OPERATORS', 'TRAVEL', 'TOUR', 'BIRO', 'Travel agencies that primarily provide travel information and booking services. Such merchants act as agents on behalf of travelers in booking and ticketing air, land, or sea transportation or lodging accommodations, including plane flights, bus tours, sea cruises, car rentals, rail transportation, and lodging. Also includes tour operators that arrange and assemble tours for sale through a travel agent or directly to the consumer. A traveler may also book such tour packages and excursions through a hotel concierge or ticket office. Examples include bus charters and tour bus operators.', 'Agen perjalanan yang utamanya menyediakan informasi perjalanan dan layanan pemesanan. Pedagang tersebut bertindak sebagai agen atas nama pelancong dalam memesan dan menerbitkan tiket transportasi udara, darat, atau laut atau akomodasi penginapan, termasuk penerbangan pesawat, tur bus, kapal pesiar, penyewaan mobil, transportasi kereta api, dan penginapan. Juga mencakup operator tur yang mengatur dan menyusun tur untuk dijual melalui agen perjalanan atau langsung ke konsumen. Seorang pelancong juga dapat memesan paket wisata dan ekskursi tersebut melalui hotel concierge atau kantor tiket. Contohnya mencakup carter bus dan operator bus wisata.', 'Transportasi');
-- ... [User to run replace on the rest of the file: ` -> [] and ' -> ''] ...
