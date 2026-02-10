// In-memory buckets
let otp_codes = [];
let merchant_applications = [];
let document_uploads = [];

class MockRequest {
    constructor() {
        this.params = {};
    }

    input(name, type, value) {
        this.params[name] = value;
        return this; // chaining
    }

    async query(command) {
        // Normalize command
        const cmd = command.trim().toLowerCase();

        console.log("📝 [MOCK DB] Executing Query:", cmd.substring(0, 50) + "...");

        // --- OTP LOGIC ---
        if (cmd.includes('insert into otp_codes')) {
            const newOtp = {
                id: otp_codes.length + 1,
                email: this.params.email,
                otp_code: this.params.otp_code,
                // Handle DATEADD(minute, 5, GETDATE()) logic simulation
                expires_at: new Date(Date.now() + 5 * 60 * 1000),
                used: 0,
                created_at: new Date()
            };
            otp_codes.push(newOtp);
            return { rowsAffected: [1] };
        }

        if (cmd.includes('select top 1 * from otp_codes')) {
            // Find valid OTP
            const match = otp_codes.find(o =>
                o.email === this.params.email &&
                o.otp_code === this.params.otp_code &&
                o.used === 0 &&
                new Date(o.expires_at) > new Date()
            );
            return { recordset: match ? [match] : [] };
        }

        if (cmd.includes('update otp_codes set used = 1')) {
            const otp = otp_codes.find(o => o.id === this.params.id);
            if (otp) otp.used = 1;
            return { rowsAffected: [otp ? 1 : 0] };
        }

        // --- MERCHANT REGISTRATION LOGIC ---
        if (cmd.includes('insert into merchant_applications')) {
            const newMerchant = {
                id: merchant_applications.length + 1,
                ticket_id: 'MOCK-TICKET-' + Date.now(),
                ...this.params,
                status: 'pending',
                submitted_at: new Date()
            };
            merchant_applications.push(newMerchant);
            return {
                recordset: [{ ticket_id: newMerchant.ticket_id, id: newMerchant.id }]
            };
        }

        if (cmd.includes('select top 1 * from merchant_applications')) {
            const match = merchant_applications.find(m => m.email === this.params.email); // Simple sorting ignored for mock
            return { recordset: match ? [match] : [] };
        }

        console.warn("⚠️ [MOCK DB] Unhandled Query Pattern:", cmd);
        return { recordset: [], rowsAffected: [0] };
    }
}

module.exports = {
    connect: async () => {
        console.log("⚠️ [MOCK DB] Connected to In-Memory Database");
        return {
            request: () => new MockRequest(),
            close: () => console.log("Mock DB Connection Closed")
        };
    },
    // Mock types for input()
    VarChar: 'VarChar',
    Int: 'Int',
    DateTime: 'DateTime',
    Text: 'Text',

    // Debug helper
    getStore: () => ({ otp_codes, merchant_applications })
};
