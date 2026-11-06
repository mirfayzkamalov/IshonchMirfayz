import { Link, useNavigate } from "@tanstack/react-router";
import { Crown, Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { fmt } from "@/lib/data";
import { searchProducts, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductCard";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="MirfayzIshonch">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-hero font-display text-sm font-bold text-primary-foreground shadow-soft">MI</span>
      <span className={cn("font-display text-lg font-bold tracking-tight", light ? "text-primary-foreground" : "text-primary-dark")}>
        Mirfayz<span className={light ? "text-olive-light" : "text-primary"}>Ishonch</span>
      </span>
    </Link>
  );
}

export function LangSwitch() {
  const { lang, setLang } = useStore();
  return (
    <div className="flex rounded-full bg-muted p-0.5 text-xs font-bold" role="group" aria-label="Language">
      {(["uz", "ru"] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} className={cn("rounded-full px-2.5 py-1 uppercase transition", lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
          {l}
        </button>
      ))}
    </div>
  );
}

function SearchBox({ onDone }: { onDone?: () => void }) {
  const { t, products, categories } = useStore();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const hits = useMemo(() => (q.trim() ? searchProducts(products, q, categories).slice(0, 6) : []), [q, products, categories]);

  useEffect(() => {
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = q.trim();
    setOpen(false);
    onDone?.();
    if (s.toLowerCase() === "/admin" || s.toLowerCase() === "admin") { void nav({ to: "/admin" }); return; }
    void nav({ to: "/products", search: { q: s || undefined } });
  };

  return (
    <form ref={ref} onSubmit={submit} className="relative w-full" role="search">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={t("search")}
        aria-label={t("search")}
        className="h-11 w-full rounded-2xl border bg-muted pl-11 pr-20 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15"
      />
      {q && (
        <button type="button" aria-label="Clear" onClick={() => setQ("")} className="absolute right-14 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
      <button type="submit" aria-label={t("search")} className="absolute right-1.5 top-1/2 grid h-8 w-10 -translate-y-1/2 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Search className="h-4 w-4" />
      </button>
      {open && q.trim() && !q.startsWith("/") && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border bg-popover shadow-lift animate-in fade-in slide-in-from-top-2">
          {hits.length ? (
            hits.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                onClick={() => {
                  setOpen(false);
                  onDone?.();
                }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-muted"
              >
                <ProductImage src={p.image} alt="" className="h-10 w-10 rounded-lg" />
                <span className="flex-1 truncate text-sm">{p.name}</span>
                <span className="text-xs font-bold text-primary">{fmt(p.price)}</span>
              </Link>
            ))
          ) : (
            <div className="p-4 text-sm text-muted-foreground">{t("noResults")}</div>
          )}
        </div>
      )}
    </form>
  );
}

export function Header() {
  const { t, cartCount, favorites, categories, lang, settings, user } = useStore();
  const [menu, setMenu] = useState(false);
  const [bump, setBump] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!cartCount) return;
    setBump(true);
    const id = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(id);
  }, [cartCount]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const icon = "relative grid h-10 w-10 place-items-center rounded-xl transition hover:bg-muted";
  return (
    <header className={cn("sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl transition-shadow", scrolled && "shadow-soft")}>
      {settings.bannerOn && settings.banner && (
        <div className="overflow-hidden bg-primary-dark py-1.5 text-center text-xs font-medium text-primary-foreground">{settings.banner}</div>
      )}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button type="button" className={cn(icon, "lg:hidden")} aria-label="Menu" onClick={() => setMenu(true)}>
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <div className="mx-4 hidden flex-1 md:block">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="hidden sm:block"><LangSwitch /></div>
          <Link to="/pro" className="hidden items-center gap-1.5 rounded-xl bg-pro px-3 py-2 text-xs font-bold text-primary-foreground transition hover:scale-105 lg:flex">
            <Crown className="h-4 w-4" /> Pro
          </Link>
          <Link to="/favorites" className={icon} aria-label={t("favorites")}>
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-sale-foreground">{favorites.length}</span>}
          </Link>
          <Link to="/cart" className={icon} aria-label={t("cart")}>
            <ShoppingCart className={cn("h-5 w-5", bump && "animate-pop")} />
            {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
          </Link>
          <Link to="/account" className={icon} aria-label={t("account")}>
            <User className="h-5 w-5" />
            {user?.pro && <Crown className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 text-sale" />}
          </Link>
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden"><SearchBox /></div>
      <nav className="mx-auto hidden max-w-7xl items-center gap-1 overflow-x-auto px-4 pb-2 lg:flex" aria-label={t("categories")}>
        <Link to="/products" search={{}} className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-olive-light hover:text-primary-dark" activeProps={{ className: "bg-olive-light text-primary-dark" }}>
          {t("all")}
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} to="/category/$category" params={{ category: c.slug }} className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-olive-light hover:text-primary-dark" activeProps={{ className: "bg-olive-light text-primary-dark" }}>
            {lang === "uz" ? c.uz : c.ru}
          </Link>
        ))}
        <Link to="/deals" className="ml-auto whitespace-nowrap rounded-full bg-sale/10 px-3 py-1.5 text-sm font-bold text-sale">🔥 {t("deals")}</Link>
      </nav>

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" onClick={() => setMenu(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col gap-1 overflow-y-auto bg-background p-5 shadow-lift animate-in slide-in-from-left duration-300">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button type="button" aria-label="Close" onClick={() => setMenu(false)} className={icon}><X className="h-5 w-5" /></button>
            </div>
            <LangSwitch />
            <div className="my-3 h-px bg-border" />
            {[
              { to: "/products" as const, l: t("allProducts") },
              { to: "/deals" as const, l: "🔥 " + t("deals") },
              { to: "/pro" as const, l: "👑 MirfayzIshonch Pro" },
              { to: "/orders" as const, l: t("orders") },
              { to: "/account" as const, l: t("account") },
            ].map((x) => (
              <Link key={x.to} to={x.to} onClick={() => setMenu(false)} className="rounded-xl px-3 py-2.5 font-semibold hover:bg-muted">{x.l}</Link>
            ))}
            <div className="my-3 h-px bg-border" />
            {categories.map((c) => (
              <Link key={c.slug} to="/category/$category" params={{ category: c.slug }} onClick={() => setMenu(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted">
                <ProductImage src={c.image} alt="" className="h-8 w-8 rounded-lg" /> {lang === "uz" ? c.uz : c.ru}
              </Link>
            ))}
          </aside>
        </div>
      )}
    </header>
  );
}
