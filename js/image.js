// ==========================
// IMAGE GENERATOR
// Mesin 1: ComfyUI lokal (SDXL, tanpa batas)
// Mesin 2: Pollinations (gratis, hanya 512x512 tanpa akun)
// ==========================

(function () {

    const $ = id => document.getElementById(id);

    const ENGINES = {
        "ComfyUI lokal (SDXL, tanpa batas)": "comfy",
        "Pollinations (gratis, 512x512)": "poll"
    };

    const SIZES = {
        comfy: {
            "9:16 Vertikal (768x1344)": [768, 1344],
            "1:1 Kotak (1024x1024)": [1024, 1024],
            "16:9 Lebar (1344x768)": [1344, 768],
            "3:4 Potret (896x1152)": [896, 1152],
            "4:3 Lanskap (1152x896)": [1152, 896]
        },
        poll: {
            "1:1 Kotak (512x512)": [512, 512]
        }
    };

    const NOTES = {
        comfy: "Jalankan ComfyUI lewat JALANKAN-COMFY-UNTUK-JAJA.bat (folder JAJA AI TOOL) supaya browser boleh memanggilnya. Buka halaman ini dari http://localhost:8000.",
        poll: "Tanpa akun, layanan ini hanya mengizinkan 512x512 dengan model standar. Cocok untuk draft cepat, bukan hasil final."
    };

    JAJA.fill($("engine"), Object.keys(ENGINES));
    JAJA.fill($("count"), ["1", "2", "4"]);
    JAJA.fill($("model"), ["Standar"]);

    $("count").value = "2";
    $("neg").value = "blurry, low quality, deformed hands, extra fingers, distorted face, text, watermark";

    const fromLib = JAJA.take("jaja_img_prompt");
    if (fromLib) $("prompt").value = fromLib;

    const engine = () => ENGINES[$("engine").value];

    function applyEngine() {
        const e = engine();
        JAJA.fill($("size"), Object.keys(SIZES[e]));
        $("comfyBox").hidden = e !== "comfy";
        $("modelBox").hidden = true;
        $("engineNote").textContent = NOTES[e];
        if (e === "comfy") loadCheckpoints();
    }

    $("engine").addEventListener("change", applyEngine);

    // ---------- ComfyUI ----------

    const base = () => $("comfyUrl").value.trim().replace(/\/+$/, "");

    async function loadCheckpoints() {

        try {
            const res = await fetch(base() + "/object_info/CheckpointLoaderSimple", { signal: AbortSignal.timeout(5000) });
            const info = await res.json();
            const list = info.CheckpointLoaderSimple.input.required.ckpt_name[0];
            JAJA.fill($("ckpt"), list);
            const sdxl = list.find(n => /sdxl|xl/i.test(n));
            if (sdxl) $("ckpt").value = sdxl;
            $("engineNote").textContent = NOTES.comfy + " ✅ Terhubung.";
        } catch (e) {
            JAJA.fill($("ckpt"), ["(ComfyUI belum terhubung)"]);
            $("engineNote").textContent = NOTES.comfy + " ⚠️ Belum terhubung.";
        }
    }

    $("reload").addEventListener("click", loadCheckpoints);

    function graph(prompt, neg, w, h, seed, ckpt) {
        return {
            "1": { class_type: "CheckpointLoaderSimple", inputs: { ckpt_name: ckpt } },
            "2": { class_type: "CLIPTextEncode", inputs: { text: prompt, clip: ["1", 1] } },
            "3": { class_type: "CLIPTextEncode", inputs: { text: neg, clip: ["1", 1] } },
            "4": { class_type: "EmptyLatentImage", inputs: { width: w, height: h, batch_size: 1 } },
            "5": {
                class_type: "KSampler",
                inputs: {
                    seed, steps: 28, cfg: 6.5, sampler_name: "dpmpp_2m", scheduler: "karras", denoise: 1,
                    model: ["1", 0], positive: ["2", 0], negative: ["3", 0], latent_image: ["4", 0]
                }
            },
            "6": { class_type: "VAEDecode", inputs: { samples: ["5", 0], vae: ["1", 2] } },
            "7": { class_type: "SaveImage", inputs: { filename_prefix: "JAJA", images: ["6", 0] } }
        };
    }

    async function comfyRender(prompt, neg, w, h, seed) {

        const ckpt = $("ckpt").value;

        const res = await fetch(base() + "/prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: graph(prompt, neg, w, h, seed, ckpt) })
        });

        if (!res.ok) throw new Error("ComfyUI menolak workflow (" + res.status + ")");

        const { prompt_id } = await res.json();

        for (let i = 0; i < 400; i++) {

            await new Promise(r => setTimeout(r, 1500));

            const hist = await (await fetch(base() + "/history/" + prompt_id)).json();
            const item = hist[prompt_id];

            if (item && item.outputs) {
                const img = Object.values(item.outputs).flatMap(o => o.images || [])[0];
                if (img) {
                    return base() + "/view?filename=" + encodeURIComponent(img.filename) +
                        "&subfolder=" + encodeURIComponent(img.subfolder || "") + "&type=" + img.type;
                }
            }

            if (item && item.status && item.status.status_str === "error") throw new Error("ComfyUI gagal membuat gambar");
        }

        throw new Error("waktu habis");
    }

    // ---------- Pollinations ----------

    function pollUrl(prompt, seed) {
        return "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) +
            "?width=512&height=512&seed=" + seed;
    }

    // ---------- tombol bantu ----------

    $("fromChar").addEventListener("click", () => {
        const p = JAJA.peek("jaja_char_prompt");
        if (p) $("prompt").value = p.replace(/\s+/g, " ").trim();
        else JAJA.toast("Belum ada prompt. Klik Generate di Character Generator dulu.");
    });

    $("enhanceBtn").addEventListener("click", () => {
        if (!$("prompt").value.trim()) return JAJA.toast("Isi prompt dulu");
        JAJA.store("jaja_enh_idea", $("prompt").value);
        location.href = "prompt-enhancer.html";
    });

    // ---------- generate ----------

    function addCard(seed) {

        const card = document.createElement("div");
        card.className = "shot";

        const box = document.createElement("div");
        box.className = "box";
        box.textContent = "⏳ Membuat gambar...";

        const acts = document.createElement("div");
        acts.className = "acts";

        const open = document.createElement("a");
        open.textContent = "🔍 Buka / simpan";
        open.target = "_blank";
        open.rel = "noopener";
        open.hidden = true;

        const sd = document.createElement("a");
        sd.href = "#";
        sd.textContent = "🌱 Seed " + seed;
        sd.addEventListener("click", e => { e.preventDefault(); JAJA.copy(String(seed)); });

        acts.append(open, sd);
        card.append(box, acts);
        $("gallery").appendChild(card);

        return {
            show(src) {
                const img = new Image();
                img.onload = () => { box.textContent = ""; box.appendChild(img); open.href = src; open.hidden = false; };
                img.onerror = () => { box.textContent = "❌ Gambar tidak bisa dimuat."; };
                img.src = src;
            },
            fail(msg) { box.textContent = "❌ " + msg; }
        };
    }

    $("go").addEventListener("click", async () => {

        const prompt = $("prompt").value.trim();

        if (!prompt) {
            $("prompt").focus();
            return JAJA.toast("Isi prompt dulu");
        }

        const e = engine();
        const [w, h] = SIZES[e][$("size").value];
        const n = parseInt($("count").value, 10);
        const neg = $("neg").value.trim();
        const baseSeed = !$("randSeed").checked && $("seed").value
            ? parseInt($("seed").value, 10)
            : Math.floor(Math.random() * 1e9);

        $("gallery").innerHTML = "";
        $("go").disabled = true;

        for (let i = 0; i < n; i++) {

            const seed = baseSeed + i;
            const card = addCard(seed);

            if (e === "poll") {
                card.show(pollUrl(prompt, seed));
                continue;
            }

            try {
                card.show(await comfyRender(prompt, neg, w, h, seed));
            } catch (err) {
                const offline = err instanceof TypeError;
                card.fail(offline
                    ? "ComfyUI tidak bisa dihubungi. Jalankan JALANKAN-COMFY-UNTUK-JAJA.bat lalu coba lagi."
                    : err.message);
                if (offline) break;
            }
        }

        $("go").disabled = false;
    });

    applyEngine();

})();
