// ==========================
// PRESET OTOMATIS + KIRIM KE MOTION
// ==========================

(function () {

    const page = location.pathname.split("/").pop();

    const FIELDS = {
        "character-generator.html": ["negara", "ras", "gender", "umur", "rambut", "warnaRambut", "outfit", "lokasi", "lighting", "kamera", "quality"],
        "motion-prompt.html": ["model", "subject", "action", "scene", "shot", "camera", "speed", "style", "light", "duration", "aspect", "audio"]
    }[page];

    if (!FIELDS) return;

    const KEY = "jaja_preset_" + page;

    function load(key) {
        try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
    }

    function save() {
        const data = {};
        FIELDS.forEach(id => { data[id] = document.getElementById(id).value; });
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { }
    }

    // ---------- pulihkan ----------

    const saved = load(KEY);

    FIELDS.forEach(id => {

        const el = document.getElementById(id);
        const evt = id === "subject" ? "input" : "change";

        if (saved[id]) {
            el.value = saved[id];
            el.dispatchEvent(new Event(evt));
        }

        el.addEventListener(evt, save);
    });

    // ---------- tombol tambahan ----------

    const group = document.querySelector(".button-group");

    function tambahTombol(label, onClick) {
        if (!group) return;
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", onClick);
        group.appendChild(b);
    }

    tambahTombol("♻ Reset Pilihan", () => {
        try { localStorage.removeItem(KEY); } catch (e) { }
        location.reload();
    });

    // ---------- karakter -> motion / gambar ----------

    if (page === "character-generator.html") {

        document.getElementById("generateBtn").addEventListener("click", () => {
            JAJA.store("jaja_char_prompt", document.getElementById("hasil").value);
        });

        tambahTombol("🖼 Buat Gambar", () => {
            const hasil = document.getElementById("hasil");
            if (!hasil.value.trim()) document.getElementById("generateBtn").click();
            if (!hasil.value.trim()) return;
            JAJA.store("jaja_img_prompt", hasil.value.replace(/\s+/g, " ").trim());
            location.href = "image-generator.html";
        });

        tambahTombol("🎬 Kirim ke Motion", () => {

            const v = id => document.getElementById(id).value;

            if (!v("gender") || !v("ras")) {
                alert("Pilih minimal Ras dan Gender dulu.");
                return;
            }

            const woman = v("gender") === "Cewek";
            const umur = { "18-25": "a young", "25-35": "an adult", "35-45": "a middle-aged" }[v("umur")] || "a";
            const hair = ENHANCER.hair[v("rambut")] || v("rambut");
            const outfit = ENHANCER.outfit[v("outfit")] || (v("outfit") ? "wearing " + v("outfit") : "");

            const subject = [umur, v("ras"), woman ? "woman" : "man", "from " + v("negara")]
                .filter(Boolean).join(" ") +
                [hair, outfit].filter(Boolean).map(t => ", " + t).join("");

            JAJA.store("jaja_subject", subject);
            JAJA.store("jaja_last_character", subject);

            location.href = "motion-prompt.html";
        });
    }

    // ---------- terima subjek dari karakter ----------

    if (page === "motion-prompt.html") {

        let subject = null;

        try {
            subject = localStorage.getItem("jaja_subject");
            localStorage.removeItem("jaja_subject");
        } catch (e) { }

        if (subject) {
            const el = document.getElementById("subject");
            el.value = subject;
            el.dispatchEvent(new Event("input"));
        }
    }

})();
