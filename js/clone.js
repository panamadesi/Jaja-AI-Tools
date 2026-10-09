// ==========================
// CHARACTER CLONE (master prompt dari gambar referensi)
// ==========================

(function () {

    const $ = id => document.getElementById(id);

    const SLOTS = [
        { id: "karakter", icon: "🧑", name: "Karakter (wajah)", take: "the face, identity, skin tone and body proportions", keep: true },
        { id: "pose", icon: "🕺", name: "Pose", take: "the exact body pose, hand position and head angle", keep: false },
        { id: "outfit", icon: "👗", name: "Outfit", take: "the complete outfit, fabric, colors and accessories", keep: false },
        { id: "rambut", icon: "💇", name: "Rambut", take: "the hairstyle, hair length, color and texture", keep: false },
        { id: "lokasi", icon: "📍", name: "Lokasi / background", take: "the location, background, props and atmosphere", keep: false },
        { id: "kamera", icon: "📷", name: "Kamera & framing", take: "the camera angle, framing, lens look, lighting and color grading", keep: false }
    ];

    const TARGETS = {
        "Gemini / Nano Banana": "Use the attached reference images.",
        "ChatGPT (image)": "Use the uploaded reference images.",
        "Flux Kontext / Qwen Edit": "Edit and combine the reference images.",
        "Generik": "Using the reference images provided,"
    };

    const state = {};

    JAJA.fill($("target"), Object.keys(TARGETS));

    const slotsEl = $("slots");

    SLOTS.forEach(s => {

        const box = document.createElement("div");
        box.className = "slot";
        box.innerHTML =
            "<h3>" + s.name + "</h3>" +
            '<div class="pv" id="pv_' + s.id + '">' + s.icon + "</div>" +
            '<input type="file" accept="image/*" id="f_' + s.id + '">' +
            '<label class="use"><input type="checkbox" id="u_' + s.id + '" checked> Pakai bagian ini</label>';

        slotsEl.appendChild(box);

        $("f_" + s.id).addEventListener("change", e => {

            const file = e.target.files[0];

            if (!file) {
                state[s.id] = false;
                $("pv_" + s.id).textContent = s.icon;
                return;
            }

            state[s.id] = true;

            const r = new FileReader();
            r.onload = ev => {
                $("pv_" + s.id).innerHTML = "";
                const img = new Image();
                img.src = ev.target.result;
                $("pv_" + s.id).appendChild(img);
            };
            r.readAsDataURL(file);
        });
    });

    function build() {

        const used = SLOTS.filter(s => state[s.id] && $("u_" + s.id).checked);

        if (!used.length) {
            $("out").value = "";
            $("order").textContent = "";
            return JAJA.toast("Unggah minimal satu gambar referensi");
        }

        const hasChar = used.some(s => s.id === "karakter");

        const lines = [TARGETS[$("target").value], ""];

        used.forEach((s, i) => {
            lines.push("Image " + (i + 1) + " (" + s.name + "): take " + s.take + " from this image.");
        });

        lines.push("");
        lines.push("Create ONE new photorealistic image that combines them:");

        if (hasChar) {
            lines.push("- Keep the person's face and identity exactly the same as Image " + (used.findIndex(s => s.id === "karakter") + 1) + ". Do not change facial features, age or skin tone.");
        }

        SLOTS.filter(s => s.id !== "karakter").forEach(s => {
            const idx = used.findIndex(u => u.id === s.id);
            if (idx >= 0) lines.push("- Apply " + s.name.toLowerCase() + " from Image " + (idx + 1) + ".");
        });

        const notUsed = SLOTS.filter(s => !used.some(u => u.id === s.id) && s.id !== "karakter");
        if (notUsed.length) {
            lines.push("- For " + notUsed.map(s => s.name.toLowerCase()).join(", ") + ": keep a natural, coherent choice that fits the rest.");
        }

        const extra = $("extra").value.trim();
        if (extra) lines.push("- Additional instruction: " + extra);

        lines.push("");
        lines.push("Style: photorealistic, natural skin texture with visible pores, realistic fabric folds, consistent lighting between subject and background, sharp focus, no extra fingers, no text, no watermark.");

        $("out").value = lines.join("\n");

        $("order").textContent = "Urutan unggah ke generator: " +
            used.map((s, i) => (i + 1) + ". " + s.name).join("  →  ");
    }

    $("build").addEventListener("click", build);
    $("copy").addEventListener("click", () => $("out").value && JAJA.copy($("out").value));
    $("exp").addEventListener("click", () => $("out").value && JAJA.download("JAJA_CLONE_PROMPT.txt", $("out").value));

})();
