mandatory inputfield & format : 

//Step1DataPemilik

inputfield: tipe nasabah
mandatory: yes
format: radio button

inputfield: tipe layanan QRIS
mandatory: yes
format: radio button

inputfield : Jenis identitas
mandatory: no 
format: dropdown

inputfield: nomor identitas (NIK)
mandatory: yes
format: format numeric tanpa tombol decrement increment dengan limit inputan 16 digit

inputfield : nama pemilik/pengurus (mandatory)
mandatory: yes
format: input text

inputfield : no hp pemilik/pengurus
mandatory: yes
format: numeric tanpa tombol increment decrement dengan limit inputan 15 digit

inputfield : NPWP PEMILIK
mandatory: JIKA TIPE NASABAH YANG DIINPUT/DIPILIH USER ADALAH "PERORANGAN" MAKA SIFATNYA INPUT FIELD NYA OPSIONAL, JIKA TIPE NASABAH YANG DIPILIH USER ADALAH "BADAN USAHA" MAKA SIFATNYA INPUTFIELD NYA MANDATORY
format: numeric tanpa tombol increment decrement dengan limit inputan 16 digit

inputfield: kode pos
mandatory: yes
format: dropwon

inputfield: alamat
mandatory: yes
format : input text

inputfield: RT
mandatory: yes
format: input text

inputfield: RW
mandatory: yes
format: input text

inputfield: provinsi
mandatory: yes
format: dropdown with search

inputfield: kab/kota
mandatory: yes
format: dropdown with search

inputfield: kecamatan
mandatory: yes
format: dropdown with search

//Step2DataUsaha.jsx

inputfield: jenis usaha
mandatory: yes
format: dropdown with inputfield yang bisa memberikan inputan custom sebagai value selain value yang ada di dropdown, jadi jika tidak menemukan pilihan yang cocok di dropdown maka bisa membuat inputan/value custom

inputfield: nama merchant (Official)
mandatory: lakukan validasi jika tipe nasabah adalah "badan usaha" maka buat otomatis menjadi mandatory, jika "perorangan" maka menjadi opsional
format: input text

inputfield: nama merchant di QR (sticker)
mandatory: yes
format: input text. note: apabila panjang nama melebihi 25 karakter, maka karakter urutan ke 25 tidak boleh berupa spasi. sistem akan otomatis memberikan warning text (error) , dan untuk karakter yang tidak diperbolehkan antara lain adalah setelah titik dua berikut: %'<>`

inputfield: email merchant (notifikasi)
mandatory: yes
format: input text (format email only)

inputfield: email merchant (MSR)
mandatory: yes
format: input text (format email only)

inputfield: bentuk usaha
mandatory: kondisional, dibawah penjelasan/validasi nya:
jika tipe nasabah = "perorangan" maka sistem otomatis mengisi (auto-fill) menjadi "Perorangan" sesuai pilihan user terkait tipe nasabah di tahap sebelumnya, dan dropdownnya disabled. jika tipe nasabah = "Badan Usaha" maka dropdown aktif dan menjadi mandatory untuk memilih opsi spesifik Badan Usaha, PT, CV, Koperasi, Yayasan, Perkumpulan, Pameran, Lainnya. jika user memilih lainnya, maka munculkan input text untuk mengisi custom value
format: dropdown with input text

inputfield: Bidang Usaha
mandatory: no
format:

inputfield: jenis usaha
mandatory: yes
format: dropdown

inputfield: no. telpon usaha/merchant
mandatory: yes
format: numeric tanpa tombol incr decr dengan limit digit 15 digit

inputfield: link website / sosial media
mandatory: no, optional.
format: input text

inputfield: Lingkungan usaha
mandatory: yes
format: radio button group. note: ketika pilih lainnya maka value yang digunakan untuk menjadi value dari linkungan usaha adalah yang diinput manual.

inputfield: status tempat
mandatory: yes
format: radio button

inputfield: luas tempat usaha (m2)
mandatory: no , optional
format: input text numeric

inputfield: tanggal berdiri
mandatory: no, optional
format: pick date, gunakan default value , dan jika tanggal tidak diubah sama sekali maka gunakan null sebagai value nya


inputfield: jam operasional
mandatory: no ,optional
format: pick time awal dan akhir, gunakan default value, jika jam awal dan akhir tidak diubah sama sekali maka value nya null

inputfield: jumlah karyawan
mandatory: no, optional
format: input text numeric dengan tombol increment decrement, jika tidak diisi maka value nya null


//step3profil.jsx

fitur checkbox "sama dengan pemilik": 
-jika dicentang maka sistem otomatis menyalin/mengambil data dari tahap 1 (Step1DataPemilik.jsx) . detail nya dibawah ini:

Nama Penghubung (PIC 1) Mengambil data yang diinput di tahap pertama (Step1DataPemilik.jsx) (field "Nama Pemilik/Pengurus")

Nomor HP (PIC 1) mengambil data yang diinput di tahap pertama (Step1DataPemilik.jsx) (inputfield "No. HP Pemilik/Pengurus")

inputfield: nama penghubung (PIC 1)
mandatory: yes
format: input text, inputfield disabled jika checkbox "Sama Dengan Data Pemilik" dicentang

inputfield: Nomor HP (PIC 1)
mandatory: yes
format: input numeric 15 digit max, inputfield disabled jika checkbox "Sama Dengan Data Pemilik" dicentang

inputfield: Nama Penghubung (PIC 2)
mandatory: no, optional
format: input text,inputfield tidak disabled jika checkbox "Sama Dengan Data Pemilik" dicentang

inputfield: Nomor HP (PIC 2)
mandatory: no, optional
format: input numeric, 15 digit limit,inputfield tidak disabled jika checkbox "Sama Dengan Data Pemilik" dicentang

//Step5DataTransaksi.jsx

inputfield: Sales Volume Per Tahun 
mandatory: yes
format: input currency

inputfield: Rata-rata Nominal Per transaksi
mandatory: no, optional
format: input currency

inputfield: Komitmen Sales Volume (bulanan)
mandatory: no, optional
format: input currency


inputfield: Komitmen Saldo Mengendap
mandatory: no, optional
format: Input currency

inputfield: Estimasi Frekuensi Transaksi
mandatory: no, optional
format: input numeric

//Step6Konfigurasi.jsx

additional note untuk form di file ini

hilangkan checkbox "Ajukan Mesin EDC" secara permanent

cek data yang diinput pada field radio button "Tipe Layanan QRIS" di Step1DataPemilik, jika data yang diinput/dipilih masuk ke session storage adalah "QRIS Dinamis" maka munculkan inputfield "Jumlah Mesin Edc" (non mandatory. input numeric), "Mesin EDC Bank Lain yang Dimiliki" (non mandatory. input text), dan "Biaya Administrasi Edc" (mandatory. input currency), jika user menginput "QRIS Statis" maka semua field ini tidak muncul dan tidak mandatory

inputfield: Kode Cabang Akusisi (Konsol)
mandatory: yes
format: Dropdown


inputfield: Kode Cabang Lokasi (Unit)
mandatory: yes
format: dropdown

inputfield: Kode MCC
mandatory: yes
format: searchable dropdown

inputfield: Kategori Usaha
mandatory: yes
format: dropdown, Sesuai dengan Sales Volume pertahun Dropdown (UKE/UME/UMI) untuk URE dapat tidak sesuai Sales Volume pertahun.


inputfield: MDR
mandatory: yes
format: dropdown. note: Sesuai dengan Sales Volume pertahun Dropdown (UKE/UME/UMI) untuk URE dapat tidak sesuai Sales Volume pertahun.

inputfield: jadwal settlement
mandatory: yes
format: input text. note: Jika UMI auto wajib H+0 selain itu menjadi H+1.

inputfield: Jika UMI auto wajib H+0 selain itu menjadi H+1.
mandatory: yes
format: input numeric . note: default value 1

//Step7Dokumen.jsx

inputfield: foto ktp
mandatory: yes
format: file upload

inputfield: foto NPWP
mandatory: yes
format: File Upload

inputfield: Foto Tampak Depan Tempat Usaha
mandatory: no, Optional
format: file upload


inputfield: Foto Barang/Jasa Yang dijual
mandatory: no, optional
format: file upload

inputfield: Foto QRIS Lama (Jika Sudah pernah punya)
mandatory: optional
format: file upload

inputfield: Formulir Permohonan & Syarat ketentuan (TTD) 
mandatory: yes
format: file upload


inputfield: Dokumen lainnya
mandatory: no, optional
format: input text + file upload

//Step4Keuangan

note: semua input field/dropdwon disini jatuhnya mandatory, jadi jika user belum menginput nomor rekening dan belum generate value 3 disabled field dibawahnya (Nama pemilik rekening, tipe rekening, kode cabang rekening) dengan tombol cek rekening atau gampangnya jika 3 field tersebut belum mempunyai value tapi user sudah klik simpan dan lanjut maka munculkan error text pada setiap 3 disabled field tersebut "Tolong Cek Rekening Terlebih Dahulu" 
