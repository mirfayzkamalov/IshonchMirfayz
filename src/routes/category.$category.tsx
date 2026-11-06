import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductBrowser } from "@/components/shop/ProductBrowser";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/category/$category")({
  head: ({ params }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: `${params.category} — MirfayzIshonch` },
      { name: "description", content: `MirfayzIshonch do'konida ${params.category} kategoriyasidagi mahsulotlar.` },
      { property: "og:title", content: `${params.category} — MirfayzIshonch` },
      { property: "og:description", content: "Kategoriya bo'yicha mahsulotlar." },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { products, categories, lang } = useStore();
  const nav = useNavigate();
  const c = categories.find((x) => x.slug === category);
  return (
    <ProductBrowser
      key={category}
      title={c ? (lang === "uz" ? c.uz : c.ru) : category}
      base={products.filter((p) => p.category === category)}
      fixedCategory={category}
      onQuery={(s) => nav({ to: "/products", search: { q: s } })}
    />
  );
}
