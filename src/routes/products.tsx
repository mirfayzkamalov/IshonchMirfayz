import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductBrowser } from "@/components/shop/ProductBrowser";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined } => ({ q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Barcha mahsulotlar — MirfayzIshonch" },
      { name: "description", content: "Smartfonlar, televizorlar, noutbuklar va maishiy texnika katalogi: saralash va filtrlar bilan." },
      { property: "og:title", content: "Barcha mahsulotlar — MirfayzIshonch" },
      { property: "og:description", content: "To'liq elektronika katalogi." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q } = Route.useSearch();
  const { products, t } = useStore();
  const nav = useNavigate();
  return <ProductBrowser title={q ? t("search").replace("?", "") : t("allProducts")} base={products} query={q} onQuery={(s) => nav({ to: "/products", search: { q: s } })} />;
}
