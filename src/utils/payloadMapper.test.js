import { describe, it, expect, vi } from 'vitest';
// We need to test constructPayload which is inside MerchantForm.
// Since it's internal, we have two options: export it or test via interaction.
// Exporting it is cleaner for unit testing logic.
// However, since we can't easily modify MerchantForm to export it without refactoring,
// We will create a test that replicates the logic or assumes we refactor.
// LET'S REFACTOR MerchantForm first to export constructPayload or move it to utils/payloadBuilder.js

// IMPLEMENTATION STRATEGY:
// 1. Move helper logic to `src/utils/payloadBuilder.js`
// 2. Test `src/utils/payloadBuilder.js`

/* 
   Since I cannot easily refactor into a new file without breaking the component's internal state usage 
   (it uses formData from state), I will mock the data structure here and test the mapping logic 
   if I were to extract it. 
   
   BETTER: I will modify MerchantForm to export the helper if possible, but it's inside the component.
   
   ALTERNATIVE: I will create a `src/utils/payloadMapper.js` file, move the logic there, 
   import it in MerchantForm, and test it separately. This is the best architectural approach.
*/

import { mapFormDataToPayload } from '../utils/payloadMapper';

describe('Payload Mapper', () => {
    it('should correctly map form data to API payload structure', () => {
        const mockFormData = {
            dataPemilik: {
                namaPemilik: 'John Doe',
                nik: '1234567890123456',
                noHp: '08123456789',
                email: 'john@example.com',
                provinsi: 'DKI Jakarta',
                kabKota: 'Jakarta Selatan',
                kecamatan: 'Setiabudi',
                kelurahan: 'Karet',
                kodePos: '12930',
                alamatLengkap: 'Jl. Sudirman No. 1',
                tipeNasabah: 'Perorangan',
                tipeLayananQRIS: 'Statis'
            },
            dataUsaha: {
                namaUsaha: 'Kopi John',
                jenisUsaha: 'F&B',
                bentukUsaha: 'Perorangan',
                tipeBisnis: 'UMKM',
                provinsiUsaha: 'DKI Jakarta',
                kabKotaUsaha: 'Jakarta Selatan',
                kecamatanUsaha: 'Tebet',
                kelurahanUsaha: 'Tebet Barat',
                kodePosUsaha: '12810',
                alamatUsaha: 'Jl. Tebet Raya'
            },
            keuangan: {
                nomorRekening: '1234567890',
                namaPemilikRekening: 'John Doe'
            },
            konfigurasi: {
                kodeCabangAkusisi: '001',
                kodeCabangLokasi: '002',
                kodeMCC: '5812',
                kategoriUsaha: 'Restoran',
                mdr: '0.7%'
            },
            dataTransaksi: {
                omsetPerTahun: '100000000',
                avgTransaksi: '50000',
                maxTransaksi: '100000',
                freqHarian: '50'
            },
            dokumen: {
                fotoKTP: [{ name: 'ktp.jpg' }],
                fotoNPWP: [],
                formulirPermohonan: [{ name: 'form.pdf' }],
                dokumenLainnya: [{ namaDokumen: 'SIUP', file: { name: 'siup.pdf' } }]
            }
        };

        const result = mapFormDataToPayload(mockFormData);

        expect(result.merchant_data.owner.name).toBe('John Doe');
        expect(result.merchant_data.owner.identity_number).toBe('1234567890123456');
        expect(result.merchant_data.business.name).toBe('Kopi John');
        expect(result.merchant_data.financial.account_number).toBe('1234567890');
        expect(result.merchant_data.documents.ktp).toContain('ktp.jpg');
        expect(result.merchant_data.documents.others[0].title).toBe('SIUP');
        expect(result.submission_date).toBeDefined();
    });
});
