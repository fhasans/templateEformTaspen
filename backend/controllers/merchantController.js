const { sql } = require('../db');

// REGISTER NEW MERCHANT
exports.registerMerchant = async (req, res) => {
    try {
        const data = req.body;

        // Basic Validation
        if (!data.email || !data.nama_pemilik) {
            return res.status(400).json({ success: false, message: 'Email and Owner Name are required' });
        }

        const pool = await sql.connect();

        const request = pool.request();

        // Input Parameters mapping
        request.input('email', sql.VarChar, data.email);
        request.input('nama_pemilik', sql.VarChar, data.nama_pemilik || null);
        request.input('no_hp_pemilik', sql.VarChar, data.no_hp_pemilik || null);
        request.input('alamat_pemilik', sql.Text, data.alamat_pemilik || null);
        request.input('nama_usaha', sql.VarChar, data.nama_usaha || null);
        request.input('jenis_usaha', sql.VarChar, data.jenis_usaha || null);
        request.input('alamat_usaha', sql.Text, data.alamat_usaha || null);
        request.input('nomor_rekening', sql.VarChar, data.nomor_rekening || null);
        request.input('nama_pemilik_rekening', sql.VarChar, data.nama_pemilik_rekening || null);
        request.input('bank_penerima', sql.VarChar, data.bank_penerima || null);
        request.input('cabang_bank', sql.VarChar, data.cabang_bank || null);

        // Add other fields as needed based on schema
        // ... (can be expanded later for full fields)

        const result = await request.query(`
            INSERT INTO merchant_applications (
                email, nama_pemilik, no_hp_pemilik, alamat_pemilik,
                nama_usaha, jenis_usaha, alamat_usaha,
                nomor_rekening, nama_pemilik_rekening, bank_penerima, cabang_bank,
                status, submitted_at
            )
            OUTPUT INSERTED.ticket_id, INSERTED.id
            VALUES (
                @email, @nama_pemilik, @no_hp_pemilik, @alamat_pemilik,
                @nama_usaha, @jenis_usaha, @alamat_usaha,
                @nomor_rekening, @nama_pemilik_rekening, @bank_penerima, @cabang_bank,
                'pending', GETDATE()
            )
        `);

        res.status(201).json({
            success: true,
            message: 'Application Submitted Successfully',
            ticket_id: result.recordset[0].ticket_id
        });

    } catch (err) {
        console.error("Database Error (Register):", err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// GET APPLICATION STATUS (Optional helper)
exports.checkStatus = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query("SELECT TOP 1 * FROM merchant_applications WHERE email = @email ORDER BY submitted_at DESC");

        if (result.recordset.length > 0) {
            res.json({ success: true, data: result.recordset[0] });
        } else {
            res.status(404).json({ success: false, message: 'Application not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error checking status' });
    }
};
