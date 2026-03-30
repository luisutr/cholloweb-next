import type { SeoLandingContent } from "@/components/seo-landing-page";

export type IntentSeoPage = SeoLandingContent & {
  slug: string;
  seoTitle: string;
  seoDescription: string;
};

export const INTENT_SEO_PAGES: IntentSeoPage[] = [
  {
    slug: "videojuegos-baratos-ps5",
    shortName: "Videojuegos baratos PS5",
    h1: "Videojuegos baratos de PS5: dónde encontrar ofertas reales",
    seoTitle:
      "Videojuegos baratos de PS5 | Mejores ofertas y descuentos",
    seoDescription:
      "Descubre cómo encontrar videojuegos baratos de PS5 con descuentos reales, comparativas y recomendaciones para ahorrar al comprar.",
    intro:
      "Esta guía está orientada a usuarios que buscan pagar menos por juegos de PlayStation 5 sin perder de vista títulos top y promociones fiables.",
    searchIntents: [
      "videojuegos baratos de ps5",
      "juegos ps5 baratos",
      "donde comprar juegos ps5 en oferta",
      "mejores ofertas juegos playstation 5",
    ],
    buyingTips: [
      "Compara precio de edición estándar y edición deluxe antes de decidir.",
      "Vigila eventos de descuentos semanales y campañas de temporada.",
      "Prioriza juegos con alta rejugabilidad cuando busques máximo valor.",
    ],
    faq: [
      {
        question: "¿Qué precio se considera oferta buena en juegos de PS5?",
        answer:
          "Depende del título, pero una rebaja relevante suele situarse en torno al 20-35% frente al precio habitual.",
      },
      {
        question: "¿Es mejor comprar digital o físico en PS5?",
        answer:
          "Para ahorrar, conviene comparar ambas versiones porque las promociones pueden variar mucho entre formatos.",
      },
    ],
  },
  {
    slug: "ofertas-xbox-series-x",
    shortName: "Ofertas Xbox Series X",
    h1: "Ofertas de Xbox Series X: consola, juegos y accesorios rebajados",
    seoTitle:
      "Ofertas Xbox Series X hoy | Consola y juegos con descuento",
    seoDescription:
      "Consulta ofertas Xbox Series X con foco en ahorro real: bundles, juegos populares y accesorios al mejor precio.",
    intro:
      "Si quieres entrar en el ecosistema Xbox al mejor coste, aquí tienes una guía de búsqueda enfocada en descuentos con intención de compra.",
    searchIntents: [
      "ofertas xbox series x hoy",
      "xbox series x barata",
      "packs xbox series x con juego",
      "descuentos xbox series x",
    ],
    buyingTips: [
      "Analiza el coste total del pack frente a comprar consola y juego por separado.",
      "Ten en cuenta almacenamiento adicional si juegas muchos títulos pesados.",
      "Aprovecha bundles oficiales cuando incluyan juegos que ya ibas a comprar.",
    ],
    faq: [
      {
        question: "¿Baja mucho de precio Xbox Series X?",
        answer:
          "Las mayores bajadas suelen concentrarse en campañas concretas y bundles puntuales, por eso conviene monitorizar precios.",
      },
      {
        question: "¿Merece más la pena un pack que consola suelta?",
        answer:
          "Si el pack incluye juego o accesorio que realmente usarás, normalmente ofrece mejor relación precio/valor.",
      },
    ],
  },
  {
    slug: "nintendo-switch-oled-oferta",
    shortName: "Nintendo Switch OLED oferta",
    h1: "Nintendo Switch OLED en oferta: guía para comprar al mejor precio",
    seoTitle:
      "Nintendo Switch OLED oferta | Dónde comprar más barato",
    seoDescription:
      "Guía de compra para Nintendo Switch OLED en oferta: precios, packs recomendados y claves para detectar descuentos reales.",
    intro:
      "La Switch OLED suele tener descuentos más contenidos, por eso necesitas una estrategia clara para detectar cuándo realmente compensa comprar.",
    searchIntents: [
      "nintendo switch oled oferta",
      "switch oled barata",
      "mejor precio nintendo switch oled",
      "pack nintendo switch oled",
    ],
    buyingTips: [
      "No te fijes solo en el precio: valora si el pack incluye juego interesante.",
      "Compara promociones con y sin accesorios para calcular ahorro real.",
      "En campañas cortas, revisa rápidamente stock y condiciones de envío.",
    ],
    faq: [
      {
        question: "¿Cuándo suele estar más barata Switch OLED?",
        answer:
          "Suele verse mejor precio en campañas estacionales y promociones flash de comercio electrónico.",
      },
      {
        question: "¿Qué pack de Switch OLED es más recomendable?",
        answer:
          "El que incluya un juego que realmente quieras y mantenga un ahorro claro frente a comprar por separado.",
      },
    ],
  },
];

export function getIntentSeoPage(slug: string): IntentSeoPage | undefined {
  return INTENT_SEO_PAGES.find((page) => page.slug === slug);
}
