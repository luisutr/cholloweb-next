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
  const affiliateUrl = withAffiliateTag(product.amazonUrl);
  const discount = getDiscountPercentage(product);

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <a href={affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer">
        <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            category={product.category}
            asin={product.id}
          />
          {product.badge ? (
            <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="space-y-3 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
            {product.platformLabel} · {product.condition}
          </p>
          <h3 className="line-clamp-2 text-base font-semibold text-zinc-900">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-zinc-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice ? (
              <span className="text-sm text-zinc-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
          </div>
          {discount > 0 ? (
            <p className="text-xs font-medium text-emerald-700">
              Ahorro aproximado del {discount}%
            </p>
          ) : null}
          <span className="inline-flex rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-700">
            Ver en Amazon
          </span>
        </div>
      </a>
    </article>
  );
}
