// ==========================
// MOTION PROMPT GENERATOR
// ==========================

const MOTION = {

    model: {
        "Wan 2.2 (ComfyUI lokal)": {
            note: "Satu paragraf, urutan: subjek, aksi, scene, kamera, gaya. Cocok untuk 5 detik.",
            audio: false, timeline: false, maxSec: 5,
            tips: "Gunakan clip 5 detik (81 frame di 16 fps). Satu aksi saja per clip, kamera pelan, dan hindari shot terlalu lebar karena wajah mudah berubah."
        },
        "Seedance": {
            note: "Mendukung audio dan beberapa shot dengan timestamp.",
            audio: true, timeline: true, maxSec: 15,
            tips: "Tulis per shot dengan rentang detik. Untuk wajah yang konsisten, lampirkan foto referensi dan sebut 'the same person as the reference image'."
        },
        "Kling": {
            note: "Kalimat ringkas dan jelas, negative prompt didukung.",
            audio: false, timeline: false, maxSec: 10,
            tips: "Jaga prompt di bawah sekitar 100 kata. Isi negative prompt agar tidak ada teks atau watermark."
        },
        "Veo 3": {
            note: "Mendukung dialog dan suara, tulis audio terpisah.",
            audio: true, timeline: false, maxSec: 8,
            tips: "Tulis suara sebagai kalimat sendiri. Dialog ditulis dalam tanda kutip dan diberi nama pembicara."
        },
        "Generic": {
            note: "Format netral untuk model apa saja.",
            audio: false, timeline: false, maxSec: 10,
            tips: "Mulai dari versi ini, lalu sesuaikan dengan format model yang dipakai."
        }
    },

    action: {
        "Berjalan pelan": "walking slowly forward with a natural gait",
        "Menoleh ke kamera": "slowly turning toward the camera and looking straight into the lens",
        "Tersenyum": "breaking into a soft genuine smile",
        "Tertawa": "laughing naturally with a slight shoulder movement",
        "Berbicara ke kamera": "talking directly to the camera with natural lip movement and small hand gestures",
        "Berlari": "running forward, hair and clothes moving with the motion",
        "Menari": "dancing with smooth rhythmic movements",
        "Duduk dan minum": "sitting and lifting a cup to drink, then setting it down",
        "Mengetik": "typing on a laptop, glancing up from the screen",
        "Memasak": "cooking at a stove, stirring a pan with steam rising",
        "Berdiri diam (bernapas)": "standing still, breathing gently, subtle blinking and tiny head movement",
        "Rambut tertiup angin": "standing as the wind moves hair and clothing gently",
        "Bertarung (slow motion)": "performing a fast martial arts strike in slow motion with controlled movement",
        "Melambaikan tangan": "waving at the camera with a friendly smile"
    },

    scene: {
        "Jalan kampung Jakarta": "in a narrow Jakarta neighborhood alley with warung stalls and hanging wires",
        "Kafe": "inside a warm cozy cafe with wooden tables and soft background chatter",
        "Pantai": "on a quiet beach with gentle waves and wet sand",
        "Sawah": "in a green rice field with distant mountains",
        "Kamar tidur": "in a tidy modern bedroom with soft window light",
        "Jalan kota malam": "on a city street at night with neon signs reflected on wet asphalt",
        "Studio": "in a clean photography studio with a plain backdrop",
        "Hutan": "in a misty tropical forest with sunbeams through the trees",
        "Pasar tradisional": "in a busy traditional market with colorful produce stalls",
        "Candi": "in front of an ancient stone temple at dawn"
    },

    shot: {
        "Close up": "close-up shot",
        "Medium shot": "medium shot",
        "Full body": "full body shot",
        "Wide shot": "wide establishing shot",
        "Over the shoulder": "over-the-shoulder shot",
        "POV": "first-person POV shot",
        "Low angle": "low angle shot",
        "High angle": "high angle shot"
    },

    camera: {
        "Statis (tripod)": "static locked-off camera",
        "Dolly in": "camera slowly dollies in",
        "Dolly out": "camera slowly pulls back",
        "Pan kiri": "camera pans left",
        "Pan kanan": "camera pans right",
        "Tilt atas": "camera tilts up",
        "Orbit (mengelilingi)": "camera orbits smoothly around the subject",
        "Tracking (mengikuti)": "camera tracks alongside the subject",
        "Handheld": "handheld camera with natural subtle shake",
        "Crane naik": "camera rises on a crane",
        "Drone": "aerial drone shot moving forward"
    },

    speed: {
        "Pelan": "slow",
        "Normal": "natural",
        "Cepat": "fast-paced",
        "Slow motion": "slow motion"
    },

    style: {
        "Sinematik": "cinematic film look, shallow depth of field, anamorphic",
        "Realistis (dokumenter)": "realistic documentary look, natural colors",
        "DV camcorder 2000-an": "early-2000s DV camcorder footage, soft focus, slight grain, date stamp feel",
        "Vlog / selfie": "casual smartphone vlog look",
        "Anime": "high-quality anime style animation",
        "3D Pixar": "3D animated family film style, expressive characters",
        "Fantasi": "epic fantasy film look, rich color grading",
        "Hitam putih": "black and white film, high contrast, fine grain"
    },

    light: {
        "Natural": "soft natural daylight",
        "Golden hour": "warm golden hour sunlight",
        "Neon": "colorful neon lighting",
        "Moody": "low-key moody lighting with deep shadows",
        "Studio": "soft studio lighting",
        "Malam": "dim night lighting with practical lights"
    },

    duration: { "3 detik": 3, "5 detik": 5, "8 detik": 8, "10 detik": 10, "15 detik": 15 },

    aspect: { "9:16 (Shorts/Reels)": "9:16 vertical", "16:9 (YouTube)": "16:9 widescreen", "1:1 (Kotak)": "1:1 square" },

    audio: {
        "Tanpa audio": "",
        "Ambience saja": "Ambient sound: natural background atmosphere of the location.",
        "Musik pelan": "Soft gentle background music.",
        "Musik dramatis": "Dramatic cinematic score building slowly."
    },

    negative: "blurry, low quality, distorted face, deformed hands, extra fingers, flickering, morphing, text, subtitles, watermark, logo, jitter"
};

// ==========================
// DROPDOWNS
// ==========================

const $ = id => document.getElementById(id);

function fill(id, obj) {
    const select = $(id);
    select.innerHTML = "";
    Object.keys(obj).forEach(k => {
        const o = document.createElement("option");
        o.value = o.textContent = k;
        select.appendChild(o);
    });
}

["model", "action", "scene", "shot", "camera", "speed", "style", "light", "duration", "aspect", "audio"]
    .forEach(id => fill(id, MOTION[id]));

$("duration").value = "5 detik";
$("aspect").value = "9:16 (Shorts/Reels)";
$("negatif").value = MOTION.negative;

// ==========================
// BUILD PROMPT
// ==========================

function build() {

    const m = MOTION.model[$("model").value];
    const subject = $("subject").value.trim() || "a young woman";
    const action = MOTION.action[$("action").value];
    const scene = MOTION.scene[$("scene").value];
    const shot = MOTION.shot[$("shot").value];
    const camera = MOTION.camera[$("camera").value];
    const speed = MOTION.speed[$("speed").value];
    const style = MOTION.style[$("style").value];
    const light = MOTION.light[$("light").value];
    const sec = MOTION.duration[$("duration").value];
    const aspect = MOTION.aspect[$("aspect").value];
    const audio = m.audio ? MOTION.audio[$("audio").value] : "";

    const body = `${shot} of ${subject}, ${action}, ${scene}.`;
    const cam = `${camera}, ${speed} movement.`;
    const look = `${style}, ${light}, ${aspect}.`;

    let out;

    if ($("model").value === "Seedance" && sec >= 8) {
        const mid = Math.round(sec / 2);
        out = `Shot 1 (0-${mid}s): ${body} ${cam}\n` +
              `Shot 2 (${mid}-${sec}s): closer framing of the same subject continuing the action, ${cam}\n` +
              `Look: ${look}`;
    } else {
        out = `${body} ${cam} ${look}`;
    }

    if (audio) out += `\n${audio}`;
    if (sec > m.maxSec) out += `\n(Catatan: ${$("model").value} paling stabil sampai ${m.maxSec} detik. Potong jadi beberapa clip lalu sambung.)`;

    $("hasil").value = out;
    $("modelNote").textContent = m.note;
    $("tips").textContent = m.tips;
}

// ==========================
// EVENTS
// ==========================

$("generateBtn").addEventListener("click", build);

$("model").addEventListener("change", () => {
    const m = MOTION.model[$("model").value];
    $("audio").disabled = !m.audio;
    build();
});

$("randomBtn").addEventListener("click", () => {
    ["action", "scene", "shot", "camera", "speed", "style", "light"].forEach(id => {
        const keys = Object.keys(MOTION[id]);
        $(id).value = keys[Math.floor(Math.random() * keys.length)];
    });
    build();
});

$("copyBtn").addEventListener("click", () => {
    const text = $("hasil").value + ($("negatif").value ? "\n\nNegative: " + $("negatif").value : "");
    navigator.clipboard.writeText(text);
    alert("Prompt berhasil di copy!");
});

$("exportBtn").addEventListener("click", () => {
    const text = $("hasil").value + "\n\nNegative: " + $("negatif").value;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    link.download = "JAJA_MOTION_PROMPT.txt";
    link.click();
});

["subject", "action", "scene", "shot", "camera", "speed", "style", "light", "duration", "aspect", "audio"]
    .forEach(id => $(id).addEventListener("change", build));

$("subject").addEventListener("input", build);

$("model").dispatchEvent(new Event("change"));
