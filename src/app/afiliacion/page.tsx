export const metadata = {
  title: "Divulgación de afiliación | cholloweb.es",
  description: "Información de transparencia sobre enlaces de afiliado en cholloweb.es.",
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 sm:p-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          Divulgación de afiliación
        </h1>
        <p className="mt-4">
          Algunos enlaces publicados en cholloweb.es son enlaces de afiliado. Si
          compras a través de ellos, el sitio puede recibir una comisión sin coste
          adicional para el usuario.
        </p>
        <p className="mt-3">
          Como Afiliados de Amazon, obtenemos ingresos por compras adscritas que
          cumplen los requisitos aplicables.
        </p>
        <p className="mt-3">
          Nuestro objetivo editorial es priorizar productos relevantes para el
          usuario, con foco en descuentos, estado del producto y relación
          calidad-precio.
        </p>
      </article>
    </main>
  );
}
