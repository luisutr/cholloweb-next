export const metadata = {
  title: "Aviso legal | cholloweb.es",
  description: "Información legal del sitio web cholloweb.es.",
};

export default function LegalNoticePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 sm:p-8">
        <h1 className="text-2xl font-bold text-zinc-900">Aviso legal</h1>
        <p className="mt-4">
          Este sitio web, cholloweb.es, tiene carácter informativo y comercial sobre
          productos de gaming y tecnología.
        </p>
        <p className="mt-3">
          El titular del sitio podrá actualizar en cualquier momento los contenidos,
          condiciones de uso y políticas para adaptarse a cambios legales o técnicos.
        </p>
        <p className="mt-3">
          Para comunicaciones legales, utiliza el correo de contacto publicado por el
          titular del dominio.
        </p>
      </article>
    </main>
  );
}
