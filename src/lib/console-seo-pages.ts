export type ConsoleSeoPage = {
  slug: string;
  shortName: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  searchIntents: string[];
  buyingTips: string[];
  faq: Array<{ question: string; answer: string }>;
};

export const CONSOLE_SEO_PAGES: ConsoleSeoPage[] = [
  {
    slug: "ps5",
    shortName: "PS5",
    h1: "Videojuegos baratos de PS5: ofertas, packs y descuentos",
    seoTitle: "Videojuegos baratos de PS5 | Ofertas PS5 hoy | cholloweb.es",
    seoDescription:
      "Encuentra videojuegos baratos de PS5, packs de PlayStation 5 y ofertas actualizadas. Seleccionamos chollos reales para comprar al mejor precio.",
    intro:
      "En esta guía recopilamos oportunidades para ahorrar en PS5: juegos top, packs con mando extra, ediciones especiales y promociones temporales.",
    searchIntents: [
      "videojuegos baratos de ps5",
      "ofertas ps5 hoy",
      "packs playstation 5 baratos",
      "juegos ps5 en oferta",
    ],
    buyingTips: [
      "Compara siempre precio actual vs. histórico antes de comprar.",
      "Prioriza packs con extras útiles (mando, suscripción o juego incluido).",
      "En ofertas flash, revisa stock y fecha de entrega para no perder el chollo.",
    ],
    faq: [
      {
        question: "¿Cada cuánto actualizáis las ofertas de PS5?",
        answer:
          "Actualizamos periódicamente y destacamos las bajadas más relevantes para que puedas detectar oportunidades reales.",
      },
      {
        question: "¿Incluís solo juegos o también hardware de PS5?",
        answer:
          "Incluimos ambos: videojuegos, packs de consola, accesorios y artículos reacondicionados cuando el descuento compensa.",
      },
    ],
  },
  {
    slug: "xbox-series",
    shortName: "Xbox Series",
    h1: "Ofertas Xbox Series X y S: consolas, juegos y accesorios",
    seoTitle: "Ofertas Xbox Series X/S | Juegos y consolas baratas",
    seoDescription:
      "Descubre ofertas de Xbox Series X y Xbox Series S con descuentos en consola, juegos y accesorios. Comparativas y selección orientada a ahorro.",
    intro:
      "Aquí agrupamos descuentos de Xbox Series para quienes buscan rendimiento y catálogo a buen precio: desde bundles hasta periféricos clave.",
    searchIntents: [
      "ofertas xbox series x",
      "xbox series s barata",
      "juegos xbox en oferta",
      "packs xbox series x baratos",
    ],
    buyingTips: [
      "Si priorizas precio, revisa versiones digitales y reacondicionadas certificadas.",
      "Evalúa el coste total incluyendo suscripciones y almacenamiento adicional.",
      "En periféricos, aprovecha promociones combinadas para ahorrar más.",
    ],
    faq: [
      {
        question: "¿Merece la pena comprar Xbox reacondicionada?",
        answer:
          "Puede compensar si el descuento es alto y el vendedor ofrece garantía clara y devolución sencilla.",
      },
      {
        question: "¿Mostráis solo productos nuevos?",
        answer:
          "No. Mostramos nuevos y reacondicionados cuando el ahorro potencial es interesante para el usuario.",
      },
    ],
  },
  {
    slug: "nintendo-switch",
    shortName: "Nintendo Switch",
    h1: "Ofertas Nintendo Switch: juegos baratos, packs y accesorios",
    seoTitle: "Ofertas Nintendo Switch | Juegos baratos y packs",
    seoDescription:
      "Encuentra ofertas Nintendo Switch con juegos baratos, packs de consola y accesorios rebajados. Selección orientada a familias y jugadores habituales.",
    intro:
      "Si buscas ahorrar en Nintendo Switch, esta página reúne oportunidades en juegos, consolas y complementos populares.",
    searchIntents: [
      "ofertas nintendo switch",
      "juegos baratos switch",
      "nintendo switch oled oferta",
      "packs nintendo switch baratos",
    ],
    buyingTips: [
      "En Nintendo, los grandes descuentos son menos frecuentes: vigila campañas puntuales.",
      "Compara versión estándar vs OLED según uso portátil.",
      "Los lotes con juego incluido suelen ofrecer mejor coste por unidad.",
    ],
    faq: [
      {
        question: "¿Compensa esperar para comprar una Switch?",
        answer:
          "Depende del descuento disponible. Si encuentras una rebaja sólida en pack, suele ser buena opción.",
      },
      {
        question: "¿Publicáis también accesorios de Switch?",
        answer:
          "Sí, especialmente mandos, fundas, cargadores y almacenamiento cuando tienen buena relación calidad-precio.",
      },
    ],
  },
];

export function getConsoleSeoPage(slug: string): ConsoleSeoPage | undefined {
  return CONSOLE_SEO_PAGES.find((page) => page.slug === slug);
}
