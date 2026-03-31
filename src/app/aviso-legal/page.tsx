import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Aviso legal | cholloweb.es",
  description: "Aviso legal e información del titular del sitio web cholloweb.es.",
  alternates: { canonical: "/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <LegalLayout title="Aviso legal" lastUpdated="Marzo 2026">
      <h2>1. Datos identificativos del titular</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
        Sociedad de la Información y de Comercio Electrónico (LSSICE), se informa de los datos
        identificativos del titular de este sitio web:
      </p>
      <ul>
        <li><strong>Titular:</strong> Luis Utrilla</li>
        <li><strong>Dominio:</strong> cholloweb.es</li>
        <li><strong>Correo de contacto:</strong> contacto@cholloweb.es</li>
        <li><strong>País:</strong> España</li>
      </ul>

      <h2>2. Objeto del sitio web</h2>
      <p>
        cholloweb.es es un sitio web de contenido informativo y comercial especializado en
        videojuegos, consolas, accesorios y productos tecnológicos con ofertas y descuentos.
        Los productos mostrados son vendidos por Amazon y sus marketplaces asociados. Este
        sitio participa en el Programa de Afiliados de Amazon.
      </p>

      <h2>3. Propiedad intelectual e industrial</h2>
      <p>
        El código fuente, diseño, logotipos, textos y demás contenidos propios de cholloweb.es
        son propiedad del titular o están bajo licencias que lo permiten. Queda prohibida su
        reproducción total o parcial sin autorización expresa.
      </p>
      <p>
        Las marcas, nombres comerciales e imágenes de productos de terceros (PlayStation,
        Xbox, Nintendo, Amazon, etc.) pertenecen a sus respectivos propietarios y se utilizan
        únicamente con fines informativos.
      </p>

      <h2>4. Exclusión de responsabilidad</h2>
      <p>
        cholloweb.es no se responsabiliza de los precios, disponibilidad o características
        de los productos mostrados, ya que éstos son suministrados por Amazon y pueden
        cambiar en cualquier momento. Te recomendamos verificar siempre la información
        directamente en Amazon antes de realizar cualquier compra.
      </p>
      <p>
        Los enlaces de afiliado dirigen al usuario al sitio de Amazon. No nos hacemos
        responsables del contenido, seguridad o condiciones de venta de dicho sitio.
      </p>

      <h2>5. Modificaciones</h2>
      <p>
        El titular se reserva el derecho de actualizar, modificar o eliminar la información
        contenida en este aviso legal, así como su diseño y configuración, sin previo aviso.
      </p>

      <h2>6. Ley aplicable y jurisdicción</h2>
      <p>
        El presente aviso legal se rige por la normativa española vigente. Para la resolución
        de controversias, las partes se someten a los juzgados y tribunales de España, salvo
        que la normativa aplicable establezca otro fuero.
      </p>
    </LegalLayout>
  );
}
