export const mapFormDataToPayload = (formData) => {
    return {
        submission_date: new Date().toISOString(),
        merchant_data: {
            // Step 1: Data Pemilik
            owner: {
                name: formData.dataPemilik.namaPemilik,
                identity_type: 'KTP', // Hardcoded as per form assumption
                identity_number: formData.dataPemilik.nik,
                phone: formData.dataPemilik.noHp,
                email: formData.dataPemilik.email,
                address: {
                    province: formData.dataPemilik.provinsi,
                    city: formData.dataPemilik.kabKota,
                    district: formData.dataPemilik.kecamatan,
                    subdistrict: formData.dataPemilik.kelurahan,
                    postal_code: formData.dataPemilik.kodePos,
                    full_address: formData.dataPemilik.alamatLengkap
                }
            },
            // Step 2: Data Usaha
            business: {
                name: formData.dataUsaha.namaUsaha,
                type: formData.dataUsaha.jenisUsaha,
                business_form: formData.dataUsaha.bentukUsaha,
                business_type: formData.dataUsaha.tipeBisnis,
                address: {
                    province: formData.dataUsaha.provinsiUsaha,
                    city: formData.dataUsaha.kabKotaUsaha,
                    district: formData.dataUsaha.kecamatanUsaha,
                    subdistrict: formData.dataUsaha.kelurahanUsaha,
                    postal_code: formData.dataUsaha.kodePosUsaha,
                    full_address: formData.dataUsaha.alamatUsaha
                }
            },
            // Step 4 (Now Step 1 logic): Keuangan
            financial: {
                bank_name: 'Bank Mandiri Taspen',
                account_number: formData.keuangan.nomorRekening,
                account_holder: formData.keuangan.namaPemilikRekening,
                customer_type: formData.dataPemilik.tipeNasabah
            },
            // Step 6: Konfigurasi & Transaksi
            configuration: {
                acquisition_branch: formData.konfigurasi.kodeCabangAkusisi,
                location_branch: formData.konfigurasi.kodeCabangLokasi,
                mcc_code: formData.konfigurasi.kodeMCC,
                business_category: formData.konfigurasi.kategoriUsaha,
                mdr_rate: formData.konfigurasi.mdr,
                qris_service_type: formData.dataPemilik.tipeLayananQRIS,
                projected_transaction: {
                    yearly_turnover: formData.dataTransaksi.omsetPerTahun,
                    avg_transaction: formData.dataTransaksi.avgTransaksi,
                    max_transaction: formData.dataTransaksi.maxTransaksi,
                    daily_freq: formData.dataTransaksi.freqHarian
                }
            },
            // Documents (File paths/names)
            documents: {
                ktp: formData.dokumen.fotoKTP ? formData.dokumen.fotoKTP.map(f => f.name) : [],
                npwp: formData.dokumen.fotoNPWP ? formData.dokumen.fotoNPWP.map(f => f.name) : [],
                merchant_form: formData.dokumen.formulirPermohonan ? formData.dokumen.formulirPermohonan.map(f => f.name) : [],
                others: formData.dokumen.dokumenLainnya ? formData.dokumen.dokumenLainnya.map(d => ({ title: d.namaDokumen, file: d.file ? d.file.name : '' })) : []
            }
        }
    };
};
