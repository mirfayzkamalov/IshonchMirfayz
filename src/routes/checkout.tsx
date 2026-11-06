import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { fmt } from "@/lib/data";
import { useStore, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useCartLines } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Rasmiylashtirish — MirfayzIshonch" },
      { name: "description", content: "Buyurtmani rasmiylashtirish: yetkazib berish va to'lov usuli." },
      { property: "og:title", content: "Rasmiylashtirish — MirfayzIshonch" },
      { property: "og:description", content: "Buyurtmani rasmiylashtirish." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { t, settings, addOrder, clearCart, user, lang } = useStore();
  const { lines, subtotal } = useCartLines();
  const [pay, setPay] = useState<Order["payment"]>("cash");
  const [months, setMonths] = useState(12);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.addresses[0] || "" });
  const [done, setDone] = useState<Order | null>(null);
  const delivery = subtotal >= settings.freeDeliveryFrom ? 0 : settings.deliveryFee;
  const total = subtotal + delivery;
  const input = "h-11 w-full rounded-xl border bg-card px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";

  if (done)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-rise">
        <CheckCircle2 className="mx-auto h-16 w-16 animate-pop text-primary" />
        <h1 className="mt-4 text-3xl font-bold">{t("orderDone")}</h1>
        <p className="mt-2 text-lg font-bold text-primary">№ {done.id}</p>
        <p className="mt-2 font-semibold">{t("total")}: {fmt(done.total)}</p>
        <p className="mt-4 rounded-2xl bg-olive-light p-3 text-sm text-primary-dark">{t("demoNote")}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/orders" className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{t("orders")}</Link>
          <Link to="/" className="rounded-xl border px-5 py-3 font-semibold">{t("continue")}</Link>
        </div>
      </div>
    );

  if (!lines.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">{t("emptyCart")}</h1>
        <Link to="/products" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{t("continue")}</Link>
      </div>
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const o: Order = {
      id: "MI-" + Date.now().toString().slice(-7),
      createdAt: Date.now(),
      ...form,
      payment: pay,
      months: pay === "install" ? months : undefined,
      items: lines.map(({ p, qty }) => ({ id: p.id, name: p.name, price: p.price, qty, image: p.image })),
      delivery,
      total,
      status: "Yangi",
    };
    addOrder(o);
    clearCart();
    setDone(o);
  };

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6 animate-rise">
        <h1 className="text-2xl font-bold md:text-3xl">{t("checkout")}</h1>
        <section className="grid gap-3 rounded-3xl border bg-card p-6 shadow-soft">
          <input required placeholder={t("fullName")} aria-label={t("fullName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
          <input required type="tel" placeholder="+998 __ ___ __ __" aria-label={t("phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
          <textarea required placeholder={t("address")} aria-label={t("address")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={cn(input, "h-24 py-2")} />
        </section>
        <section className="rounded-3xl border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-bold">{t("payment")}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {(["cash", "install", "online"] as const).map((k) => (
              <button key={k} type="button" onClick={() => setPay(k)} className={cn("rounded-2xl border-2 p-4 text-left font-semibold transition", pay === k ? "border-primary bg-olive-light" : "hover:border-primary/50")}>
                {k === "cash" ? "💵" : k === "install" ? "📆" : "💳"} {t(k)}
              </button>
            ))}
          </div>
          {pay === "install" && (
            <div className="mt-4 rounded-2xl bg-olive-light p-4 animate-rise">
              <div className="flex flex-wrap gap-2">
                {[3, 6, 12, 24].map((m) => (
                  <button key={m} type="button" onClick={() => setMonths(m)} className={cn("rounded-xl px-4 py-2 text-sm font-bold", months === m ? "bg-primary text-primary-foreground" : "bg-card")}>{m} {lang === "uz" ? "oy" : "мес"}</button>
                ))}
              </div>
              <div className="mt-3 text-lg font-extrabold text-primary-dark">{fmt(total / months)} {t("perMonth")}</div>
            </div>
          )}
          {pay === "online" && (
            <div className="mt-4 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground animate-rise">
              💳 Payme / Click / Uzum — {lang === "uz" ? "faqat demo ko'rinish. Haqiqiy to'lov olinmaydi." : "только демо. Реальная оплата не списывается."}
            </div>
          )}
        </section>
      </div>
      <aside className="h-fit space-y-3 rounded-3xl border bg-card p-6 shadow-soft lg:sticky lg:top-40">
        {lines.map(({ p, qty }) => (
          <div key={p.id} className="flex justify-between gap-3 text-sm"><span className="line-clamp-1">{p.name} × {qty}</span><span className="shrink-0 font-semibold">{fmt(p.price * qty)}</span></div>
        ))}
        <div className="flex justify-between border-t pt-3 text-sm"><span>{t("delivery")}</span><span>{delivery ? fmt(delivery) : "0 so'm"}</span></div>
        <div className="flex justify-between text-lg font-extrabold"><span>{t("total")}</span><span>{fmt(total)}</span></div>
        <button type="submit" className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground transition hover:bg-primary-dark active:scale-95">{t("placeOrder")}</button>
        <p className="text-center text-xs text-muted-foreground">Demo</p>
      </aside>
    </form>
  );
}
