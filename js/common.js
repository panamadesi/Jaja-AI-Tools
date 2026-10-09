// ==========================
// COMMON HELPERS (namespace JAJA, tidak memakai nama global lain)
// ==========================

window.JAJA = (function () {

    const MENU = [
        ["character-generator.html", "🧍 Character Generator"],
        ["character-clone.html", "🧬 Character Clone"],
        ["image-generator.html", "🖼 Image Generator"],
        ["motion-prompt.html", "🎬 Motion Control"],
        ["prompt-library.html", "📚 Prompt Siap Pakai"],
        ["pabrik-konten.html", "🏭 Pabrik Konten"],
        ["ugc.html", "🛍 UGC Konten"],
        ["prompt-enhancer.html", "✨ Prompt Enhancer"],
        ["bundle.html", "🎁 Jaja Bundle"],
        ["../index.html", "🏠 Home"]
    ];

    function nav() {
        const el = document.getElementById("nav");
        if (!el) return;
        const page = location.pathname.split("/").pop();
        el.innerHTML = MENU.map(([href, label]) =>
            `<a href="${href}"${href === page ? ' class="active"' : ""}>${label}</a>`
        ).join("");
    }

    function toast(msg) {
        let t = document.getElementById("toast");
        if (!t) {
            t = document.createElement("div");
            t.id = "toast";
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(t._h);
        t._h = setTimeout(() => t.classList.remove("show"), 1800);
    }

    function copy(text) {
        const done = () => toast("Tersalin ke clipboard");
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, () => toast("Gagal menyalin"));
        } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
            done();
        }
    }

    function download(name, text) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function fill(select, items) {
        select.innerHTML = "";
        items.forEach(v => {
            const o = document.createElement("option");
            o.value = o.textContent = v;
            select.appendChild(o);
        });
    }

    function store(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { }
    }

    function take(key) {
        try {
            const v = localStorage.getItem(key);
            localStorage.removeItem(key);
            return v;
        } catch (e) { return null; }
    }

    function peek(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }

    // Ollama lokal (opsional). Melempar error jika tidak tersedia.
    async function ollama(system, prompt) {
        const res = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "qwen2.5:7b", system, prompt, stream: false }),
            signal: AbortSignal.timeout(90000)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        return (await res.json()).response.trim();
    }

    // ---------- riwayat hasil (disimpan di browser) ----------
    // opts: { key, max, onOpen(entry) }. entry = { id, t, label, data }

    function history(opts) {

        const KEY = "jaja_hist_" + opts.key;
        const max = opts.max || 15;

        const read = () => {
            try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
        };

        const write = list => {
            try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
        };

        const card = document.createElement("div");
        card.className = "card";

        const h = document.createElement("h2");
        h.textContent = "🕘 Riwayat";

        const hint = document.createElement("p");
        hint.className = "hint";
        hint.textContent = "Hasil tersimpan otomatis di browser ini saja (tidak dikirim ke mana pun). Maksimal " + max + " terakhir.";

        const box = document.createElement("div");
        box.className = "hist";

        const clear = document.createElement("button");
        clear.className = "ghost sm";
        clear.textContent = "🗑 Hapus semua";
        clear.addEventListener("click", () => {
            if (read().length && confirm("Hapus semua riwayat?")) {
                write([]);
                render();
            }
        });

        card.append(h, hint, box, clear);

        const mount = document.querySelector(".right-panel");
        (mount || document.body).appendChild(card);

        function render() {

            const list = read();
            box.innerHTML = "";

            if (!list.length) {
                const empty = document.createElement("p");
                empty.className = "hint";
                empty.textContent = "Belum ada riwayat.";
                box.appendChild(empty);
                return;
            }

            list.forEach(e => {

                const row = document.createElement("div");
                row.className = "hitem";

                const info = document.createElement("div");
                const b = document.createElement("b");
                b.textContent = e.label;
                const s = document.createElement("small");
                s.textContent = new Date(e.t).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
                info.append(b, s);

                const open = document.createElement("button");
                open.className = "sm";
                open.textContent = "Buka";
                open.addEventListener("click", () => opts.onOpen(e));

                const del = document.createElement("button");
                del.className = "sm ghost";
                del.textContent = "✕";
                del.setAttribute("aria-label", "Hapus");
                del.addEventListener("click", () => {
                    write(read().filter(x => x.id !== e.id));
                    render();
                });

                row.append(info, open, del);
                box.appendChild(row);
            });
        }

        // simpan entri baru, atau timpa entri dengan id yang sama
        function save(entry, id) {

            let list = read();

            if (id && list.some(x => x.id === id)) {
                entry.id = id;
                list = list.map(x => x.id === id ? Object.assign({}, entry, { t: x.t }) : x);
            } else {
                entry.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
                entry.t = Date.now();
                list.unshift(entry);
            }

            list = list.slice(0, max);

            if (!write(list)) {
                list = list.slice(0, Math.max(1, Math.floor(list.length / 2)));
                if (!write(list)) toast("Riwayat tidak bisa disimpan (penyimpanan penuh)");
            }

            render();
            return entry.id;
        }

        render();

        return { save, render };
    }

    // ---------- panduan cara pakai ----------

    function guide() {

        if (typeof GUIDES === "undefined") return;

        const g = GUIDES[location.pathname.split("/").pop()];
        const navEl = document.getElementById("nav");

        if (!g || !navEl) return;

        const d = document.createElement("details");
        d.className = "guide";

        let closed = false;
        try { closed = localStorage.getItem("jaja_guide_closed") === "1"; } catch (e) { }
        d.open = !closed;

        d.innerHTML =
            "<summary>📖 Cara Pakai: " + g.title + "</summary>" +
            '<p class="goal">' + g.goal + "</p>" +
            "<ol>" + g.steps.map(x => "<li>" + x + "</li>").join("") + "</ol>" +
            (g.next ? '<p class="next"><b>Langkah berikutnya:</b> ' + g.next + "</p>" : "") +
            (g.tips ? "<h4>Tips</h4><ul>" + g.tips.map(x => "<li>" + x + "</li>").join("") + "</ul>" : "");

        d.addEventListener("toggle", () => {
            try { localStorage.setItem("jaja_guide_closed", d.open ? "0" : "1"); } catch (e) { }
        });

        navEl.insertAdjacentElement("afterend", d);
    }

    document.addEventListener("DOMContentLoaded", () => { nav(); guide(); });

    return { nav, toast, copy, download, pick, shuffle, fill, store, take, peek, ollama, history };

})();
