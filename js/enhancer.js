// ==========================
// PROMPT ENHANCER
// Kamus dan jenis konten ada di data/kamus.js
// ==========================

const ENH = {

    type: {
        "Gambar (foto/ilustrasi)": "image",
        "Video (gerakan)": "video"
    },

    style: {
        "Realistis": "photorealistic, natural lighting, sharp focus, high detail",
        "Sinematik": "cinematic film still, anamorphic lens, rich color grading, volumetric light",
        "Anime": "high quality anime illustration, clean line art, vibrant colors",
        "3D Pixar": "3D animated film style, expressive features, soft global illumination",
        "Fantasi": "epic fantasy concept art, intricate detail, dramatic atmosphere",
        "Foto produk": "clean commercial product photo, soft studio light, sharp focus"
    },

    // gaya yang cocok dengan tambahan detail fotografi per jenis konten
    photoStyles: ["Realistis", "Sinematik", "Foto produk"],

    level: {
        "Ringkas": 1,
        "Sedang": 2,
        "Detail": 3
    },

    imageExtra: [
        "natural composition",
        "highly detailed, realistic proportions",
        "masterpiece, 8K, professional color grading, intricate details"
    ],

    videoExtra: [
        "smooth natural motion",
        "smooth natural motion, stable camera, consistent subject",
        "smooth natural motion, stable camera, consistent subject and face, fluid temporal coherence, no flicker"
    ],

    negImage: "blurry, low quality, text, watermark",
    negVideo: "blurry, flickering, morphing, jitter, text, watermark"
};

const $ = id => document.getElementById(id);

["type", "style", "level"].forEach(id => {
    const select = $(id);
    Object.keys(ENH[id]).forEach(k => {
        const o = document.createElement("option");
        o.value = o.textContent = k;
        select.appendChild(o);
    });
});

$("level").value = "Sedang";

// ==========================
// PENERJEMAH (satu pass: hasil terjemahan tidak diterjemahkan ulang)
// ==========================

const KAMUS_KEYS = Object.keys(KAMUS).sort((a, b) => b.length - a.length);

const KAMUS_RE = new RegExp(
    "(^|[^a-zA-Z0-9-])(" +
    KAMUS_KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
    ")(?![a-zA-Z0-9-])",
    "gi"
);

function terjemah(text) {

    // pecah menjadi potongan: kata kamus (k) dan teks biasa
    const tokens = [];
    let last = 0;
    let hits = 0;
    let m;

    KAMUS_RE.lastIndex = 0;

    while ((m = KAMUS_RE.exec(text))) {
        const start = m.index + m[1].length;
        const key = m[2].toLowerCase();
        if (start > last) tokens.push({ t: text.slice(last, start) });
        tokens.push({ k: key, t: KAMUS[key] });
        last = start + m[2].length;
        hits++;
    }

    tokens.push({ t: text.slice(last) });

    // orang + pakaian -> "wearing" ("cewek kebaya" -> "young woman wearing traditional kebaya")
    for (let i = 2; i < tokens.length; i++) {
        const cloth = tokens[i];
        const gap = tokens[i - 1];
        const who = tokens[i - 2];
        if (cloth.k && KAMUS_PAKAIAN.has(cloth.k) && !gap.k && /^\s+$/.test(gap.t) && who.k && KAMUS_ORANG.has(who.k)) {
            cloth.t = "wearing " + cloth.t;
        }
    }

    // benda + sifat -> sifat + benda ("kucing hitam" -> "black cat")
    for (let i = 2; i < tokens.length; i++) {

        const adj = tokens[i];
        const gap = tokens[i - 1];
        const noun = tokens[i - 2];

        if (!adj.k || !KAMUS_SIFAT.has(adj.k) || gap.k || !/^\s+$/.test(gap.t)) continue;
        if (!noun.k || KAMUS_SIFAT.has(noun.k) || KAMUS_FUNGSI.has(noun.k)) continue;

        // sisipkan sifat setelah "wearing a" / "on the" ("wearing a hijab" + putih -> "wearing a white hijab")
        const w = /^(wearing (?:an? )?|(?:on|in|at|under|near) the )(.*)$/.exec(noun.t || "");
        if (w) {
            const pre = w[1].replace(/\ban? $/, /^[aeiou]/i.test(adj.t) ? "an " : "a ");
            noun.t = pre + adj.t + " " + w[2];
            adj.t = "";
            continue;
        }

        if (!noun.t || /ing$/.test(noun.t) || /^(in|on|at|to|from|and|with|for|or|while|when|a|but|very|above|under|behind|near)\b/.test(noun.t)) continue;

        const tmp = noun.t;
        noun.t = adj.t;
        adj.t = tmp;
    }

    const out = tokens.map(x => x.t).join("");

    // kata sisa yang tidak dikenali (hanya dilaporkan jika teks tampak berbahasa Indonesia)
    const sisa = hits
        ? [...new Set((text.replace(KAMUS_RE, "$1 ").match(/[a-zA-Z][a-zA-Z-]{3,}/g) || []).map(w => w.toLowerCase()))].slice(0, 6)
        : [];

    return {
        text: out.replace(/\s+/g, " ").replace(/\s+([,.])/g, "$1").replace(/^[,\s]+|[,\s]+$/g, ""),
        sisa
    };
}

// urutan dari yang paling spesifik
const JENIS_URUTAN = ["fantasi", "hewan", "produk", "makanan", "orang", "bangunan", "pemandangan"];

function deteksi(text) {
    const t = text.toLowerCase();
    return JENIS_URUTAN.filter(j => JENIS[j].test(t)).slice(0, 2);
}

function enhanceLocal(idea) {

    const isVideo = ENH.type[$("type").value] === "video";
    const lvl = ENH.level[$("level").value] - 1;
    const styleName = $("style").value;

    const tr = terjemah(idea);
    const jenis = deteksi(tr.text);

    const parts = [tr.text, ENH.style[styleName]];

    const useJenis = jenis.length && (isVideo || ENH.photoStyles.includes(styleName));

    if (useJenis) {
        const table = isVideo ? JENIS_VIDEO : JENIS_GAMBAR;
        jenis.forEach(j => parts.push(table[j][lvl]));
        if (lvl === 2) parts.push(isVideo ? ENH.videoExtra[2] : ENH.imageExtra[2]);
    } else {
        parts.push((isVideo ? ENH.videoExtra : ENH.imageExtra)[lvl]);
    }

    // negative prompt per jenis; "people" tidak dilarang jika ada orangnya
    const negJenis = jenis.map(j => JENIS_NEGATIF[j])
        .map(n => jenis.includes("orang") || jenis.includes("fantasi") ? n.replace(/^people, /, "") : n);

    // buang istilah yang berulang (tanpa membedakan huruf besar/kecil)
    const dedupe = list => {
        const seen = new Set();
        return list.join(", ").split(/,\s*/).filter(t => {
            const k = t.trim().toLowerCase();
            if (!k || seen.has(k)) return false;
            seen.add(k);
            return true;
        });
    };

    const uniq = dedupe(parts);
    const neg = dedupe([isVideo ? ENH.negVideo : ENH.negImage].concat(negJenis)).join(", ");

    let info = jenis.length
        ? "Terdeteksi: " + jenis.map(j => JENIS_LABEL[j]).join(" + ") + "."
        : "Jenis konten tidak terdeteksi, memakai detail umum.";

    if (tr.sisa.length) {
        info += " Belum diterjemahkan (dibiarkan): " + tr.sisa.join(", ") + ". Untuk kalimat rumit, coba AI lokal.";
    }

    return { text: uniq.join(", ") + "\n\nNegative: " + neg, info };
}

// ==========================
// OLLAMA (opsional)
// ==========================

async function enhanceAI(idea) {

    const isVideo = ENH.type[$("type").value] === "video";

    const system =
        "You rewrite short ideas (Indonesian or English) into one detailed English prompt for an AI " +
        (isVideo ? "video" : "image") + " generator. " +
        "Describe subject, setting, lighting, camera and style. " +
        "Keep the user's intent, invent nothing contradicting it. " +
        "Output only the prompt, no explanation, no quotes. " +
        "Style: " + ENH.style[$("style").value] + ". " +
        "Length: " + ["about 30 words", "about 60 words", "about 100 words"][ENH.level[$("level").value] - 1] + ".";

    const text = await JAJA.ollama(system, idea);

    return text + "\n\nNegative: " + (isVideo ? ENH.negVideo : ENH.negImage);
}

// ==========================
// EVENTS
// ==========================

$("generateBtn").addEventListener("click", async () => {

    const idea = $("idea").value.trim();

    if (!idea) {
        $("hasil").value = "";
        $("aiStatus").textContent = "Tulis ide singkat dulu.";
        $("idea").focus();
        return;
    }

    if (!$("useAI").checked) {
        const r = enhanceLocal(idea);
        $("hasil").value = r.text;
        $("aiStatus").textContent = r.info;
        return;
    }

    $("generateBtn").disabled = true;
    $("aiStatus").textContent = "AI sedang menulis...";

    try {
        $("hasil").value = await enhanceAI(idea);
        $("aiStatus").textContent = "Selesai memakai Ollama.";
    } catch (e) {
        const r = enhanceLocal(idea);
        $("hasil").value = r.text;
        $("aiStatus").textContent = "Ollama tidak bisa dihubungi (" + e.message + "), memakai aturan bawaan. " + r.info;
    }

    $("generateBtn").disabled = false;
});

$("useAI").addEventListener("change", () => {
    $("aiStatus").textContent = $("useAI").checked
        ? "Aktif: butuh Ollama berjalan di localhost:11434."
        : "Mati: memakai aturan bawaan, tanpa internet.";
});

$("copyBtn").addEventListener("click", () => {
    JAJA.copy($("hasil").value);
});

$("exportBtn").addEventListener("click", () => {
    JAJA.download("JAJA_ENHANCED_PROMPT.txt", $("hasil").value);
});

// ==========================
// TERIMA IDE DARI IMAGE GENERATOR + KIRIM KE IMAGE GENERATOR
// ==========================

const fromImage = JAJA.take("jaja_enh_idea");
if (fromImage) $("idea").value = fromImage;

$("imgBtn").addEventListener("click", () => {
    const text = $("hasil").value.split("\n\nNegative:")[0].trim();
    if (!text) return JAJA.toast("Enhance dulu");
    JAJA.store("jaja_img_prompt", text);
    location.href = "image-generator.html";
});
