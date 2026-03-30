"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { KIND_OPTIONS, PLATFORM_TREE } from "@/lib/platform-hierarchy";

/* ─── Datos del menú ─────────────────────────────────────── */

const VIDEOJUEGOS_ITEMS = [
  { href: "/videojuegos/nuevos", label: "Nuevos" },
  { href: "/videojuegos/segunda-mano", label: "Segunda mano" },
  { href: "/videojuegos/reacondicionados", label: "Reacondicionados" },
  { href: "/videojuegos/ofertas", label: "Ofertas" },
  { href: "/videojuegos", label: "Todos los videojuegos" },
];

const ACCESORIOS_ITEMS = [
  { href: "/accesorios/nuevos", label: "Nuevos" },
  { href: "/accesorios/segunda-mano", label: "Segunda mano" },
  { href: "/accesorios/reacondicionados", label: "Reacondicionados" },
  { href: "/accesorios/ofertas", label: "Ofertas" },
  { href: "/accesorios", label: "Todos los accesorios" },
];

const MARKETPLACE_ITEMS = [
  { href: "/destacados", label: "Destacados" },
  { href: "/ofertas", label: "Ofertas del día" },
  { href: "/segunda-mano", label: "Segunda mano" },
  { href: "/reacondicionados", label: "Reacondicionados" },
  { href: "/nuevos", label: "Nuevos" },
];

/* ─── Hook: menú con retraso de cierre ───────────────────── */

function useDelayedMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function enter(id: string) {
    if (timer.current) clearTimeout(timer.current);
    setOpen(id);
  }

  function leave() {
    timer.current = setTimeout(() => setOpen(null), 180);
  }

  function cancel() {
    if (timer.current) clearTimeout(timer.current);
  }

  return { open, enter, leave, cancel };
}

/* ─── Chevron icon ───────────────────────────────────────── */

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`ml-1 inline-block h-3 w-3 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* ─── Dropdown simple (Videojuegos / Accesorios / Más) ───── */

function SimpleDropdown({
  items,
  onMouseEnter,
  onMouseLeave,
}: {
  items: { href: string; label: string }[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="absolute left-0 top-full z-50 min-w-52 pt-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* puente transparente para que no se pierda el hover */}
      <div className="absolute -top-1 left-0 right-0 h-2" />
      <div className="rounded-xl border border-zinc-700 bg-zinc-800 py-1.5 shadow-2xl ring-1 ring-black/20">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-orange-400"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Mega-menú (PlayStation / Xbox / Nintendo) ──────────── */

function MegaMenu({
  platform,
  onMouseEnter,
  onMouseLeave,
}: {
  platform: (typeof PLATFORM_TREE)[number];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const colCount = platform.generations.length;
  const gridCols = colCount === 3 ? "grid-cols-3" : "grid-cols-2";
  const minWidth = colCount === 3 ? "min-w-[480px]" : "min-w-[340px]";

  return (
    <div
      className={`absolute left-0 top-full z-50 ${minWidth} pt-1`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* puente transparente */}
      <div className="absolute -top-1 left-0 right-0 h-2" />
      <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-5 shadow-2xl ring-1 ring-black/20">
        <div className={`grid gap-6 ${gridCols}`}>
          {platform.generations.map((gen) => (
            <div key={gen.slug}>
              {/* Nivel 2: generación */}
              <Link
                href={`/consolas/${platform.slug}?gen=${gen.slug}`}
                className="mb-2.5 block border-b border-zinc-600 pb-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300"
              >
                {gen.label}
              </Link>
              {/* Nivel 3: tipo de producto */}
              <div className="space-y-0.5">
                {KIND_OPTIONS.map((kind) => (
                  <Link
                    key={kind.slug}
                    href={`/${platform.slug}/${gen.slug}/${kind.slug}`}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-orange-400"
                  >
                    <span className="text-zinc-500">›</span>
                    {kind.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────── */

export function SiteHeader() {
  const { open, enter, leave, cancel } = useDelayedMenu();

  const triggerClass = (id: string) =>
    `inline-flex cursor-pointer select-none items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
      open === id
        ? "bg-orange-500/20 text-orange-400"
        : "text-zinc-300 hover:bg-zinc-700/60 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-700/60 bg-zinc-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-sm font-extrabold tracking-tight text-white sm:text-base"
        >
          <span className="text-orange-400">chollo</span>web.es
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 items-center gap-0.5">
          {/* Inicio */}
          <Link
            href="/"
            className="inline-flex whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700/60 hover:text-white"
          >
            Inicio
          </Link>

          {/* ── Plataformas ── */}
          {PLATFORM_TREE.map((platform) => (
            <div
              key={platform.slug}
              className="relative shrink-0"
              onMouseEnter={() => enter(platform.slug)}
              onMouseLeave={leave}
            >
              <Link href={`/consolas/${platform.slug}`} className={triggerClass(platform.slug)}>
                {platform.label}
                <Chevron isOpen={open === platform.slug} />
              </Link>

              {open === platform.slug && (
                <MegaMenu platform={platform} onMouseEnter={cancel} onMouseLeave={leave} />
              )}
            </div>
          ))}

          {/* ── Videojuegos ── */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => enter("videojuegos")}
            onMouseLeave={leave}
          >
            <span className={triggerClass("videojuegos")}>
              Videojuegos
              <Chevron isOpen={open === "videojuegos"} />
            </span>
            {open === "videojuegos" && (
              <SimpleDropdown
                items={VIDEOJUEGOS_ITEMS}
                onMouseEnter={cancel}
                onMouseLeave={leave}
              />
            )}
          </div>

          {/* ── Accesorios ── */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => enter("accesorios")}
            onMouseLeave={leave}
          >
            <span className={triggerClass("accesorios")}>
              Accesorios
              <Chevron isOpen={open === "accesorios"} />
            </span>
            {open === "accesorios" && (
              <SimpleDropdown
                items={ACCESORIOS_ITEMS}
                onMouseEnter={cancel}
                onMouseLeave={leave}
              />
            )}
          </div>

          {/* ── Comparativas ── */}
          <Link
            href="/comparativas"
            className="inline-flex shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700/60 hover:text-white"
          >
            Comparativas
          </Link>

          {/* ── Más (Marketplace) ── */}
          <div
            className="relative ml-auto shrink-0"
            onMouseEnter={() => enter("mas")}
            onMouseLeave={leave}
          >
            <span className={triggerClass("mas")}>
              Más
              <Chevron isOpen={open === "mas"} />
            </span>
            {open === "mas" && (
              <div
                className="absolute right-0 top-full z-50 min-w-48 pt-1"
                onMouseEnter={cancel}
                onMouseLeave={leave}
              >
                <div className="absolute -top-1 left-0 right-0 h-2" />
                <div className="rounded-xl border border-zinc-700 bg-zinc-800 py-1.5 shadow-2xl ring-1 ring-black/20">
                  {MARKETPLACE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-orange-400"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
