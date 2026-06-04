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
  { href: "/figuras",        label: "Figuras" },
  { href: "/peliculas",      label: "Películas" },
];

const PROJECT_LINKS = [
  { href: "/coverlens", label: "📱 CoverLens App", external: false },
  { href: "https://covers.cholloweb.es/", label: "🖼️ Covers Database ↗", external: true },
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
    <footer className="mt-12 border-t border-zinc-800 bg-[#08080a] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Grid principal */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Columna marca */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="cholloweb.es — inicio">
              <Image
                src="/logo.png"
                alt="cholloweb.es"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-base font-brand font-extrabold tracking-wider text-white">
                <span className="text-primary">chollo</span>web.es
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500">
              Tu portal de ofertas gaming. Encuentra chollos en consolas, videojuegos y merchandising al mejor precio.
            </p>
          </div>

          {/* Columna nuestros proyectos (Patrocinio) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Nuestros Proyectos
            </h3>
            <ul className="mt-3 space-y-2">
              {PROJECT_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition hover:text-primary"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Columna plataformas */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Plataformas
            </h3>
            <ul className="mt-3 space-y-2">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna catálogo */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Catálogo
            </h3>
            <ul className="mt-3 space-y-2">
              {CATALOG_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Legal
            </h3>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="mt-10 border-t border-zinc-900 pt-6">
          <p className="text-xs text-zinc-550">
            Como Afiliados de Amazon, en cholloweb.es obtenemos ingresos por compras
            adscritas que cumplen los requisitos aplicables.
          </p>
          <p className="mt-2 text-xs text-zinc-600">
            © {year} cholloweb.es · Todos los derechos reservados · Desarrollado en conjunto con el ecosistema CoverLens.
          </p>
        </div>
      </div>
    </footer>
  );
}
