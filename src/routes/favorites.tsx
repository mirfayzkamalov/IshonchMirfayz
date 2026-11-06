import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Sevimlilar — MirfayzIshonch" },
      { name: "description", content: "Saqlangan sevimli mahsulotlaringiz." },
      { property: "og:title", content: "Sevimlilar — MirfayzIshonch" },
      { property: "og:description", content: "Sevimli mahsulotlar ro'yxati." },
    ],
  }),
  component: FavPage,
});

function FavPage() {
  const { favorites, products, t, addToCart } = useStore();
  const list = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl">{t("favorites")}</h1>
        {list.length > 0 && (
          <button type="button" onClick={() => list.forEach((p) => p.stock > 0 && addToCart(p.id))} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {t("addCart")} ({list.length})
          </button>
        )}
      </div>
      {list.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => <div key={p.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}><ProductCard p={p} /></div>)}
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-14 text-center animate-rise">
          <Heart className="mx-auto h-12 w-12 text-primary animate-float" />
          <h2 className="mt-4 text-lg font-bold">{t("emptyFav")}</h2>
          <Link to="/products" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{t("continue")}</Link>
        </div>
      )}
    </div>
  );
}
