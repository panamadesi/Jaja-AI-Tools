// ==========================
// FEATURED CHARACTERS MODAL
// ==========================

const modal = document.getElementById("modal");

function bukaModal(img) {

    const key = img.getAttribute("src").split("/").pop().replace(/\.\w+$/, "");
    const item = SHOWCASE[key];

    if (!item) return;

    document.getElementById("modalImg").src = img.src;
    document.getElementById("modalName").textContent = item.nama;
    document.getElementById("modalPrompt").value = item.prompt;
    document.getElementById("modalCopy").textContent = "📋 Copy Prompt";

    modal.hidden = false;
}

function tutupModal() {
    modal.hidden = true;
}

document.querySelectorAll(".character-row img").forEach(img => {
    img.addEventListener("click", () => bukaModal(img));
});

document.getElementById("modalClose").addEventListener("click", tutupModal);

modal.addEventListener("click", e => {
    if (e.target === modal) tutupModal();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") tutupModal();
});

document.getElementById("modalCopy").addEventListener("click", () => {
    navigator.clipboard.writeText(document.getElementById("modalPrompt").value);
    document.getElementById("modalCopy").textContent = "✅ Tersalin";
});
