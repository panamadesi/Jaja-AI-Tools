// Pustaka prompt siap pakai. Ubah bagian dalam [kurung siku] sesuai kebutuhan.
const PROMPTS = [

    // ---------- Portrait ----------
    { cat: "Portrait", title: "Portrait natural jendela", text: "Close-up portrait of a [young Indonesian woman], soft natural window light, calm expression, natural skin texture with visible pores, 85mm lens, shallow depth of field, photorealistic, sharp focus on the eyes" },
    { cat: "Portrait", title: "Portrait golden hour", text: "Medium portrait of a [man in his 30s] outdoors at golden hour, warm rim light on the hair, gentle smile, soft bokeh background, cinematic color grading, photorealistic, 50mm lens" },
    { cat: "Portrait", title: "Selfie santai", text: "Casual smartphone selfie of a [young woman] in a cozy cafe, natural lighting, slightly imperfect framing, realistic skin, authentic social media photo" },
    { cat: "Portrait", title: "Studio editorial", text: "Editorial studio portrait of a [model], plain grey backdrop, softbox lighting, controlled shadows, high fashion look, sharp details, medium format camera" },
    { cat: "Portrait", title: "Potret orang tua", text: "Documentary portrait of an elderly [Javanese grandmother], deep expressive wrinkles, warm kind eyes, soft side light from a doorway, natural tones, photorealistic" },

    // ---------- Fashion ----------
    { cat: "Fashion", title: "Kebaya modern", text: "Full body photo of a woman in an elegant modern kebaya with lace details and batik skirt, standing in a minimalist studio, soft light, realistic fabric folds, highly detailed" },
    { cat: "Fashion", title: "Streetwear", text: "Full body shot of a [young man] in oversized streetwear, layered jacket and cargo pants, standing on an urban street at dusk, neon reflections, realistic photography" },
    { cat: "Fashion", title: "Hijab stylish", text: "Portrait of a young woman in a stylish pastel hijab and modest outfit, bright cafe interior, soft natural light, friendly smile, photorealistic, 85mm lens" },
    { cat: "Fashion", title: "Baju adat", text: "Full body photo of a person in traditional [Balinese] ceremonial attire with gold ornaments, in front of a carved temple gate, golden hour, rich textures, photorealistic" },
    { cat: "Fashion", title: "Seragam kerja", text: "A friendly staff member in a clean [minimarket] uniform behind the counter, bright interior, natural fluorescent light, realistic documentary photo" },

    // ---------- Produk ----------
    { cat: "Produk", title: "Produk di meja kayu", text: "Product photo of a [skincare bottle] on a wooden table, soft morning window light, small green plant in the background, clean composition, commercial photography, sharp focus" },
    { cat: "Produk", title: "Flat lay", text: "Top-down flat lay of [product] with complementary props on a pastel background, soft shadows, clean minimal styling, commercial photography" },
    { cat: "Produk", title: "UGC pegang produk", text: "A young woman holding [product] toward the camera in her bedroom, smartphone vertical photo, natural light, authentic UGC style, slightly casual framing" },
    { cat: "Produk", title: "Unboxing", text: "Hands opening a delivery box revealing [product], tidy desk, soft daylight, first-person view, realistic UGC unboxing photo" },
    { cat: "Produk", title: "Makanan menggugah", text: "Close-up of [nasi goreng] on a ceramic plate, steam rising, shallow depth of field, warm restaurant light, appetizing food photography" },

    // ---------- Indonesia ----------
    { cat: "Indonesia", title: "Sawah pagi", text: "Wide shot of terraced rice fields at sunrise, mist between the hills, a farmer walking along the path wearing a conical hat, golden light, photorealistic landscape" },
    { cat: "Indonesia", title: "Gang kampung Jakarta", text: "A narrow Jakarta kampung alley with warung stalls, hanging wires, motorbikes, laundry on lines, warm afternoon light, documentary photography" },
    { cat: "Indonesia", title: "Pasar tradisional", text: "Busy traditional Indonesian market in the morning, colorful vegetable stalls, vendors and shoppers, natural light, candid street photography" },
    { cat: "Indonesia", title: "Candi saat fajar", text: "Ancient Javanese stone temple at dawn, soft fog, silhouette of volcanoes in the distance, cinematic wide shot, rich colors" },
    { cat: "Indonesia", title: "Pantai Bali", text: "Quiet beach in Bali at sunset, a traditional wooden boat on the sand, gentle waves, warm pink sky, photorealistic travel photography" },

    // ---------- Cinematic ----------
    { cat: "Cinematic", title: "Adegan hujan malam", text: "Cinematic night scene, a lone figure with an umbrella on a wet city street, neon signs reflecting on the asphalt, shallow depth of field, anamorphic lens flares, movie still" },
    { cat: "Cinematic", title: "Close-up emosional", text: "Cinematic extreme close-up of a face with tears in the eyes, soft side light, shallow depth of field, muted color grading, film grain, 35mm movie still" },
    { cat: "Cinematic", title: "Pahlawan siluet", text: "Silhouette of a warrior on a hilltop against a huge orange sunset, wind moving the cloak, epic wide shot, dramatic clouds, cinematic composition" },
    { cat: "Cinematic", title: "Horor kampung", text: "Eerie abandoned village house at night, thin fog, a single flickering lantern, dark teal and amber palette, cinematic horror still, low-key lighting" },
    { cat: "Cinematic", title: "DV camcorder 2000-an", text: "Early-2000s DV camcorder footage still, slightly soft focus, low resolution grain, date stamp feel, people laughing in a neighborhood street" },

    // ---------- Anime / 3D ----------
    { cat: "Anime 3D", title: "Anime penyihir", text: "High quality anime illustration of a young mage casting a glowing spell, flowing robe, floating particles, dynamic pose, vibrant colors, clean line art" },
    { cat: "Anime 3D", title: "Pixar kampung", text: "3D animated family film style, a cheerful village boy with big expressive eyes, warm lighting, detailed textures, soft global illumination" },
    { cat: "Anime 3D", title: "Chibi lucu", text: "Cute chibi character with oversized head, pastel colors, simple background, soft shading, sticker style" },
    { cat: "Anime 3D", title: "Legenda Nusantara 3D", text: "3D animated Indonesian folk tale scene, a mystical stone by a river at dusk, glowing fireflies, warm colors, storybook atmosphere" },
    { cat: "Anime 3D", title: "Fantasi epik", text: "Epic fantasy concept art of a castle on a cliff above the clouds, dragons in the sky, dramatic lighting, highly detailed matte painting" },

    // ---------- Video ----------
    { cat: "Video", title: "Dolly in wajah", text: "Close-up of a young woman, slow dolly in, she turns her head toward the camera and breaks into a soft smile, natural light, shallow depth of field, cinematic" },
    { cat: "Video", title: "Jalan di kampung", text: "Medium tracking shot of a person walking slowly down a narrow kampung alley, handheld camera, warm afternoon light, locals in the background, documentary look" },
    { cat: "Video", title: "Orbit karakter", text: "The camera orbits smoothly around a character standing still, wind moving the hair and clothes, golden hour backlight, cinematic slow motion" },
    { cat: "Video", title: "Produk berputar", text: "A product slowly rotating on a pedestal, soft studio lighting, reflections on the surface, smooth camera push in, clean commercial look" },
    { cat: "Video", title: "Drone sawah", text: "Aerial drone shot slowly moving forward over terraced rice fields at sunrise, mist drifting, birds crossing the frame, cinematic" },

    // ---------- Thumbnail ----------
    { cat: "Thumbnail", title: "Thumbnail kaget", text: "YouTube thumbnail style, a person with an exaggerated shocked expression pointing at the side, bright saturated background, strong rim light, high contrast, clean empty space for text" },
    { cat: "Thumbnail", title: "Thumbnail before after", text: "Split composition thumbnail, left side dull and messy, right side clean and vibrant, same subject, bold colors, high contrast, empty space at the top for a title" },
    { cat: "Thumbnail", title: "Thumbnail misteri", text: "Dark mysterious thumbnail, glowing object in the center, dramatic fog, deep blue and orange contrast, high detail, space for bold text" },

    // ---------- Negative ----------
    { cat: "Negative", title: "Negative umum gambar", text: "blurry, low quality, deformed hands, extra fingers, distorted face, text, watermark, logo, oversaturated, plastic skin" },
    { cat: "Negative", title: "Negative video", text: "blurry, flickering, morphing, distorted face, jitter, warping, text, subtitles, watermark, logo" },
    { cat: "Negative", title: "Negative produk", text: "wrong label, misspelled text, distorted logo, extra buttons, duplicated objects, low resolution, harsh glare" }

];
