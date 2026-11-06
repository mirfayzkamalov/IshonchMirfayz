import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard, ProductImage } from "@/components/shop/ProductCard";
import { discount, fmt } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Mahsulot — MirfayzIshonch" },
      { name: "description", content: "Mahsulot tafsilotlari, narxi, muddatli to'lov va xususiyatlari." },
      { property: "og:title", content: "Mahsulot — MirfayzIshonch" },
      { property: "og:description", content: "Mahsulot tafsilotlari va narxi." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { getProduct, products, t, addToCart, toggleFav, favorites, ready, categories, lang } = useStore();
  const [qty, setQty] = useState(1);
  const p = getProduct(id);

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        {ready ? (
          <>
            <h1 className="text-2xl font-bold">{t("noResults")}</h1>
            <Link to="/products" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{t("continue")}</Link>
          </>
        ) : (
          <div className="mx-auto h-96 animate-pulse rounded-3xl bg-muted" />
        )}
      </div>
    );
  }

  const d = discount(p);
  const fav = favorites.includes(p.id);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const cat = categories.find((c) => c.slug === p.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">MirfayzIshonch</Link> /{" "}
        {cat && <Link to="/category/$category" params={{ category: cat.slug }} className="hover:text-primary">{lang === "uz" ? cat.uz : cat.ru}</Link>}
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative animate-rise overflow-hidden rounded-[2rem] border bg-card shadow-soft">
          <ProductImage src={p.image} alt={p.name} className="aspect-square w-full animate-float" />
          {d > 0 && <span className="absolute left-5 top-5 rounded-full bg-sale px-3 py-1.5 text-sm font-bold text-sale-foreground">-{d}%</span>}
        </div>
        <div className="animate-rise [animation-delay:150ms]">
          <div className="text-sm font-bold uppercase tracking-widest text-primary">{p.brand}</div>
          <h1 className="mt-2 text-2xl font-bold md:text-4xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-sale text-sale" /> {p.rating} · {p.reviews} (demo)
            <span className={cn("ml-3 rounded-full px-2 py-0.5 text-xs font-semibold", p.stock > 0 ? "bg-olive-light text-primary-dark" : "bg-destructive/10 text-destructive")}>
              {p.stock > 0 ? `${t("inStock")}: ${p.stock}` : t("outStock")}
            </span>
          </div>
          <div className="mt-6 rounded-3xl border bg-card p-6 shadow-soft">
            {d > 0 && <div className="text-muted-foreground line-through">{fmt(p.oldPrice)}</div>}
            <div className="text-3xl font-extrabold text-primary-dark md:text-4xl">{fmt(p.price)}</div>
            <div className="mt-3 rounded-2xl bg-olive-light p-3 text-sm font-semibold text-primary-dark">
              {t("install")}: {fmt(p.monthly)} {t("perMonth")} × 12
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border" aria-label={t("qty")}>
                <button type="button" aria-label="-" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button type="button" aria-label="+" onClick={() => setQty((q) => Math.min(p.stock || 1, q + 1))} className="grid h-11 w-11 place-items-center"><Plus className="h-4 w-4" /></button>
              </div>
              <button type="button" disabled={p.stock <= 0} onClick={() => { addToCart(p.id, qty); toast.success(t("added"), { description: `${p.name} × ${qty}` }); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-primary-dark active:scale-95 disabled:opacity-50">
                <ShoppingBag className="h-5 w-5" /> {t("addCart")}
              </button>
              <button type="button" aria-label={t("favorites")} onClick={() => toggleFav(p.id)} className="grid h-12 w-12 place-items-center rounded-xl border transition hover:bg-muted">
                <Heart className={cn("h-5 w-5", fav && "fill-sale text-sale")} />
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-2xl border p-4"><Truck className="h-5 w-5 shrink-0 text-primary" /><div><div className="font-semibold">{t("delivery")}</div><div className="text-sm text-muted-foreground">{t("deliveryText")}</div></div></div>
            <div className="flex gap-3 rounded-2xl border p-4"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /><div><div className="font-semibold">{t("warranty")}</div><div className="text-sm text-muted-foreground">{t("warrantyText")}</div></div></div>
          </div>
          <h2 className="mt-8 text-lg font-bold">{t("desc")}</h2>
          <p className="mt-2 text-muted-foreground">{p.description}</p>
          <h2 className="mt-8 text-lg font-bold">{t("specs")}</h2>
          <dl className="mt-3 divide-y rounded-2xl border bg-card">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">{t("related")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
