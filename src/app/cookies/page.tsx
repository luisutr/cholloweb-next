import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Política de cookies | cholloweb.es",
  description: "Información sobre el uso de cookies en cholloweb.es: tipos, finalidades y cómo gestionarlas.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de cookies" lastUpdated="Marzo 2026">
      <p>
        En cumplimiento del artículo 22.2 de la LSSI-CE y el Reglamento (UE) 2016/679
        (RGPD), informamos sobre el uso de cookies en cholloweb.es.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en el
        dispositivo del usuario al visitarlos. Permiten al sitio recordar acciones y
        preferencias durante un tiempo determinado.
      </p>

      <h2>2. Tipos de cookies que utilizamos</h2>

      <h3>2.1 Cookies técnicas (necesarias)</h3>
      <p>
        Son imprescindibles para el funcionamiento básico del sitio. Sin ellas, la web
        no puede funcionar correctamente. No requieren consentimiento del usuario.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-100 text-left text-zinc-700">
              <th className="border border-zinc-200 px-3 py-2">Cookie</th>
              <th className="border border-zinc-200 px-3 py-2">Proveedor</th>
              <th className="border border-zinc-200 px-3 py-2">Finalidad</th>
              <th className="border border-zinc-200 px-3 py-2">Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-zinc-200 px-3 py-2 font-mono">__vercel_*</td>
              <td className="border border-zinc-200 px-3 py-2">Vercel</td>
              <td className="border border-zinc-200 px-3 py-2">Enrutamiento y rendimiento del servidor</td>
              <td className="border border-zinc-200 px-3 py-2">Sesión</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.2 Cookies de terceros — Amazon</h3>
      <p>
        Cuando el usuario hace clic en un enlace de afiliado y accede a Amazon, Amazon
        puede establecer sus propias cookies para el seguimiento de la sesión de compra y
        la atribución de la comisión de afiliado. Estas cookies están sujetas a la{" "}
        <a href="https://www.amazon.es/gp/help/customer/display.html?nodeId=201890250"
           target="_blank" rel="noopener noreferrer">
          política de privacidad y cookies de Amazon
        </a>.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-100 text-left text-zinc-700">
              <th className="border border-zinc-200 px-3 py-2">Cookie</th>
              <th className="border border-zinc-200 px-3 py-2">Proveedor</th>
              <th className="border border-zinc-200 px-3 py-2">Finalidad</th>
              <th className="border border-zinc-200 px-3 py-2">Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-zinc-200 px-3 py-2 font-mono">session-id, ubid-*</td>
              <td className="border border-zinc-200 px-3 py-2">Amazon</td>
              <td className="border border-zinc-200 px-3 py-2">Sesión de compra y seguimiento de afiliado</td>
              <td className="border border-zinc-200 px-3 py-2">Hasta 1 año</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. ¿Cómo gestionar o desactivar las cookies?</h2>
      <p>
        Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies. Ten en
        cuenta que desactivar algunas cookies puede afectar al funcionamiento del sitio.
        Instrucciones por navegador:
      </p>
      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
            Google Chrome
          </a>
        </li>
        <li>
          <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
            Safari
          </a>
        </li>
        <li>
          <a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">
            Microsoft Edge
          </a>
        </li>
      </ul>

      <h2>4. Actualizaciones</h2>
      <p>
        Esta política puede actualizarse si se incorporan nuevas herramientas o servicios
        que utilicen cookies. Consulta la fecha de última actualización al inicio.
      </p>
    </LegalLayout>
  );
}
