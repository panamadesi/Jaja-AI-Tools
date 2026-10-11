#!/usr/bin/env python3
"""
Proxy lokal untuk Seedance (BytePlus ModelArk) yang dipakai halaman "Seedance" di JAJA AI TOOLS.

Kenapa perlu: API BytePlus butuh kunci rahasia dan tidak boleh dipanggil langsung dari browser. Proxy ini berjalan di
komputer Anda saja (127.0.0.1), menyimpan kunci di sisi komputer, dan hanya menerima permintaan dari
http://localhost:8000 / http://127.0.0.1:8000.

Kunci API (dibuat sendiri di konsol BytePlus), salah satu:
  1) variabel lingkungan  ARK_API_KEY
  2) file teks satu baris `seedance-key.txt` di folder induk repo (E:\\...\\JAJA AI TOOL\\seedance-key.txt)
Kunci TIDAK pernah dikirim ke browser, ditulis ke log, atau disimpan di repo.

Opsi (variabel lingkungan atau file `seedance-config.json` di folder yang sama dengan kunci):
  ARK_BASE_URL   default https://ark.ap-southeast.bytepluses.com/api/v3
  SEEDANCE_PORT  default 8787

Endpoint:
  GET  /health                       -> {"ok": true, "hasKey": bool, "baseUrl": "..."}
  POST /tasks                        -> meneruskan JSON ke  POST {base}/contents/generations/tasks
  GET  /tasks/<id>                   -> meneruskan ke       GET  {base}/contents/generations/tasks/<id>
  POST /save  {"url","name"}         -> mengunduh video hasil (https) ke folder seedance-output di folder induk repo
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import ipaddress
import socket

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, ".."))
PARENT = os.path.abspath(os.path.join(REPO, ".."))          # folder "JAJA AI TOOL"
KEY_FILE = os.path.join(PARENT, "seedance-key.txt")
CONF_FILE = os.path.join(PARENT, "seedance-config.json")
OUT_DIR = os.path.join(PARENT, "seedance-output")

ALLOWED_ORIGINS = {"http://localhost:8000", "http://127.0.0.1:8000"}
MAX_BODY = 40 * 1024 * 1024        # 40 MB (gambar base64)
DEFAULT_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3"


def load_conf():
    conf = {}
    if os.path.exists(CONF_FILE):
        try:
            conf = json.load(open(CONF_FILE, encoding="utf-8"))
        except Exception:
            conf = {}
    return conf


def get_key():
    k = os.environ.get("ARK_API_KEY", "").strip()
    if k:
        return k
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    return line
    return ""


def base_url():
    conf = load_conf()
    return (os.environ.get("ARK_BASE_URL") or conf.get("base_url") or DEFAULT_BASE).rstrip("/")


def public_https_only(url):
    """Hanya https ke host publik (cegah penyalahgunaan unduhan ke jaringan lokal)."""
    p = urllib.parse.urlparse(url)
    if p.scheme != "https" or not p.hostname:
        return False
    try:
        for info in socket.getaddrinfo(p.hostname, 443):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return False
    except Exception:
        return False
    return True


class Handler(BaseHTTPRequestHandler):
    server_version = "SeedanceProxy/1.0"

    # ---------- util ----------
    def log_message(self, fmt, *args):            # log singkat, tanpa isi permintaan
        sys.stderr.write("[proxy] %s %s\n" % (self.command, self.path.split("?")[0]))

    def origin_ok(self):
        origin = self.headers.get("Origin", "")
        return origin in ALLOWED_ORIGINS

    def send_json(self, code, obj):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.end_headers()
        self.wfile.write(data)

    def read_json(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0 or n > MAX_BODY:
            raise ValueError("ukuran isi permintaan tidak valid")
        return json.loads(self.rfile.read(n).decode("utf-8"))

    def upstream(self, method, path, body=None):
        key = get_key()
        if not key:
            return 401, {"error": "Kunci API belum diatur. Buat file seedance-key.txt (lihat README) lalu mulai ulang proxy."}
        url = base_url() + path
        data = json.dumps(body).encode("utf-8") if body is not None else None
        req = urllib.request.Request(url, data=data, method=method, headers={
            "Authorization": "Bearer " + key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        })
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                raw = r.read().decode("utf-8", "replace")
                try:
                    return r.status, json.loads(raw)
                except Exception:
                    return r.status, {"raw": raw[:2000]}
        except urllib.error.HTTPError as e:
            raw = e.read().decode("utf-8", "replace")
            try:
                obj = json.loads(raw)
            except Exception:
                obj = {"raw": raw[:2000]}
            return e.code, {"upstream_status": e.code, "upstream": obj}
        except Exception as e:
            return 502, {"error": "Tidak bisa menghubungi %s (%s)" % (urllib.parse.urlparse(url).netloc, e)}

    # ---------- CORS preflight ----------
    def do_OPTIONS(self):
        if not self.origin_ok():
            return self.send_json(403, {"error": "asal tidak diizinkan"})
        self.send_response(204)
        origin = self.headers.get("Origin")
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Vary", "Origin")
        self.end_headers()

    # ---------- GET ----------
    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/health":
            # health boleh dibaca tanpa Origin (cek manual di browser), tapi tidak membocorkan kunci
            return self.send_json(200, {"ok": True, "hasKey": bool(get_key()), "baseUrl": base_url(), "outDir": OUT_DIR})
        m = re.fullmatch(r"/tasks/([A-Za-z0-9_\-]{4,100})", path)
        if m:
            if not self.origin_ok():
                return self.send_json(403, {"error": "asal tidak diizinkan"})
            code, obj = self.upstream("GET", "/contents/generations/tasks/" + m.group(1))
            return self.send_json(code, obj)
        self.send_json(404, {"error": "tidak ditemukan"})

    # ---------- POST ----------
    def do_POST(self):
        path = self.path.split("?")[0]
        if not self.origin_ok():
            return self.send_json(403, {"error": "asal tidak diizinkan"})
        try:
            body = self.read_json()
        except Exception as e:
            return self.send_json(400, {"error": "JSON tidak valid: %s" % e})

        if path == "/tasks":
            code, obj = self.upstream("POST", "/contents/generations/tasks", body)
            return self.send_json(code, obj)

        if path == "/save":
            url = str(body.get("url", ""))
            name = re.sub(r"[^A-Za-z0-9_\-]", "_", str(body.get("name", "seedance")))[:60] or "seedance"
            if not public_https_only(url):
                return self.send_json(400, {"error": "hanya https ke alamat publik yang diizinkan"})
            os.makedirs(OUT_DIR, exist_ok=True)
            dest = os.path.join(OUT_DIR, name + ".mp4")
            i = 1
            while os.path.exists(dest):
                i += 1
                dest = os.path.join(OUT_DIR, "%s_%d.mp4" % (name, i))
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "JAJA-AI-TOOLS"}), timeout=300) as r, open(dest, "wb") as f:
                    while True:
                        chunk = r.read(1 << 20)
                        if not chunk:
                            break
                        f.write(chunk)
            except Exception as e:
                return self.send_json(502, {"error": "gagal mengunduh: %s" % e})
            return self.send_json(200, {"saved": dest, "mb": round(os.path.getsize(dest) / 1048576, 1)})

        self.send_json(404, {"error": "tidak ditemukan"})


def main():
    port = int(os.environ.get("SEEDANCE_PORT") or load_conf().get("port") or 8787)
    srv = ThreadingHTTPServer(("127.0.0.1", port), Handler)     # hanya 127.0.0.1, bukan seluruh jaringan
    print("Seedance proxy aktif di http://127.0.0.1:%d" % port)
    print("Kunci API  : %s" % ("TERBACA" if get_key() else "BELUM ADA (buat seedance-key.txt, lihat README)"))
    print("Base URL   : %s" % base_url())
    print("Hasil unduhan disimpan di: %s" % OUT_DIR)
    print("Tekan Ctrl+C untuk berhenti.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
