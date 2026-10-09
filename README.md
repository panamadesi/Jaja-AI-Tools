# JAJA AI TOOLS

Kumpulan tool gratis untuk AI content creator. Semua berjalan di browser, tanpa server.

| Modul | Fungsi |
|---|---|
| Pabrik Konten | Ide, character sheet, dan storyboard (prompt gambar + video per scene) untuk Drama/Film dan Music Clip |
| Character Generator | Prompt karakter realistis; kirim ke Motion Control atau Image Generator |
| Character Clone | Master prompt untuk meniru pose, outfit, rambut, lokasi, dan kamera dari gambar referensi |
| Image Generator | Text to image lewat ComfyUI lokal (SDXL) atau Pollinations (512x512) |
| Motion Control | Prompt video untuk Wan 2.2, Seedance, Kling, Veo 3 |
| Referensi Video | Unggah video lokal, ambil frame kunci, susun prompt gerakan berurutan (diproses di browser) |
| Prompt Siap Pakai | 40 prompt siap salin (portrait, fashion, produk, sinematik, thumbnail) |
| UGC Konten | Hook, naskah bertimestamp, CTA, hashtag, dan storyboard jualan |
| Prompt Enhancer | Ide singkat menjadi prompt lengkap: kamus ±500 kata, deteksi jenis konten, atau Ollama lokal |
| Jaja Bundle | Alur 3 langkah dan daftar web AI pembuat konten |
| Versi 2 | Paket Jaja v2 (Pabrik Konten, Video Generator, Prompt Siap Pakai) di folder `v2/` |

Setiap modul punya panel "Cara Pakai" yang bisa dilipat. Pilihan di Character Generator dan Motion Control tersimpan otomatis di browser. UGC Konten dan Pabrik Konten menyimpan 15 hasil terakhir di kartu Riwayat (hanya di browser).

## Jalankan lokal

```bash
python -m http.server 8000
```

Buka http://localhost:8000/ dari folder proyek ini.

## Image Generator dengan ComfyUI

Browser hanya boleh memanggil ComfyUI jika ComfyUI dijalankan dengan izin CORS untuk `http://localhost:8000`:

```bat
python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-cors-header "http://localhost:8000"
```

Buka Image Generator dari `http://localhost:8000` (bukan dari situs `https://`). Tanpa ComfyUI, pilih mesin Pollinations (hanya 512x512).

## AI lokal (opsional)

Prompt Enhancer, UGC Konten, dan Pabrik Konten (Drama/Film) bisa memakai Ollama `qwen2.5:7b` untuk memperkaya hasil. Jalankan `ollama serve` dan buka dari `http://localhost:8000`. Tanpa Ollama, semua tetap jalan dengan aturan bawaan.

## Struktur

```
index.html          beranda
HOME/               halaman modul
js/ css/ data/      script, gaya, data
assets/             gambar, video, ikon
```

## Kredit

Daftar web AI di Jaja Bundle berasal dari deskripsi video
[GENERATOR AI 2026 TERBARU](https://www.youtube.com/watch?v=SyXptMYmBy8) milik Jaja Tip Tutorial.
