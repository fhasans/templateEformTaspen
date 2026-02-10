const { sql } = require('../db');
const nodemailer = require('nodemailer');

// Helper to send email
async function sendEmail(email, code) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("⚠️ SMTP Credentials not found. Skipping real email send.");
        return false;
    }

    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Mandiri Taspen Onboarding" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Kode Verifikasi Merchant (OTP)",
            text: `Kode OTP Anda adalah: ${code}. Berlaku selama 5 menit.`,
            html: `<b>Kode OTP Anda adalah: ${code}</b><br>Berlaku selama 5 menit.`,
        });

        console.log(`📧 Email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Email send failed:", error);
        return false;
    }
}

// REQUEST OTP
exports.requestOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Use SQL Server time for expiry to avoid timezone mismatches

    try {
        const pool = await sql.connect();

        // 1. Save to DB
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('otp_code', sql.VarChar, otpCode)
            .query(`
                INSERT INTO otp_codes (email, otp_code, expires_at)
                VALUES (@email, @otp_code, DATEADD(minute, 5, GETDATE()))
            `);

        // 2. Send Email
        const emailSent = await sendEmail(email, otpCode);

        // 3. Return Response (with debug info if email failed)
        if (emailSent) {
            res.json({ success: true, message: 'OTP sent to email.' });
        } else {
            // FALLBACK FOR DEV: Return OTP in response if SMTP fails
            console.log(`⚠️ SMTP Failed. OTP for ${email} is ${otpCode}`);
            res.json({
                success: true,
                message: 'OTP generated (SMTP Failed - Check Verify Console)',
                debug_otp: otpCode
            });
        }

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email & OTP required' });

    try {
        const pool = await sql.connect();

        // Check OTP in DB (Must calculate match & expiry)
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('otp_code', sql.VarChar, otp)
            .query(`
                SELECT TOP 1 * FROM otp_codes 
                WHERE email = @email 
                AND otp_code = @otp_code 
                AND used = 0
                AND expires_at > GETDATE()
                ORDER BY created_at DESC
            `);

        if (result.recordset.length > 0) {
            // Valid! Mark as used
            const id = result.recordset[0].id;
            await pool.request()
                .input('id', sql.Int, id)
                .query("UPDATE otp_codes SET used = 1 WHERE id = @id");

            res.json({ success: true, message: 'OTP Verified' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid or Expired OTP' });
        }

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
