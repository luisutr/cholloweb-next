/**
 * GET /api/admin/catalog
 *
 * Devuelve el catálogo COMPLETO sin ningún filtro (incluye productos con
 * título genérico o precio 0). Solo disponible en localhost.
 */

import fs from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

const CATALOG_PATH = path.join(process.cwd(), "src", "data", "products.json");

function isLocalhost(req: NextRequest): boolean {
  const host = req.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export async function GET(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json(
      { error: "Admin API solo disponible en entorno local." },
      { status: 403 },
    );
  }

  const raw = await fs.readFile(CATALOG_PATH, "utf-8");
  const catalog = JSON.parse(raw) as {
    updatedAt: string;
    source: string;
    products: unknown[];
  };

  return NextResponse.json({
    updatedAt: catalog.updatedAt,
    total: catalog.products.length,
    products: catalog.products,
  });
}
