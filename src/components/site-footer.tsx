import Image from "next/image";
import Link from "next/link";

const PLATFORM_LINKS = [
  { href: "/consolas/playstation", label: "PlayStation" },
  { href: "/consolas/xbox",        label: "Xbox" },
  { href: "/consolas/nintendo",    label: "Nintendo" },
];

const CATALOG_LINKS = [
  { href: "/videojuegos",    label: "Videojuegos" },
  { href: "/consolas",       label: "Consolas" },
  { href: "/accesorios",     label: "Accesorios" },
  { href: "/reacondicionados", label: "Reacondicionados" },
  { href: "/segunda-mano",   label: "Segunda mano" },
  { href: "/ofertas",        label: "Ofertas" },
];

const LEGAL_LINKS = [
  { href: "/aviso-legal",  label: "Aviso legal" },
  { href: "/privacidad",   label: "Privacidad" },
  { href: "/cookies",      label: "Cookies" },
  { href: "/afiliacion",   label: "Afiliación" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-[#1a2f6a]/30 bg-[#0d1b4e] text-zinc-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Grid principal */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Columna marca */}
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="cholloweb.es — inicio">
              <Image
                src="/logo.png"
                alt="cholloweb.es"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-base font-extrabold tracking-tight text-white">
                <span className="text-amber-400">chollo</span>web.es
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Chollos en videojuegos, consolas, figuras y reacondicionados.
              Actualizamos el catálogo para que siempre encuentres las mejores ofertas.
            </p>
          </div>

          {/* Columna plataformas */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Plataformas
            </h3>
            <ul className="mt-3 space-y-2">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna catálogo */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Catálogo
            </h3>
            <ul className="mt-3 space-y-2">
              {CATALOG_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="mt-8 border-t border-[#1a2f6a]/50 pt-6">
          <p className="text-xs text-zinc-500">
            Como Afiliados de Amazon, en cholloweb.es obtenemos ingresos por compras
            adscritas que cumplen los requisitos aplicables.
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            © {year} cholloweb.es · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
