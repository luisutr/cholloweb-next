/**
 * POST /api/admin/redetect
 *
 * Re-aplica la auto-detección SOLO para los campos donde tiene sentido:
 *
 *  - category:  actualiza si detecta accesorios/consolas/figuras
 *              (NO toca si ya es videojuegos y el título no da pistas claras)
 *  - condition: actualiza solo si el título dice explícitamente "reacondicionado" o "segunda mano"
 *  - platformFamily/generation: NUNCA sobreescribe un valor específico ya asignado.
 *              Solo actualiza si el actual es "multi" Y la detección encuentra algo concreto.
 *
 * Regla clave: nunca DEGRADA información (específico → multi).
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
    // Si el título es un placeholder genérico, no hay información útil → no tocar nada
    if (!p.title || /^producto amazon\s+\w+$/i.test(p.title.trim())) {
      return p;
    }

    const meta = detectProductMeta(p.title);
    const updated = { ...p };
    let dirty = false;

    // ── Categoría ──
    // Solo actualiza si detecta algo más específico que el default (videojuegos)
    if (meta.category !== "videojuegos" && meta.category !== p.category) {
      updated.category = meta.category as Product["category"];
      dirty = true;
    }

    // ── Plataforma / generación ──
    // SOLO actualiza si el valor actual es "multi" y la detección encuentra algo concreto
    if (p.platformFamily === "multi" && meta.platformFamily !== "multi") {
      updated.platformFamily = meta.platformFamily as Product["platformFamily"];
      updated.generation     = (meta.generation || null) as Product["generation"];
      updated.platformLabel  = meta.platformLabel;
      dirty = true;
    }
    // NUNCA sobreescribe playstation/xbox/nintendo con multi

    // ── Condición ──
    // Solo actualiza si el título menciona explícitamente reacondicionado o segunda mano
    if (meta.condition !== "nuevo" && meta.condition !== p.condition) {
      updated.condition = meta.condition;
      dirty = true;
    }

    if (dirty) changed++;
    return updated;
  });

  catalog.updatedAt = new Date().toISOString();
  await fs.writeFile(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf-8");

  return NextResponse.json({ ok: true, total: catalog.products.length, changed });
}
