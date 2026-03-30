import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/consolas", label: "Consolas" },
  { href: "/comparativas", label: "Comparativas" },
  { href: "/videojuegos", label: "Videojuegos" },
  { href: "/accesorios", label: "Accesorios" },
  { href: "/destacados", label: "Destacados" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/segunda-mano", label: "Segunda mano" },
  { href: "/reacondicionados", label: "Reacondicionados" },
  { href: "/nuevos", label: "Nuevos" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-sm font-bold text-zinc-900 sm:text-base">
          cholloweb.es
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3 py-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
