// Validation utility functions for form fields

export const validators = {
    // Check if field is not empty
    required: (value) => {
        if (typeof value === 'string') {
            return value.trim() !== '';
        }
        return value !== null && value !== undefined && value !== '';
    },

    // Email format validation
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },

    // Numeric validation (no letters)
    numeric: (value) => {
        return /^\d+$/.test(value);
    },

    // Length validation
    minLength: (value, min) => {
        return value && value.length >= min;
    },

    maxLength: (value, max) => {
        return value && value.length <= max;
    },

    exactLength: (value, length) => {
        return value && value.length === length;
    },

    // NIK validation (16 digits)
    nik: (value) => {
        return validators.numeric(value) && validators.exactLength(value, 16);
    },

    // Phone number validation (max 15 digits)
    phone: (value) => {
        return validators.numeric(value) && value.length <= 15 && value.length > 0;
    },

    // NPWP validation (16 digits)
    npwp: (value) => {
        return validators.numeric(value) && validators.exactLength(value, 16);
    },

    // Nama Merchant QR validation (no special chars, 25th char not space)
    merchantQRName: (value) => {
        if (!value) return false;
        // Check for forbidden characters: %'<>`
        const forbiddenChars = /[%'<>`]/;
        if (forbiddenChars.test(value)) return false;
        // Check if 25th character is not a space
        if (value.length >= 25 && value[24] === ' ') return false;
        return true;
    },

    // File upload validation
    fileUploaded: (files) => {
        return files && files.length > 0;
    }
};

// Step-specific validation functions
export const validateStep1 = (data) => {
    const errors = {};

    if (!validators.required(data.tipeNasabah)) {
        errors.tipeNasabah = 'Tipe Nasabah harus dipilih';
    }

    if (!validators.required(data.tipeLayananQRIS)) {
        errors.tipeLayananQRIS = 'Tipe Layanan QRIS harus dipilih';
    }

    if (!validators.required(data.nomorIdentitas)) {
        errors.nomorIdentitas = 'Nomor Identitas harus diisi';
    } else if (!validators.nik(data.nomorIdentitas)) {
        errors.nomorIdentitas = 'NIK harus 16 digit angka';
    }

    if (!validators.required(data.namaPemilik)) {
        errors.namaPemilik = 'Nama Pemilik/Pengurus harus diisi';
    }

    if (!validators.required(data.noHpPemilik)) {
        errors.noHpPemilik = 'No HP Pemilik/Pengurus harus diisi';
    } else if (!validators.phone(data.noHpPemilik)) {
        errors.noHpPemilik = 'No HP harus berupa angka (max 15 digit)';
    }

    // Conditional NPWP validation
    if (data.tipeNasabah === 'badan_usaha') {
        if (!validators.required(data.npwpPemilik)) {
            errors.npwpPemilik = 'NPWP Pemilik harus diisi untuk Badan Usaha';
        } else if (!validators.npwp(data.npwpPemilik)) {
            errors.npwpPemilik = 'NPWP harus 16 digit angka';
        }
    }

    if (!validators.required(data.kodePos)) {
        errors.kodePos = 'Kode Pos harus dipilih';
    }

    if (!validators.required(data.alamat)) {
        errors.alamat = 'Alamat harus diisi';
    }

    if (!validators.required(data.rt)) {
        errors.rt = 'RT harus diisi';
    }

    if (!validators.required(data.rw)) {
        errors.rw = 'RW harus diisi';
    }

    if (!validators.required(data.provinsi)) {
        errors.provinsi = 'Provinsi harus dipilih';
    }

    if (!validators.required(data.kabKota)) {
        errors.kabKota = 'Kab/Kota harus dipilih';
    }

    if (!validators.required(data.kecamatan)) {
        errors.kecamatan = 'Kecamatan harus dipilih';
    }

    return errors;
};

export const validateStep2 = (data) => {
    const errors = {};

    if (!validators.required(data.jenisUsaha)) {
        errors.jenisUsaha = 'Jenis Usaha harus dipilih';
    }

    // Conditional Nama Merchant Official
    if (data.tipeNasabah === 'badan_usaha') {
        if (!validators.required(data.namaMerchantOfficial)) {
            errors.namaMerchantOfficial = 'Nama Merchant Official harus diisi untuk Badan Usaha';
        }
    }

    if (!validators.required(data.namaMerchantQR)) {
        errors.namaMerchantQR = 'Nama Merchant di QR harus diisi';
    } else if (!validators.merchantQRName(data.namaMerchantQR)) {
        errors.namaMerchantQR = 'Nama tidak valid. Karakter terlarang: %\'<>`. Karakter ke-25 tidak boleh spasi.';
    }

    if (!validators.required(data.emailNotifikasi)) {
        errors.emailNotifikasi = 'Email Notifikasi harus diisi';
    } else if (!validators.email(data.emailNotifikasi)) {
        errors.emailNotifikasi = 'Format email tidak valid';
    }

    if (!validators.required(data.emailMSR)) {
        errors.emailMSR = 'Email MSR harus diisi';
    } else if (!validators.email(data.emailMSR)) {
        errors.emailMSR = 'Format email tidak valid';
    }

    if (!validators.required(data.bentukUsaha)) {
        errors.bentukUsaha = 'Bentuk Usaha harus dipilih';
    }

    // Conditional Validation for Bentuk Usaha
    if (data.bentukUsaha === 'lainnya') {
        if (!validators.required(data.bentukUsahaLainnya)) {
            errors.bentukUsahaLainnya = 'Bentuk Usaha Lainnya harus diisi';
        }
    } else if (data.bentukUsaha === 'pameran') {
        if (!validators.required(data.pameran_start)) {
            errors.pameran_start = 'Jadwal Pameran Awal harus diisi';
        }
        if (!validators.required(data.pameran_end)) {
            errors.pameran_end = 'Jadwal Pameran Akhir harus diisi';
        }
        // Ideally, check if End Date >= Start Date
    }

    if (!validators.required(data.noTelponUsaha)) {
        errors.noTelponUsaha = 'No Telpon Usaha harus diisi';
    } else if (!validators.phone(data.noTelponUsaha)) {
        errors.noTelponUsaha = 'No Telpon harus berupa angka (max 15 digit)';
    }

    if (!validators.required(data.lingkunganUsaha)) {
        errors.lingkunganUsaha = 'Lingkungan Usaha harus dipilih';
    } else if (data.lingkunganUsaha === 'lainnya') {
        if (!validators.required(data.lingkunganUsahaLainnya)) {
            errors.lingkunganUsaha = 'Lingkungan Usaha Lainnya harus diisi'; // Using same error key for display simplicity
        }
    }

    if (!validators.required(data.statusTempat)) {
        errors.statusTempat = 'Status Tempat harus dipilih';
    }

    return errors;
};

export const validateStep3 = (data) => {
    const errors = {};

    if (!validators.required(data.namaPIC1)) {
        errors.namaPIC1 = 'Nama Penghubung (PIC 1) harus diisi';
    }

    if (!validators.required(data.noHpPIC1)) {
        errors.noHpPIC1 = 'Nomor HP (PIC 1) harus diisi';
    } else if (!validators.phone(data.noHpPIC1)) {
        errors.noHpPIC1 = 'No HP harus berupa angka (max 15 digit)';
    }

    return errors;
};

export const validateStep4 = (data) => {
    const errors = {};

    if (!validators.required(data.nomorRekening)) {
        errors.nomorRekening = 'Nomor Rekening harus diisi';
    }

    // Check if "Cek Rekening" has been executed
    // Field names match Step4Keuangan.jsx: namaPemilik, kodeCabang, tipeRekening
    if (!validators.required(data.namaPemilik)) {
        errors.namaPemilikRekening = 'Tolong Cek Rekening Terlebih Dahulu';
    }

    if (!validators.required(data.tipeRekening)) {
        errors.tipeRekening = 'Tolong Cek Rekening Terlebih Dahulu';
    }

    if (!validators.required(data.kodeCabang)) {
        errors.kodeCabangRekening = 'Tolong Cek Rekening Terlebih Dahulu';
    }

    // Status Kepemilikan is also mandatory
    if (!validators.required(data.statusKepemilikan)) {
        errors.statusKepemilikan = 'Status Kepemilikan harus dipilih';
    }

    return errors;
};

export const validateStep5 = (data) => {
    const errors = {};

    if (!validators.required(data.salesVolumePerTahun)) {
        errors.salesVolumePerTahun = 'Sales Volume Per Tahun harus diisi';
    }

    return errors;
};

export const validateStep6 = (data) => {
    const errors = {};

    if (!validators.required(data.kodeCabangAkusisi)) {
        errors.kodeCabangAkusisi = 'Kode Cabang Akusisi harus dipilih';
    }

    if (!validators.required(data.kodeCabangLokasi)) {
        errors.kodeCabangLokasi = 'Kode Cabang Lokasi harus dipilih';
    }

    if (!validators.required(data.kodeMCC)) {
        errors.kodeMCC = 'Kode MCC harus dipilih';
    }

    if (!validators.required(data.kategoriUsaha)) {
        errors.kategoriUsaha = 'Kategori Usaha harus dipilih';
    }

    if (!validators.required(data.mdr)) {
        errors.mdr = 'MDR harus dipilih';
    }

    if (!validators.required(data.jadwalSettlement)) {
        errors.jadwalSettlement = 'Jadwal Settlement harus diisi';
    }

    if (!validators.required(data.jumlahTerminal)) {
        errors.jumlahTerminal = 'Jumlah Terminal/Kasir harus diisi';
    }

    // Conditional: Biaya Admin EDC mandatory if QRIS Dinamis
    if (data.tipeLayananQRIS === 'QRIS Dinamis') {
        if (!validators.required(data.biayaAdminEDC)) {
            errors.biayaAdminEDC = 'Biaya Administrasi EDC harus diisi untuk QRIS Dinamis';
        }
    }

    return errors;
};

export const validateStep7 = (data) => {
    const errors = {};

    if (!validators.fileUploaded(data.fotoKTP)) {
        errors.fotoKTP = 'Foto KTP harus diupload';
    }

    if (!validators.fileUploaded(data.fotoNPWP)) {
        errors.fotoNPWP = 'Foto NPWP harus diupload';
    }

    if (!validators.fileUploaded(data.formulirPermohonan)) {
        errors.formulirPermohonan = 'Formulir Permohonan & Syarat Ketentuan harus diupload';
    }

    return errors;
};

// Main validation function that routes to step-specific validators
// Note: UI step order is now matching the file naming convention
// Step 1 = Step1DataPemilik, Step 2 = Step2DataUsaha, etc.
export const validateStep = (uiStepNumber, data) => {
    switch (uiStepNumber) {
        case 1:
            return validateStep1(data); // Data Pemilik
        case 2:
            return validateStep2(data); // Data Usaha
        case 3:
            return validateStep3(data); // Profil
        case 4:
            return validateStep4(data); // Keuangan
        case 5:
            return validateStep5(data); // Data Transaksi
        case 6:
            return validateStep6(data); // Konfigurasi
        case 7:
            return validateStep7(data); // Dokumen
        default:
            return {};
    }
};
