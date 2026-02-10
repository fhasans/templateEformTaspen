async function testBank() {
    const API_URL = "http://localhost:3000/api/bank";
    console.log("🚀 Testing Bank API...");

    // 1. Valid Account
    console.log("\n1️⃣ Testing Valid Account...");
    const res1 = await fetch(`${API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bankName: "Bank Mandiri",
            accountNumber: "1234567890"
        })
    });
    const data1 = await res1.json();
    console.log("Response:", data1);

    if (data1.success) {
        console.log("✅ Valid Account Check SUCCESS!");
    } else {
        console.error("❌ Valid Account Check FAILED!");
    }

    // 2. Invalid Account (Mock Logic: 0000000000 triggers failure)
    console.log("\n2️⃣ Testing Invalid Account...");
    const res2 = await fetch(`${API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bankName: "Bank Mandiri",
            accountNumber: "0000000000"
        })
    });
    const data2 = await res2.json();
    console.log("Response:", data2);

    if (!data2.success) {
        console.log("✅ Invalid Account Check SUCCESS! (Correctly rejected)");
    } else {
        console.error("❌ Invalid Account Check FAILED! (Should have been rejected)");
    }
}

testBank();
