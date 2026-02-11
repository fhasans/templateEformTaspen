const { sql, connectDB } = require('./db');

async function fixSchema() {
    try {
        await connectDB();
        const request = new sql.Request();

        console.log("🛠️ Fixing Schema for T_ONBOARDING_FINTECH...");

        // ALTER COLUMN commands needs to be run one by one or in a block? 
        // SQL Server supports multiple ALTERS if separated keyframes? No, standard SQL.
        // Best to run them as a batch.

        await request.query(`
            ALTER TABLE T_ONBOARDING_FINTECH ALTER COLUMN KODE_CABANG VARCHAR(100);
            ALTER TABLE T_ONBOARDING_FINTECH ALTER COLUMN KC_AKUISISI VARCHAR(100);
            ALTER TABLE T_ONBOARDING_FINTECH ALTER COLUMN KC_LOKASI VARCHAR(100);
            ALTER TABLE T_ONBOARDING_FINTECH ALTER COLUMN KATEGORI_USAHA VARCHAR(100);
            ALTER TABLE T_ONBOARDING_FINTECH ALTER COLUMN BANK_CODE VARCHAR(50);
            ALTER TABLE T_ONBOARDING_FINTECH ALTER COLUMN TIPE_REKENING VARCHAR(50);
            ALTER TABLE T_ONBOARDING_FINTECH ALTER COLUMN STATUS_KEPEMILIKAN VARCHAR(50);
        `);

        console.log("✅ Schema Fixed Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error fixing schema:", err);
        process.exit(1);
    }
}

fixSchema();
