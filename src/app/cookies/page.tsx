export const metadata = {
  title: "Política de cookies | cholloweb.es",
  description: "Información sobre el uso de cookies en cholloweb.es.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 sm:p-8">
        <h1 className="text-2xl font-bold text-zinc-900">Política de cookies</h1>
        <p className="mt-4">
          cholloweb.es puede utilizar cookies técnicas necesarias para el
          funcionamiento del sitio y, en su caso, cookies analíticas para conocer el
          rendimiento de la web.
        </p>
        <p className="mt-3">
          Si se incorporan herramientas de terceros que utilicen cookies adicionales,
          se mostrará la información y mecanismos de gestión correspondientes.
        </p>
        <p className="mt-3">
          Puedes gestionar o bloquear cookies desde la configuración de tu navegador.
        </p>
      </article>
    </main>
  );
}
