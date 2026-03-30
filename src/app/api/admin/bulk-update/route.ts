/**
 * POST /api/admin/bulk-update
 *
 * Actualiza en lote los productos que cumplan un filtro.
 * Solo disponible en localhost.
 *
 * Body JSON:
 *   filter: { platformFamily?: string; category?: string; generation?: string | null }
 *   update: Partial<Product>   — campos a sobreescribir en los productos que pasen el filtro
 *   ids?:   string[]           — si se proporciona, solo actualiza esos IDs
 */

import fs from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

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

  const body = await req.json() as {
    filter?: Partial<Record<keyof Product, unknown>>;
    update:  Partial<Product>;
    ids?:    string[];
  };

  if (!body.update || typeof body.update !== "object") {
    return NextResponse.json({ error: "Falta el campo 'update'." }, { status: 400 });
  }

  const raw = await fs.readFile(CATALOG_PATH, "utf-8");
  const catalog = JSON.parse(raw) as { updatedAt: string; source: string; products: Product[] };

  let changed = 0;

  catalog.products = catalog.products.map((p) => {
    // Si se especifican IDs, solo actualizar esos
    if (body.ids && !body.ids.includes(p.id)) return p;

    // Comprobar filtro
    if (body.filter) {
      for (const [key, val] of Object.entries(body.filter)) {
        if (p[key as keyof Product] !== val) return p;
      }
    }

    changed++;
    return { ...p, ...body.update };
  });

  catalog.updatedAt = new Date().toISOString();
  await fs.writeFile(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf-8");

  return NextResponse.json({ ok: true, total: catalog.products.length, changed });
}
