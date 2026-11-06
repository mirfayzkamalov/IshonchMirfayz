import { createFileRoute } from "@tanstack/react-router";
import { Crown, Gift, Percent, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/shop/Reveal";
import { fmt } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "MirfayzIshonch Pro — a'zolik imtiyozlari" },
      { name: "description", content: "Pro a'zolik: maxsus chegirmalar, ustuvor yetkazib berish va eksklyuziv takliflar (demo)." },
      { property: "og:title", content: "MirfayzIshonch Pro" },
      { property: "og:description", content: "Pro a'zolik imtiyozlari." },
    ],
  }),
  component: Pro,
});

const PLANS = [
  { id: "month", uz: "Oylik", ru: "Месяц", price: 49000 },
  { id: "year", uz: "Yillik", ru: "Год", price: 399000, best: true },
  { id: "family", uz: "Oilaviy", ru: "Семейный", price: 599000 },
];

function Pro() {
  const { lang, t, products, user, setUser, setMembers, cart } = useStore();
  const [sel, setSel] = useState("year");
  const uz = lang === "uz";
  const perks = [
    { i: Percent, uz: "Qo'shimcha 5% chegirma", ru: "Доп. скидка 5%" },
    { i: Truck, uz: "Ustuvor yetkazish (taklif)", ru: "Приоритетная доставка" },
    { i: Gift, uz: "Eksklyuziv sovg'alar", ru: "Эксклюзивные подарки" },
    { i: Zap, uz: "Aksiyalarga erta kirish", ru: "Ранний доступ к акциям" },
  ];
  const join = () => {
    const plan = PLANS.find((p) => p.id === sel)!;
    if (user) setUser({ ...user, pro: plan.id });
    setMembers((m) => [{ email: user?.email || "mehmon", plan: plan.id, at: Date.now() }, ...m]);
    toast.success(uz ? `Demo: ${plan.uz} reja tanlandi` : `Демо: выбран план ${plan.ru}`, { description: uz ? "Hech qanday to'lov olinmadi." : "Оплата не списана." });
    void cart;
  };
  return (
    <>
      <section className="relative overflow-hidden bg-pro py-24 text-primary-foreground">
        <div className="absolute -left-20 top-0 h-80 w-80 animate-blob bg-sale/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 animate-blob bg-primary/50 blur-3xl [animation-delay:-5s]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <Crown className="mx-auto h-14 w-14 animate-float text-sale" />
          <h1 className="mt-4 animate-rise text-4xl font-extrabold md:text-6xl">MirfayzIshonch <span className="text-shimmer">Pro</span></h1>
          <p className="mx-auto mt-4 max-w-xl animate-rise opacity-85 [animation-delay:150ms]">{uz ? "Har bir xariddan ko'proq foyda oling." : "Получайте больше от каждой покупки."}</p>
          <span className="mt-4 inline-block rounded-full bg-primary-foreground/15 px-3 py-1 text-xs">DEMO</span>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map((p, i) => (
          <Reveal key={p.uz} delay={i * 90} className="rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
            <p.i className="h-8 w-8 text-primary" />
            <div className="mt-3 font-bold">{uz ? p.uz : p.ru}</div>
          </Reveal>
        ))}
      </div>
      <div className="mx-auto grid max-w-5xl gap-5 px-4 md:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.id} delay={i * 100}>
            <button type="button" onClick={() => setSel(p.id)} className={cn("relative w-full rounded-3xl border-2 bg-card p-7 text-left transition hover:-translate-y-1", sel === p.id ? "border-primary shadow-lift" : "border-border")}>
              {p.best && <span className="absolute -top-3 right-5 rounded-full bg-sale px-3 py-1 text-xs font-bold text-sale-foreground">TOP</span>}
              <div className="font-bold text-primary">{uz ? p.uz : p.ru}</div>
              <div className="mt-2 text-2xl font-extrabold">{fmt(p.price)}</div>
            </button>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button type="button" onClick={join} className="rounded-2xl bg-pro px-10 py-4 font-bold text-primary-foreground shadow-lift transition hover:scale-105 active:scale-95">👑 {t("becomePro")}</button>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-bold">{uz ? "A'zolar uchun takliflar" : "Предложения для членов"}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{products.filter((p) => p.featured).slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </>
  );
}
