import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Divulgación de afiliación | cholloweb.es",
  description: "Información de transparencia sobre el programa de afiliados de Amazon en cholloweb.es.",
  alternates: { canonical: "/afiliacion" },
};

export default function AfiliacionPage() {
  return (
    <LegalLayout title="Divulgación de afiliación" lastUpdated="Marzo 2026">
      <p>
        Esta página explica de forma transparente cómo funciona la relación de afiliación
        entre cholloweb.es y Amazon, tal y como exigen el Programa de Afiliados de Amazon
        y las normativas de protección al consumidor aplicables en España y la Unión Europea.
      </p>

      <h2>1. Participación en el Programa de Afiliados de Amazon</h2>
      <p>
        cholloweb.es participa en el Programa de Afiliados de Amazon en los siguientes
        países:
      </p>
      <ul>
        <li><strong>Amazon.es</strong> (España) — tag: <code>cholloweb0c-21</code></li>
        <li><strong>Amazon.it</strong> (Italia) — tag: <code>cholloweb03-21</code></li>
        <li><strong>Amazon.de</strong> (Alemania) — tag: <code>cholloweb07-21</code></li>
        <li><strong>Amazon.co.uk</strong> (Reino Unido) — tag: <code>cholloweb05-21</code></li>
        <li><strong>Amazon.fr</strong> (Francia) — tag: <code>cholloweb0b-21</code></li>
      </ul>
      <p>
        Como Afiliados de Amazon, en cholloweb.es obtenemos ingresos por las compras
        adscritas que cumplen los requisitos aplicables del programa. Esto significa que,
        si haces clic en uno de nuestros enlaces y realizas una compra en Amazon, podemos
        recibir una pequeña comisión <strong>sin coste adicional para ti</strong>.
      </p>

      <h2>2. Cómo identificar los enlaces de afiliado</h2>
      <p>
        Todos los botones "Ver en Amazon" y enlaces a productos de este sitio son enlaces
        de afiliado. Incluyen el parámetro <code>?tag=cholloweb0c-21</code> (u otro según
        el país) en la URL de Amazon.
      </p>

      <h2>3. Independencia editorial</h2>
      <p>
        La selección de productos publicados en cholloweb.es se realiza de forma
        independiente, atendiendo a criterios como:
      </p>
      <ul>
        <li>Relevancia para la comunidad gamer y tecnológica.</li>
        <li>Calidad de la oferta: descuento, precio histórico y disponibilidad.</li>
        <li>Estado del producto: nuevo, reacondicionado o segunda mano.</li>
      </ul>
      <p>
        Amazon no influye en la selección, el orden de aparición ni el contenido editorial
        de este sitio. Nuestra principal motivación es ofrecer información útil al usuario.
      </p>

      <h2>4. Precios y disponibilidad</h2>
      <p>
        Los precios y la disponibilidad de los productos pueden cambiar en Amazon en
        cualquier momento. La información mostrada en cholloweb.es puede no estar
        actualizada al instante. Recomendamos siempre verificar el precio final directamente
        en Amazon antes de realizar la compra.
      </p>

      <h2>5. Contacto</h2>
      <p>
        Si tienes cualquier duda sobre nuestra política de afiliación, puedes contactarnos
        en <a href="mailto:contacto@cholloweb.es">contacto@cholloweb.es</a>.
      </p>
    </LegalLayout>
  );
}
