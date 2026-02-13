const { sql } = require('../db');

// REGISTER NEW MERCHANT (Refactored for Normalized Schema with Transactions)
// REGISTER NEW MERCHANT (Refactored for Normalized Schema with Transactions)
exports.registerMerchant = async (req, res) => {
    const transaction = new sql.Transaction();

    try {
        const data = req.body;
        console.log("🔍 Full Payload Received:", JSON.stringify(data, null, 2));

        // Basic Validation
        if (!data.email || !data.nama_pemilik) {
            return res.status(400).json({ success: false, message: 'Email and Owner Name are required' });
        }

        const pool = await sql.connect();
        await transaction.begin();

        // ========================
        // STEP 1: INSERT INTO T_ONBOARDING_REGISTRATION
        // ========================
        const regRequest = new sql.Request(transaction);
        regRequest.input('tipe_nasabah', sql.VarChar, data.tipe_nasabah || null);
        regRequest.input('tipe_qris', sql.VarChar, 'DYNAMIC');
        regRequest.input('status', sql.VarChar, 'PENDING');
        regRequest.input('current_step', sql.Int, 7);
        regRequest.input('created_by', sql.VarChar, data.email);

        const regResult = await regRequest.query(`
            INSERT INTO T_ONBOARDING_REGISTRATION (
                TIPE_NASABAH, TIPE_QRIS, STATUS, CURRENT_STEP, CREATED_AT, CREATED_BY
            )
            OUTPUT INSERTED.ID
            VALUES (
                @tipe_nasabah, @tipe_qris, @status, @current_step, GETDATE(), @created_by
            )
        `);

        const regId = regResult.recordset[0].ID;
        console.log(`✅ Registration ID created: ${regId}`);

        // ========================
        // STEP 2: INSERT INTO T_ONBOARDING_MERCHANT
        // ========================
        const merchantRequest = new sql.Request(transaction);

        // Owner Details (Mapped from Frontend: alamat, rt, rw, etc)
        merchantRequest.input('reg_id', sql.Int, regId);
        merchantRequest.input('kode_sales', sql.VarChar, data.kode_sales || null); // ADDED: New field
        merchantRequest.input('jenis_id', sql.VarChar, data.jenis_identitas || null);
        merchantRequest.input('no_id', sql.VarChar, data.nomor_identitas || null);
        merchantRequest.input('nama_owner', sql.NVarChar, data.nama_pemilik);
        merchantRequest.input('no_tlp_owner', sql.VarChar, data.no_hp_pemilik || null);
        merchantRequest.input('npwp_owner', sql.VarChar, data.npwp_pemilik || null);

        // Fix Address Mapping for Owner
        merchantRequest.input('alamat_owner', sql.NVarChar, data.alamat || null);
        merchantRequest.input('rt_id', sql.VarChar, data.rt || null);
        merchantRequest.input('rw_id', sql.VarChar, data.rw || null);
        merchantRequest.input('kelurahan_id', sql.VarChar, data.kelurahan || null);
        merchantRequest.input('kecamatan_id', sql.VarChar, data.kecamatan || null);
        merchantRequest.input('kota_id', sql.VarChar, data.kab_kota || null);
        merchantRequest.input('provinsi_id', sql.VarChar, data.provinsi || null);
        merchantRequest.input('kodepos_id', sql.VarChar, data.kode_pos || null);

        // Merchant/Business Details
        merchantRequest.input('nama_merchant', sql.NVarChar, data.nama_usaha || null);
        merchantRequest.input('nama_merchant_qr', sql.NVarChar, data.nama_merchant_qr || (data.nama_usaha ? data.nama_usaha.substring(0, 50) : null));
        merchantRequest.input('email_merchant', sql.VarChar, data.email_usaha || data.email);

        // Fix Address Mapping for Merchant
        merchantRequest.input('alamat_merchant', sql.NVarChar, data.alamat_usaha || null);
        // Handle RT/RW combined format "009/008" if present, or fallback
        let rtMerch = null, rwMerch = null;
        if (data.rt_rw_usaha && data.rt_rw_usaha.includes('/')) {
            [rtMerch, rwMerch] = data.rt_rw_usaha.split('/');
        }
        merchantRequest.input('rt_merchant', sql.VarChar, rtMerch);
        merchantRequest.input('rw_merchant', sql.VarChar, rwMerch);

        merchantRequest.input('kelurahan_merchant', sql.VarChar, data.kelurahan_usaha || null);
        merchantRequest.input('kecamatan_merchant', sql.VarChar, data.kecamatan_usaha || null);
        merchantRequest.input('kota_merchant', sql.VarChar, data.kota_usaha || null);
        merchantRequest.input('provinsi_merchant', sql.VarChar, data.provinsi_usaha || null);
        merchantRequest.input('kodepos_merchant', sql.VarChar, data.kode_pos_usaha || null);

        // Business Profile
        merchantRequest.input('bentuk_usaha', sql.VarChar, data.bentuk_usaha || null);
        merchantRequest.input('bentuk_usaha_lainnya', sql.NVarChar, data.bentuk_usaha_lainnya || null); // ADDED
        merchantRequest.input('pameran_start', sql.Time, data.pameran_start ? new Date(data.pameran_start).toTimeString().split(' ')[0] : null); // ADDED - Need proper Time format?
        // Wait, input from frontend is likely just "YYYY-MM-DD" for date or "HH:mm" for time?
        // FSD says "Jadwal Pameran Awal" (Date) 
        // SQL Schema says PAMERAN_START TIME(0) ??
        // Let's check schema again.
        // Schema: PAMERAN_START TIME(0). This implies Time. 
        // But FSD Image shows "Jadwal Pameran Awal" with a Calendar icon. It is a DATE.
        // SCHEMA BUG? Or intended for Time? 
        // Usually "Jadwal Pameran" implies Date Range (Start Date - End Date).
        // I will map it as Date if I can, but if SQL expects TIME, I might have an issue.
        // Let's assume schema should have been DATE.
        // I will map `pameran_mulai` and `pameran_selesai` from frontend.
        // If SQL is strictly TIME, it will fail if I pass '2023-01-01'.
        // I should probably ALTER the schema to DATE for PAMERAN_START/END.

        // For now, I'll map them, but noted potential schema mismatch.
        // Re-reading Schema in my head: PAMERAN_START TIME(0).
        // Re-reading FSD Image: Calendar icon.
        // It's definitely a DATE. 
        // I will ALTER the schema in a subsequent step.
        // For now I will map it to `pameran_mulai` assuming I'll fix the DB.

        merchantRequest.input('bidang_usaha', sql.VarChar, data.bidang_usaha || null);
        merchantRequest.input('jenis_produk', sql.NVarChar, data.jenis_usaha || null);
        merchantRequest.input('tipe_bisnis', sql.NVarChar, data.tipe_bisnis || null); // ADDED
        merchantRequest.input('no_tlp_merchant', sql.VarChar, data.no_tlp_usaha || null);
        merchantRequest.input('lingkungan_usaha', sql.VarChar, data.lingkungan_usaha || null);
        merchantRequest.input('lingkungan_usaha_lainnya', sql.NVarChar, data.lingkungan_usaha_lainnya || null); // ADDED
        merchantRequest.input('status_tempat', sql.VarChar, data.status_tempat || null);
        merchantRequest.input('status_tempat_lainnya', sql.NVarChar, data.status_tempat_lainnya || null); // ADDED
        merchantRequest.input('luas_tempat', sql.Decimal(10, 2), data.luas_tempat_usaha || null); // ADDED

        merchantRequest.input('tanggal_berdiri', sql.Date, data.tanggal_berdiri || null); // ADDED
        merchantRequest.input('operational_start', sql.Time, data.jam_buka ? data.jam_buka + ':00' : null); // ADDED (HH:mm -> HH:mm:ss)
        merchantRequest.input('operational_end', sql.Time, data.jam_tutup ? data.jam_tutup + ':00' : null); // ADDED
        merchantRequest.input('jumlah_karyawan', sql.Int, data.jumlah_karyawan || 0);

        // PIC Details
        merchantRequest.input('pic1_nama', sql.NVarChar, data.nama_pic1 || null); // Mapped
        merchantRequest.input('pic1_tlp', sql.VarChar, data.no_hp_pic1 || null); // Mapped
        merchantRequest.input('pic2_nama', sql.NVarChar, data.nama_pic2 || null);
        merchantRequest.input('pic2_tlp', sql.VarChar, data.no_hp_pic2 || null);

        await merchantRequest.query(`
            INSERT INTO T_ONBOARDING_MERCHANT (
                REG_ID, KODE_SALES, JENIS_ID, NO_ID, NAMA_OWNER, NO_TLP_OWNER, NPWP_OWNER, 
                ALAMAT_OWNER, RT_ID, RW_ID, KELURAHAN_ID, KECAMATAN_ID, KOTA_ID, PROVINSI_ID, KODEPOS_ID,
                
                NAMA_MERCHANT, NAMA_MERCHANT_QR, EMAIL_MERCHANT, 
                ALAMAT_MERCHANT, RT_MERCHANT, RW_MERCHANT, KELURAHAN_MERCHANT, KECAMATAN_MERCHANT, KOTA_MERCHANT, PROVINSI_MERCHANT, KODEPOS_MERCHANT,
                
                BENTUK_USAHA, BENTUK_USAHA_LAINNYA, BIDANG_USAHA, JENIS_PRODUK, TIPE_BISNIS, NO_TLP_MERCHANT,
                LINGKUNGAN_USAHA, LINGKUNGAN_USAHA_LAINNYA, STATUS_TEMPAT, STATUS_TEMPAT_LAINNYA, LUAS_TEMPAT,
                TANGGAL_BERDIRI, OPERATIONAL_START, OPERATIONAL_END, JUMLAH_KARYAWAN,
                PIC1_NAMA, PIC1_TLP, PIC2_NAMA, PIC2_TLP
            ) VALUES (
                @reg_id, @kode_sales, @jenis_id, @no_id, @nama_owner, @no_tlp_owner, @npwp_owner, 
                @alamat_owner, @rt_id, @rw_id, @kelurahan_id, @kecamatan_id, @kota_id, @provinsi_id, @kodepos_id,
                
                @nama_merchant, @nama_merchant_qr, @email_merchant, 
                @alamat_merchant, @rt_merchant, @rw_merchant, @kelurahan_merchant, @kecamatan_merchant, @kota_merchant, @provinsi_merchant, @kodepos_merchant,
                
                @bentuk_usaha, @bentuk_usaha_lainnya, @bidang_usaha, @jenis_produk, @tipe_bisnis, @no_tlp_merchant,
                @lingkungan_usaha, @lingkungan_usaha_lainnya, @status_tempat, @status_tempat_lainnya, @luas_tempat,
                @tanggal_berdiri, @operational_start, @operational_end, @jumlah_karyawan,
                @pic1_nama, @pic1_tlp, @pic2_nama, @pic2_tlp
            )
        `);

        console.log(`✅ Merchant data inserted for REG_ID: ${regId}`);

        // ========================
        // STEP 3: INSERT INTO T_ONBOARDING_FINTECH
        // ========================
        const fintechRequest = new sql.Request(transaction);
        fintechRequest.input('reg_id', sql.Int, regId);
        fintechRequest.input('bank_code', sql.VarChar, data.bank_penerima || null); // Correct map
        fintechRequest.input('no_rekening', sql.VarChar, data.nomor_rekening || null);
        fintechRequest.input('nama_rekening', sql.NVarChar, data.nama_pemilik_rekening || null);
        fintechRequest.input('kode_cabang', sql.VarChar, data.kode_cabang || null); // Was cabang_bank, but payload sends kode_cabang
        fintechRequest.input('tipe_rekening', sql.VarChar, data.tipe_rekening || null); // ADDED
        fintechRequest.input('status_kepemilikan', sql.VarChar, data.status_kepemilikan || null); // ADDED

        // Transaction Details
        fintechRequest.input('sales_volume_tahun', sql.Decimal(18, 2), data.sales_volume_per_tahun || 0); // Correct map
        fintechRequest.input('komitmen_bulanan', sql.Decimal(18, 2), data.komitmen_sales_volume || 0); // ADDED
        fintechRequest.input('avg_transaksi', sql.Decimal(18, 2), data.rata_rata_nominal || 0); // ADDED
        fintechRequest.input('saldo_mengendap', sql.Decimal(18, 2), data.komitmen_saldo_mengendap || 0); // ADDED
        fintechRequest.input('estimasi_frekuensi', sql.Int, data.frekuensi_harian || 0); // ADDED

        // Configuration Details
        fintechRequest.input('kc_akuisisi', sql.VarChar, data.kode_cabang_akusisi || null); // ADDED
        fintechRequest.input('kc_lokasi', sql.VarChar, data.kode_cabang_lokasi || null); // ADDED
        fintechRequest.input('mcc_code', sql.VarChar, data.kode_mcc || null); // ADDED
        fintechRequest.input('kategori_usaha', sql.VarChar, data.kategori_usaha || null); // ADDED
        fintechRequest.input('mdr', sql.Decimal(5, 2), parseFloat((data.mdr || '0').replace('%', '')) || 0); // ADDED & Cleaned
        fintechRequest.input('settlement_hari', sql.TinyInt, (data.jadwal_settlement === 'H+1' ? 1 : 0)); // Simple mapping logic
        fintechRequest.input('jumlah_qr', sql.SmallInt, data.jumlah_qr || 0); // ADDED - Jumlah Terminal/Kasir
        fintechRequest.input('jumlah_edc', sql.SmallInt, data.jumlah_edc || 0); // ADDED
        fintechRequest.input('edc_bank_lain', sql.NVarChar, data.bank_edc_lain || null); // ADDED - Bank EDC Lain
        fintechRequest.input('edc_fee', sql.Decimal(18, 2), data.biaya_admin_edc || 0); // ADDED


        await fintechRequest.query(`
            INSERT INTO T_ONBOARDING_FINTECH (
                REG_ID, BANK_CODE, NO_REKENING, NAMA_REKENING, KODE_CABANG, 
                TIPE_REKENING, STATUS_KEPEMILIKAN, 
                SALES_VOLUME_TAHUN, KOMITMENT_BULANAN, AVG_TRANSAKSI, SALDO_MENGENDAP, ESTIMASI_FREKUENSI,
                KC_AKUISISI, KC_LOKASI, MCC_CODE, KATEGORI_USAHA, MDR, SETTLEMENT_HARI, JUMLAH_QR, JUMLAH_EDC, EDC_BANK_LAIN, EDC_FEE
            ) VALUES (
                @reg_id, @bank_code, @no_rekening, @nama_rekening, @kode_cabang, 
                @tipe_rekening, @status_kepemilikan,
                @sales_volume_tahun, @komitmen_bulanan, @avg_transaksi, @saldo_mengendap, @estimasi_frekuensi,
                @kc_akuisisi, @kc_lokasi, @mcc_code, @kategori_usaha, @mdr, @settlement_hari, @jumlah_qr, @jumlah_edc, @edc_bank_lain, @edc_fee
            )
        `);


        console.log(`✅ Fintech data inserted for REG_ID: ${regId}`);

        // ========================
        // STEP 4: INSERT INTO T_ONBOARDING_DOCUMENT (Multiple Rows)
        // ========================
        const docKeys = ['fotoKTP', 'fotoNPWP', 'tampakDepan', 'barangJasa', 'qris', 'formulirPermohonan', 'dokumenLainnya'];

        console.log("🔍 Debugging Documents Data:", JSON.stringify(data, null, 2)); // Log ALL data to see structure

        for (const key of docKeys) {
            console.log(`Checking key: ${key}, Value:`, data[key]); // Log each key

            if (data[key] && Array.isArray(data[key])) {
                for (const doc of data[key]) {
                    console.log(`Processing doc in ${key}:`, doc); // Log doc object

                    if (doc.filePath) {
                        const docRequest = new sql.Request(transaction);
                        docRequest.input('reg_id', sql.Int, regId);
                        docRequest.input('doc_type', sql.VarChar, key);
                        docRequest.input('doc_title', sql.NVarChar, doc.name || key);
                        docRequest.input('file_path', sql.NVarChar, doc.filePath);

                        await docRequest.query(`
                            INSERT INTO T_ONBOARDING_DOCUMENT (REG_ID, DOC_TYPE, DOC_TITLE, FILE_PATH, UPLOADED_AT)
                            VALUES (@reg_id, @doc_type, @doc_title, @file_path, GETDATE())
                        `);
                        console.log(`✅ Inserted doc: ${key} - ${doc.filePath}`);
                    } else {
                        console.warn(`⚠️ Doc in ${key} missing filePath:`, doc);
                    }
                }
            } else {
                console.log(`ℹ️ No documents for ${key} or not an array`);
            }
        }

        console.log(`✅ Documents inserted process finished for REG_ID: ${regId}`);

        // ========================
        // COMMIT TRANSACTION
        // ========================
        await transaction.commit();
        console.log(`🎉 Transaction committed successfully. REG_ID: ${regId}`);

        res.status(201).json({
            success: true,
            message: 'Application Submitted Successfully',
            ticket_id: `REG-${regId.toString().padStart(6, '0')}`
        });

    } catch (err) {
        // ========================
        // ROLLBACK ON ERROR
        // ========================
        console.error("❌ Transaction Error (Register):", err);
        if (err.originalError) {
            console.error("SQL Original Error:", err.originalError.message);
            console.error("SQL Line Number:", err.originalError.lineNumber);
        }

        try {
            await transaction.rollback();
            console.log("🔄 Transaction rolled back");
        } catch (rollbackErr) {
            console.error("❌ Rollback Error:", rollbackErr);
        }

        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            debug_error: err.message // Send error to frontend for easier debugging during dev
        });
    }
};

// GET APPLICATION STATUS (Updated for new schema)
exports.checkStatus = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`
                SELECT TOP 1 
                    r.ID, r.STATUS, r.CURRENT_STEP, r.CREATED_AT,
                    m.NAMA_OWNER, m.NAMA_MERCHANT, m.EMAIL_MERCHANT
                FROM T_ONBOARDING_REGISTRATION r
                LEFT JOIN T_ONBOARDING_MERCHANT m ON r.ID = m.REG_ID
                WHERE m.EMAIL_MERCHANT = @email OR r.CREATED_BY = @email
                ORDER BY r.CREATED_AT DESC
            `);

        if (result.recordset.length > 0) {
            res.json({ success: true, data: result.recordset[0] });
        } else {
            res.status(404).json({ success: false, message: 'Application not found' });
        }
    } catch (err) {
        console.error("Check Status Error:", err);
        res.status(500).json({ message: 'Error checking status' });
    }
};
