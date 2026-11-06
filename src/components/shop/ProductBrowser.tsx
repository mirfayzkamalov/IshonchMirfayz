import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import { searchProducts, sortProducts, useStore, type SortKey } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

const SORTS: { k: SortKey; t: "s_default" | "s_priceAsc" | "s_priceDesc" | "s_monAsc" | "s_monDesc" | "s_new" | "s_disc" | "s_pop" }[] = [
  { k: "default", t: "s_default" },
  { k: "priceAsc", t: "s_priceAsc" },
  { k: "priceDesc", t: "s_priceDesc" },
  { k: "monAsc", t: "s_monAsc" },
  { k: "monDesc", t: "s_monDesc" },
  { k: "new", t: "s_new" },
  { k: "disc", t: "s_disc" },
  { k: "pop", t: "s_pop" },
];

const POPULAR = ["iPhone", "Samsung", "Televizor", "Artel", "LG", "MacBook"];

export function ProductBrowser({ title, base, query, fixedCategory, onQuery }: { title: string; base: Product[]; query?: string | undefined; fixedCategory?: string | undefined; onQuery?: (q: string) => void }) {
  const { t, categories, lang, ready } = useStore();
  const [sort, setSort] = useState<SortKey>("default");
  const [cat, setCat] = useState<string>("");
  const [brands, setBrands] = useState<string[]>([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [discOnly, setDiscOnly] = useState(false);
  const [maxMonthly, setMaxMonthly] = useState("");
  const [open, setOpen] = useState(false);

  const allBrands = useMemo(() => [...new Set(base.map((p) => p.brand))].sort(), [base]);

  const list = useMemo(() => {
    let l = searchProducts(base, query || "", categories);
    if (cat) l = l.filter((p) => p.category === cat);
    if (brands.length) l = l.filter((p) => brands.includes(p.brand));
    if (min) l = l.filter((p) => p.price >= Number(min));
    if (max) l = l.filter((p) => p.price <= Number(max));
    if (stockOnly) l = l.filter((p) => p.stock > 0);
    if (discOnly) l = l.filter((p) => p.oldPrice > p.price);
    if (maxMonthly) l = l.filter((p) => p.monthly <= Number(maxMonthly));
    return sortProducts(l, sort);
  }, [base, query, categories, cat, brands, min, max, stockOnly, discOnly, maxMonthly, sort]);

  const reset = () => {
    setCat(""); setBrands([]); setMin(""); setMax(""); setStockOnly(false); setDiscOnly(false); setMaxMonthly("");
  };
  const input = "h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:border-primary";

  const filters = (
    <div className="space-y-5">
      {!fixedCategory && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("category")}</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={input}>
            <option value="">{t("all")}</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{lang === "uz" ? c.uz : c.ru}</option>)}
          </select>
        </div>
      )}
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("brand")}</div>
        <div className="flex flex-wrap gap-2">
          {allBrands.map((b) => (
            <button key={b} type="button" onClick={() => setBrands((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b]))}
              className={cn("rounded-full border px-3 py-1 text-xs font-semibold transition", brands.includes(b) ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary")}>
              {b}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="number" inputMode="numeric" placeholder={t("minPrice")} value={min} onChange={(e) => setMin(e.target.value)} className={input} aria-label={t("minPrice")} />
        <input type="number" inputMode="numeric" placeholder={t("maxPrice")} value={max} onChange={(e) => setMax(e.target.value)} className={input} aria-label={t("maxPrice")} />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("maxMonthly")}</label>
        <input type="number" inputMode="numeric" placeholder="1 500 000" value={maxMonthly} onChange={(e) => setMaxMonthly(e.target.value)} className={input} />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} className="accent-primary" /> {t("onlyStock")}</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={discOnly} onChange={(e) => setDiscOnly(e.target.checked)} className="accent-primary" /> {t("onlyDisc")}</label>
      <button type="button" onClick={reset} className="w-full rounded-xl border py-2 text-sm font-semibold hover:bg-muted">{t("reset")}</button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 animate-rise">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{list.length} {t("results")}{query ? ` — “${query}”` : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> {t("filters")}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t("sort")} className="h-10 rounded-xl border bg-card px-3 text-sm font-medium outline-none focus:border-primary">
            {SORTS.map((s) => <option key={s.k} value={s.k}>{t(s.t)}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden h-fit rounded-3xl border bg-card p-5 shadow-soft lg:sticky lg:top-40 lg:block">{filters}</aside>
        <div>
          {!ready ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/5] animate-pulse rounded-3xl bg-muted" />)}
            </div>
          ) : list.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {list.map((p, i) => (
                <div key={p.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 12) * 50}ms` }}><ProductCard p={p} /></div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border bg-card p-10 text-center">
              <div className="text-5xl">🔍</div>
              <h2 className="mt-4 text-lg font-bold">{t("noResults")}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{t("popularSearch")}:</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {POPULAR.map((s) => (
                  <button key={s} type="button" onClick={() => { reset(); onQuery?.(s); }} className="rounded-full bg-olive-light px-3 py-1 text-sm font-semibold text-primary-dark hover:bg-primary hover:text-primary-foreground">{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5 animate-in slide-in-from-bottom duration-300">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{t("filters")}</h2>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}
