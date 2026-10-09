// ==========================
// JAJA BUNDLE: direktori web AI
// Sumber: deskripsi video GENERATOR AI 2026 TERBARU (Jaja Tip Tutorial)
// ==========================

(function () {

    const GROUPS = {
        l1: [
            "https://www.flowstudio.com/",
            "https://ltx.studio/",
            "https://www.katalist.ai/",
            "https://ltx.video/",
            "https://invideo.io/"
        ],
        l2: [
            "https://beatmv.ai/",
            "https://aibeatsync.com/",
            "https://rotorvideos.com/",
            "https://www.neuralframes.com/",
            "https://www.heygen.com/tool/ai-music-video-generator"
        ],
        l3: [
            "https://www.u-gen.ai/",
            "https://ugcgen.ai/",
            "https://www.ugcreate.studio/",
            "https://www.createugc.ai/",
            "https://prizmad.com/",
            "https://www.aistudios.com/features/product-to-video",
            "https://creatify.ai/",
            "https://www.arcads.ai/",
            "https://tagshop.ai/"
        ]
    };

    Object.keys(GROUPS).forEach(id => {

        const box = document.getElementById(id);

        GROUPS[id].forEach(u => {
            const a = document.createElement("a");
            a.href = u;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
            box.appendChild(a);
        });
    });

})();
