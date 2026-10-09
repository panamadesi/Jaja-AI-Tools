// ==========================
// REFERENSI VIDEO
// Ambil frame kunci dari video lokal, beri catatan gerakan, susun prompt berurutan.
// Semua diproses di browser; video tidak diunggah ke mana pun.
// ==========================

(function () {

    const $ = id => document.getElementById(id);

    const MAX_FRAMES = 24;
    const THUMB_W = 360;

    const MODES = {
        "8 frame (rata sepanjang video)": { n: 8 },
        "6 frame": { n: 6 },
        "12 frame": { n: 12 },
        "16 frame": { n: 16 },
        "24 frame": { n: 24 },
        "Tiap 1 detik": { every: 1 },
        "Tiap 2 detik": { every: 2 },
        "Tiap 3 detik": { every: 3 },
        "Tiap 5 detik": { every: 5 }
    };

    const PRESETS = {
        "(pilih gerakan)": "",
        "Berdiri diam, bernapas": "stands still, breathing gently",
        "Berjalan mendekat": "walks toward the camera",
        "Berjalan menjauh": "walks away from the camera",
        "Berjalan pelan": "walks slowly forward with a natural gait",
        "Menoleh ke kamera": "turns the head toward the camera",
        "Tersenyum": "breaks into a soft smile",
        "Tertawa": "laughs naturally",
        "Berbicara ke kamera": "speaks to the camera with small hand gestures",
        "Melambaikan tangan": "waves at the camera",
        "Mengangkat kedua tangan": "raises both hands",
        "Menunjuk ke kamera": "points at the camera",
        "Menari, gerak tangan": "dances with smooth arm movements",
        "Menari, goyang badan": "sways the body to the rhythm",
        "Berputar": "spins around smoothly",
        "Melompat kecil": "jumps lightly",
        "Duduk": "sits down",
        "Berdiri dari duduk": "stands up from sitting",
        "Membungkuk": "leans forward",
        "Menunduk lalu menatap": "looks down, then looks up at the camera"
    };

    JAJA.fill($("mode"), Object.keys(MODES));
    $("neg").value = "blurry, low quality, distorted face, deformed hands, extra fingers, flickering, morphing, text, subtitles, watermark, logo, jitter";

    let url = null;       // object URL video
    let meta = null;      // { duration, w, h, name }
    let frames = [];      // { t, img (dataURL), note }

    const fmt = t => {
        const m = Math.floor(t / 60);
        const s = (t - m * 60).toFixed(1).padStart(4, "0");
        return m + ":" + s;
    };

    // ---------- muat video ----------

    function loadFile(file) {

        if (!file) return;

        if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(file);
        frames = [];
        renderFrames();
        $("hasil").value = "";

        const p = $("player");
        p.src = url;
        p.style.display = "block";

        p.onloadedmetadata = () => {
            meta = { duration: p.duration, w: p.videoWidth, h: p.videoHeight, name: file.name };
            $("info").textContent = file.name + " · " + fmt(meta.duration) + " · " + meta.w + "x" + meta.h +
                " (" + ratioLabel(meta.w, meta.h) + ")";
            $("status").textContent = "";
        };

        p.onerror = () => {
            meta = null;
            $("info").textContent = "Video tidak bisa dibaca browser (format atau codec tidak didukung). Coba ekspor ulang ke MP4 H.264.";
        };
    }

    function ratioLabel(w, h, en) {
        const r = w / h;
        if (Math.abs(r - 9 / 16) < 0.05) return en ? "vertical 9:16" : "9:16 vertikal";
        if (Math.abs(r - 16 / 9) < 0.05) return en ? "widescreen 16:9" : "16:9 lebar";
        if (Math.abs(r - 1) < 0.05) return en ? "square 1:1" : "1:1 kotak";
        return r < 1 ? (en ? "vertical" : "vertikal") : (en ? "widescreen" : "lebar");
    }

    $("file").addEventListener("change", e => loadFile(e.target.files[0]));

    const dz = document.querySelector(".upload-box");
    ["dragover", "dragenter"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); }));
    dz.addEventListener("drop", e => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith("video/")) loadFile(f);
    });

    // ---------- ambil frame ----------

    // video terpisah dipakai untuk ekstraksi supaya pemutar tidak terganggu
    function openHidden() {
        return new Promise((resolve, reject) => {
            const v = document.createElement("video");
            v.muted = true;
            v.preload = "auto";
            v.playsInline = true;
            v.src = url;
            v.onloadeddata = () => resolve(v);
            v.onerror = () => reject(new Error("video tidak bisa dibaca"));
        });
    }

    function seek(v, t) {
        return new Promise(resolve => {
            const done = () => { v.removeEventListener("seeked", done); resolve(); };
            v.addEventListener("seeked", done);
            v.currentTime = Math.max(0, Math.min(t, v.duration - 0.05));
        });
    }

    function snap(v) {
        const w = Math.min(THUMB_W, v.videoWidth);
        const h = Math.round(v.videoHeight * w / v.videoWidth);
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d").drawImage(v, 0, 0, w, h);
        return c.toDataURL("image/jpeg", 0.78);
    }

    function times() {

        const m = MODES[$("mode").value];
        const d = meta.duration;
        let list = [];

        if (m.n) {
            for (let i = 0; i < m.n; i++) list.push((i + 0.5) * d / m.n);
        } else {
            for (let t = 0; t < d; t += m.every) list.push(t);
        }

        if (list.length > MAX_FRAMES) {
            const step = list.length / MAX_FRAMES;
            list = Array.from({ length: MAX_FRAMES }, (_, i) => list[Math.floor(i * step)]);
        }

        return list;
    }

    $("extract").addEventListener("click", async () => {

        if (!url || !meta) return JAJA.toast("Unggah video dulu");

        $("extract").disabled = true;
        $("status").textContent = "Mengambil frame...";

        try {
            const v = await openHidden();
            const ts = times();
            const out = [];

            for (let i = 0; i < ts.length; i++) {
                await seek(v, ts[i]);
                out.push({ t: ts[i], img: snap(v), note: "" });
                $("status").textContent = "Mengambil frame " + (i + 1) + " / " + ts.length + "...";
            }

            frames = out;
            renderFrames();
            $("status").textContent = out.length + " frame diambil. Pilih gerakan di tiap frame.";
        } catch (e) {
            $("status").textContent = "Gagal: " + e.message;
        }

        $("extract").disabled = false;
    });

    $("grab").addEventListener("click", () => {

        const p = $("player");

        if (!url || !meta || !p.videoWidth) return JAJA.toast("Unggah video dulu");
        if (frames.length >= MAX_FRAMES) return JAJA.toast("Maksimal " + MAX_FRAMES + " frame");

        frames.push({ t: p.currentTime, img: snap(p), note: "" });
        frames.sort((a, b) => a.t - b.t);
        renderFrames();
    });

    // ---------- daftar frame ----------

    function renderFrames() {

        const box = $("frames");
        box.innerHTML = "";

        if (!frames.length) {
            const p = document.createElement("p");
            p.className = "hint";
            p.textContent = 'Belum ada frame. Unggah video lalu klik "Ambil Frame Otomatis".';
            box.appendChild(p);
            return;
        }

        frames.forEach((f, i) => {

            const d = document.createElement("div");
            d.className = "frame";

            const img = document.createElement("img");
            img.src = f.img;
            img.alt = "frame " + fmt(f.t);
            img.title = "Klik untuk melompat ke waktu ini";
            img.addEventListener("click", () => {
                const p = $("player");
                p.currentTime = f.t;
                p.scrollIntoView({ block: "center" });
            });

            const head = document.createElement("div");
            head.className = "fhead";

            const tag = document.createElement("b");
            tag.textContent = "#" + (i + 1) + " · " + fmt(f.t) + " s";

            const del = document.createElement("button");
            del.className = "sm ghost";
            del.textContent = "✕";
            del.setAttribute("aria-label", "Hapus frame");
            del.addEventListener("click", () => { frames.splice(i, 1); renderFrames(); });

            head.append(tag, del);

            const sel = document.createElement("select");
            JAJA.fill(sel, Object.keys(PRESETS));
            sel.addEventListener("change", () => {
                if (PRESETS[sel.value]) {
                    f.note = PRESETS[sel.value];
                    ta.value = f.note;
                }
            });

            const ta = document.createElement("textarea");
            ta.className = "sm";
            ta.placeholder = "Gerakan di frame ini (bahasa Inggris)...";
            ta.value = f.note;
            ta.addEventListener("input", () => { f.note = ta.value; });

            d.append(img, head, sel, ta);
            box.appendChild(d);
        });
    }

    $("clear").addEventListener("click", () => {
        if (frames.length && confirm("Hapus semua frame?")) {
            frames = [];
            renderFrames();
        }
    });

    // ---------- kontak sheet ----------

    $("sheet").addEventListener("click", async () => {

        if (!frames.length) return JAJA.toast("Belum ada frame");

        const cols = Math.min(4, frames.length);
        const rows = Math.ceil(frames.length / cols);
        const imgs = await Promise.all(frames.map(f => new Promise(r => {
            const i = new Image();
            i.onload = () => r(i);
            i.src = f.img;
        })));

        const cw = imgs[0].width;
        const ch = imgs[0].height;
        const pad = 8;
        const bar = 26;

        const c = document.createElement("canvas");
        c.width = cols * (cw + pad) + pad;
        c.height = rows * (ch + bar + pad) + pad;

        const g = c.getContext("2d");
        g.fillStyle = "#0b1220";
        g.fillRect(0, 0, c.width, c.height);
        g.font = "bold 16px Arial";
        g.textBaseline = "middle";

        imgs.forEach((im, i) => {
            const x = pad + (i % cols) * (cw + pad);
            const y = pad + Math.floor(i / cols) * (ch + bar + pad);
            g.drawImage(im, x, y, cw, ch);
            g.fillStyle = "#38bdf8";
            g.fillText("#" + (i + 1) + "  " + fmt(frames[i].t) + " s", x + 4, y + ch + bar / 2);
        });

        const a = document.createElement("a");
        a.href = c.toDataURL("image/png");
        a.download = "JAJA_KONTAK_SHEET.png";
        a.click();
    });

    // ---------- susun prompt ----------

    function build() {

        const used = frames.filter(f => f.note.trim());
        const msg = $("buildMsg");

        // pesan menetap (bukan toast sesaat) dan isi kotak hasil tidak dihapus
        if (!meta || !url) {
            msg.textContent = "⚠️ Unggah video dulu (langkah 1), lalu ambil frame (langkah 2).";
            return;
        }

        if (!frames.length) {
            msg.textContent = "⚠️ Belum ada frame. Klik \"Ambil Frame Otomatis\" di langkah 2, lalu pilih gerakan di tiap frame pada kartu Frame Kunci.";
            return;
        }

        if (!used.length) {
            msg.textContent = "⚠️ Ada " + frames.length + " frame, tetapi belum ada gerakan yang dipilih. Pilih gerakan minimal di satu frame pada kartu Frame Kunci.";
            $("frames").scrollIntoView({ block: "start" });
            return;
        }

        const subject = $("subject").value.trim() || "the character";
        const end = meta ? meta.duration : used[used.length - 1].t + 1;

        const segs = used.map((f, i) => {
            const to = i + 1 < used.length ? used[i + 1].t : end;
            // segmen pertama dimulai dari awal video
            return { from: i === 0 ? 0 : f.t, to, note: f.note.trim().replace(/[.\s]+$/, "") };
        });

        const lines = segs.map(s => "[" + s.from.toFixed(1) + "-" + s.to.toFixed(1) + "s] " + s.note);

        const para = "A continuous movement sequence matching the reference video, performed by " + subject + ": " +
            segs.map((s, i) => (i ? "then " : "first ") + s.note).join("; ") + ". " +
            "Natural timing and body weight, smooth transitions between actions, consistent face and outfit throughout" +
            (meta ? ", " + ratioLabel(meta.w, meta.h, true) + ", about " + Math.round(meta.duration) + " seconds" : "") + ".";

        $("hasil").value = para + ($("withTimeline").checked ? "\n\nTimeline:\n" + lines.join("\n") : "");

        msg.textContent = "✅ Prompt tersusun dari " + used.length + " frame. Lihat kotak Prompt Gerakan.";
        $("hasil").scrollIntoView({ block: "center" });
    }

    $("build").addEventListener("click", build);

    $("copy").addEventListener("click", () => {
        if (!$("hasil").value) return JAJA.toast("Susun prompt dulu");
        JAJA.copy($("hasil").value + "\n\nNegative: " + $("neg").value);
    });

    $("exp").addEventListener("click", () => {
        if (!$("hasil").value) return JAJA.toast("Susun prompt dulu");
        JAJA.download("JAJA_REFERENSI_VIDEO.txt", $("hasil").value + "\n\nNegative: " + $("neg").value);
    });

    $("toMotion").addEventListener("click", () => {
        if (!$("hasil").value) return JAJA.toast("Susun prompt dulu");
        const para = $("hasil").value.split("\n\nTimeline:")[0];
        JAJA.store("jaja_subject", para);
        location.href = "motion-prompt.html";
    });

    // bersihkan object URL saat halaman ditutup
    window.addEventListener("beforeunload", () => { if (url) URL.revokeObjectURL(url); });

})();
