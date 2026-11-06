import { seedCategories, seedProducts, type Category, type Product } from "./data";
import { legacyProducts } from "./legacy-catalog";

export const CATALOG_VERSION = 2;

/** Upgrade once; subsequent admin deletions and edits remain authoritative. */
export function upgradeCatalog(products: Product[], categories: Category[], version = 0) {
  if (version >= CATALOG_VERSION) return { products, categories };
  const retained = products.flatMap((product) => {
    const legacy = legacyProducts.find((p) => p.id === product.id);
    if (!legacy) return [product];
    const unchanged = Object.entries(legacy).every(([key, value]) =>
      key === "image" || JSON.stringify(product[key as keyof Product]) === JSON.stringify(value),
    );
    const legacyImage = legacy.image.split("/").at(-1)?.replace(".jpg", "") ?? "";
    const oldPhoto = product.image.includes(`/assets/${legacyImage}`) || product.image === legacy.image;
    // Never carry the old, model-inaccurate photo into an edited product.
    if (unchanged && oldPhoto) return [];
    return [{ ...product, image: oldPhoto ? "" : product.image }];
  });
  const ids = new Set(retained.map((p) => p.id));
  const mergedProducts = [...retained, ...seedProducts.filter((p) => !ids.has(p.id))];
  const mergedCategories = categories.map((c) => {
    const seed = seedCategories.find((s) => s.slug === c.slug);
    const legacyPhoto = /\/assets\/(iphone17|tv|washer|fridge|ac|soundbar|laptop|headphones)[.-]/.test(c.image);
    return seed && legacyPhoto ? { ...c, image: seed.image } : c;
  });
  const slugs = new Set(mergedCategories.map((c) => c.slug));
  return { products: mergedProducts, categories: [...mergedCategories, ...seedCategories.filter((c) => !slugs.has(c.slug))] };
}