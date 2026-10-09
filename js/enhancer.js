// ==========================
// PROMPT ENHANCER
// ==========================

const ENH = {

    type: {
        "Gambar (foto/ilustrasi)": "image",
        "Video (gerakan)": "video"
    },

    style: {
        "Realistis": "photorealistic, natural skin texture, shot on 85mm lens, shallow depth of field",
        "Sinematik": "cinematic film still, anamorphic lens, rich color grading, volumetric light",
        "Anime": "high quality anime illustration, clean line art, vibrant colors",
        "3D Pixar": "3D animated film style, expressive features, soft global illumination",
        "Fantasi": "epic fantasy concept art, intricate detail, dramatic atmosphere",
        "Foto produk": "clean commercial product photo, soft studio light, sharp focus"
    },

    level: {
        "Ringkas": 1,
        "Sedang": 2,
        "Detail": 3
    },

    // kata Indonesia umum -> Inggris
    kamus: {
        "cewek": "young woman", "perempuan": "woman", "wanita": "woman", "gadis": "girl",
        "cowok": "young man", "laki-laki": "man", "pria": "man", "anak": "child",
        "nenek": "elderly grandmother", "kakek": "elderly grandfather",
        "kebaya": "traditional kebaya", "batik": "batik clothing", "hijab": "hijab",
        "jalan": "walking", "berjalan": "walking", "lari": "running", "berlari": "running",
        "duduk": "sitting", "berdiri": "standing", "tersenyum": "smiling", "senyum": "smiling",
        "menari": "dancing", "makan": "eating", "minum": "drinking", "memasak": "cooking",
        "sawah": "rice field", "pantai": "beach", "hutan": "forest", "gunung": "mountain",
        "kota": "city", "kampung": "village", "pasar": "traditional market", "kafe": "cafe",
        "kamar": "bedroom", "jalanan": "street", "sungai": "river", "candi": "ancient temple",
        "pagi hari": "morning", "pagi": "morning", "siang hari": "midday", "malam hari": "night", "sore hari": "late afternoon", "hari": "day", "siang": "midday", "sore": "late afternoon", "malam": "night",
        "hujan": "rain", "kabut": "mist", "senja": "sunset", "matahari terbit": "sunrise",
        "di": "in", "dan": "and", "dengan": "with", "yang": "", "sedang": "",
        "cantik": "beautiful", "tampan": "handsome", "lucu": "cute", "tua": "elderly",
        "mobil": "car", "motor": "motorbike", "kucing": "cat", "anjing": "dog",
        "naga": "dragon", "ksatria": "knight", "penyihir": "witch", "putri": "princess"
    },

    imageExtra: [
        "natural composition",
        "highly detailed",
        "realistic proportions, sharp focus",
        "masterpiece, 8K, professional color grading, intricate details"
    ],

    videoExtra: [
        "smooth natural motion",
        "smooth natural motion, stable camera, consistent subject",
        "smooth natural motion, stable camera, consistent subject and face, fluid temporal coherence, no flicker"
    ],

    negImage: "blurry, low quality, deformed hands, extra fingers, distorted face, text, watermark",
    negVideo: "blurry, flickering, morphing, distorted face, jitter, text, watermark"
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
// RULE BASED
// ==========================

function terjemah(text) {

    let out = text.toLowerCase();

    // frasa panjang dulu supaya "matahari terbit" menang atas kata tunggal
    Object.keys(ENH.kamus)
        .sort((a, b) => b.length - a.length)
        .forEach(k => {
            const re = new RegExp("(^|[^a-z])" + k.replace(/[-]/g, "\\-") + "(?![a-z])", "g");
            out = out.replace(re, (m, pre) => pre + ENH.kamus[k]);
        });

    return out.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
}

function enhanceLocal(idea) {

    const isVideo = ENH.type[$("type").value] === "video";
    const lvl = ENH.level[$("level").value] - 1;

    const parts = [terjemah(idea), ENH.style[$("style").value]];

    if (lvl > 0) parts.push((isVideo ? ENH.videoExtra : ENH.imageExtra)[lvl]);
    else parts.push((isVideo ? ENH.videoExtra : ENH.imageExtra)[0]);

    return parts.join(", ") + "\n\nNegative: " + (isVideo ? ENH.negVideo : ENH.negImage);
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

    const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "qwen2.5:7b", system, prompt: idea, stream: false }),
        signal: AbortSignal.timeout(60000)
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();

    return data.response.trim() + "\n\nNegative: " + (isVideo ? ENH.negVideo : ENH.negImage);
}

// ==========================
// EVENTS
// ==========================

$("generateBtn").addEventListener("click", async () => {

    const idea = $("idea").value.trim();

    if (!idea) {
        $("hasil").value = "";
        $("idea").focus();
        return;
    }

    if (!$("useAI").checked) {
        $("hasil").value = enhanceLocal(idea);
        return;
    }

    $("generateBtn").disabled = true;
    $("aiStatus").textContent = "AI sedang menulis...";

    try {
        $("hasil").value = await enhanceAI(idea);
        $("aiStatus").textContent = "Selesai memakai Ollama.";
    } catch (e) {
        $("hasil").value = enhanceLocal(idea);
        $("aiStatus").textContent = "Ollama tidak bisa dihubungi (" + e.message + "), memakai aturan bawaan.";
    }

    $("generateBtn").disabled = false;
});

$("useAI").addEventListener("change", () => {
    $("aiStatus").textContent = $("useAI").checked
        ? "Aktif: butuh Ollama berjalan di localhost:11434."
        : "Mati: memakai aturan bawaan, tanpa internet.";
});

$("copyBtn").addEventListener("click", () => {
    navigator.clipboard.writeText($("hasil").value);
    alert("Prompt berhasil di copy!");
});

$("exportBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([$("hasil").value], { type: "text/plain" }));
    link.download = "JAJA_ENHANCED_PROMPT.txt";
    link.click();
});

// ==========================
// TERIMA IDE DARI IMAGE GENERATOR + KIRIM KE IMAGE GENERATOR
// ==========================

const fromImage = JAJA.take("jaja_enh_idea");
if (fromImage) $("idea").value = fromImage;

$("imgBtn").addEventListener("click", () => {
    const text = $("hasil").value.split("

Negative:")[0].trim();
    if (!text) return JAJA.toast("Enhance dulu");
    JAJA.store("jaja_img_prompt", text);
    location.href = "image-generator.html";
});
