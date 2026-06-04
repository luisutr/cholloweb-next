/**
 * POST /api/admin/enrich-asins
 *
 * Para cada ASIN recibido, descarga la página del producto en Amazon.es
 * (server-side, sin restricciones CORS) y extrae:
 *   - title     → del span#productTitle o de la etiqueta <title>
 *   - price     → del span con clase a-price-whole
 *   - imageUrl  → de la imagen principal del producto
 *
 * Solo disponible en localhost. Procesa en lotes de 5 para no saturar Amazon.
 */

import { NextRequest, NextResponse } from "next/server";

function isLocalhost(req: NextRequest): boolean {
  const host = req.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

type AsinResult = {
  asin:     string;
  title:    string | null;
  price:    number | null;
  imageUrl: string | null;
};

const AMAZON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Cache-Control": "no-cache",
};

async function fetchAsinData(asin: string): Promise<AsinResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(`https://www.amazon.es/dp/${asin}`, {
      headers: AMAZON_HEADERS,
      signal: controller.signal,
      redirect: "follow",
    });

    if (!res.ok) return { asin, title: null, price: null, imageUrl: null };

    const html = await res.text();

    /* ── Título ── */
    let title: string | null = null;

    // 1. span#productTitle (presente en HTML estático siempre)
    const m1 = html.match(/id="productTitle"[^>]*>\s*([\s\S]{3,300?}?)\s*<\/span>/);
    if (m1?.[1]) {
      title = m1[1].replace(/\s+/g, " ").trim();
    }

    // 2. <title> tag como fallback
    if (!title) {
      const m2 = html.match(/<title[^>]*>([^<]{5,})<\/title>/i);
      if (m2?.[1]) {
        const raw = m2[1].trim();
        // Amazon format: "Nombre : Amazon.es: Categoría" o "Nombre | Amazon"
        const candidate = raw.split(" : ")[0].split(" | ")[0].trim();
        if (candidate.length > 3 && !/^amazon/i.test(candidate)) {
          title = candidate;
        }
      }
    }

    /* ── Precio ── */
    let price: number | null = null;
    const priceMatch = html.match(
      /class="a-price-whole">([0-9.,]+)<|"priceAmount":"([0-9.,]+)"/,
    );
    if (priceMatch) {
      const raw = (priceMatch[1] ?? priceMatch[2]).replace(/\./g, "").replace(",", ".");
      const n = parseFloat(raw);
      if (!isNaN(n) && n > 0) price = n;
    }

    /* ── Imagen ── */
    let imageUrl: string | null = null;
    const imgMatch = html.match(
      /"large":"(https:\/\/m\.media-amazon\.com\/images\/[^"]+)"/,
    );
    if (imgMatch?.[1]) imageUrl = imgMatch[1];

    return { asin, title, price, imageUrl };
  } catch {
    return { asin, title: null, price: null, imageUrl: null };
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json(
      { error: "Admin API solo disponible en entorno local." },
      { status: 403 },
    );
  }

  const body = await req.json() as { asins?: string[] };
  const asins: string[] = (body.asins ?? []).filter(
    (a) => typeof a === "string" && /^[A-Z0-9]{10}$/.test(a),
  );

  if (!asins.length) {
    return NextResponse.json({ results: [] });
  }

  const BATCH = 5;
  const results: AsinResult[] = [];

  for (let i = 0; i < asins.length; i += BATCH) {
    const batch = asins.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(fetchAsinData));
    results.push(...batchResults);
  }

  return NextResponse.json({ results });
}
