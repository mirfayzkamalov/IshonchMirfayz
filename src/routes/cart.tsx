import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/shop/ProductCard";
import { fmt } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Savat — MirfayzIshonch" },
      { name: "description", content: "Savatingizdagi mahsulotlar va jami summa." },
      { property: "og:title", content: "Savat — MirfayzIshonch" },
      { property: "og:description", content: "Savatdagi mahsulotlar." },
    ],
  }),
  component: CartPage,
});

export function useCartLines() {
  const { cart, getProduct } = useStore();
  const lines = Object.entries(cart).flatMap(([id, qty]) => {
    const p = getProduct(id);
    return p ? [{ p, qty }] : [];
  });
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const saved = lines.reduce((s, l) => s + Math.max(0, l.p.oldPrice - l.p.price) * l.qty, 0);
  return { lines, subtotal, saved };
}

function CartPage() {
  const { t, setQty, removeFromCart } = useStore();
  const { lines, subtotal, saved } = useCartLines();

  if (!lines.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center animate-rise">
        <ShoppingCart className="mx-auto h-14 w-14 animate-float text-primary" />
        <h1 className="mt-4 text-2xl font-bold">{t("emptyCart")}</h1>
        <Link to="/products" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{t("continue")}</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">{t("cart")}</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {lines.map(({ p, qty }, i) => (
            <li key={p.id} className="flex animate-rise items-center gap-4 rounded-3xl border bg-card p-3 shadow-soft" style={{ animationDelay: `${i * 60}ms` }}>
              <Link to="/product/$id" params={{ id: p.id }}><ProductImage src={p.image} alt={p.name} className="h-20 w-20 rounded-2xl md:h-24 md:w-24" /></Link>
              <div className="min-w-0 flex-1">
                <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 font-semibold hover:text-primary">{p.name}</Link>
                <div className="mt-1 font-bold text-primary-dark">{fmt(p.price)}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center rounded-xl border">
                    <button type="button" aria-label="-" onClick={() => setQty(p.id, qty - 1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-7 text-center text-sm font-bold">{qty}</span>
                    <button type="button" aria-label="+" onClick={() => setQty(p.id, Math.min(p.stock, qty + 1))} className="grid h-8 w-8 place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button type="button" aria-label="Remove" onClick={() => removeFromCart(p.id)} className="grid h-8 w-8 place-items-center rounded-xl text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="hidden text-right font-extrabold sm:block">{fmt(p.price * qty)}</div>
            </li>
          ))}
        </ul>
        <aside className="h-fit space-y-3 rounded-3xl border bg-card p-6 shadow-soft lg:sticky lg:top-40">
          <div className="flex justify-between text-sm"><span>{t("subtotal")}</span><span className="font-semibold">{fmt(subtotal + saved)}</span></div>
          <div className="flex justify-between text-sm text-sale"><span>{t("saved")}</span><span className="font-semibold">-{fmt(saved)}</span></div>
          <div className="flex justify-between border-t pt-3 text-lg font-extrabold"><span>{t("total")}</span><span>{fmt(subtotal)}</span></div>
          <Link to="/checkout" className="block rounded-xl bg-primary py-3 text-center font-bold text-primary-foreground transition hover:bg-primary-dark">{t("checkout")}</Link>
          <Link to="/products" className="block rounded-xl border py-3 text-center text-sm font-semibold hover:bg-muted">{t("continue")}</Link>
        </aside>
      </div>
    </div>
  );
}
