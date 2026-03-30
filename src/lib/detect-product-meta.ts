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

export type DetectedCategory  = "consolas" | "videojuegos" | "accesorios" | "figuras";
export type DetectedPlatform  = "playstation" | "xbox" | "nintendo" | "multi";
export type DetectedCondition = "nuevo" | "segunda-mano" | "reacondicionado";

export type ProductMeta = {
  category:       DetectedCategory;
  platformFamily: DetectedPlatform;
  generation:     string;
  platformLabel:  string;
  condition:      DetectedCondition;
};

/* ─── Mapas de plataforma ──────────────────────────────────── */

const PLATFORM_LABEL_MAP: Record<string, string> = {
  ps3:           "PS3",
  ps4:           "PS4",
  ps5:           "PS5",
  "xbox-360":    "Xbox 360",
  "xbox-one":    "Xbox One",
  "xbox-series": "Xbox Series X/S",
  "switch":      "Nintendo Switch",
  "switch-oled": "Nintendo Switch OLED",
  "":            "Multi",
};

/* ─── Detección de plataforma y generación ─────────────────── */

function detectPlatform(t: string): { platformFamily: DetectedPlatform; generation: string } {
  // PlayStation
  if (/\bps\s*5\b|playstation\s*5|playstation5/i.test(t))
    return { platformFamily: "playstation", generation: "ps5" };
  if (/\bps\s*4\b|playstation\s*4|playstation4/i.test(t))
    return { platformFamily: "playstation", generation: "ps4" };
  if (/\bps\s*3\b|playstation\s*3|playstation3/i.test(t))
    return { platformFamily: "playstation", generation: "ps3" };
  if (/playstation|dualsense|dualshock|ps move/i.test(t))
    return { platformFamily: "playstation", generation: "ps5" };

  // Xbox
  if (/xbox series|series\s*x\b|series\s*s\b/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-series" };
  if (/xbox\s*one/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-one" };
  if (/xbox\s*360/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-360" };
  if (/\bxbox\b/i.test(t))
    return { platformFamily: "xbox", generation: "xbox-series" };

  // Nintendo
  if (/switch\s*oled|oled\s*switch/i.test(t))
    return { platformFamily: "nintendo", generation: "switch-oled" };
  if (/nintendo\s*switch|\bswitch\b/i.test(t))
    return { platformFamily: "nintendo", generation: "switch" };
  if (/\bnintendo\b|joy.?con|amiibo/i.test(t))
    return { platformFamily: "nintendo", generation: "switch" };

  return { platformFamily: "multi", generation: "" };
}

/* ─── Detección de categoría ────────────────────────────────── */

const CONSOLE_KEYWORDS = [
  "consola", "console",
  // Modelos concretos de consola
  "playstation 5", "ps5 digital", "ps5 disc", "ps5 slim",
  "playstation 4 slim", "playstation 4 pro", "ps4 slim", "ps4 pro",
  "xbox series x", "xbox series s", "xbox one s", "xbox one x",
  "nintendo switch oled", "nintendo switch lite", "switch lite",
];

const ACCESSORY_KEYWORDS = [
  "mando", "controller", "gamepad",
  "auricular", "headset", "headphone",
  "cargador", "charger", "charging",
  "funda", "case", "carcasa",
  "ssd", "disco", "tarjeta de memoria", "memory card", "almacenamiento",
  "cable", "hdmi", "usb",
  "soporte", "stand", "dock",
  "volante", "wheel", "joystick", "arcade",
  "teclado", "keyboard",
  "ratón", "mouse",
  "camara", "webcam", "microfono",
  "dualsense", "dualshock", "joy-con", "joycon",
  "pulse 3d", "pulse 3d",
  "media remote",
];

const FIGURE_KEYWORDS = [
  "figura", "figure", "figurine",
  "funko", "pop!", "nendoroid", "amiibo",
  "estatua", "statue", "collectible",
  "plush", "peluche",
];

function detectCategory(t: string): DetectedCategory {
  const lower = t.toLowerCase();

  if (FIGURE_KEYWORDS.some((k) => lower.includes(k))) return "figuras";
  if (ACCESSORY_KEYWORDS.some((k) => lower.includes(k))) return "accesorios";
  if (CONSOLE_KEYWORDS.some((k) => lower.includes(k))) return "consolas";

  // Si el título contiene solo el nombre de la consola sin otros indicadores → consola
  if (
    /\b(ps5|ps4|ps3|xbox series x$|xbox series s$|nintendo switch oled$|nintendo switch lite$)\b/i.test(
      t.trim(),
    )
  ) {
    return "consolas";
  }

  return "videojuegos";
}

/* ─── Detección de condición ─────────────────────────────────── */

export function detectCondition(conditionText: string): DetectedCondition {
  const c = conditionText.toLowerCase();
  if (/reacondicionad|renewed|refurb|reconditionn/i.test(c)) return "reacondicionado";
  if (/segunda\s*mano|used|occasion|gebraucht|occasion|usato/i.test(c)) return "segunda-mano";
  return "nuevo";
}

/* ─── Función principal ──────────────────────────────────────── */

export function detectProductMeta(title: string, conditionText = ""): ProductMeta {
  const { platformFamily, generation } = detectPlatform(title);
  const category  = detectCategory(title);
  const condition = detectCondition(conditionText);
  const platformLabel = PLATFORM_LABEL_MAP[generation] ?? platformFamily;

  return { category, platformFamily, generation, platformLabel, condition };
}
