import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Política de privacidad | cholloweb.es",
  description: "Política de privacidad y protección de datos personales de cholloweb.es, conforme al RGPD.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de privacidad" lastUpdated="Marzo 2026">
      <p>
        En cholloweb.es respetamos y protegemos la privacidad de todos los usuarios. Esta
        política describe cómo tratamos los datos personales en conformidad con el Reglamento
        (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales
        (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Titular:</strong> Luis Utrilla</li>
        <li><strong>Sitio web:</strong> cholloweb.es</li>
        <li><strong>Contacto:</strong> contacto@cholloweb.es</li>
      </ul>

      <h2>2. Datos que recopilamos</h2>
      <p>
        cholloweb.es <strong>no solicita registro de usuarios</strong> ni recopila datos
        personales a través de formularios en esta fase. Los únicos datos tratados son:
      </p>
      <ul>
        <li>
          <strong>Datos técnicos del servidor:</strong> dirección IP, tipo de navegador,
          página solicitada y marca de tiempo. Se tratan de forma agregada y anónima para
          garantizar el correcto funcionamiento y seguridad del sitio. Se conservan el
          tiempo mínimo necesario según los logs del servidor.
        </li>
        <li>
          <strong>Cookies:</strong> se utilizan cookies técnicas necesarias para el
          funcionamiento del sitio. Consulta nuestra{" "}
          <a href="/cookies">Política de cookies</a> para más detalle.
        </li>
      </ul>

      <h2>3. Finalidades y bases legales</h2>
      <ul>
        <li>
          <strong>Funcionamiento técnico del sitio</strong> — base legal: interés legítimo
          (art. 6.1.f RGPD).
        </li>
        <li>
          <strong>Seguridad y prevención de fraude</strong> — base legal: interés legítimo
          (art. 6.1.f RGPD).
        </li>
      </ul>

      <h2>4. Destinatarios y transferencias internacionales</h2>
      <p>
        Los datos técnicos son tratados por los proveedores de infraestructura de este sitio:
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (alojamiento web) — puede implicar transferencia a
          Estados Unidos bajo el marco EU-US Data Privacy Framework.
        </li>
        <li>
          <strong>Amazon Associates</strong> — cuando el usuario hace clic en un enlace de
          afiliado y accede a Amazon, Amazon aplica su propia política de privacidad.
          cholloweb.es no transmite datos personales a Amazon.
        </li>
      </ul>

      <h2>5. Derechos de los interesados</h2>
      <p>
        En virtud del RGPD, puedes ejercer los siguientes derechos dirigiéndote a
        contacto@cholloweb.es:
      </p>
      <ul>
        <li><strong>Acceso:</strong> conocer qué datos se tratan sobre ti.</li>
        <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
        <li><strong>Supresión:</strong> solicitar el borrado de tus datos.</li>
        <li><strong>Limitación:</strong> restringir el tratamiento en determinados casos.</li>
        <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.</li>
        <li>
          <strong>Portabilidad:</strong> recibir tus datos en formato estructurado (cuando
          aplique).
        </li>
      </ul>
      <p>
        Si consideras que el tratamiento de tus datos no es adecuado, tienes derecho a
        presentar una reclamación ante la{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Agencia Española de Protección de Datos (AEPD)
        </a>.
      </p>

      <h2>6. Cambios en esta política</h2>
      <p>
        Esta política puede actualizarse para adaptarse a cambios legales o técnicos.
        La fecha de última actualización se indica al inicio de este documento.
      </p>
    </LegalLayout>
  );
}
