import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600 sm:px-6 lg:px-8">
        <p>
          Como Afiliados de Amazon, en cholloweb.es obtenemos ingresos por compras
          adscritas que cumplen los requisitos aplicables.
        </p>
        <nav className="mt-4 flex flex-wrap gap-3">
          <Link href="/aviso-legal" className="hover:underline">
            Aviso legal
          </Link>
          <Link href="/privacidad" className="hover:underline">
            Política de privacidad
          </Link>
          <Link href="/cookies" className="hover:underline">
            Política de cookies
          </Link>
          <Link href="/afiliacion" className="hover:underline">
            Divulgación de afiliación
          </Link>
        </nav>
      </div>
    </footer>
  );
}
