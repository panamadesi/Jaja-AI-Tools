// ==========================
// PROMPT SIAP PAKAI
// ==========================

(function () {

    const cats = ["Semua"].concat([...new Set(PROMPTS.map(p => p.cat))]);
    let active = "Semua";

    const catsEl = document.getElementById("cats");
    const listEl = document.getElementById("list");
    const q = document.getElementById("q");

    cats.forEach(c => {
        const b = document.createElement("span");
        b.className = "chip" + (c === active ? " on" : "");
        b.textContent = c;
        b.addEventListener("click", () => {
            active = c;
            [...catsEl.children].forEach(x => x.classList.toggle("on", x.textContent === c));
            render();
        });
        catsEl.appendChild(b);
    });

    function render() {

        const term = q.value.trim().toLowerCase();

        const rows = PROMPTS.filter(p =>
            (active === "Semua" || p.cat === active) &&
            (!term || (p.title + " " + p.text + " " + p.cat).toLowerCase().includes(term))
        );

        document.getElementById("count").textContent = rows.length + " prompt";

        listEl.innerHTML = "";

        rows.forEach(p => {

            const d = document.createElement("div");
            d.className = "item";

            const h = document.createElement("h3");
            h.textContent = p.title;

            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = p.cat;

            const t = document.createElement("p");
            t.textContent = p.text;

            const acts = document.createElement("div");
            acts.className = "acts";

            const copy = document.createElement("button");
            copy.className = "sm";
            copy.textContent = "📋 Copy";
            copy.addEventListener("click", () => JAJA.copy(p.text));

            const img = document.createElement("button");
            img.className = "sm ghost";
            img.textContent = "🖼 Buat gambar";
            img.addEventListener("click", () => {
                JAJA.store("jaja_img_prompt", p.text);
                location.href = "image-generator.html";
            });

            acts.append(copy, img);
            d.append(h, tag, t, acts);
            listEl.appendChild(d);
        });
    }

    q.addEventListener("input", render);
    render();

})();
