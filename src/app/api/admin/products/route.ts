/**
 * API de administración — solo funciona en entorno local (desarrollo).
 * En producción (Vercel) el sistema de ficheros es de solo lectura,
 * por lo que esta ruta devuelve 403 fuera de localhost.
 *
 * POST /api/admin/products  → añade o actualiza un producto
 * DELETE /api/admin/products → elimina un producto por id
 */

import fs from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

const CATALOG_PATH = path.join(process.cwd(), "src", "data", "products.json");

function isLocalhost(req: NextRequest): boolean {
  const host = req.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

async function readCatalog() {
  const raw = await fs.readFile(CATALOG_PATH, "utf-8");
  return JSON.parse(raw) as {
    updatedAt: string;
    source: string;
    products: Record<string, unknown>[];
  };
}

async function writeCatalog(catalog: {
  updatedAt: string;
  source: string;
  products: Record<string, unknown>[];
}) {
  await fs.writeFile(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf-8");
}

/* ── POST: añadir o actualizar producto ─────────────────── */
export async function POST(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json(
      { error: "Admin API solo disponible en entorno local." },
      { status: 403 },
    );
  }

  const body = await req.json();

  if (!body.id || !body.title || !body.category || !body.amazonUrl) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: id, title, category, amazonUrl" },
      { status: 400 },
    );
  }

  const catalog = await readCatalog();
  const idx = catalog.products.findIndex((p) => p.id === body.id);

  if (idx >= 0) {
    catalog.products[idx] = body;
  } else {
    catalog.products.unshift(body);
  }

  catalog.updatedAt = new Date().toISOString();
  catalog.source = "manual";

  await writeCatalog(catalog);

  return NextResponse.json({ ok: true, action: idx >= 0 ? "updated" : "created" });
}

/* ── DELETE: eliminar producto por id ──────────────────── */
export async function DELETE(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json(
      { error: "Admin API solo disponible en entorno local." },
      { status: 403 },
    );
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Falta el campo id" }, { status: 400 });
  }

  const catalog = await readCatalog();
  const before = catalog.products.length;
  catalog.products = catalog.products.filter((p) => p.id !== id);

  if (catalog.products.length === before) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  catalog.updatedAt = new Date().toISOString();
  await writeCatalog(catalog);

  return NextResponse.json({ ok: true });
}
