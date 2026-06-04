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
      className={`flex flex-col overflow-hidden rounded-xl border bg-surface-card transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,127,255,0.15)] ${
        unavailable ? "border-zinc-850 opacity-60" : "border-zinc-800 hover:border-zinc-700"
      }`}
    >
      {/* Imagen → página de producto interna */}
      <Link href={productPageUrl} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            category={product.category}
            asin={product.id}
          />

          {unavailable && (
            <span className="absolute left-0 right-0 top-0 bg-black/80 py-1 text-center text-xs font-semibold text-zinc-400">
              No disponible
            </span>
          )}

          {product.badge && !unavailable && (
            <span className="absolute left-3 top-3 rounded bg-red-650 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
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
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
          {product.platformLabel} · {product.condition}
        </p>

        {/* Título → página de producto interna */}
        <Link href={productPageUrl} className="block flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white hover:text-primary transition duration-150">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          {unavailable ? (
            <span className="text-sm font-semibold text-zinc-500">
              No disponible
            </span>
          ) : (
            <>
              <span className="text-lg font-bold tabular-nums text-white">
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
          className={`mt-4 flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-bold transition duration-150 active:scale-95 ${
            unavailable
              ? "pointer-events-none bg-zinc-900 text-zinc-650"
              : "bg-[#FF9900] text-zinc-900 hover:bg-[#e08800]"
          }`}
        >
          {unavailable ? "Ver en Amazon →" : "Ver en Amazon →"}
        </a>
      </div>
    </article>
  );
}
