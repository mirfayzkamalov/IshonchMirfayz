import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgePercent, CreditCard, ShieldCheck, Truck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { MarqueeRow } from "@/components/shop/MarqueeRow";
import { ProductImage } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/shop/Reveal";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "MirfayzIshonch — BOOOM! Barcha kerakli texnika shu yerda" },
      { name: "description", content: "iPhone, Samsung, televizorlar, sovutgichlar va konditsionerlar qulay narxlarda va muddatli to'lovga." },
      { property: "og:title", content: "MirfayzIshonch — elektronika do'koni" },
      { property: "og:description", content: "Sevimli texnikangizni qulay narxlarda xarid qiling." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, products, categories, lang } = useStore();
  const popular = [...products].sort((a, b) => b.reviews - a.reviews);
  const phones = products.filter((p) => p.category === "smartfonlar");
  const hot = products.filter((p) => p.hot);
  const fresh = [...products].sort((a, b) => b.createdAt - a.createdAt);
  const home = products.filter((p) => ["televizorlar", "kir-yuvish", "sovutgichlar", "konditsionerlar", "audio"].includes(p.category));

  return (
    <>
      <section className="relative overflow-hidden bg-hero">
        <img src={hero} alt="" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-luminosity md:mix-blend-normal" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/80 to-transparent" />
        <div className="absolute -left-24 -top-24 h-96 w-96 animate-blob bg-primary/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur">
              <BadgePercent className="h-4 w-4" /> {lang === "uz" ? "25% gacha chegirmalar" : "Скидки до 25%"}
            </span>
            <h1 className="mt-5 animate-rise text-4xl font-extrabold leading-[1.05] text-primary-foreground [animation-delay:120ms] md:text-6xl">
              <span className="text-shimmer">BOOOM!</span> {t("heroTitle").replace(/^(BOOOM!|БУМ!)\s*/, "")}
            </h1>
            <p className="mt-5 max-w-xl animate-rise text-base text-primary-foreground/85 [animation-delay:240ms] md:text-lg">{t("heroSub")}</p>
            <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
              <Link to="/products" className="group inline-flex items-center gap-2 rounded-2xl bg-primary-foreground px-6 py-3.5 font-bold text-primary-dark shadow-lift transition hover:-translate-y-0.5">
                {t("shop")} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/deals" className="inline-flex items-center gap-2 rounded-2xl bg-sale px-6 py-3.5 font-bold text-sale-foreground shadow-lift transition hover:-translate-y-0.5">
                🔥 {t("seeDeals")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-8 grid max-w-7xl grid-cols-2 gap-3 px-4 md:grid-cols-4">
        {[
          { i: Truck, uz: "Tez yetkazish", ru: "Быстрая доставка" },
          { i: CreditCard, uz: "Muddatli to'lov", ru: "Рассрочка" },
          { i: ShieldCheck, uz: "Rasmiy kafolat", ru: "Гарантия" },
          { i: BadgePercent, uz: "Haftalik aksiyalar", ru: "Акции" },
        ].map((f, i) => (
          <Reveal key={f.uz} delay={i * 80} className="relative flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-olive-light text-primary"><f.i className="h-5 w-5" /></span>
            <span className="text-sm font-semibold">{lang === "uz" ? f.uz : f.ru}</span>
          </Reveal>
        ))}
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-14">
        <Reveal><h2 className="mb-6 text-2xl font-bold">{t("categories")}</h2></Reveal>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 50}>
              <Link to="/category/$category" params={{ category: c.slug }} className="group flex flex-col items-center gap-2 rounded-2xl p-2 text-center transition hover:bg-olive-light">
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-soft">
                  <ProductImage src={c.image} alt={c.uz} className="h-full w-full transition duration-500 group-hover:scale-110" />
                </div>
                <span className="text-xs font-semibold leading-tight md:text-sm">{lang === "uz" ? c.uz : c.ru}</span>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={categories.length * 50}>
            <Link to="/products" className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-hero p-2 text-center text-primary-foreground shadow-soft transition hover:scale-105">
              <ArrowRight className="h-6 w-6" />
              <span className="text-xs font-bold md:text-sm">{t("all")}</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="pt-8">
        <MarqueeRow title={"⭐ " + t("popular")} items={popular} duration={55} to="/products" />
        <MarqueeRow title={"📱 " + t("phones")} items={phones} duration={40} to="/category/smartfonlar" />
        <MarqueeRow title={"🔥 " + t("hot")} items={hot} duration={50} to="/deals" />
        <Reveal className="mx-auto my-8 max-w-7xl px-4">
          <Link to="/pro" className="group relative block overflow-hidden rounded-3xl bg-pro p-8 text-primary-foreground shadow-lift md:p-12">
            <div className="absolute -right-10 -top-10 h-64 w-64 animate-blob bg-sale/30 blur-2xl" />
            <div className="relative">
              <div className="text-sm font-bold uppercase tracking-widest opacity-80">MirfayzIshonch Pro</div>
              <div className="mt-2 font-display text-2xl font-bold md:text-4xl">{lang === "uz" ? "Ko'proq tejang. Tezroq oling." : "Экономьте больше. Получайте быстрее."}</div>
              <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-5 py-3 font-bold text-primary-dark transition group-hover:gap-3">
                {t("becomePro")} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>
        <MarqueeRow title={"✨ " + t("newArr")} items={fresh} duration={60} to="/products" />
        <MarqueeRow title={"📺 " + t("appliances")} items={home} duration={48} to="/category/televizorlar" />
      </div>
    </>
  );
}
