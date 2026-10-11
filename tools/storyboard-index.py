#!/usr/bin/env python3
"""
Membuat adegan.json dari paket storyboard JAJA DRAMA STUDIO (folder `gambar/` dan `prompt-asli/`).
Prompt asli (±4.500 karakter, untuk generator lain) diringkas menjadi prompt singkat yang cocok untuk Seedance.

Pemakaian:
  python storyboard-index.py [folder-storyboard]
Default folder: <folder induk repo>/storyboard-malin
Hasil: <folder-storyboard>/adegan.json  (dibaca halaman Seedance)
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.abspath(os.path.join(HERE, "..", ".."))
ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(PARENT, "storyboard-malin")

HEAD = re.compile(
    r"^(DURATION|START FRAME|VISIBLE PROCESS|ORDERED BEATS|TARGET END FRAME|CHARACTER & OUTFIT LOCK|"
    r"JAJA PRESENCE LOCK|CAMERA & WORLD GEOMETRY LOCK|CONTINUITY LOCK|DIALOGUE|EXIT BRIDGE TO NEXT SCENE|"
    r"ADDITIONAL VIDEO DIRECTION)\b.*$"
)


def sections(text):
    """Pisahkan teks menjadi {JUDUL: [baris...]} (judul = baris huruf kapital di awal bagian)."""
    out, cur = {}, None
    for line in text.replace("﻿", "").splitlines():
        m = HEAD.match(line.strip())
        if m and line.strip().isupper() or (m and line.strip().startswith(m.group(1)) and " — " in line):
            cur = m.group(1)
            out[cur] = []
        elif cur:
            out[cur].append(line.rstrip())
    return out


def first_text(lines):
    """Baris pertama yang bukan JSON dan bukan kosong."""
    for l in lines:
        s = l.strip()
        if s and not s.startswith("{"):
            return s
    return ""


def clean(s):
    s = re.sub(r"\s+", " ", s).strip()
    s = s.replace("..", ".")
    return s


def strip_time(s):
    return re.sub(r"^\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?\s*sec:\s*", "", s.strip())


def characters(block):
    """'Visible: A, B. Off-frame ...: A: deskripsi. B: deskripsi. Never add...' -> {A: deskripsi}"""
    text = clean(" ".join(block))
    m = re.search(r"Visible:\s*(.+?)\.\s", text)
    visible = [v.strip() for v in m.group(1).split(",")] if m else []
    out = {}
    for name in visible:
        m2 = re.search(re.escape(name) + r":\s*(.+?)(?=\s(?:[A-Z][\w' ]{2,40}):\s|\sNever add|$)", text)
        if m2:
            desc = re.sub(r"\s*\|\s*", " ", m2.group(1)).strip().rstrip(" .")
            out[name] = desc
    return out


def short(desc, limit=170):
    desc = clean(desc)
    if len(desc) <= limit:
        return desc
    cut = desc[:limit]
    # potong di tanda baca terakhir
    k = max(cut.rfind(","), cut.rfind("."))
    return (cut[:k] if k > 80 else cut).rstrip(",. ")


def camera_phrase(block):
    text = clean(" ".join(block))
    m = re.search(r"Camera setup:\s*([^.]+?)(?:\.|$)", text)
    if not m:
        return ""
    parts = [p.strip().lower() for p in m.group(1).split("/")]
    keep = [p for p in parts if not p.startswith("axis") and "axis" not in p and p]
    # buang bagian sumbu seperti "hut-to-ocean axis"
    keep = [p for p in keep if not p.endswith("axis") and not re.search(r"line connecting|north|south|east|west|shoreline|hut", p)]
    return ", ".join(keep[:5])


def build(sec):
    chars = characters(sec.get("CHARACTER & OUTFIT LOCK", []))
    start = first_text(sec.get("START FRAME", []))
    process = [strip_time(l) for l in sec.get("VISIBLE PROCESS", []) if l.strip()]
    beats = [strip_time(l) for l in sec.get("ORDERED BEATS", []) if l.strip() and not l.startswith("Every change")]
    end = first_text(sec.get("TARGET END FRAME", []))
    cam = camera_phrase(sec.get("CAMERA & WORLD GEOMETRY LOCK", []))

    parts = []
    for name, desc in chars.items():
        parts.append("%s: %s." % (name, short(desc)))
    if start:
        parts.append(clean(start).rstrip(".") + ".")
    META = re.compile(r"perform the trigger|do not skip|do not overshoot|never skip|exact start frame|next-scene trigger|visibly begin this movement|end mid-process|tamat", re.I)
    action = []
    for x in (process + beats):
        x = clean(x)
        x = re.sub(r"^FINAL BRIDGE ACTION:\s*", "", x)
        if not x or META.search(x):
            continue
        action.append(x.rstrip(".") + ".")
    # hindari kalimat yang sama muncul dua kali (proses dan beat sering mirip)
    seen, uniq = set(), []
    for a in action:
        k = a.lower()[:50]
        if k not in seen:
            seen.add(k)
            uniq.append(a)

    def lower_first(t):
        return t[0].lower() + t[1:] if re.match(r"(The|He|She|They|It|A|An|His|Her|Their|Camera) ", t) else t

    if uniq:
        parts.append("Action: " + uniq[0] + "".join(" Then " + lower_first(a) for a in uniq[1:]))
    if end:
        parts.append("Ends with: " + clean(end).rstrip(".") + ".")
    if cam:
        parts.append("Camera: " + cam + ".")
    parts.append("Realistic cinematic film look, natural lighting, consistent characters and set.")
    text = " ".join(parts)
    if len(text) > 1100:
        text = " ".join(x for x in parts if not x.startswith("Ends with:"))
    return text, list(chars.keys())


def main():
    pdir = os.path.join(ROOT, "prompt-asli")
    idir = os.path.join(ROOT, "gambar")
    if not os.path.isdir(pdir) or not os.path.isdir(idir):
        sys.exit("Folder tidak lengkap: butuh %s dan %s" % (idir, pdir))

    out = []
    for fn in sorted(os.listdir(pdir)):
        if not fn.lower().endswith(".txt"):
            continue
        sid = fn[:-4]
        img = sid + ".png"
        if not os.path.exists(os.path.join(idir, img)):
            continue
        with open(os.path.join(pdir, fn), encoding="utf-8-sig", errors="replace") as f:
            text = f.read()

        sec = sections(text)
        dur_m = re.search(r"DURATION:\s*(\d+)s", text) or re.search(r"^(\d+)\s*seconds?\.", " ".join(sec.get("DURATION", [])).strip())
        dur = int(dur_m.group(1)) if dur_m else 5

        dlg = clean(" ".join(l for l in re.findall(r"DIALOGUE_TRACK_ASSIGNMENT:\s*\n(.*?)\n\n", text, re.S)).replace("\n", " "))
        if dlg.upper() == "N/A":
            dlg = ""

        prompt, chars = build(sec)
        out.append({"id": sid, "image": "gambar/" + img, "durasi": dur, "tokoh": chars, "dialog": dlg, "prompt": prompt})

    with open(os.path.join(ROOT, "adegan.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)

    lens = [len(x["prompt"]) for x in out]
    print("adegan.json: %d adegan | panjang prompt min/rata/maks = %d/%d/%d karakter" % (len(out), min(lens), sum(lens) // len(lens), max(lens)))


if __name__ == "__main__":
    main()
