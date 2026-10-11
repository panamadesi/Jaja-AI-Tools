// ==========================
// SEEDANCE (BytePlus ModelArk) lewat proxy lokal
// Kunci API hanya ada di proxy (tools/seedance-proxy.py), tidak pernah di browser ini.
// ==========================

(function () {

    const $ = id => document.getElementById(id);

    const RATIOS = ["9:16", "16:9", "1:1", "3:4", "4:3", "21:9"];
    const DURS = ["5", "10", "4", "6", "8", "12", "15"];
    const RES = ["480p", "720p", "1080p"];

    JAJA.fill($("ratio"), RATIOS);
    JAJA.fill($("dur"), DURS);
    JAJA.fill($("res"), RES);

    const LS = {
        get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
    };

    $("proxy").value = LS.get("jaja_seedance_proxy", "http://127.0.0.1:8787");
    $("model").value = LS.get("jaja_seedance_model", "");

    const handoff = JAJA.take("jaja_seed_prompt");
    if (handoff) $("prompt").value = handoff;

    let imageData = null;        // data URL gambar (sudah diperkecil)
    let lastUrl = null;          // tautan video terakhir
    let timer = null;

    const proxy = () => $("proxy").value.trim().replace(/\/+$/, "");

    // ---------- koneksi ----------

    async function cek() {

        LS.set("jaja_seedance_proxy", $("proxy").value.trim());

        const el = $("koneksi");

        try {
            const r = await fetch(proxy() + "/health", { signal: AbortSignal.timeout(4000) });
            const j = await r.json();
            el.textContent = j.hasKey
                ? "✅ Proxy aktif dan kunci API terbaca. Alamat BytePlus: " + j.baseUrl
                : "⚠️ Proxy aktif, tetapi kunci API belum ada. Buat file seedance-key.txt di folder JAJA AI TOOL (lihat panduan), lalu mulai ulang proxy.";
        } catch (e) {
            el.textContent = "❌ Proxy belum berjalan. Jalankan JALANKAN-SEEDANCE-PROXY.bat (folder JAJA AI TOOL), lalu klik Cek koneksi. Halaman ini juga harus dibuka dari http://localhost:8000.";
        }
    }

    $("cek").addEventListener("click", cek);

    // ---------- gambar ----------

    function showImgBox() {
        $("imgBox").hidden = $("mode").value === "teks";
    }

    $("mode").addEventListener("change", () => { showImgBox(); rebuild(); });
    showImgBox();

    $("img").addEventListener("change", e => {

        const f = e.target.files[0];

        if (!f) {
            imageData = null;
            $("imgPv").style.display = "none";
            $("imgInfo").textContent = "";
            return rebuild();
        }

        const url = URL.createObjectURL(f);
        const im = new Image();

        im.onload = () => {
            const max = 1280;
            const s = Math.min(1, max / Math.max(im.width, im.height));
            const c = document.createElement("canvas");
            c.width = Math.round(im.width * s);
            c.height = Math.round(im.height * s);
            c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
            imageData = c.toDataURL("image/jpeg", 0.9);
            URL.revokeObjectURL(url);

            $("imgPv").src = imageData;
            $("imgPv").style.display = "block";
            $("imgInfo").textContent = c.width + "x" + c.height + ", " + Math.round(imageData.length * 0.75 / 1024) + " KB (diperkecil di browser, dikirim sebagai base64)";
            rebuild();
        };

        im.onerror = () => { $("imgInfo").textContent = "Gambar tidak bisa dibaca."; };
        im.src = url;
    });

    // ---------- isi permintaan ----------

    function build() {

        const style = $("pstyle").value;
        const mode = $("mode").value;
        const wm = $("wm").checked;
        let text = $("prompt").value.trim();

        if (style === "flag") {
            text += " --ratio " + $("ratio").value + " --dur " + $("dur").value + " --rs " + $("res").value + " --wm " + wm;
            if ($("seed").value) text += " --seed " + $("seed").value;
        }

        const content = [{ type: "text", text }];

        if (mode !== "teks") {
            content.push({
                type: "image_url",
                image_url: { url: imageData ? "__GAMBAR__" : "" },
                role: mode === "frame" ? "first_frame" : "reference_image"
            });
        }

        const body = { model: $("model").value.trim(), content };

        if (style === "json") {
            body.ratio = $("ratio").value;
            body.duration = parseInt($("dur").value, 10);
            body.resolution = $("res").value;
            body.generate_audio = $("audio").checked;
            body.watermark = wm;
            if ($("seed").value) body.seed = parseInt($("seed").value, 10);
        }

        return body;
    }

    function rebuild() {
        $("body").value = JSON.stringify(build(), null, 2);
    }

    $("rebuild").addEventListener("click", rebuild);

    ["model", "prompt", "ratio", "dur", "res", "seed", "audio", "wm", "pstyle"].forEach(id => {
        $(id).addEventListener("change", rebuild);
        $(id).addEventListener("input", rebuild);
    });

    $("model").addEventListener("change", () => LS.set("jaja_seedance_model", $("model").value.trim()));

    // ---------- kirim ----------

    function pretty(o) {
        return JSON.stringify(o, null, 2);
    }

    function setStatus(t) {
        $("status").textContent = t;
    }

    $("send").addEventListener("click", async () => {

        let body;

        try {
            body = JSON.parse($("body").value);
        } catch (e) {
            return setStatus("❌ Isi permintaan bukan JSON yang valid: " + e.message);
        }

        if (!body.model) return setStatus("❌ Isi ID model dulu (langkah 2).");

        const hasToken = JSON.stringify(body).includes("__GAMBAR__");

        if ($("mode").value !== "teks" && hasToken && !imageData) return setStatus("❌ Pilih gambar dulu (langkah 2).");

        if (hasToken) body = JSON.parse(JSON.stringify(body).replace(/"__GAMBAR__"/g, JSON.stringify(imageData)));

        if (!confirm("Ini memakai kredit atau biaya akun BytePlus Anda. Kirim sekarang?")) return;

        $("send").disabled = true;
        setStatus("Mengirim ke Seedance...");

        try {
            const r = await fetch(proxy() + "/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const j = await r.json();

            if (!r.ok || !j.id) {
                setStatus("❌ Ditolak (" + r.status + "):\n" + pretty(j));
            } else {
                saveTask(j.id, $("prompt").value.trim());
                poll(j.id);
            }
        } catch (e) {
            setStatus("❌ Tidak bisa menghubungi proxy lokal (" + e.message + "). Cek langkah 1.");
        }

        $("send").disabled = false;
    });

    // ---------- pantau ----------

    function findVideoUrl(o) {
        if (!o) return null;
        if (typeof o === "string") return /^https?:\/\/.+/.test(o) && /(\.mp4|video)/i.test(o) ? o : null;
        if (typeof o === "object") {
            for (const k of Object.keys(o)) {
                if (/video_url|videourl|url/i.test(k) && typeof o[k] === "string" && /^https?:/.test(o[k])) return o[k];
            }
            for (const k of Object.keys(o)) {
                const v = findVideoUrl(o[k]);
                if (v) return v;
            }
        }
        return null;
    }

    function poll(id) {

        clearTimeout(timer);

        const t0 = Date.now();

        const tick = async () => {

            try {
                const r = await fetch(proxy() + "/tasks/" + encodeURIComponent(id));
                const j = await r.json();
                const st = (j.status || (j.upstream && j.upstream.status) || "").toString().toLowerCase();
                const menit = ((Date.now() - t0) / 60000).toFixed(1);

                if (!r.ok) {
                    return setStatus("❌ Gagal membaca tugas " + id + " (" + r.status + "):\n" + pretty(j));
                }

                if (/succe/.test(st)) {
                    const url = findVideoUrl(j.content) || findVideoUrl(j);
                    updateTask(id, "selesai", url);
                    return tampil(id, url, j);
                }

                if (/fail|cancel|expired/.test(st)) {
                    updateTask(id, st);
                    return setStatus("❌ Tugas " + id + " " + st + ":\n" + pretty(j.error || j));
                }

                setStatus("⏳ " + id + " · status: " + (st || "menunggu") + " · " + menit + " menit");
                if (Date.now() - t0 < 25 * 60000) timer = setTimeout(tick, 6000);
                else setStatus("⏱ Waktu pantau habis (25 menit). Klik Pantau lagi dengan ID " + id + ".");
            } catch (e) {
                setStatus("⚠️ Gangguan koneksi ke proxy (" + e.message + "); mencoba lagi...");
                timer = setTimeout(tick, 8000);
            }
        };

        tick();
    }

    function tampil(id, url, j) {

        if (!url) {
            return setStatus("✅ Selesai, tetapi saya tidak menemukan tautan video di balasan:\n" + pretty(j));
        }

        lastUrl = url;
        setStatus("✅ Selesai: " + id);
        $("out").src = url;
        $("out").style.display = "block";
        $("outBtns").hidden = false;
        $("saveInfo").textContent = "Tautan video dari BytePlus biasanya kedaluwarsa dalam waktu singkat. Klik \"Simpan ke komputer\" agar tidak hilang.";
    }

    $("open").addEventListener("click", () => lastUrl && window.open(lastUrl, "_blank", "noopener"));
    $("copyUrl").addEventListener("click", () => lastUrl && JAJA.copy(lastUrl));

    $("saveLocal").addEventListener("click", async () => {

        if (!lastUrl) return;

        $("saveInfo").textContent = "Mengunduh ke komputer...";

        try {
            const r = await fetch(proxy() + "/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: lastUrl, name: "seedance_" + Date.now() })
            });
            const j = await r.json();
            $("saveInfo").textContent = r.ok ? "💾 Tersimpan: " + j.saved + " (" + j.mb + " MB)" : "❌ " + pretty(j);
        } catch (e) {
            $("saveInfo").textContent = "❌ " + e.message;
        }
    });

    $("resume").addEventListener("click", () => {
        const id = $("resumeId").value.trim();
        if (id) poll(id);
    });

    // ---------- daftar tugas (di browser ini) ----------

    function readTasks() {
        try { return JSON.parse(LS.get("jaja_seedance_tasks", "[]")); } catch (e) { return []; }
    }

    function writeTasks(l) {
        LS.set("jaja_seedance_tasks", JSON.stringify(l.slice(0, 10)));
        renderTasks();
    }

    function saveTask(id, prompt) {
        writeTasks([{ id, t: Date.now(), prompt: prompt.slice(0, 70), status: "dikirim", url: null }].concat(readTasks().filter(x => x.id !== id)));
    }

    function updateTask(id, status, url) {
        writeTasks(readTasks().map(x => x.id === id ? Object.assign({}, x, { status, url: url || x.url }) : x));
    }

    function renderTasks() {

        const box = $("tasks");
        box.innerHTML = "";

        readTasks().forEach(x => {

            const row = document.createElement("div");
            row.className = "hitem";

            const info = document.createElement("div");
            const b = document.createElement("b");
            b.textContent = x.prompt || x.id;
            const s = document.createElement("small");
            s.textContent = new Date(x.t).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) + " · " + x.status + " · " + x.id;
            info.append(b, s);

            const go = document.createElement("button");
            go.className = "sm";
            go.textContent = "Pantau";
            go.addEventListener("click", () => poll(x.id));

            row.append(info, go);
            box.appendChild(row);
        });
    }

    renderTasks();
    rebuild();
    cek();

})();
