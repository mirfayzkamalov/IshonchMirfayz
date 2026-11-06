import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductBrowser } from "@/components/shop/ProductBrowser";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Qaynoq chegirmalar — MirfayzIshonch" },
      { name: "description", content: "Eng katta chegirmalar: smartfonlar, televizorlar va maishiy texnika." },
      { property: "og:title", content: "Qaynoq chegirmalar — MirfayzIshonch" },
      { property: "og:description", content: "Haftaning eng yaxshi takliflari." },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const { products, t } = useStore();
  const nav = useNavigate();
  return <ProductBrowser title={"🔥 " + t("hot")} base={products.filter((p) => p.hot)} onQuery={(s) => nav({ to: "/products", search: { q: s } })} />;
}
