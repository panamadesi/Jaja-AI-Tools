// ==========================
// PANDUAN CARA PAKAI PER MODUL (kunci = nama file halaman)
// ==========================

const GUIDES = {

    "character-generator.html": {
        title: "Character Generator",
        goal: "Membuat prompt karakter realistis untuk generator gambar AI.",
        steps: [
            "Pilih Negara, lalu Ras, Gender, dan Umur di kartu Identity.",
            "Pilih Rambut, Warna rambut, dan Outfit di kartu Appearance.",
            "Pilih Lokasi, Lighting, Kamera, dan Quality di kartu Camera.",
            "Klik <b>Generate</b>. Prompt lengkap muncul di kotak Generated Prompt.",
            "Klik <b>Copy</b> untuk menyalin, atau <b>Export TXT</b> untuk menyimpan."
        ],
        next: "Klik <b>Buat Gambar</b> untuk langsung ke Image Generator, atau <b>Kirim ke Motion</b> untuk membuat prompt video dari karakter ini.",
        tips: [
            "Pilihan Anda tersimpan otomatis. Klik <b>Reset Pilihan</b> untuk mengosongkan.",
            "Upload Reference hanya untuk pratinjau di halaman ini; gambar tidak dikirim ke mana pun.",
            "Kualitas Cinematic atau Hyper Realistic menambah detail pada prompt."
        ]
    },

    "character-clone.html": {
        title: "Character Clone",
        goal: "Membuat master prompt agar generator meniru pose, outfit, rambut, lokasi, atau kamera dari gambar referensi, sambil menjaga wajah karakter.",
        steps: [
            "Unggah gambar di slot yang Anda perlukan. Contoh: foto karakter di slot <b>Karakter</b>, foto baju di slot <b>Outfit</b>.",
            "Hilangkan centang <b>Pakai bagian ini</b> pada slot yang ingin diabaikan.",
            "Pilih Target generator (Gemini/Nano Banana, ChatGPT, Flux Kontext, atau Generik). Isi instruksi tambahan jika perlu.",
            "Klik <b>Buat Master Prompt</b>. Di atas kotak hasil ada urutan unggah gambar yang harus diikuti.",
            "Buka generator tujuan, unggah gambar <b>persis sesuai urutan itu</b>, lalu tempel master prompt."
        ],
        next: "Hasil gambar bisa dianimasikan lewat Motion Control.",
        tips: [
            "Gambar tidak diunggah ke server; hanya tampil di browser Anda.",
            "Gunakan foto wajah yang jelas dan menghadap depan di slot Karakter.",
            "Satu slot satu tujuan. Foto pose sebaiknya tidak membawa outfit yang tidak diinginkan."
        ]
    },

    "image-generator.html": {
        title: "Image Generator",
        goal: "Membuat gambar dari teks (text to image).",
        steps: [
            "Tulis prompt (bahasa Inggris paling akurat), atau klik <b>Dari Character Generator</b> untuk memakai prompt terakhir.",
            "Pilih mesin. <b>ComfyUI lokal</b> untuk hasil penuh, <b>Pollinations</b> untuk draft 512x512.",
            "Pilih ukuran dan jumlah gambar, lalu klik <b>Generate</b>.",
            "Klik <b>Buka / simpan</b> pada gambar yang disukai, lalu simpan dari tab baru."
        ],
        next: "Gambar yang sudah jadi bisa dipakai sebagai frame awal di generator video.",
        tips: [
            "Untuk ComfyUI: jalankan <code>JALANKAN-COMFY-UNTUK-JAJA.bat</code> dulu dan buka halaman ini dari <code>http://localhost:8000</code>. Status \"Terhubung\" muncul di bawah pilihan mesin.",
            "Seed yang sama dengan prompt yang sama menghasilkan gambar yang sama. Salin seed gambar bagus untuk diulang.",
            "Tombol <b>Perbaiki prompt</b> membuka Prompt Enhancer untuk memperkaya prompt."
        ]
    },

    "motion-prompt.html": {
        title: "Motion Control",
        goal: "Membuat prompt video untuk Wan 2.2, Seedance, Kling, atau Veo 3.",
        steps: [
            "Pilih <b>Target Model</b>. Catatan dan tips model muncul di bawah.",
            "Isi <b>Subject</b> (siapa yang ada di video), lalu pilih Aksi dan Scene.",
            "Pilih kamera: ukuran shot, gerakan kamera, dan kecepatan.",
            "Pilih gaya, lighting, durasi, rasio, dan audio (audio aktif untuk Seedance dan Veo).",
            "Klik <b>Generate</b>, lalu <b>Copy</b>. Negative prompt ikut tersalin."
        ],
        next: "Tempel prompt di generator video bersama gambar frame awal.",
        tips: [
            "Klik <b>Random</b> untuk mendapat kombinasi acak sebagai inspirasi.",
            "Seedance dengan durasi 8 detik atau lebih otomatis dibuat dalam dua shot.",
            "Satu aksi per clip dan gerakan kamera pelan memberi hasil lebih stabil. Sambung beberapa clip untuk adegan panjang."
        ]
    },

    "prompt-library.html": {
        title: "Prompt Siap Pakai",
        goal: "Mengambil prompt jadi untuk gambar, video, produk, dan thumbnail.",
        steps: [
            "Pilih kategori di atas, atau ketik kata kunci di kotak pencarian.",
            "Klik <b>Copy</b> pada prompt yang cocok.",
            "Ganti bagian dalam [kurung siku] dengan isi Anda sendiri sebelum dipakai.",
            "Atau klik <b>Buat gambar</b> untuk langsung membukanya di Image Generator."
        ],
        next: "Prompt yang kurang detail bisa diperkaya di Prompt Enhancer.",
        tips: [
            "Kategori Negative berisi daftar hal yang sebaiknya dihindari; tempel di kolom negative prompt.",
            "Prompt Video cocok dipasangkan dengan gambar frame awal di generator video."
        ]
    },

    "pabrik-konten.html": {
        title: "Pabrik Konten",
        goal: "Mengubah satu ide menjadi character sheet dan storyboard lengkap untuk drama, film pendek, atau music clip.",
        steps: [
            "Pilih mode: <b>Drama / Film</b> atau <b>Music Clip</b>.",
            "Langkah 1 (Ide): tulis ide atau tema, pilih genre atau mood, gaya visual, jumlah scene, durasi, dan rasio.",
            "Langkah 2 (Karakter): deskripsikan karakter utama dalam bahasa Inggris, atau klik <b>Ambil dari Character Generator</b>.",
            "Klik <b>Buat Karakter + Storyboard</b>.",
            "Buat gambar character sheet dulu. Lalu untuk tiap scene, salin <b>Prompt gambar</b> dan hasilkan frame-nya.",
            "Animasikan tiap frame memakai <b>Prompt video</b> di generator video, lalu gabungkan di CapCut."
        ],
        next: "Master Style otomatis menempel di setiap prompt gambar supaya tampilan konsisten antar scene.",
        tips: [
            "Mode Music Clip: isi judul lagu dan tempo. Untuk memakai wajah sendiri, unggah foto di slot wajah lalu lampirkan foto yang sama di generator gambar.",
            "<b>Export TXT</b> menyimpan seluruh storyboard dalam satu file.",
            "Setiap hasil masuk ke kartu <b>Riwayat</b> di bawah (15 terakhir, hanya di browser ini). Klik <b>Buka</b> untuk memuat ulang semuanya, termasuk mode Drama atau Music Clip.",
            "Mode Drama bisa dikembangkan oleh AI lokal (Ollama) dengan mencentang opsi di langkah 2."
        ]
    },

    "ugc.html": {
        title: "UGC Konten",
        goal: "Membuat paket konten video jualan untuk TikTok, Reels, Shopee Video, atau Shorts.",
        steps: [
            "Isi data produk dengan teliti: nama, manfaat (pisahkan dengan koma), target pembeli, dan harga atau promo.",
            "Pilih platform, durasi, gaya jualan (review, unboxing, tutorial, dan lainnya), nada bicara, pemeran, dan lokasi.",
            "Klik <b>Generate</b>. Anda mendapat 5 hook, naskah bertimestamp, CTA, hashtag, dan storyboard.",
            "Belum cocok? Klik <b>Generate ulang</b>; hasilnya berbeda setiap kali.",
            "Untuk tiap scene, salin Prompt gambar untuk frame, dan Prompt video untuk animasinya."
        ],
        next: "Rekam atau susun video, tambahkan suara dan teks, lalu edit di CapCut.",
        tips: [
            "Hanya tulis manfaat yang benar. Hindari klaim berlebihan, terutama untuk produk kesehatan dan kecantikan.",
            "Centang opsi AI lokal untuk memoles naskah jadi bahasa yang lebih natural (butuh Ollama).",
            "Pemeran \"Tanpa wajah\" cocok jika Anda tidak ingin menampilkan wajah.",
            "Setiap Generate tersimpan di kartu <b>Riwayat</b> di bawah (15 terakhir, hanya di browser ini). Klik <b>Buka</b> untuk memuat ulang hasil lama."
        ]
    },

    "prompt-enhancer.html": {
        title: "Prompt Enhancer",
        goal: "Mengubah ide singkat berbahasa Indonesia atau Inggris menjadi prompt lengkap.",
        steps: [
            "Tulis ide singkat di kotak Ide Singkat. Contoh: <i>cewek kebaya jalan di sawah pagi hari</i>.",
            "Pilih jenis (gambar atau video), gaya, dan tingkat detail.",
            "Klik <b>Enhance</b>, lalu <b>Copy</b> atau <b>Export TXT</b>.",
            "Klik <b>Buat Gambar</b> untuk langsung mencoba prompt di Image Generator."
        ],
        next: "Prompt video hasil enhancer bisa dilengkapi di Motion Control.",
        tips: [
            "Mode bawaan memakai kamus sekitar 500 kata Indonesia (orang, pakaian, tempat, cuaca, makanan, hewan, nama tempat) dan merapikan urutan, misalnya \"kucing hitam\" menjadi \"black cat\". Cepat dan tanpa internet.",
            "Tool mengenali jenis konten (orang, makanan, pemandangan, bangunan, hewan, produk, fantasi) dan menambah detail serta negative prompt yang sesuai. Jenis yang terdeteksi tampil di bawah pilihan AI.",
            "Jika muncul \"Belum diterjemahkan\", kata itu dibiarkan apa adanya. Ganti dengan sinonim yang umum, atau pakai AI lokal.",
            "Centang <b>Pakai AI lokal</b> untuk hasil yang lebih kaya. Butuh Ollama (<code>ollama serve</code>) dan model <code>qwen2.5:7b</code>, dibuka dari <code>http://localhost:8000</code>.",
            "Jika Ollama tidak terjangkau, tool otomatis kembali ke mode bawaan."
        ]
    },

    "bundle.html": {
        title: "Jaja Bundle",
        goal: "Peta alur produksi dan daftar web AI untuk membuat konten.",
        steps: [
            "Baca alur 3 langkah di bagian atas: karakter dan gambar, naskah dan storyboard, video dan edit.",
            "Klik modul yang disebut untuk langsung membukanya.",
            "Buka daftar web per kategori (Drama/Film, Music Video, UGC) jika ingin hasil yang lebih instan."
        ],
        next: "Mulai dari Pabrik Konten atau UGC Konten untuk proyek baru.",
        tips: [
            "Banyak web di daftar ini berbayar atau freemium; cek harga dan syaratnya dulu.",
            "Daftar bersumber dari deskripsi video Jaja Tip Tutorial; link di kartu Catatan membuka video aslinya."
        ]
    }
};
