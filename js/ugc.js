// ==========================
// UGC KONTEN: hook, naskah, CTA, hashtag, storyboard
// ==========================

(function () {

    const $ = id => document.getElementById(id);
    const R = JAJA.pick;

    const PLATFORM = {
        "TikTok": { cta: "keranjang kuning", tags: ["#fyp", "#racuntiktok", "#tiktokshop"] },
        "Reels Instagram": { cta: "link di bio", tags: ["#reels", "#explore", "#rekomendasi"] },
        "Shopee Video": { cta: "keranjang di bawah video", tags: ["#shopeehaul", "#rekomendasishopee", "#belanjaonline"] },
        "YouTube Shorts": { cta: "link di deskripsi", tags: ["#shorts", "#review", "#rekomendasi"] }
    };

    const DURASI = { "15 detik": [15, 4], "30 detik": [30, 5], "45 detik": [45, 6], "60 detik": [60, 7] };

    const GAYA = {
        "Review jujur": ["hook", "masalah", "produk", "bukti", "kelebihan", "promo", "cta"],
        "Unboxing": ["hook", "paket", "buka", "detail", "coba", "promo", "cta"],
        "Daily / GRWM": ["hook", "rutinitas", "produk", "pakai", "hasil", "promo", "cta"],
        "Problem - Solution": ["hook", "masalah", "solusi", "bukti", "hasil", "promo", "cta"],
        "Testimoni": ["hook", "sebelum", "temu", "pakai", "hasil", "promo", "cta"],
        "Tutorial": ["hook", "siapkan", "langkah", "bukti", "hasil", "promo", "cta"],
        "Before - After": ["hook", "before", "produk", "proses", "after", "promo", "cta"]
    };

    const NADA = {
        "Santai": { open: ["Guys,", "Jadi gini,", "Eh dengerin dulu,"], close: ["Yuk coba sendiri.", "Gak nyesel deh."] },
        "Energik": { open: ["Wih!", "Gila sih,", "Stop scroll!"], close: ["Buruan sebelum habis!", "Gas checkout sekarang!"] },
        "Tenang & meyakinkan": { open: ["Sebelum memutuskan,", "Ini pengalamanku,"], close: ["Silakan dipertimbangkan.", "Semoga membantu."] },
        "Lucu": { open: ["Plot twist:", "Jujur ya,", "Serius nih,"], close: ["Dompet aman, hati senang.", "Jangan bilang-bilang ya."] }
    };

    const HOOKS = [
        "Jangan beli {produk} sebelum nonton ini.",
        "Ini alasan {target} wajib punya {produk}.",
        "Capek dengan masalah ini? {produk} jawabannya.",
        "Aku coba {produk}, hasilnya di luar dugaan.",
        "{m1}? Ternyata semudah ini.",
        "Stop scroll! {produk} lagi promo.",
        "Rahasia {m1} yang jarang diketahui.",
        "Kalau kamu {target}, video ini buat kamu.",
        "Aku nyesel baru tahu {produk} sekarang.",
        "{produk}: worth it atau cuma hype?"
    ];

    const CTAS = [
        "Klik {loc} sekarang sebelum kehabisan.",
        "Cek {loc}, stok bisa habis kapan saja.",
        "Checkout lewat {loc}, promo ada waktunya.",
        "Simpan video ini dan tag temanmu yang butuh.",
        "Follow untuk review jujur lainnya, produknya ada di {loc}."
    ];

    const BEAT = {
        hook: ["{hook}"],
        masalah: ["Aku sering banget kesulitan soal ini, dan pasti kamu juga pernah merasakannya.", "Masalah yang paling bikin kesal itu ya ini, bukan cuma aku yang ngerasain."],
        sebelum: ["Dulu aku selalu bermasalah dengan hal ini.", "Sebelum kenal {produk}, rutinitasku bisa dibilang berantakan."],
        before: ["Ini kondisi aku sebelum pakai {produk}.", "Lihat dulu kondisi awalnya, sebelum aku coba apa-apa."],
        temu: ["Lalu temanku merekomendasikan {produk}, ya sudah aku coba.", "Akhirnya aku nemu {produk} dan memutuskan coba."],
        paket: ["Paketnya baru sampai, langsung aku buka di sini.", "Ini dia paket {produk} yang kutunggu-tunggu."],
        buka: ["Kemasannya rapi dan aman, ini isinya.", "Pelan-pelan kubuka, dan isinya sesuai pesanan."],
        detail: ["Kalau dilihat dari dekat, kualitasnya terasa. {m1}.", "Detailnya kelihatan rapi, apalagi soal {m1}."],
        coba: ["Langsung kucoba dan {m1} terasa jelas.", "Pertama pakai, kesan pertamaku: {m1}."],
        rutinitas: ["Ini rutinitas pagiku, simpel dan gak ribet.", "Hari ini aku mau bagi satu langkah favoritku."],
        siapkan: ["Siapkan dulu {produk} dan alat sederhana yang ada di rumah.", "Bahan yang dibutuhkan cuma {produk}, gak perlu banyak."],
        langkah: ["Langkahnya mudah: ikuti urutannya, jangan buru-buru.", "Caranya gampang, cukup tiga gerakan sederhana."],
        produk: ["Namanya {produk}. Keunggulannya: {manfaat}.", "Kenalan dulu sama {produk}, yang menonjol itu {manfaat}."],
        solusi: ["Solusinya ya {produk}. {m1} jadi alasan utamaku.", "Sejak pakai {produk}, aku merasa {m1}."],
        pakai: ["Cara pakainya gampang, tinggal ikuti petunjuk di kemasan.", "Aku pakai seperti biasa, gak perlu repot."],
        proses: ["Prosesnya singkat, dan yang kurasakan {m1}.", "Aku pakai pelan-pelan dan hasilnya mulai terlihat."],
        bukti: ["Nih buktinya langsung di depan kamera, bukan klaim kosong.", "Aku tunjukkan langsung biar kamu bisa menilai sendiri."],
        kelebihan: ["Kelebihannya: {manfaat}.", "Yang bikin aku suka: {manfaat}."],
        hasil: ["Hasilnya sesuai harapanku, dan {m1} jadi nilai plusnya.", "Menurutku hasilnya memuaskan untuk harganya."],
        after: ["Dan ini kondisi sesudahnya, kelihatan bedanya.", "Bandingkan dengan tadi, perbedaannya terasa."],
        promo: ["Soal harga: {promo}.", "Untuk {target}, harganya terjangkau: {promo}."],
        cta: ["{cta}"]
    };

    const VIS = {
        hook: { img: "{aktor} looking at the camera with an engaged expression, holding {produk}", vid: "{aktor} speaks to the camera energetically, then lifts {produk} into frame" },
        masalah: { img: "{aktor} looking frustrated at a small everyday problem", vid: "{aktor} sighs and shakes head, slight handheld movement" },
        sebelum: { img: "{aktor} with a tired, unsatisfied expression", vid: "{aktor} looks down, then up toward the camera" },
        before: { img: "close-up showing the 'before' condition, plain and honest", vid: "slow push in on the 'before' condition" },
        temu: { img: "{aktor} receiving a recommendation on a phone screen, curious look", vid: "{aktor} scrolls the phone and raises eyebrows with interest" },
        paket: { img: "a delivery package on a table, {aktor} reaching for it", vid: "{aktor} pulls the package toward the camera" },
        buka: { img: "{aktor} opening the box revealing {produk}", vid: "hands tear open the box and lift {produk} out" },
        detail: { img: "macro close-up of {produk} details, clean surface", vid: "slow macro pan across {produk}" },
        coba: { img: "{aktor} trying {produk} for the first time, pleasantly surprised", vid: "{aktor} uses {produk} and smiles with surprise" },
        rutinitas: { img: "{aktor} in a daily routine moment, relaxed", vid: "{aktor} moves naturally through a routine, handheld" },
        siapkan: { img: "flat lay of {produk} and simple tools on a table", vid: "hands arrange {produk} neatly on the table" },
        langkah: { img: "hands demonstrating a step using {produk}", vid: "hands perform the step slowly and clearly, top-down view" },
        produk: { img: "hero shot of {produk} held toward the camera by {aktor}", vid: "{aktor} rotates {produk} slowly to show all sides" },
        solusi: { img: "{aktor} presenting {produk} confidently", vid: "{aktor} nods and gestures toward {produk}" },
        pakai: { img: "{aktor} using {produk}, natural movement", vid: "{aktor} uses {produk} step by step, medium close-up" },
        proses: { img: "{aktor} in the middle of using {produk}, focused", vid: "close-up of the process, steady handheld" },
        bukti: { img: "{aktor} showing a clear proof or demonstration with {produk}", vid: "{aktor} demonstrates, camera pushes in to the result" },
        kelebihan: { img: "{aktor} counting benefits on fingers next to {produk}", vid: "{aktor} counts benefits on fingers while smiling" },
        hasil: { img: "{aktor} smiling happily with {produk}, satisfied", vid: "{aktor} smiles, gives a thumbs up toward the camera" },
        after: { img: "close-up showing the improved 'after' result", vid: "slow push in on the 'after' result" },
        promo: { img: "{aktor} holding {produk} with a cheerful, urgent expression", vid: "{aktor} points down toward the cart area and smiles" },
        cta: { img: "{aktor} pointing toward the bottom of the screen, friendly smile, {produk} in hand", vid: "{aktor} points down, winks, and waves goodbye" }
    };

    const AKTOR = {
        "Cewek": "a young Indonesian woman",
        "Cowok": "a young Indonesian man",
        "Tanpa wajah (hanya tangan)": "only a person's hands, no face visible,"
    };

    JAJA.fill($("platform"), Object.keys(PLATFORM));
    JAJA.fill($("durasi"), Object.keys(DURASI));
    JAJA.fill($("gaya"), Object.keys(GAYA));
    JAJA.fill($("nada"), Object.keys(NADA));
    JAJA.fill($("aktor"), Object.keys(AKTOR));
    JAJA.fill($("lokasi"), ["Kamar", "Dapur", "Kafe", "Teras rumah", "Kamar mandi", "Meja kerja", "Outdoor"]);

    $("durasi").value = "30 detik";

    const LOKASI_EN = { "Kamar": "a tidy bedroom", "Dapur": "a home kitchen", "Kafe": "a cozy cafe", "Teras rumah": "a front porch", "Kamar mandi": "a clean bathroom", "Meja kerja": "a work desk", "Outdoor": "an outdoor setting in daylight" };

    function fillTpl(t, v) {
        return t.replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m);
    }

    function pickBeats(all, n) {
        // pertahankan hook (awal), promo dan cta (akhir); sisanya dari tengah
        const middle = all.slice(1, all.length - 2);
        const need = Math.max(0, n - 3);
        return [all[0]].concat(middle.slice(0, need), all.slice(-2));
    }

    let current = null;

    // ---------- riwayat ----------

    const FIELDS = ["produk", "manfaat", "target", "promo", "platform", "durasi", "gaya", "nada", "aktor", "lokasi"];
    let histId = null;

    const hist = JAJA.history({ key: "ugc", onOpen: restore });

    function histSave(overwrite) {

        const f = {};
        FIELDS.forEach(id => { f[id] = $(id).value; });

        histId = hist.save({
            label: (f.produk || "Tanpa nama") + " · " + f.gaya + " · " + f.durasi,
            data: { f, hooks: $("hooks").value, script: $("script").value, cta: $("cta").value, current }
        }, overwrite ? histId : null);
    }

    function restore(e) {

        const d = e.data;

        FIELDS.forEach(id => { $(id).value = d.f[id]; });

        $("hooks").value = d.hooks;
        $("script").value = d.script;
        $("cta").value = d.cta;

        current = d.current;
        histId = e.id;
        renderBoard();

        JAJA.toast("Riwayat dibuka");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function generate() {

        const produk = $("produk").value.trim();

        if (!produk) {
            $("produk").focus();
            return JAJA.toast("Isi nama produk dulu");
        }

        const manfaatList = $("manfaat").value.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
        const manfaat = manfaatList.length ? manfaatList.join(", ") : "kualitas yang bagus";
        const m1 = manfaatList[0] || "kualitasnya bagus";
        const target = $("target").value.trim() || "kamu";
        const promo = $("promo").value.trim() || "cek harga terbaru";

        const plat = PLATFORM[$("platform").value];
        const [total, nScenes] = DURASI[$("durasi").value];
        const tone = NADA[$("nada").value];
        const beats = pickBeats(GAYA[$("gaya").value], nScenes);

        const vars = { produk, manfaat, m1, target, promo, loc: plat.cta };

        // hook: 5 pilihan
        const hooks = JAJA.shuffle(HOOKS).slice(0, 5).map(h => fillTpl(h, vars));

        const ctas = JAJA.shuffle(CTAS).slice(0, 3).map(c => fillTpl(c, vars));

        const per = Math.round(total / beats.length);

        const scenes = beats.map((b, i) => {

            const from = i * per;
            const to = i === beats.length - 1 ? total : (i + 1) * per;

            let text;

            if (b === "hook") text = R(tone.open) + " " + hooks[0];
            else if (b === "cta") text = ctas[0] + " " + R(tone.close);
            else text = fillTpl(R(BEAT[b]), vars);

            const aktor = AKTOR[$("aktor").value];
            const lokasi = LOKASI_EN[$("lokasi").value];
            const v = { aktor, produk, loc: lokasi };

            return {
                beat: b,
                time: from + "-" + to + "s",
                text,
                img: fillTpl(VIS[b].img, v) + ", in " + lokasi + ", vertical 9:16 smartphone UGC photo, natural lighting, realistic skin and textures, authentic casual look, no text, no watermark",
                vid: fillTpl(VIS[b].vid, v) + ", in " + lokasi + ", handheld smartphone feel, natural movement, vertical 9:16, about " + (to - from) + " seconds"
            };
        });

        const tags = ["#" + produk.toLowerCase().replace(/[^a-z0-9]/g, ""), "#reviewjujur"]
            .concat(plat.tags, ["#" + $("gaya").value.toLowerCase().replace(/[^a-z]/g, "")])
            .filter((t, i, a) => t.length > 2 && a.indexOf(t) === i);

        current = { hooks, ctas, tags, scenes };

        $("hooks").value = hooks.map((h, i) => (i + 1) + ". " + h).join("\n");
        $("script").value = scenes.map(s => "[" + s.time + "] " + s.beat.toUpperCase() + "\n" + s.text).join("\n\n");
        $("cta").value = ctas.map((c, i) => "CTA " + (i + 1) + ": " + c).join("\n") + "\n\nHashtag: " + tags.join(" ");

        renderBoard();
        histSave(false);
    }

    function renderBoard() {

        const board = $("board");
        board.innerHTML = "";

        current.scenes.forEach((s, i) => {

            const d = document.createElement("div");
            d.className = "scene";

            const h = document.createElement("h3");
            h.textContent = "Scene " + (i + 1) + " · " + s.time + " · " + s.beat;

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

            d.append(h, ...mk("Narasi", s.text), ...mk("Prompt gambar", s.img), ...mk("Prompt video", s.vid), acts);
            board.appendChild(d);
        });
    }

    function everything() {
        if (!current) return "";
        return "HOOK\n" + $("hooks").value + "\n\nNASKAH\n" + $("script").value + "\n\n" + $("cta").value +
            "\n\nSTORYBOARD\n" + current.scenes.map((s, i) =>
                "Scene " + (i + 1) + " [" + s.time + "]\nNarasi: " + s.text + "\nPrompt gambar: " + s.img + "\nPrompt video: " + s.vid
            ).join("\n\n");
    }

    $("go").addEventListener("click", generate);
    $("again").addEventListener("click", generate);
    $("copyAll").addEventListener("click", () => current && JAJA.copy(everything()));
    $("exp").addEventListener("click", () => current && JAJA.download("JAJA_UGC.txt", everything()));

    $("useAI").addEventListener("change", () => {
        $("aiStatus").textContent = $("useAI").checked
            ? "Aktif: naskah dipoles oleh Ollama (qwen2.5:7b) di komputer ini setelah Generate."
            : "";
    });

    // poles naskah dengan AI lokal setelah generate
    $("go").addEventListener("click", polish);
    $("again").addEventListener("click", polish);

    async function polish() {

        if (!$("useAI").checked || !current) return;

        $("aiStatus").textContent = "AI sedang memoles naskah...";

        try {
            const out = await JAJA.ollama(
                "Kamu penulis naskah video jualan (UGC) berbahasa Indonesia. Tulis ulang naskah agar terdengar natural seperti ucapan sehari-hari. " +
                "Pertahankan penanda waktu dalam kurung siku dan urutan. Jangan menambah klaim medis, angka, atau harga baru. Keluarkan naskah saja.",
                $("script").value
            );
            $("script").value = out;
            histSave(true);
            $("aiStatus").textContent = "Selesai dipoles dengan Ollama.";
        } catch (e) {
            $("aiStatus").textContent = "Ollama tidak bisa dihubungi (" + e.message + "), memakai naskah bawaan.";
        }
    }

})();
