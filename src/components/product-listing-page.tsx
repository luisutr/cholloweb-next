import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

type ProductListingPageProps = {
  title: string;
  description: string;
  products: Product[];
};

export function ProductListingPage({
  title,
  description,
  products,
}: ProductListingPageProps) {
  return (
    <div className="bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-3 text-zinc-600">{description}</p>
        </section>

        <section className="mt-8">
          {products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              Aún no hay productos en esta sección.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
