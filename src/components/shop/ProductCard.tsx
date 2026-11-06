import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { discount, fmt, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err || !src)
    return <div role="img" aria-label={alt} className={cn("flex items-center justify-center bg-muted text-muted-foreground text-sm p-4 text-center", className)}>{alt}</div>;
  return <img src={src} alt={alt} loading="lazy" width={816} height={816} onError={() => setErr(true)} className={cn("object-contain", className)} />;
}

export function ProductCard({ p, compact }: { p: Product; compact?: boolean }) {
  const { t, addToCart, toggleFav, favorites } = useStore();
  const d = discount(p);
  const fav = favorites.includes(p.id);
  const [popped, setPopped] = useState(false);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift",
        compact ? "w-60 shrink-0" : "w-full",
      )}
    >
      <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-square overflow-hidden bg-muted">
        <ProductImage src={p.image} alt={p.name} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {d > 0 && <span className="rounded-full bg-sale px-2.5 py-1 text-xs font-bold text-sale-foreground">-{d}%</span>}
          {p.hot && <span className="rounded-full bg-primary-dark px-2.5 py-1 text-xs font-semibold text-primary-foreground">HOT</span>}
        </div>
      </Link>
      <button
        type="button"
        aria-label={t("favorites")}
        onClick={() => {
          toggleFav(p.id);
          setPopped(true);
          setTimeout(() => setPopped(false), 400);
        }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur transition hover:scale-110"
      >
        <Heart className={cn("h-4 w-4", fav ? "fill-sale text-sale" : "text-primary-dark", popped && "animate-pop")} />
      </button>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{p.brand}</span>
        <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug hover:text-primary">
          {p.name}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-sale text-sale" /> {p.rating} · {p.reviews} <span className="opacity-60">(demo)</span>
        </div>
        <div className="mt-auto pt-2">
          {d > 0 && <div className="text-xs text-muted-foreground line-through">{fmt(p.oldPrice)}</div>}
          <div className="text-lg font-extrabold text-primary-dark">{fmt(p.price)}</div>
          <div className="mt-1 inline-block rounded-lg bg-olive-light px-2 py-0.5 text-xs font-semibold text-primary-dark">
            {fmt(p.monthly)} {t("perMonth")}
          </div>
        </div>
        <button
          type="button"
          disabled={p.stock <= 0}
          onClick={() => {
            addToCart(p.id);
            toast.success(t("added"), { description: p.name });
          }}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark active:scale-95 disabled:opacity-50"
        >
          <ShoppingBag className="h-4 w-4" /> {p.stock > 0 ? t("addCart") : t("outStock")}
        </button>
      </div>
    </article>
  );
}
