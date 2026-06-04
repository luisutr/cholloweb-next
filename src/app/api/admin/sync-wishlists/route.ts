/**
 * POST /api/admin/sync-wishlists
 *
 * Ejecuta `scripts/sync-wishlists.mjs` en el servidor de desarrollo local.
 *
 * Body JSON opcional:
 *   { "dryRun": true }  → --dry-run (no escribe products.json)
 *
 * Solo disponible en localhost.
 */

import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

const SCRIPT_REL = ["scripts", "sync-wishlists.mjs"] as const;

function isLocalhost(req: NextRequest): boolean {
  const host = req.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  if (!isLocalhost(req)) {
    return NextResponse.json(
      { error: "Admin API solo disponible en entorno local." },
      { status: 403 },
    );
  }

  let dryRun = false;
  try {
    const body = (await req.json()) as { dryRun?: boolean };
    dryRun = Boolean(body?.dryRun);
  } catch {
    // sin body → defaults
  }

  const scriptPath = path.join(process.cwd(), ...SCRIPT_REL);
  const args = [scriptPath];
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
        exitCode: typeof e.code === "number" ? e.code : 1,
        stdout: e.stdout?.toString() ?? "",
        stderr: e.stderr?.toString() ?? "",
        error: e.message ?? "sync-wishlists falló",
      },
      { status: 200 },
    );
  }
}
