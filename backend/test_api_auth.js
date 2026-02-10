async function testAuth() {
    const email = "test_api@example.com";
    const API_URL = "http://localhost:3000/api/auth";

    console.log("🚀 Testing Auth API...");

    // 1. Request OTP
    console.log("\n1️⃣ Requesting OTP...");
    const res = await fetch(`${API_URL}/otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json();
    console.log("Response:", data);

    if (!data.success) {
        console.error("❌ Failed to request OTP");
        return;
    }

    const otp = data.debug_otp; // Grab OTP from debug field
    if (!otp) {
        console.warn("⚠️ OTP not returned in debug mode. Cannot proceed automatically.");
        return;
    }

    // 2. Verify OTP
    console.log(`\n2️⃣ Verifying OTP: ${otp}...`);
    const resVerify = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    });
    const dataVerify = await resVerify.json();
    console.log("Response:", dataVerify);

    if (dataVerify.success) {
        console.log("\n✅ Auth Flow SUCCESS!");
    } else {
        console.error("\n❌ Auth Flow FAILED!");
    }
}

testAuth();
