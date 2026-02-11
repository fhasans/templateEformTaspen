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
            debug: true,
            logger: true
        });
        // const transporter = nodemailer.createTransport({ host: "smtp.office365.com", port: 587, secure: false, auth: { user: "estatement@bankmandiritaspen.co.id", pass: "PASSWORD" }, tls: { ciphers: "SSLv3" } });

        const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #003D79; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">Mandiri Taspen</h2>
                <p style="color: #a8c6fa; margin: 5px 0 0 0; font-size: 14px;">Mitra Terbaik Masa Depan Anda</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
                <h3 style="color: #333333; margin-top: 0;">Verifikasi Email Merchant</h3>
                <p style="color: #666666; line-height: 1.6;">
                    Halo Calon Mitra, <br><br>
                    Terima kasih telah mendaftar sebagai Merchant Mandiri Taspen. 
                    Silakan gunakan kode OTP berikut untuk memverifikasi email Anda:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; background-color: #f0f7ff; color: #003D79; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px 30px; border-radius: 8px; border: 2px dashed #003D79;">
                        ${code}
                    </span>
                </div>
                
                <p style="color: #666666; font-size: 14px; text-align: center;">
                    <em>Kode ini berlaku selama <strong>5 menit</strong>. Jangan berikan kode ini kepada siapapun.</em>
                </p>
                
                <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                
                <p style="color: #999999; font-size: 12px; text-align: center;">
                    Email ini dikirim otomatis. Mohon tidak membalas email ini.<br>
                    &copy; ${new Date().getFullYear()} Bank Mandiri Taspen. All rights reserved.
                </p>
            </div>
        </div>
        `;

        await transporter.sendMail({
            from: `"Mandiri Taspen Onboarding" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "🔐 Kode Verifikasi Merchant (OTP)",
            text: `Kode OTP Anda adalah: ${code}. Berlaku selama 5 menit.`,
            html: htmlTemplate,
        });

        console.log(`📧 Email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("\n❌ ==================== EMAIL ERROR ====================");
        console.error("Error Message:", error.message);
        console.error("Error Code:", error.code);
        console.error("SMTP Response:", error.response);
        console.error("SMTP Command:", error.command);
        console.error("\nSMTP Configuration:");
        console.error("  Host:", process.env.SMTP_HOST);
        console.error("  Port:", process.env.SMTP_PORT);
        console.error("  User:", process.env.SMTP_USER);
        console.error("  Pass:", process.env.SMTP_PASS ? "***" + process.env.SMTP_PASS.slice(-3) : "(not set)");
        console.error("\nFull Error Object:", JSON.stringify(error, null, 2));
        console.error("========================================================\n");
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
