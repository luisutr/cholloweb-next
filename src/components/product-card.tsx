import Link from "next/link";
import type { Product } from "@/lib/products";
import { getDiscountPercentage, withAffiliateTag } from "@/lib/products";
import { ProductImage } from "@/components/product-image";

type ProductCardProps = {
  product: Product;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export function ProductCard({ product }: ProductCardProps) {
  const affiliateUrl  = withAffiliateTag(product.amazonUrl);
  const discount      = getDiscountPercentage(product);
  const unavailable   = product.price === 0;
  const productPageUrl = `/producto/${product.id}`;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
        unavailable ? "border-zinc-200 opacity-70" : "border-zinc-200"
      }`}
    >
      {/* Imagen → página de producto interna */}
      <Link href={productPageUrl} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            category={product.category}
            asin={product.id}
          />

          {unavailable && (
            <span className="absolute left-0 right-0 top-0 bg-zinc-800/75 py-1 text-center text-xs font-semibold text-zinc-300">
              No disponible
            </span>
          )}

          {product.badge && !unavailable && (
            <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          )}

          {discount > 0 && !unavailable && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
          {product.platformLabel} · {product.condition}
        </p>

        {/* Título → página de producto interna */}
        <Link href={productPageUrl} className="block flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 hover:text-blue-700">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          {unavailable ? (
            <span className="text-sm font-semibold text-zinc-400">
              No disponible
            </span>
          ) : (
            <>
              <span className="text-lg font-bold tabular-nums text-zinc-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price ? (
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              ) : null}
            </>
          )}
        </div>

        {/* Botón "Ver en Amazon" → link de afiliado directo */}
        <a
          href={affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className={`mt-auto flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold transition active:scale-95 ${
            unavailable
              ? "pointer-events-none bg-zinc-100 text-zinc-400"
              : "bg-[#FF9900] text-zinc-900 hover:bg-[#e08800]"
          }`}
        >
          {unavailable ? "Ver en Amazon →" : "Ver en Amazon →"}
        </a>
      </div>
    </article>
  );
}
