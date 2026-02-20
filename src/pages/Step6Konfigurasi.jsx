import React, { useState, useEffect } from 'react';
import FormSection from '../components/FormSection';
import Input from '../components/Input';
import Select from '../components/Select';
import { formatCurrency, parseCurrency } from '../utils/currencyFormatter';
import { API_BASE_URL } from '../config/api';

const Step6Konfigurasi = ({ data = {}, updateData, dataPemilik = {}, dataTransaksi = {}, dataUsaha = {}, errors = {} }) => {

    // Check if QRIS Dinamis is selected in Step 1
    const isQrisDinamis = dataPemilik.tipeLayananQRIS === 'dinamis';

    // State for dynamic options and loading
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [loadingKategori, setLoadingKategori] = useState(false);
    const [fullKategoriData, setFullKategoriData] = useState([]); // Store full objects to lookup MDR

    const handleChange = (field, value) => {
        // For currency fields, parse the formatted value to store raw numbers
        // Check if this is the biayaAdminEDC field (currency field)
        if (field === 'biayaAdminEDC') {
            const rawValue = parseCurrency(value);
            updateData({ [field]: rawValue });
        } else {
            updateData({ [field]: value });
        }
    };

    // Initialize defaults (only if fields are empty)
    useEffect(() => {
        const defaults = {
            kodeCabangAkusisi: '1201',
            kodeCabangLokasi: '1201',
            kodeMCC: dataUsaha.jenisUsaha || '5310', // Auto-fill from Step 2 or default
            // Default Kategori Usaha and MDR will be handled by dynamic logic or leave empty
        };

        const updates = {};
        Object.keys(defaults).forEach(key => {
            if (!data[key]) {
                updates[key] = defaults[key];
            }
        });

        // Force update MCC if it differs from Step 2 (in case user went back and changed Step 2)
        if (dataUsaha.jenisUsaha && data.kodeMCC !== dataUsaha.jenisUsaha) {
            updates.kodeMCC = dataUsaha.jenisUsaha;
        }

        if (Object.keys(updates).length > 0) {
            updateData(updates);
        }
    }, [dataUsaha.jenisUsaha]); // Dependency on dataUsaha.jenisUsaha

    // Fetch Kategori Usaha based on sales volume
    useEffect(() => {
        const fetchKategori = async () => {
            setLoadingKategori(true);
            try {
                // Get sales volume from dataTransaksi and clean it
                // Need to defensively handle if dataTransaksi is undefined or property missing
                const rawSalesVolume = (dataTransaksi?.salesVolumePerTahun || '0').toString().replace(/[^0-9]/g, '');

                // Construct URL with query param
                const url = `${API_BASE_URL}/kategori-usaha${rawSalesVolume ? `?salesVolume=${rawSalesVolume}` : ''}`;

                console.log('Fetching Kategori Usaha from:', url);

                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch kategori usaha');

                const result = await response.json();
                setFullKategoriData(result);

                // Map to options format for Select component
                // Format: "JENIS_MERCHANT - KATEGORI_MERCHANT"
                // Value should be unique. Using KATEGORI_MERCHANT string as value.

                const options = result.map(item => ({
                    value: item.KATEGORI_MERCHANT,
                    label: `${item.JENIS_MERCHANT} - ${item.KATEGORI_MERCHANT}`,
                }));

                setKategoriOptions(options);

                // Validation: If current selected value is NOT in the new options (e.g. volume changed), 
                // we should probably warn or let user know. 
                // But auto-clearing might be annoying. We'll leave it unless it's strictly required.

                // Auto-select if requested? Not requested. Just filter logic.

            } catch (err) {
                console.error("Error fetching kategori usaha:", err);
                setKategoriOptions([]);
            } finally {
                setLoadingKategori(false);
            }
        };

        fetchKategori();
    }, [dataTransaksi?.salesVolumePerTahun]); // Re-run when sales volume changes

    // Handle Kategori Usaha Change -> Auto-set MDR & Settlement
    const handleKategoriChange = (selectedKategori) => {
        // Update the selected category
        const updates = { kategoriUsaha: selectedKategori };

        // Find the full data object to get MDR and other rules
        const selectedItem = fullKategoriData.find(item => item.KATEGORI_MERCHANT === selectedKategori);

        if (selectedItem) {
            // Auto-set MDR
            // MDR in DB is typically float (e.g. 0.003). Convert to percentage string '0.3%'
            // We multiply by 100 and fix to 1 decimal place, removing trailing .0 if any
            const mdrVal = parseFloat(selectedItem.MDR);
            let mdrPersen = '0%';

            if (!isNaN(mdrVal)) {
                // Example: 0.007 -> 0.7
                const percent = (mdrVal * 100);
                // Check if it has decimals. If integer, don't show .0
                mdrPersen = Number.isInteger(percent) ? `${percent}%` : `${percent.toFixed(1)}%`;
            }

            updates.mdr = mdrPersen;

            // Auto-set Jadwal Settlement
            // Logic: "UMI" (Usaha Mikro) -> H+0, Non-UMI -> H+1
            // We check if the KATEGORI_MERCHANT string contains "UMI" or "Mikro"
            // OR checks against JENIS_MERCHANT if available.

            const isUMI = (selectedItem.KATEGORI_MERCHANT && (
                selectedItem.KATEGORI_MERCHANT.includes('UMI') ||
                selectedItem.KATEGORI_MERCHANT.includes('Mikro')
            ));

            if (isUMI) {
                updates.jadwalSettlement = '0'; // H+0
            } else {
                updates.jadwalSettlement = '1'; // H+1
            }
        }

        updateData(updates);
    };

    const handleTerminalChange = (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        updateData({ jumlahTerminal: val.toString() });
    };

    // Helper for displaying Settlement text
    const getSettlementText = (val) => {
        if (val === '0') return 'H+0 (Transaksi Hari Ini)';
        if (val === '1') return 'H+1 (Hari Berikutnya)';
        return '';
    };

    return (
        <FormSection title="Konfigurasi Teknis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Select
                    label="Kode Cabang Lokasi (Unit)"
                    required={true}
                    options={[
                        { value: "1201", label: "1201 - KC JAKARTA" },
                    ]}
                    value={data.kodeCabangLokasi || '1201'}
                    onChange={(e) => handleChange('kodeCabangLokasi', e.target.value)}
                    error={errors.kodeCabangLokasi}
                />
                <Select
                    label="Kode Cabang Akuisisi (Konsol)"
                    required={true}
                    options={[
                        { value: "1201", label: "1201 - KC JAKARTA" },
                    ]}
                    value={data.kodeCabangAkusisi || '1201'}
                    onChange={(e) => handleChange('kodeCabangAkusisi', e.target.value)}
                    error={errors.kodeCabangAkusisi}
                />
            </div>

            <div className="mb-4">
                <Input
                    label="Kode MCC"
                    required={true}
                    value={data.kodeMCC || ''}
                    readOnly={true}
                    className="bg-gray-100 cursor-not-allowed text-gray-500"
                    placeholder="Auto-filled from Jenis Usaha"
                    error={errors.kodeMCC}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Select
                    label="Kategori Usaha"
                    required={true}
                    options={kategoriOptions}
                    value={data.kategoriUsaha || ''}
                    onChange={(e) => handleKategoriChange(e.target.value)}
                    error={errors.kategoriUsaha}
                    disabled={loadingKategori}
                    placeholder={loadingKategori ? "Memuat Kategori..." : "Pilih Kategori Usaha"}
                />
                <Input
                    label="MDR"
                    required={true}
                    value={data.mdr || ''}
                    readOnly={true}
                    className="bg-gray-100 cursor-not-allowed text-gray-500"
                    error={errors.mdr}
                    placeholder="Otomatis terisi"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                    label="Jadwal Settlement"
                    required={true}
                    placeholder="Otomatis terisi"
                    value={getSettlementText(data.jadwalSettlement)}
                    readOnly={true}
                    className="bg-gray-100 cursor-not-allowed text-gray-500"
                    error={errors.jadwalSettlement}
                />
                <Input
                    label="Jumlah Terminal/Kasir (QRIS Statis)"
                    required={true}
                    placeholder="1"
                    type="number"
                    min="1"
                    value={data.jumlahTerminal || '1'}
                    onChange={handleTerminalChange}
                    error={errors.jumlahTerminal}
                />
            </div>

            {/* Conditional Fields based on dataPemilik.tipeLayananQRIS */}
            {isQrisDinamis && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input
                            label="Jumlah Mesin EDC"
                            placeholder="2"
                            type="number"
                            value={data.jumlahMesinEDC || ''}
                            onChange={(e) => handleChange('jumlahMesinEDC', e.target.value)}
                        />
                        <Input
                            label="Mesin EDC Bank Lain Yang Dimiliki"
                            placeholder="BCA, BRI"
                            value={data.mesinEDCLain || ''}
                            onChange={(e) => handleChange('mesinEDCLain', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="Biaya Administrasi EDC (per bulan)"
                            required={true}
                            placeholder="25.000"
                            type="text"
                            value={formatCurrency(data.biayaAdminEDC || '')}
                            onChange={(e) => handleChange('biayaAdminEDC', e.target.value)}
                            error={errors.biayaAdminEDC}
                        />
                    </div>
                </>
            )}
        </FormSection>
    );
};

export default Step6Konfigurasi;
