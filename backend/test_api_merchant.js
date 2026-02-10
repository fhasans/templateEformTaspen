async function testMerchant() {
    const API_URL = "http://localhost:3000/api/merchant";
    console.log("🚀 Testing Merchant API...");

    const merchantData = {
        email: "merchant_test@example.com",
        nama_pemilik: "Budi Trader",
        no_hp_pemilik: "08123456789",
        alamat_pemilik: "Jl. Sudirman No. 1",
        nama_usaha: "Warung Budi",
        jenis_usaha: "Kuliner",
        alamat_usaha: "Jl. Thamrin No. 2",
        nomor_rekening: "1234567890",
        nama_pemilik_rekening: "Budi Trader",
        bank_penerima: "Bank Mandiri",
        cabang_bank: "Cabang Jakarta"
    };

    console.log("\n1️⃣ Registering Merchant...");
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merchantData)
    });
    const data = await res.json();
    console.log("Response:", data);

    if (data.success && data.ticket_id) {
        console.log("✅ Merchant Registration SUCCESS!");

        // Check Status
        console.log("\n2️⃣ Checking Status...");
        const resStatus = await fetch(`${API_URL}/status?email=${merchantData.email}`);
        const dataStatus = await resStatus.json();
        console.log("Status Response:", dataStatus);

        if (dataStatus.success) {
            console.log("✅ Status Check SUCCESS!");
        } else {
            console.error("❌ Status Check FAILED!");
        }

    } else {
        console.error("❌ Merchant Registration FAILED!");
    }
}

testMerchant();
