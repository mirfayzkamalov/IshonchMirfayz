import { describe, expect, it } from "vitest";
import { seedCategories, seedProducts } from "@/lib/data";
import provenance from "@/lib/catalog-provenance.json";
import { CATALOG_VERSION, upgradeCatalog } from "@/lib/catalog-upgrade";
import { legacyProducts } from "@/lib/legacy-catalog";

describe("Catalog requirements", () => {
  for (const category of seedCategories) {
    it(`${category.slug} contains at least 20 products`, () => {
      expect(seedProducts.filter((p) => p.category === category.slug).length).toBeGreaterThanOrEqual(20);
    });
  }

  it("uses each product's own sourced photograph, never another model's", () => {
    expect(new Set(provenance.map((p) => p.sha256)).size).toBe(seedProducts.length);
    expect(new Set(seedProducts.map((p) => p.image)).size).toBe(seedProducts.length);
    for (const product of seedProducts) {
      const source = provenance.find((p) => p.id === product.id);
      expect(source?.name).toBe(product.name);
      expect(source?.category).toBe(product.category);
      expect(source?.sourceUrl).toContain(`/detail/${product.id.replace("texnomart-", "")}/`);
      expect(product.image).toMatch(/^https:\/\/mini-io-api\.texnomart\.uz\//);
    }
  });

  it("upgrades legacy demos while preserving admin-edited records", () => {
    const first = legacyProducts[0];
    if (!first) throw new Error("Legacy fixture missing");
    const edited = { ...first, name: "Admin model", price: 1234567, image: "https://shop.example/my-model.jpg" };
    const upgraded = upgradeCatalog([edited, ...legacyProducts.slice(1)], seedCategories);
    expect(upgraded.products.find((p) => p.id === edited.id)).toEqual(edited);
    expect(upgraded.products.length).toBe(161);
  });

  it("does not re-add products an admin deleted after the upgrade", () => {
    const remaining = seedProducts.slice(1);
    expect(upgradeCatalog(remaining, seedCategories, CATALOG_VERSION).products).toEqual(remaining);
  });
});