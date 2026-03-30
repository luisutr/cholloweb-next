/**
 * POST /api/admin/redetect
 *
 * Recorre todos los productos del catálogo y re-aplica la auto-detección
 * de plataforma, generación, categoría y condición a partir del título.
 * Solo disponible en entorno local.
 */

import fs from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { detectProductMeta } from "@/lib/detect-product-meta";
import type { Product } from "@/lib/products";

const CATALOG_PATH = path.join(process.cwd(), "src", "data", "products.json");

function isLocalhost(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export async function POST(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json({ error: "Solo disponible en local." }, { status: 403 });
  }

  const raw = await fs.readFile(CATALOG_PATH, "utf-8");
  const catalog = JSON.parse(raw) as { updatedAt: string; source: string; products: Product[] };

  let changed = 0;

  catalog.products = catalog.products.map((p) => {
    const meta = detectProductMeta(p.title);

    const updated: Product = {
      ...p,
      category:       meta.category       as Product["category"],
      platformFamily: meta.platformFamily  as Product["platformFamily"],
      generation:     (meta.generation || null) as Product["generation"],
      platformLabel:  meta.platformLabel,
      // La condición solo se sobreescribe si el producto no tiene condición definida
      // o si el título menciona explícitamente reacondicionado/segunda mano
      condition: meta.condition !== "nuevo" ? meta.condition : p.condition,
    };

    const dirty =
      updated.category       !== p.category       ||
      updated.platformFamily !== p.platformFamily  ||
      updated.generation     !== p.generation      ||
      updated.condition      !== p.condition;

    if (dirty) changed++;
    return updated;
  });

  catalog.updatedAt = new Date().toISOString();

  await fs.writeFile(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf-8");

  return NextResponse.json({
    ok: true,
    total: catalog.products.length,
    changed,
  });
}
