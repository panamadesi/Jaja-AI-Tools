// ==========================
// PABRIK KONTEN: Drama/Film + Music Clip
// Ide -> Character Sheet -> Storyboard (prompt gambar + prompt video per scene)
// ==========================

(function () {

    const $ = id => document.getElementById(id);

    const MODES = ["Drama / Film", "Music Clip"];
    let mode = MODES[0];
    let current = null;

    const GENRES = {
        "Drama keluarga": "emotional family drama, warm tones, intimate framing",
        "Romansa": "romantic mood, soft glow, shallow depth of field, pastel warm palette",
        "Horor": "eerie horror atmosphere, low-key lighting, thin fog, desaturated teal and amber",
        "Aksi": "high-energy action, dynamic angles, contrasty lighting, motion blur on movement",
        "Komedi": "bright comedic tone, vivid colors, expressive reactions, playful framing",
        "Fantasi": "epic fantasy world, magical glow, rich saturated colors, grand scale",
        "Legenda Nusantara": "Indonesian folk tale atmosphere, mystical, warm earthy tones, storybook feel",
        "Misteri": "mysterious suspense, dark shadows, cold blue light with a single warm accent"
    };

    const MUSIC_MOODS = {
        "Galau / sedih": "melancholic, rain and blue hour tones, quiet longing",
        "Semangat": "uplifting, bright saturated colors, energetic movement",
        "Romantis": "romantic, golden hour glow, soft focus highlights",
        "Santai / chill": "relaxed, warm natural light, easy slow movement",
        "Dramatis": "dramatic, high contrast, strong rim light, cinematic scale"
    };

    const TEMPO = { "Lambat": "slow smooth camera movement, slow motion moments", "Sedang": "smooth steady camera movement", "Cepat": "fast cuts feel, dynamic camera movement" };

    const VISUAL = {
        "Realistis sinematik": "photorealistic cinematic film still, 35mm, natural skin texture",
        "Dokumenter": "photorealistic documentary look, handheld feel, natural colors",
        "DV camcorder 2000-an": "early-2000s DV camcorder look, soft focus, grain",
        "Animasi 3D": "3D animated family film style, expressive characters, soft global illumination",
        "Anime": "high quality anime film style, clean line art, painterly background",
        "Vintage 35mm": "vintage 35mm film look, warm tones, light leaks, grain"
    };

    const LOKASI = {
        "Bebas": "",
        "Kampung Indonesia": "an Indonesian village with rice fields and wooden houses",
        "Kota modern": "a modern city with glass buildings and busy streets",
        "Pegunungan": "misty mountains and tropical highlands",
        "Pantai": "a coastal beach with fishing boats",
        "Hutan": "a deep tropical forest with shafts of light",
        "Istana / kerajaan": "an ancient Javanese-style palace and courtyard",
        "Sekolah": "an Indonesian school and its yard",
        "Rumah": "a lived-in family home"
    };

    const RASIO = { "9:16 vertikal": "vertical 9:16", "16:9 lebar": "widescreen 16:9", "1:1 kotak": "square 1:1" };

    const PHASES = [
        { id: "Pembukaan", t: "Establishing shot introducing {c} in an everyday moment, calm atmosphere" },
        { id: "Pemicu", t: "Something unexpected draws {c}'s attention, tied to the story: {i}" },
        { id: "Konflik naik", t: "{c} follows the new development, curiosity and tension growing" },
        { id: "Rintangan", t: "A serious obstacle confronts {c}, strong emotion visible on the face" },
        { id: "Puncak", t: "The turning point: {c} makes a decisive choice, peak emotion and movement" },
        { id: "Penutup", t: "Resolution: {c} reflects quietly as everything settles, a hopeful ending" }
    ];

    const SECTIONS = ["Intro", "Verse 1", "Pre-Chorus", "Chorus", "Verse 2", "Pre-Chorus", "Chorus", "Bridge", "Final Chorus", "Outro"];

    const SECTION_VIS = {
        "Intro": "atmospheric establishing shot of the location, {c} appears slowly, mood set",
        "Verse 1": "{c} in an intimate storytelling moment, singing softly to themselves, b-roll of small details",
        "Pre-Chorus": "{c} building energy, closer framing, emotion rising",
        "Chorus": "{c} performing powerfully to the camera, wide and dynamic, lights and movement at their peak",
        "Verse 2": "{c} moving through the location, memories shown through small details",
        "Bridge": "{c} in a quiet emotional close-up, almost still, softer light",
        "Final Chorus": "{c} giving the biggest performance, grand scale, strongest visuals",
        "Outro": "slow pull-back wide shot, {c} small in the scene, fading calm"
    };

    const SHOTS = ["wide establishing shot", "medium shot", "close-up", "over-the-shoulder shot", "low angle shot", "tracking shot", "extreme close-up", "high angle wide shot"];
    const MOVES = ["slow push in", "gentle pan right", "steady tracking alongside the subject", "slow pull back", "handheld subtle shake", "smooth orbit", "static locked-off", "slow tilt up"];

    // ---------- isi form ----------

    JAJA.fill($("visual"), Object.keys(VISUAL));
    JAJA.fill($("jml"), ["4", "5", "6", "8", "10", "12"]);
    JAJA.fill($("dur"), ["5 detik", "8 detik", "10 detik"]);
    JAJA.fill($("rasio"), Object.keys(RASIO));
    JAJA.fill($("lokasi"), Object.keys(LOKASI));
    JAJA.fill($("tempo"), Object.keys(TEMPO));

    $("jml").value = "6";
    $("dur").value = "5 detik";

    const modeEl = $("mode");

    MODES.forEach(m => {
        const c = document.createElement("span");
        c.className = "chip" + (m === mode ? " on" : "");
        c.textContent = m === MODES[0] ? "🎬 " + m : "🎵 " + m;
        c.addEventListener("click", () => setMode(m));
        modeEl.appendChild(c);
    });

    function setMode(m) {
        mode = m;
        [...modeEl.children].forEach((c, i) => c.classList.toggle("on", MODES[i] === m));
        const music = m === MODES[1];
        $("musicOnly").hidden = !music;
        $("lblIde").textContent = music ? "Tema / cerita di balik lagu" : "Ide cerita";
        $("lblGenre").textContent = music ? "Mood musik" : "Genre";
        JAJA.fill($("genre"), music ? Object.keys(MUSIC_MOODS) : Object.keys(GENRES));
        $("ide").placeholder = music ? "Contoh: rindu pada kampung halaman saat hujan" : "Contoh: Seorang anak kampung menemukan batu yang bisa menangis";
        $("board").innerHTML = '<p class="hint">Isi ide lalu klik "Buat Karakter + Storyboard".</p>';
        $("sheet").value = "";
        $("master").value = "";
        current = null;
    }

    setMode(MODES[0]);

    $("lastChar").addEventListener("click", () => {
        const c = JAJA.peek("jaja_last_character");
        if (c) $("karakter").value = c;
        else JAJA.toast("Belum ada. Pakai tombol Kirim ke Motion di Character Generator.");
    });

    $("face").addEventListener("change", () => {
        $("karakter").value = ($("karakter").value ? $("karakter").value + ", " : "") +
            "the same person as the uploaded reference photo (keep the face identical)";
    });

    // ---------- bangun ----------

    function fillTpl(t, v) {
        return t.replace(/\{(\w)\}/g, (m, k) => v[k] || m);
    }

    async function aiBeats(n, ide, char) {

        const out = await JAJA.ollama(
            "You are a storyboard writer. Output exactly " + n + " lines, numbered 1 to " + n + ", each one short English sentence describing one visual scene in order, with a clear beginning, build-up, climax and ending. No extra text.",
            "Story idea: " + ide + "\nMain character: " + char
        );

        const lines = out.split("\n")
            .map(l => l.replace(/^\s*\d+[\).\-:]\s*/, "").trim())
            .filter(Boolean);

        if (lines.length < n) throw new Error("hasil AI kurang lengkap");

        return lines.slice(0, n);
    }

    async function build() {

        const ide = $("ide").value.trim();

        if (!ide) {
            $("ide").focus();
            return JAJA.toast("Isi ide dulu");
        }

        const music = mode === MODES[1];
        const n = parseInt($("jml").value, 10);
        const dur = parseInt($("dur").value, 10);
        const char = $("karakter").value.trim() || (music ? "the singer" : "the main character");
        const style = VISUAL[$("visual").value];
        const rasio = RASIO[$("rasio").value];
        const lokasi = LOKASI[$("lokasi").value];
        const flavor = music ? MUSIC_MOODS[$("genre").value] : GENRES[$("genre").value];
        const tempo = music ? TEMPO[$("tempo").value] : "smooth steady camera movement";

        const master = [style, flavor, lokasi, "consistent character design across all frames", rasio, "cinematic color grading", "no text, no watermark"]
            .filter(Boolean).join(", ");

        $("master").value = master;

        $("sheet").value =
            "Character reference sheet of " + char + ", full body front view, side view and back view, plus three close-up face expressions (neutral, smile, serious), " +
            "plain neutral grey background, even lighting, consistent proportions and outfit, " + style + ", no text, no watermark";

        // aksi per scene
        let actions;

        if (music) {
            const base = SECTIONS.slice(0, Math.max(n - 1, 1));
            const names = base.concat(["Outro"]).slice(0, n);
            actions = names.map(s => ({ label: s, text: fillTpl(SECTION_VIS[s], { c: char }) + " (theme: " + ide + ")" }));
        } else {
            actions = Array.from({ length: n }, (_, i) => {
                const p = PHASES[Math.min(PHASES.length - 1, Math.floor(i * PHASES.length / n))];
                return { label: p.id, text: fillTpl(p.t, { c: char, i: ide }) };
            });
        }

        if ($("useAI").checked && !music) {
            $("aiStatus").textContent = "AI sedang menyusun alur...";
            $("build").disabled = true;
            try {
                const beats = await aiBeats(n, ide, char);
                actions.forEach((a, i) => { a.text = beats[i]; });
                $("aiStatus").textContent = "Alur dikembangkan oleh Ollama.";
            } catch (e) {
                $("aiStatus").textContent = "Ollama tidak bisa dihubungi (" + e.message + "), memakai alur bawaan.";
            }
            $("build").disabled = false;
        }

        const scenes = actions.map((a, i) => {

            const shot = SHOTS[i % SHOTS.length];
            const move = MOVES[(i * 3) % MOVES.length];

            return {
                label: a.label,
                action: a.text,
                img: shot + ", " + a.text + ". " + master,
                vid: a.text + ", " + move + ", " + tempo + ", about " + dur + " seconds, " + rasio + ", keep the character and setting consistent with the first frame"
            };
        });

        current = { music, scenes };

        $("steps").querySelectorAll("span").forEach((s, i) => s.classList.toggle("on", i === 2));

        render();
    }

    function render() {

        const board = $("board");
        board.innerHTML = "";

        current.scenes.forEach((s, i) => {

            const d = document.createElement("div");
            d.className = "scene";

            const h = document.createElement("h3");
            h.textContent = "Scene " + (i + 1) + " · " + s.label;

            const mk = (label, text) => {
                const t = document.createElement("div");
                t.className = "t";
                t.textContent = label;
                const p = document.createElement("p");
                p.textContent = text;
                return [t, p];
            };

            const acts = document.createElement("div");
            acts.className = "acts";

            const b1 = document.createElement("button");
            b1.className = "sm";
            b1.textContent = "📋 Prompt gambar";
            b1.addEventListener("click", () => JAJA.copy(s.img));

            const b2 = document.createElement("button");
            b2.className = "sm ghost";
            b2.textContent = "📋 Prompt video";
            b2.addEventListener("click", () => JAJA.copy(s.vid));

            const b3 = document.createElement("button");
            b3.className = "sm ghost";
            b3.textContent = "🖼 Buat gambar";
            b3.addEventListener("click", () => {
                JAJA.store("jaja_img_prompt", s.img);
                location.href = "image-generator.html";
            });

            acts.append(b1, b2, b3);

            d.append(h, ...mk("Prompt gambar", s.img), ...mk("Prompt video", s.vid), acts);
            board.appendChild(d);
        });
    }

    function everything() {
        if (!current) return "";
        return (current.music ? "MUSIC CLIP" : "DRAMA / FILM") + "\n\nCHARACTER SHEET\n" + $("sheet").value +
            "\n\nMASTER STYLE\n" + $("master").value + "\n\nSTORYBOARD\n\n" +
            current.scenes.map((s, i) => "Scene " + (i + 1) + " - " + s.label + "\nPrompt gambar: " + s.img + "\nPrompt video: " + s.vid).join("\n\n");
    }

    $("build").addEventListener("click", build);
    $("copySheet").addEventListener("click", () => $("sheet").value && JAJA.copy($("sheet").value));
    $("copyAll").addEventListener("click", () => current && JAJA.copy(everything()));
    $("exp").addEventListener("click", () => current && JAJA.download("JAJA_PABRIK_KONTEN.txt", everything()));

    $("ide").addEventListener("input", () => $("steps").querySelectorAll("span").forEach((s, i) => s.classList.toggle("on", i === 0)));
    $("karakter").addEventListener("input", () => $("steps").querySelectorAll("span").forEach((s, i) => s.classList.toggle("on", i === 1)));

    $("useAI").addEventListener("change", () => {
        $("aiStatus").textContent = $("useAI").checked ? "Aktif: butuh Ollama di localhost:11434 (hanya mode Drama/Film)." : "";
    });

})();
