# Validation Integration Guide

## Overview
The validation system has been successfully implemented with core infrastructure complete. All  components now support error display natively.

## Completed Components

### Core Infrastructure
- ✅ **validation.js** - Comprehensive validation utilities and step-specific validators
- ✅ **Modal.jsx** - Confirmation and success modals
- ✅ **ErrorText.jsx** - Reusable error text component
- ✅ **Input.jsx** - Updated to accept `error` prop
- ✅ **Select.jsx** - Updated to accept `error` prop

### MerchantForm Integration
- ✅ Validation state management
- ✅ Step-by-step validation on "Simpan dan Lanjut"
- ✅ Button text changes to "Simpan dan Daftar" on Step  7
- ✅ Confirmation modal on final submission
- ✅ Success modal after submission
- ✅ Session storage clearing on success

### Step 4 (Keuangan) - COMPLETE
- ✅ Accepts and displays validation errors
- ✅ Shows "Tolong Cek Rekening Terlebih Dahulu" error when needed

## How to Add Validation to Remaining Steps

For each remaining step component, follow this pattern:

### 1. Update Component Signature
```javascript
const StepXComponent = ({ data = {}, updateData, errors = {} }) => {
```

### 2. Pass error Prop to Input/Select Components
```javascript
<Input
    label="Field Name"
    required={true}
    value={data.fieldName || ''}
    onChange={(e) => handleInputChange('fieldName', e.target.value)}
    error={errors.fieldName}
/>

<Select
    label="Field Name"
    required={true}
    value={data.fieldName || ''}
    onChange={(e) => handleInputChange('fieldName', e.target.value)}
    options={options}
    error={errors.fieldName}
/>
```

### 3. Test Validation
1. Run the app
2. Navigate to the step
3. Try clicking "Simpan dan Lanjut" without filling mandatory fields
4. Verify error messages appear

## Field Name Mapping Reference

Each step's validation errors use specific field names:

**Step 1 (currently Step 2 in UI) - Step1DataPemilik:**
- tipeNasabah
- tipeLayananQRIS
- nomorIdentitas
- namaPemilik
- noHpPemilik
- npwpPemilik (conditional)
- kodePos
- alamat
- rt
- rw
- provinsi
- kabKota
- kecamatan

**Step 2 (currently Step 3 in UI) - Step2DataUsaha:**
- jenisUsaha
- namaMerchantOfficial (conditional)
- namaMerchantQR
- emailNotifikasi
- emailMSR
- bentukUsaha
- noTelponUsaha
- lingkunganUsaha
- statusTempat

**Step 3 (currently Step 4 in UI) - Step3Profil:**
- namaPIC1
- noHpPIC1

**Step 4 (currently Step 1 in UI) - Step4Keuangan:** ✅ DONE
- nomorRekening
- namaPemilikRekening
- tipeRekening
- kodeCabangRekening

**Step 5 (currently Step 5 in UI) - Step5DataTransaksi:**
- salesVolumePerTahun

**Step 6 (currently Step 6 in UI) - Step6Konfigurasi:**
- kodeCabangAkusisi
- kodeCabangLokasi
- kodeMCC
- kategoriUsaha
- mdr
- jadwalSettlement
- biayaAdminEDC (conditional for QRIS Dinamis)

**Step 7 (currently Step 7 in UI) - Step7Dokumen:**
- fotoKTP
- fotoNPWP
- formulirPermohonan

## Testing the System

1. **Test Step Navigation with Empty Fields:**
   - Navigate to any step
   - Leave required fields empty
   - Click "Simpan dan Lanjut"
   - Verify error messages appear and navigation is blocked

2. **Test Step 7 Submission:**
   - Fill all fields through Step 7
   - Verify button text is "Simpan dan Daftar"
   - Click button
   - Verify confirmation modal appears
   - Click "Ya"
   - Verify success modal appears
   - Verify session storage is cleared
   - Verify redirect to landing page

3. **Test Conditional Validation:**
   - Step 1: Test NPWP mandatory for "Badan Usaha"
   - Step 2: Test Nama Merchant Official mandatory for "Badan Usaha"
   - Step 6: Test Biaya Admin EDC mandatory for "QRIS Dinamis"

## Current Status

- Core validation system: **100% Complete**
- Step 4 implementation: **100% Complete**  
- Remaining steps: **Require error prop integration** (10-15 minutes per step)

The validation logic is fully functional. The remaining work is purely mechanical - adding the `error={errors.fieldName}` prop to each Input/Select component in the remaining step files.
