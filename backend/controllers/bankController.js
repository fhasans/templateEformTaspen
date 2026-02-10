// MOCK BANK VALIDATION
// In production, this would call an external Bank API using Axios
exports.validateBankAccount = async (req, res) => {
    const { bankName = 'Bank Mandiri Taspen', accountNumber } = req.body;

    if (!accountNumber) {
        return res.status(400).json({ success: false, message: 'Account Number required' });
    }

    // SIMULATION LOGIC
    // Mocking success for specific patterns or just generally returning success for now as requested
    console.log(`🏦 Validating Bank: ${bankName} - ${accountNumber}`);

    // Simulation: Force failure for specific account number
    if (accountNumber === '0000000000') {
        return res.json({
            success: false,
            message: 'Rekening tidak ditemukan atau tidak aktif.'
        });
    }

    // Simulation: Success
    res.json({
        success: true,
        data: {
            isValid: true,
            accountName: "MOCK USER NAME (SIMULATED)",
            bankName: bankName,
            accountNumber: accountNumber
        }
    });
};
