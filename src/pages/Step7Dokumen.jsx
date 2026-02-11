import React, { useState } from 'react';
import { FaEye, FaTrash, FaSpinner } from 'react-icons/fa'; // Added FaSpinner
import { useDispatch } from 'react-redux';
import { uploadDocument } from '../features/merchantSlice';
import FormSection from '../components/FormSection';

const FileInput = ({ label, required, subtext, onChange, file }) => (
    <div className="mb-6">
        <label className="block text-gray-900 font-bold mb-2 text-sm">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        <div className="flex gap-4">
            <div className="flex-grow">
                <div className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500 truncate">
                    {file ? file.name : "No File Chosen"}
                </div>
                {subtext && <p className="text-xs text-gray-500 mt-1 italic">{subtext}</p>}
            </div>
            <label className="bg-[#1e3a8a] text-white px-4 py-2 rounded text-sm font-semibold whitespace-nowrap h-[42px] cursor-pointer flex items-center justify-center">
                Upload
                <input type="file" className="hidden" onChange={onChange} accept=".pdf,.png,.jpg,.jpeg" />
            </label>
        </div>
    </div>
);

const MultiFileUpload = ({ label, subtext, files, onAdd, onRemove, max = 5, required }) => (
    <div className="mb-6">
        <label className="block text-gray-900 font-bold mb-2 text-sm">
            {label} {required && <span className="text-red-600">*</span>}
        </label>

        {files.length < max && (
            <div className="flex gap-4 mb-4">
                <div className="flex-grow">
                    <div className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500">
                        Select file to add (Max {max})
                    </div>
                    {subtext && <p className="text-xs text-gray-500 mt-1 italic">{subtext}</p>}
                </div>
                <label className="bg-[#1e3a8a] text-white px-4 py-2 rounded text-sm font-semibold whitespace-nowrap h-[42px] cursor-pointer flex items-center justify-center">
                    Tambah Dokumen
                    <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                onAdd(e.target.files[0]);
                                e.target.value = null;
                            }
                        }}
                        accept=".pdf,.png,.jpg,.jpeg"
                    />
                </label>
            </div>
        )}

        {files.length > 0 && (
            <div className="space-y-3">
                {files.map((fileObj, index) => (
                    <div key={index} className="flex gap-3 items-center">
                        <div className="flex-grow px-4 py-2 border border-gray-300 rounded bg-gray-200 text-gray-700 truncate">
                            {fileObj.name}
                        </div>
                        <button
                            type="button"
                            onClick={() => window.open(fileObj.url, '_blank')}
                            className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                            title="Preview"
                        >
                            <FaEye />
                        </button>
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                            title="Delete"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const DokumenLainnyaUpload = ({ files, onAdd, onRemove, max = 5 }) => {
    const [title, setTitle] = useState("");

    const handleAdd = (file) => {
        if (!title.trim()) {
            alert("Please enter a document title first.");
            return;
        }
        onAdd(file, title);
        setTitle("");
    };

    return (
        <div className="mb-6">
            <div className="mb-2">
                <label className="block text-gray-900 font-bold mb-2 text-sm">Dokumen Lainnya</label>
            </div>

            {files.length < max && (
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Input Judul Dokumen"
                        />
                        <p className="text-xs text-gray-500 mt-1 italic">Isi nama dokumen</p>
                    </div>
                    <div className="w-full md:w-2/3 flex gap-4">
                        <div className="flex-grow">
                            <div className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500">
                                {title ? "Ready to upload" : "Enter title first"}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 italic">Format file yang dapat diproses adalah .pdf/.png/.jpg dan Ukuran file maksimum sebesar 2MB.</p>
                        </div>
                        <label className={`bg-[#1e3a8a] text-white px-4 py-2 rounded text-sm font-semibold whitespace-nowrap h-[42px] flex items-center justify-center ${!title.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            Tambah Dokumen
                            <input
                                type="file"
                                className="hidden"
                                disabled={!title.trim()}
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        handleAdd(e.target.files[0]);
                                        e.target.value = null;
                                    }
                                }}
                                accept=".pdf,.png,.jpg,.jpeg"
                            />
                        </label>
                    </div>
                </div>
            )}

            {files.length > 0 && (
                <div className="space-y-3">
                    {files.map((fileObj, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <div className="w-1/3 px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 font-semibold truncate">
                                {fileObj.customTitle}
                            </div>
                            <div className="flex-grow px-4 py-2 border border-gray-300 rounded bg-gray-200 text-gray-700 truncate">
                                {fileObj.name}
                            </div>
                            <button
                                type="button"
                                onClick={() => window.open(fileObj.url, '_blank')}
                                className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                                title="Preview"
                            >
                                <FaEye />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Step7Dokumen = ({ data = {}, updateData, errors = {} }) => {
    const dispatch = useDispatch();
    const [uploading, setUploading] = useState({}); // Track uploading state per field

    // Helpers to handle file state in parent data
    const getSingleFile = (key) => {
        const val = data[key];
        if (Array.isArray(val) && val.length > 0) return val[0];
        return null;
    };

    const handleSingleFile = async (key, file) => {
        if (!file) return;

        // Set loading for this key
        setUploading(prev => ({ ...prev, [key]: true }));

        try {
            const result = await dispatch(uploadDocument(file)).unwrap();

            // Result: { originalName, fileName, filePath, url }
            const fileObj = {
                name: result.originalName,
                // Ensure URL is complete
                url: result.url.startsWith('http') ? result.url : `http://localhost:3000${result.url}`,
                filePath: result.filePath,
                type: key,
                file: file
            };

            updateData({ [key]: [fileObj] });
        } catch (error) {
            console.error("Upload Error:", error);
            alert(`Gagal upload ${key}: ${error.message || 'Server Error'}`);
        } finally {
            setUploading(prev => ({ ...prev, [key]: false }));
        }
    };

    const getMultiFiles = (key) => {
        return Array.isArray(data[key]) ? data[key] : [];
    };

    const handleAddMulti = async (key, file, customTitle = "") => {
        if (!file) return;

        setUploading(prev => ({ ...prev, [key]: true })); // Simple loading tracker

        try {
            const result = await dispatch(uploadDocument(file)).unwrap();

            const fileObj = {
                name: result.originalName,
                // Ensure URL is complete if backend returns relative path
                url: result.url.startsWith('http') ? result.url : `http://localhost:3000${result.url}`,
                filePath: result.filePath,
                file: file,
                customTitle
            };

            const currentFiles = getMultiFiles(key);
            updateData({
                [key]: [...currentFiles, fileObj]
            });
        } catch (error) {
            console.error("Upload Error:", error);
            alert(`Gagal upload dokumen: ${error.message || 'Server Error'}`);
        } finally {
            setUploading(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleRemoveMulti = (key, index) => {
        const currentFiles = getMultiFiles(key);
        updateData({
            [key]: currentFiles.filter((_, i) => i !== index)
        });
    };

    return (
        <FormSection title="Upload Dokumen">
            <FileInput
                label="Foto KTP Pemilik/Pengurus"
                required={true}
                subtext="Format file yang dapat diproses adalah .pdf/.png/.jpg dan Ukuran file maksimum sebesar 2MB."
                file={getSingleFile('fotoKTP')}
                onChange={(e) => handleSingleFile('fotoKTP', e.target.files[0])}
            />
            {errors.fotoKTP && <p className="text-red-500 text-sm -mt-4 mb-4">{errors.fotoKTP}</p>}

            <FileInput
                label="Foto NPWP"
                required={true}
                subtext="Format file yang dapat diproses adalah .pdf/.png/.jpg dan Ukuran file maksimum sebesar 2MB."
                file={getSingleFile('fotoNPWP')}
                onChange={(e) => handleSingleFile('fotoNPWP', e.target.files[0])}
            />
            {errors.fotoNPWP && <p className="text-red-500 text-sm -mt-4 mb-4">{errors.fotoNPWP}</p>}

            <MultiFileUpload
                label="Foto Tampak Depan Tempat Usaha"
                subtext="Format file yang dapat diproses adalah .pdf/.png/.jpg dan Ukuran file maksimum sebesar 2MB."
                files={getMultiFiles('tampakDepan')}
                onAdd={(file) => handleAddMulti('tampakDepan', file)}
                onRemove={(index) => handleRemoveMulti('tampakDepan', index)}
            />

            <MultiFileUpload
                label="Foto Barang/Jasa yang dijual"
                subtext="Format file yang dapat diproses adalah .pdf/.png/.jpg dan Ukuran file maksimum sebesar 2MB."
                files={getMultiFiles('barangJasa')}
                onAdd={(file) => handleAddMulti('barangJasa', file)}
                onRemove={(index) => handleRemoveMulti('barangJasa', index)}
            />

            <FileInput
                label="Foto QRIS Lama (jika sudah pernah punya)"
                subtext="Format file yang dapat diproses adalah .pdf/.png/.jpg dan Ukuran file maksimum sebesar 2MB."
                file={getSingleFile('qris')}
                onChange={(e) => handleSingleFile('qris', e.target.files[0])}
            />

            <FileInput
                label="Formulir Permohonan & Syarat Ketentuan (TTD)"
                required={true}
                subtext="Format file yang dapat diproses adalah .pdf/.png/.jpg dan Ukuran file maksimum sebesar 2MB."
                file={getSingleFile('formulirPermohonan')}
                onChange={(e) => handleSingleFile('formulirPermohonan', e.target.files[0])}
            />
            {errors.formulirPermohonan && <p className="text-red-500 text-sm -mt-4 mb-4">{errors.formulirPermohonan}</p>}

            <DokumenLainnyaUpload
                files={getMultiFiles('dokumenLainnya')}
                onAdd={(file, title) => handleAddMulti('dokumenLainnya', file, title)}
                onRemove={(index) => handleRemoveMulti('dokumenLainnya', index)}
            />

        </FormSection>
    );
};

export default Step7Dokumen;
