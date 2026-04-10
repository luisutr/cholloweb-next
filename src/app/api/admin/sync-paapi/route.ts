/**
 * POST /api/admin/sync-paapi
 *
 * Ejecuta `scripts/sync-paapi.mjs` en el servidor de desarrollo local.
 * Las credenciales PA-API deben estar en `.env.local` (no se exponen al navegador).
 *
 * Body JSON opcional:
 *   { "dryRun": true }           → --dry-run (no escribe products.json)
 *   { "mode": "search" }       → --mode=search (regenera por búsquedas)
 *
 * Solo disponible en localhost (mismo criterio que el resto del admin).
 */

import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

const CATALOG_REL = ["scripts", "sync-paapi.mjs"] as const;

function isLocalhost(req: NextRequest): boolean {
  const host = req.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export const maxDuration = 900;

export async function POST(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json(
      { error: "Admin API solo disponible en entorno local." },
      { status: 403 },
    );
  }

  let dryRun = false;
  let modeSearch = false;
  try {
    const body = (await req.json()) as { dryRun?: boolean; mode?: string };
    dryRun = Boolean(body?.dryRun);
    modeSearch = body?.mode === "search";
  } catch {
    // sin body → defaults
  }

  const scriptPath = path.join(process.cwd(), ...CATALOG_REL);
  const args = [scriptPath];
  if (modeSearch) args.push("--mode=search");
  if (dryRun) args.push("--dry-run");

  const nodeBin = process.execPath;

  try {
    const { stdout, stderr } = await execFileAsync(nodeBin, args, {
      cwd: process.cwd(),
      env: process.env,
      maxBuffer: 12 * 1024 * 1024,
      timeout: 14 * 60 * 1000,
    });

    return NextResponse.json({
      ok: true,
      dryRun,
      mode: modeSearch ? "search" : "asin",
      stdout: stdout.toString(),
      stderr: stderr.toString(),
    });
  } catch (err: unknown) {
    const e = err as {
      code?: number;
      stdout?: Buffer;
      stderr?: Buffer;
      message?: string;
    };
    return NextResponse.json(
      {
        ok: false,
        dryRun,
        mode: modeSearch ? "search" : "asin",
        exitCode: typeof e.code === "number" ? e.code : 1,
        stdout: e.stdout?.toString() ?? "",
        stderr: e.stderr?.toString() ?? "",
        error: e.message ?? "sync-paapi falló",
      },
      { status: 200 },
    );
  }
}
