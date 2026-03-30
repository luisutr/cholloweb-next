export const metadata = {
  title: "Política de privacidad | cholloweb.es",
  description: "Política de privacidad y tratamiento de datos en cholloweb.es.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 sm:p-8">
        <h1 className="text-2xl font-bold text-zinc-900">Política de privacidad</h1>
        <p className="mt-4">
          En cholloweb.es respetamos tu privacidad. Este sitio no solicita registro
          de usuarios en esta fase inicial y minimiza la recogida de datos
          personales.
        </p>
        <p className="mt-3">
          Los datos técnicos esenciales (por ejemplo, logs del servidor o métricas de
          uso) pueden tratarse para seguridad, funcionamiento y mejora del servicio.
        </p>
        <p className="mt-3">
          Si en el futuro se incorporan formularios o newsletters, esta política se
          actualizará con la base legal, finalidad, conservación y derechos de los
          usuarios.
        </p>
      </article>
    </main>
  );
}
