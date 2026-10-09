// Kamus Indonesia -> Inggris untuk Prompt Enhancer.
// Kunci huruf kecil. Frasa lebih panjang selalu diproses lebih dulu. Nilai "" berarti kata dibuang.

const KAMUS = {

    // ---------- orang ----------
    "cewek": "young woman", "perempuan": "woman", "wanita": "woman", "gadis": "girl", "cowok": "young man",
    "laki-laki": "man", "lelaki": "man", "pria": "man", "anak kecil": "small child", "anak laki-laki": "boy",
    "anak perempuan": "girl", "anak": "child", "bayi": "baby", "remaja": "teenager", "ibu": "mother", "bapak": "father",
    "ayah": "father", "nenek": "elderly grandmother", "kakek": "elderly grandfather", "pengantin": "bride and groom",
    "penari": "dancer", "petani": "farmer", "nelayan": "fisherman", "pedagang": "street vendor", "guru": "teacher",
    "dokter": "doctor", "perawat": "nurse", "polisi": "police officer", "tentara": "soldier", "koki": "chef",
    "pelajar": "student", "mahasiswa": "university student", "penyanyi": "singer", "pasangan": "couple",
    "keluarga": "family", "teman-teman": "friends", "teman": "friend", "sekelompok orang": "a group of people",
    "orang": "person", "kurir": "delivery courier", "pengemudi ojek": "motorbike taxi driver", "tukang": "craftsman",

    // ---------- sifat dan ekspresi ----------
    "cantik": "beautiful", "tampan": "handsome", "lucu": "cute", "imut": "adorable", "tua": "elderly", "muda": "young",
    "tinggi": "tall", "pendek": "short", "kurus": "slim", "gemuk": "chubby", "tersenyum": "smiling", "senyum": "smiling",
    "tertawa": "laughing", "menangis": "crying", "marah": "angry", "sedih": "sad", "bahagia": "happy", "senang": "joyful",
    "kaget": "surprised", "terkejut": "startled", "tenang": "calm", "lelah": "tired", "serius": "serious",
    "takut": "frightened", "gugup": "nervous", "rindu": "longing", "kesepian": "lonely", "percaya diri": "confident",

    // ---------- rambut dan wajah ----------
    "rambut panjang": "long hair", "rambut pendek": "short hair", "rambut keriting": "curly hair", "rambut lurus": "straight hair",
    "rambut hitam": "black hair", "rambut pirang": "blonde hair", "rambut": "hair", "berhijab": "wearing a hijab",
    "hijab": "hijab", "berkacamata": "wearing glasses", "kacamata": "glasses", "berjenggot": "with a beard",
    "berkumis": "with a mustache", "mata": "eyes", "wajah": "face", "tangan": "hand",

    // ---------- pakaian ----------
    "baju adat": "traditional costume", "kebaya": "traditional kebaya", "batik": "batik clothing", "kain": "cloth", "sarung": "sarong",
    "peci": "peci cap", "blangkon": "Javanese blangkon headwear", "kemeja": "shirt", "kaos": "t-shirt", "jaket": "jacket",
    "gaun": "dress", "rok": "skirt", "celana": "trousers", "seragam": "uniform", "topi caping": "conical hat", "topi": "hat",
    "jas": "suit", "sepatu": "shoes", "tas": "bag", "kimono": "kimono", "mukena": "white prayer garment", "daster": "house dress",

    // ---------- aksi ----------
    "naik motor": "riding a motorbike", "naik sepeda": "riding a bicycle", "mengendarai": "driving", "berjalan": "walking",
    "jalan kaki": "walking", "berlari": "running", "lari": "running", "duduk": "sitting", "berdiri": "standing",
    "melompat": "jumping", "menari": "dancing", "joget": "dancing", "menyanyi": "singing", "makan": "eating",
    "minum": "drinking", "memasak": "cooking", "masak": "cooking", "membaca": "reading", "menulis": "writing",
    "tidur": "sleeping", "bermain": "playing", "bekerja": "working", "berdoa": "praying", "memegang": "holding",
    "membawa": "carrying", "melihat": "looking at", "memandang": "gazing at", "menunjuk": "pointing at",
    "memeluk": "hugging", "berenang": "swimming", "memancing": "fishing", "menanam": "planting", "memanen": "harvesting",
    "berbelanja": "shopping", "bertarung": "fighting", "terbang": "flying", "menyeberang": "crossing", "mengetik": "typing",
    "foto": "photographing", "selfie": "taking a selfie", "jalan": "walking",

    // ---------- tempat ----------
    "air terjun": "waterfall", "jalan raya": "highway", "jalanan": "street", "gang sempit": "narrow alley", "gang": "alley",
    "pasar tradisional": "traditional market", "pasar": "market", "warung kopi": "small coffee stall", "warung": "small food stall",
    "kafe": "cafe", "restoran": "restaurant", "kamar tidur": "bedroom", "kamar mandi": "bathroom", "kamar": "bedroom",
    "dapur": "kitchen", "ruang tamu": "living room", "sekolah": "school", "kelas": "classroom", "rumah adat": "traditional house",
    "rumah sakit": "hospital", "rumah": "house", "candi": "ancient temple", "masjid": "mosque", "pura": "Balinese temple",
    "gereja": "church", "istana": "palace", "taman": "park", "kebun teh": "tea plantation", "kebun": "garden", "stasiun": "train station",
    "bandara": "airport", "pelabuhan": "harbor", "jembatan": "bridge", "atap": "rooftop", "pabrik": "factory", "kantor": "office",
    "sawah": "rice field", "pantai": "beach", "laut": "sea", "gunung": "mountain", "hutan": "forest", "sungai": "river",
    "danau": "lake", "desa": "village", "kampung": "village", "kota": "city", "lapangan": "open field", "gua": "cave",
    "pulau": "island", "bukit": "hill", "lembah": "valley", "ladang": "farm field", "toko": "shop", "minimarket": "convenience store",

    // ---------- waktu dan cuaca ----------
    "di pagi hari": "in the morning", "di siang hari": "at midday", "di sore hari": "in the late afternoon", "di malam hari": "at night",
    "pagi hari": "in the morning", "siang hari": "at midday", "sore hari": "in the late afternoon", "malam hari": "at night", "tengah malam": "at midnight",
    "pagi-pagi": "early in the morning", "saat hujan deras": "in heavy rain", "saat hujan": "in the rain", "saat matahari terbit": "at sunrise",
    "saat matahari terbenam": "at sunset", "saat senja": "at dusk", "saat malam": "at night", "saat pagi": "in the morning", "saat gerimis": "in light drizzle",
    "matahari terbit": "sunrise", "matahari terbenam": "sunset", "pagi": "morning", "siang": "midday", "sore": "late afternoon",
    "malam": "night", "subuh": "dawn", "senja": "sunset", "fajar": "dawn", "hujan deras": "heavy rain", "hujan": "rain",
    "gerimis": "drizzle", "berkabut": "misty", "kabut": "mist", "mendung": "overcast", "cerah": "clear and sunny", "badai": "storm",
    "berangin": "windy", "angin": "wind", "salju": "snow", "pelangi": "rainbow", "bintang": "stars", "bulan": "moon",
    "langit": "sky", "awan": "clouds", "hari": "day",

    // ---------- benda dan kendaraan ----------
    "mobil": "car", "motor": "motorbike", "sepeda": "bicycle", "becak": "cycle rickshaw", "angkot": "minibus", "ojek": "motorbike taxi",
    "kereta": "train", "kapal": "ship", "perahu": "wooden boat", "pesawat": "airplane", "bus": "bus", "truk": "truck",
    "payung": "umbrella", "lampion": "paper lantern", "lentera": "lantern", "buku": "book", "ponsel": "smartphone", "hp": "smartphone",
    "laptop": "laptop", "kamera": "camera", "gitar": "guitar", "gamelan": "gamelan instruments", "wayang": "shadow puppet",
    "keris": "keris dagger", "bunga": "flower", "pohon": "tree", "batu": "stone", "api": "fire", "air": "water", "kursi": "chair",
    "meja": "table", "jendela": "window", "pintu": "door", "lampu": "lamp", "uang": "money", "surat": "letter", "peta": "map",

    // ---------- makanan ----------
    "nasi goreng": "nasi goreng fried rice", "nasi": "rice", "sate": "satay skewers", "bakso": "meatball soup", "soto": "soto soup",
    "rendang": "rendang beef", "tumpeng": "tumpeng rice cone", "gado-gado": "gado-gado salad", "mie ayam": "chicken noodles",
    "kopi": "coffee", "teh": "tea", "kue": "cake", "roti": "bread", "buah": "fruit", "es": "iced drink", "ayam": "chicken",

    // ---------- hewan ----------
    "kucing": "cat", "anjing": "dog", "burung": "bird", "kuda": "horse", "kerbau": "water buffalo", "sapi": "cow", "ikan": "fish",
    "harimau": "tiger", "ular": "snake", "kupu-kupu": "butterfly", "gajah": "elephant", "monyet": "monkey", "bebek": "duck",
    "ayam jago": "rooster",

    // ---------- fantasi ----------
    "naga": "dragon", "ksatria": "knight", "penyihir": "witch", "putri": "princess", "pangeran": "prince", "raja": "king",
    "ratu": "queen", "pahlawan": "hero", "hantu": "ghost", "raksasa": "giant", "peri": "fairy", "sihir": "magic",
    "pedang": "sword", "kerajaan": "kingdom", "robot": "robot", "alien": "alien", "dewa": "god", "dewi": "goddess",
    "pocong": "pocong ghost in a white shroud", "kuntilanak": "kuntilanak ghost in white", "tuyul": "small mischievous spirit",

    // ---------- warna ----------
    "merah muda": "pink", "abu-abu": "grey", "merah": "red", "biru": "blue", "hijau": "green", "kuning": "yellow",
    "hitam": "black", "putih": "white", "coklat": "brown", "cokelat": "brown", "ungu": "purple", "emas": "gold",
    "perak": "silver", "oranye": "orange", "jingga": "orange",

    // ---------- kualitas dan gaya ----------
    "realistis": "realistic", "sinematik": "cinematic", "gelap": "dark", "terang": "bright", "indah": "beautiful",
    "megah": "majestic", "misterius": "mysterious", "seram": "eerie", "menyeramkan": "creepy", "klasik": "classic",
    "modern": "modern", "tradisional": "traditional", "kuno": "ancient", "mewah": "luxurious", "sederhana": "simple",
    "ramai": "crowded and lively", "sepi": "quiet and empty", "hangat": "warm", "dingin": "cold", "basah": "wet",
    "kering": "dry", "bersih": "clean", "kotor": "dirty", "kecil": "small", "besar": "large", "banyak": "many",

    // ---------- tambahan: kata kerja, hasil bumi, nama tempat ----------
    "menggendong": "cradling", "menggandeng": "holding hands with", "melambaikan": "waving", "menunggu": "waiting for",
    "berteduh": "sheltering", "mengangkat": "lifting", "mendorong": "pushing", "menarik": "pulling", "memotret": "photographing",
    "menjual": "selling", "membeli": "buying", "bernyanyi": "singing", "bersepeda": "cycling", "berfoto": "posing for photos",
    "berbaring": "lying down", "bersantai": "relaxing", "berteriak": "shouting", "berbisik": "whispering", "berpose": "posing",
    "melukis": "painting", "membuat": "making", "mencuci": "washing", "menjahit": "sewing", "menenun": "weaving",
    "padi": "rice plants", "jagung": "corn", "kelapa": "coconut", "pisang": "banana", "sayur": "vegetables", "gabah": "rice grains",
    "sate ayam": "chicken satay skewers", "nasi uduk": "nasi uduk coconut rice", "nasi padang": "nasi padang platter",
    "candi borobudur": "Borobudur temple", "borobudur": "Borobudur", "prambanan": "Prambanan temple", "gunung bromo": "Mount Bromo",
    "bromo": "Mount Bromo", "danau toba": "Lake Toba", "raja ampat": "Raja Ampat islands", "monas": "the Monas tower", "jakarta": "Jakarta",
    "yogyakarta": "Yogyakarta", "bali": "Bali", "bandung": "Bandung", "surabaya": "Surabaya", "indonesia": "Indonesia",
    "di atas atap": "on the rooftop", "di atas": "above",

    // ---------- tambahan: produk, perabot, bahan, tempat duduk ----------
    "botol": "bottle", "serum": "skincare serum", "krim": "cream jar", "sabun": "soap", "parfum": "perfume bottle", "kosmetik": "cosmetics",
    "jam tangan": "wristwatch", "tas ransel": "backpack", "gelas": "glass", "piring": "plate", "mangkuk": "bowl", "cangkir": "cup",
    "produk": "product", "kemasan": "packaging", "kotak": "box", "teras": "porch", "balkon": "balcony", "halaman": "yard", "lantai": "floor",
    "dinding": "wall", "tembok": "wall", "tikar": "woven mat", "bantal": "pillow", "selimut": "blanket", "kasur": "mattress",
    "di meja": "on the table", "di kursi": "on a chair", "di lantai": "on the floor", "di dinding": "on the wall", "di tangan": "in the hand",
    "di tepi": "at the edge of", "di sebelah": "next to", "di sekitar": "around", "di antara": "between", "di sana": "there", "di sini": "here",
    "kayu": "wooden", "besi": "metal", "kaca": "glass", "bambu": "bamboo", "kulit": "leather", "kertas": "paper",

    // ---------- posisi dan penghubung ----------
    "di depan": "in front of", "di belakang": "behind", "di bawah": "under", "di samping": "beside",
    "di tengah": "in the middle of", "di dalam": "inside", "di luar": "outside", "dekat": "near", "jauh": "far from",
    "sambil": "while", "saat": "when", "ketika": "when", "sebuah": "a", "seorang": "a", "seekor": "a",
    "di": "in", "ke": "to", "dari": "from", "dan": "and", "dengan": "with", "untuk": "for", "pada": "at", "atau": "or",
    "yang": "", "sedang": "", "lagi": "", "sangat": "very", "sekali": "", "tapi": "but", "tetapi": "but"
};

// Jenis konten: dipakai untuk memilih tambahan detail yang sesuai.
// Setiap pola dicocokkan pada hasil terjemahan (huruf kecil).
const JENIS = {
    orang: /\b(woman|man|girl|boy|child|baby|teenager|mother|father|grandmother|grandfather|bride|dancer|farmer|fisherman|vendor|teacher|doctor|nurse|police|soldier|chef|student|singer|couple|family|friend|person|people|portrait|selfie|face|king|queen|princess|prince|knight|witch)\b/,
    makanan: /\b(rice(?!\s+(?:field|plants|grains))|satay|soup|beef|salad|noodles|coffee|tea|cake|bread|fruit|chicken|food|meal|dish|eating|drinking|cooking|rendang|tumpeng)\b/,
    pemandangan: /\b(rice field|mountain|beach|sea|forest|river|waterfall|lake|valley|hill|island|sunrise|sunset|landscape|tea plantation|cave|sky)\b/,
    bangunan: /\b(temple|mosque|church|palace|house|building|bridge|station|airport|harbor|factory|office|school|hospital|shop|market|alley|street|city)\b/,
    hewan: /\b(cat|dog|bird|horse|buffalo|cow|fish|tiger|snake|butterfly|elephant|monkey|duck|rooster)\b/,
    produk: /\b(product|bottle|packaging|box|smartphone|laptop|camera|bag|shoes|watch)\b/,
    fantasi: /\b(dragon|ghost|fairy|giant|magic|sword|kingdom|robot|alien|god|goddess|spirit|pocong|kuntilanak)\b/
};

const JENIS_LABEL = {
    orang: "orang", makanan: "makanan", pemandangan: "pemandangan", bangunan: "tempat/bangunan",
    hewan: "hewan", produk: "produk", fantasi: "fantasi"
};

// Tambahan detail per jenis: [ringkas, sedang, detail]
const JENIS_GAMBAR = {
    orang: ["natural skin texture", "natural skin texture, expressive eyes, soft flattering light, shallow depth of field", "natural skin texture with visible pores, expressive detailed eyes, soft flattering light, shallow depth of field, 85mm lens, sharp focus on the face, authentic candid feel"],
    makanan: ["appetizing", "appetizing food photography, steam rising, shallow depth of field, warm light", "appetizing food photography, fresh ingredients, steam rising, glossy textures, shallow depth of field, warm directional light, 100mm macro lens"],
    pemandangan: ["wide landscape", "wide landscape photography, natural light, rich colors, atmospheric depth", "wide landscape photography, golden light, rich colors, atmospheric depth with layered mist, foreground interest, leading lines, ultra sharp, 24mm lens"],
    bangunan: ["architectural detail", "architectural photography, strong composition, natural light, rich textures", "architectural photography, strong composition, realistic materials and weathering, natural light with soft shadows, rich textures, 24mm lens"],
    hewan: ["detailed fur", "wildlife photography, detailed fur or feathers, natural light, sharp eyes", "wildlife photography, extremely detailed fur or feathers, catchlight in the eyes, natural light, shallow depth of field, 200mm telephoto lens"],
    produk: ["clean product shot", "clean commercial product photography, soft studio light, sharp focus", "clean commercial product photography, soft studio light with subtle reflections, sharp focus, premium styling, shallow depth of field, realistic materials"],
    fantasi: ["epic atmosphere", "epic fantasy concept art, dramatic lighting, rich detail", "epic fantasy concept art, dramatic lighting, volumetric atmosphere, intricate detail, cinematic composition, highly detailed matte painting"]
};

const JENIS_VIDEO = {
    orang: ["natural movement", "natural movement, subtle facial expressions, soft light", "natural movement, subtle facial expressions and blinking, soft light, shallow depth of field, consistent face throughout"],
    makanan: ["steam rising", "steam rising, slow camera push in, warm light", "steam rising, slow camera push in, glossy textures, warm light, appetizing close-up detail"],
    pemandangan: ["slow camera movement", "slow cinematic camera movement, drifting mist, natural light", "slow cinematic camera movement, drifting mist and clouds, birds crossing the frame, golden light, wide establishing feel"],
    bangunan: ["slow camera movement", "slow tracking camera movement, natural light, life in the background", "slow tracking camera movement, people moving naturally in the background, natural light, realistic atmosphere"],
    hewan: ["natural movement", "natural animal movement, tracking camera, natural light", "natural animal movement, tracking camera at eye level, detailed fur or feathers, natural light"],
    produk: ["slow rotation", "slow product rotation, soft studio light, smooth camera push in", "slow product rotation on a pedestal, soft studio light with moving reflections, smooth camera push in, premium commercial look"],
    fantasi: ["dramatic motion", "dramatic motion, drifting particles, cinematic camera movement", "dramatic motion, drifting particles and embers, epic cinematic camera movement, volumetric atmosphere"]
};

const JENIS_NEGATIF = {
    orang: "deformed hands, extra fingers, distorted face, plastic skin",
    makanan: "unappetizing, burnt, plastic look, extra utensils",
    pemandangan: "people, text, oversaturated, distorted horizon",
    bangunan: "distorted perspective, extra windows, text, people blocking the view",
    hewan: "extra limbs, distorted anatomy, cartoonish",
    produk: "wrong label, misspelled text, distorted logo, harsh glare",
    fantasi: "low detail, flat lighting, deformed anatomy"
};

// Kata sifat Indonesia yang diletakkan setelah benda. Dipakai untuk menukar urutan: "kucing hitam" -> "black cat".
const KAMUS_SIFAT = new Set([
    "merah muda", "abu-abu", "merah", "biru", "hijau", "kuning", "hitam", "putih", "coklat", "cokelat", "ungu", "emas", "perak", "oranye", "jingga",
    "cantik", "tampan", "lucu", "imut", "tua", "muda", "tinggi", "pendek", "kurus", "gemuk", "kuno", "tradisional", "modern", "mewah",
    "sederhana", "ramai", "sepi", "hangat", "dingin", "basah", "kering", "bersih", "kotor", "kecil", "besar", "megah", "seram",
    "menyeramkan", "misterius", "indah", "kayu", "besi", "kaca", "gelap", "terang", "klasik", "cerah", "berkabut", "berangin"
]);

// Kata fungsi: tidak boleh dianggap benda saat menukar urutan.
const KAMUS_FUNGSI = new Set([
    "di", "ke", "dari", "dan", "dengan", "untuk", "pada", "atau", "yang", "sedang", "lagi", "sangat", "sekali", "tapi", "tetapi",
    "sambil", "saat", "ketika", "sebuah", "seorang", "seekor", "banyak", "dekat", "jauh"
]);

// Kata orang dan pakaian: orang diikuti pakaian otomatis diberi "wearing" ("cewek kebaya" -> "young woman wearing traditional kebaya").
const KAMUS_ORANG = new Set([
    "cewek", "perempuan", "wanita", "gadis", "cowok", "laki-laki", "lelaki", "pria", "anak kecil", "anak laki-laki", "anak perempuan",
    "anak", "bayi", "remaja", "ibu", "bapak", "ayah", "nenek", "kakek", "pengantin", "penari", "petani", "nelayan", "pedagang", "guru",
    "dokter", "perawat", "polisi", "tentara", "koki", "pelajar", "mahasiswa", "penyanyi", "kurir", "tukang", "putri", "pangeran", "raja", "ratu"
]);

const KAMUS_PAKAIAN = new Set([
    "baju adat", "kebaya", "batik", "kemeja", "kaos", "jaket", "gaun", "rok", "celana", "seragam", "jas", "kimono", "mukena", "daster",
    "sarung", "peci", "blangkon", "topi caping", "topi", "sepatu"
]);
