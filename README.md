# JAJA AI TOOLS

Kumpulan tool gratis untuk AI content creator. Semua berjalan di browser, tanpa server.

- **Character Generator**: prompt karakter realistis (ras, outfit, lokasi, lighting, kamera). Pilihan tersimpan otomatis.
- **Motion Prompt Generator**: prompt video untuk Wan 2.2, Seedance, Kling, dan Veo 3. Menerima karakter dari Character Generator lewat tombol "Kirim ke Motion".
- **Prompt Enhancer**: ide singkat (Indonesia atau Inggris) menjadi prompt lengkap. Mode bawaan tanpa internet, opsional memakai Ollama `qwen2.5:7b` lokal.
- **Featured AI Characters**: klik gambar untuk melihat dan menyalin prompt-nya.

## Jalankan lokal

```bash
python -m http.server 8000
```

Buka http://localhost:8000/ dari folder proyek ini.

## Prompt Enhancer dengan Ollama

Jalankan `ollama serve` dan pastikan model `qwen2.5:7b` sudah di-pull. Pakai dari `http://localhost:8000`, karena halaman `https://` biasanya diblokir browser saat memanggil `http://localhost`.

## Struktur

```
index.html          beranda
HOME/               halaman tool
js/ css/ data/      script, gaya, data
assets/             gambar, video, ikon
```
