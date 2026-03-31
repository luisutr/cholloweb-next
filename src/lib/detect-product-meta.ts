/**
 * Auto-detección de metadatos de producto a partir del título y texto de condición.
 *
 * Analiza el título para inferir:
 *  - platformFamily  (playstation / xbox / nintendo / multi)
 *  - generation      (ps5, ps4, xbox-series…)
 *  - platformLabel   (PS5, Xbox Series X/S…)
 *  - category        (consolas / videojuegos / accesorios / figuras)
 *  - condition       (nuevo / reacondicionado / segunda-mano)
 */

export type DetectedCategory  = "consolas" | "videojuegos" | "accesorios" | "figuras" | "peliculas";
export type DetectedPlatform  = "playstation" | "xbox" | "nintendo" | "evercade" | "multi";
export type DetectedCondition = "nuevo" | "segunda-mano" | "reacondicionado";

export type ProductMeta = {
  category:       DetectedCategory;
  platformFamily: DetectedPlatform;
  generation:     string;
  platformLabel:  string;
  condition:      DetectedCondition;
};

/** Categorías sin plataforma de hardware asociada */
export const PLATFORM_FREE_DETECTED: DetectedCategory[] = ["figuras", "peliculas"];

/* ─── Mapas de plataforma ──────────────────────────────────── */

const PLATFORM_LABEL_MAP: Record<string, string> = {
  ps3:                "PS3",
  ps4:                "PS4",
  ps5:                "PS5",
  "xbox-360":         "Xbox 360",
  "xbox-one":         "Xbox One",
  "xbox-series":      "Xbox Series X/S",
  "switch":           "Switch",
  "switch-2":         "Switch 2",
  "evercade-handheld": "Evercade",
  "":                 "Multi",
};

/* ─── Detección de plataforma y generación ─────────────────── */

function detectPlatform(t: string): { platformFamily: DetectedPlatform; generation: string } {
  // PlayStation — del más específico al más genérico
  if (/\bps\s*5\b|playstation\s*5|playstation5/i.test(t))
    return { platformFamily: "playstation", generation: "ps5" };
  if (/\bps\s*4\b|playstation\s*4|playstation4/i.test(t))
    return { platformFamily: "playstation", generation: "ps4" };
  if (/\bps\s*3\b|playstation\s*3|playstation3/i.test(t))
    return { platformFamily: "playstation", generation: "ps3" };

  // DualShock/DualSense — mandos con número de versión antes que el fallback genérico
  if (/dualsense/i.test(t))
    return { platformFamily: "playstation", generation: "ps5" };
  if (/dualshock\s*4/i.test(t))
    return { platformFamily: "playstation", generation: "ps4" };
  if (/dualshock\s*3/i.test(t))
    return { platformFamily: "playstation", generation: "ps3" };
  if (/dualshock/i.test(t))                                 // DualShock sin número → PS4
    return { platformFamily: "playstation", generation: "ps4" };

  // Genérico PlayStation (PULSE 3D, PS Move, etc.) → ps5 como fallback razonable
  if (/playstation|pulse\s*3d|ps move/i.test(t))
    return { platformFamily: "playstation", generation: "ps5" };

  // Xbox — del más específico al más genérico
  if (/xbox series|series\s*x\b|series\s*s\b/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-series" };
  if (/xbox\s*one/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-one" };
  if (/xbox\s*360/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-360" };
  if (/\bxbox\b/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-series" };

  // Nintendo — del más específico al más genérico
  if (/nintendo\s*switch\s*2|switch\s*2/i.test(t))
    return { platformFamily: "nintendo", generation: "switch-2" };
  if (/nintendo\s*switch|switch\s*oled|\bswitch\b/i.test(t))
    return { platformFamily: "nintendo", generation: "switch" };
  if (/\bnintendo\b|joy.?con|amiibo/i.test(t))
    return { platformFamily: "nintendo", generation: "switch" };

  // Evercade
  if (/\bevercade\b/i.test(t))
    return { platformFamily: "evercade", generation: "evercade-handheld" };

  return { platformFamily: "multi", generation: "" };
}

/* ─── Detección de categoría ────────────────────────────────── */

/**
 * Palabras clave que indican HARDWARE (consola).
 *
 * IMPORTANTE: NO incluir nombres de plataforma solos como "Xbox Series X"
 * porque aparecen en títulos de juegos ("Forza Horizon 5 - Xbox Series X|S").
 * Solo se incluyen cuando van acompañados de indicadores claros de hardware:
 * palabras como "consola", "console", modelo+capacidad, edición de hardware, etc.
 */
const CONSOLE_KEYWORDS = [
  // Genéricos
  "consola", "console",
  // PlayStation — indicadores de hardware suficientemente específicos
  "playstation 5", "ps5 digital", "ps5 disc", "ps5 slim",
  "playstation 4 slim", "playstation 4 pro", "ps4 slim", "ps4 pro",
  // Nintendo — solo modelos específicos, no el nombre de plataforma solo
  "nintendo switch oled", "nintendo switch lite", "switch lite",
  // Indicadores universales de hardware
  "1tb", "500gb", "512gb", "256gb",    // capacidad de almacenamiento
  "all-digital", "all digital",        // edición sin lector
  "disc edition", "digital edition",
  "bundle",
];

const ACCESSORY_KEYWORDS = [
  "mando", "controller", "gamepad",
  "auricular", "headset", "headphone",
  "cargador", "charger", "charging",
  "funda", "case", "carcasa",
  "ssd", "disco duro", "tarjeta de memoria", "memory card", "almacenamiento",
  "cable", "hdmi", "usb",
  "soporte", "stand", "dock",
  "volante", "wheel", "joystick", "arcade",
  "teclado", "keyboard",
  "ratón", "mouse",
  "camara", "webcam", "microfono",
  "dualsense", "dualshock", "joy-con", "joycon",
  "pulse 3d", "pulse3d",
  "media remote",
];

const FIGURE_KEYWORDS = [
  "figura", "figure", "figurine",
  "funko", "pop!",
  "nendoroid", "amiibo",
  "estatua", "statue", "collectible",
  "plush", "peluche",
];

const MOVIE_KEYWORDS = [
  "blu-ray", "blu ray", "bluray",
  "4k uhd", "4k uHD", "uhd",
  "dvd",
  "steelbook",
  "película", "pelicula", "movie",
  "serie ", "series ",     // con espacio para no cazar "Xbox Series"
  "temporada", "season",
  "documental", "documentary",
  "anime blu", "anime dvd",
];

function detectCategory(t: string): DetectedCategory {
  const lower = t.toLowerCase();

  if (MOVIE_KEYWORDS.some((k) => lower.includes(k.toLowerCase()))) return "peliculas";
  if (FIGURE_KEYWORDS.some((k) => lower.includes(k))) return "figuras";
  if (ACCESSORY_KEYWORDS.some((k) => lower.includes(k))) return "accesorios";
  if (CONSOLE_KEYWORDS.some((k) => lower.includes(k))) return "consolas";

  return "videojuegos";
}

/* ─── Detección de condición ─────────────────────────────────── */

export function detectCondition(conditionText: string): DetectedCondition {
  const c = conditionText.toLowerCase();
  if (/reacondicionad|renewed|refurb|reconditionn/i.test(c)) return "reacondicionado";
  if (/segunda\s*mano|used|occasion|gebraucht|usato/i.test(c)) return "segunda-mano";
  return "nuevo";
}

/* ─── Función principal ──────────────────────────────────────── */

export function detectProductMeta(title: string, conditionText = ""): ProductMeta {
  const { platformFamily, generation } = detectPlatform(title);
  const category    = detectCategory(title);
  const condition   = detectCondition(conditionText);
  const platformLabel = PLATFORM_LABEL_MAP[generation] ?? platformFamily;

  return { category, platformFamily, generation, platformLabel, condition };
}
