import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.join(__dirname, "..", "src", "data", "products.json");

function roundPrice(value) {
  return Math.round(value * 100) / 100;
}

function bumpProductPrice(product) {
  const randomDelta = (Math.random() * 0.07) - 0.04; // -4% .. +3%
  const nextPrice = roundPrice(product.price * (1 + randomDelta));
  const minPrice = 1;

  return {
    ...product,
    price: Math.max(minPrice, nextPrice),
  };
}

async function run() {
  const raw = await fs.readFile(catalogPath, "utf8");
  const catalog = JSON.parse(raw);
  const shouldSimulate = process.argv.includes("--simulate-prices");

  const nextCatalog = {
    ...catalog,
    updatedAt: new Date().toISOString(),
    products: shouldSimulate
      ? catalog.products.map((product) => bumpProductPrice(product))
      : catalog.products,
  };

  await fs.writeFile(catalogPath, `${JSON.stringify(nextCatalog, null, 2)}\n`, "utf8");

  console.log(
    `Catalog synced (${shouldSimulate ? "with simulated prices" : "metadata only"}) at ${nextCatalog.updatedAt}`,
  );
}

run().catch((error) => {
  console.error("Sync failed:", error);
  process.exitCode = 1;
});
