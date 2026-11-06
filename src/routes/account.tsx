import { createFileRoute } from "@tanstack/react-router";
import { Crown, LogOut } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { OrdersList } from "./orders";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Shaxsiy kabinet — MirfayzIshonch" },
      { name: "description", content: "Profil, buyurtmalar, sevimlilar va manzillar." },
      { property: "og:title", content: "Kabinet — MirfayzIshonch" },
      { property: "og:description", content: "Mijoz kabineti." },
    ],
  }),
  component: Account,
});

function Account() {
  const { user, setUser, t, lang, favorites, products } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [addr, setAddr] = useState("");
  const [tab, setTab] = useState<"profile" | "orders" | "fav" | "addr">("profile");
  const input = "h-11 w-full rounded-xl border bg-card px-3 outline-none focus:border-primary";

  if (!user)
    return (
      <div className="mx-auto max-w-md px-4 py-16 animate-rise">
        <div className="rounded-3xl border bg-card p-8 shadow-lift">
          <div className="mb-6 flex rounded-2xl bg-muted p-1">
            {(["login", "register"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={cn("flex-1 rounded-xl py-2 text-sm font-bold transition", mode === m && "bg-card shadow-soft")}>{t(m)}</button>
            ))}
          </div>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setUser({ name: f.name || f.email.split("@")[0] || "Mijoz", email: f.email, phone: f.phone, addresses: [] }); }}>
            {mode === "register" && <input required placeholder={t("fullName")} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} />}
            <input required type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input} />
            {mode === "register" && <input placeholder={t("phone")} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input} />}
            <input required type="password" placeholder="Parol" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className={input} />
            <button type="submit" className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground">{t(mode)}</button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">{lang === "uz" ? "Demo kirish — haqiqiy himoyalangan hisob emas." : "Демо-вход — не защищённый аккаунт."}</p>
        </div>
      </div>
    );

  const favs = products.filter((p) => favorites.includes(p.id));
  const tabs = [
    { k: "profile" as const, l: lang === "uz" ? "Profil" : "Профиль" },
    { k: "orders" as const, l: t("orders") },
    { k: "fav" as const, l: t("favorites") },
    { k: "addr" as const, l: lang === "uz" ? "Manzillar" : "Адреса" },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-3xl bg-hero p-6 text-primary-foreground shadow-lift animate-rise">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-foreground/15 font-display text-2xl">{user.name[0]?.toUpperCase()}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xl font-bold">{user.name} {user.pro && <span className="flex items-center gap-1 rounded-full bg-sale px-2 py-0.5 text-xs"><Crown className="h-3 w-3" /> PRO</span>}</div>
          <div className="text-sm opacity-80">{user.email}</div>
        </div>
        <button type="button" onClick={() => setUser(null)} className="flex items-center gap-2 rounded-xl bg-primary-foreground/15 px-4 py-2 text-sm font-semibold hover:bg-primary-foreground/25"><LogOut className="h-4 w-4" /> {t("logout")}</button>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((x) => <button key={x.k} type="button" onClick={() => setTab(x.k)} className={cn("whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold", tab === x.k ? "bg-primary text-primary-foreground" : "bg-muted")}>{x.l}</button>)}
      </div>
      {tab === "profile" && (
        <div className="grid gap-3 rounded-3xl border bg-card p-6 sm:grid-cols-2 animate-rise">
          <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className={input} aria-label={t("fullName")} />
          <input value={user.phone} placeholder={t("phone")} onChange={(e) => setUser({ ...user, phone: e.target.value })} className={input} aria-label={t("phone")} />
        </div>
      )}
      {tab === "orders" && <OrdersList />}
      {tab === "fav" && <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{favs.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      {tab === "addr" && (
        <div className="space-y-3 rounded-3xl border bg-card p-6 animate-rise">
          {user.addresses.map((a, i) => (
            <div key={i} className="flex justify-between rounded-xl bg-muted p-3 text-sm">{a}<button type="button" className="text-destructive" onClick={() => setUser({ ...user, addresses: user.addresses.filter((_, j) => j !== i) })}>✕</button></div>
          ))}
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (addr.trim()) { setUser({ ...user, addresses: [...user.addresses, addr.trim()] }); setAddr(""); } }}>
            <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder={t("address")} className={input} />
            <button type="submit" className="rounded-xl bg-primary px-4 font-bold text-primary-foreground">+</button>
          </form>
        </div>
      )}
    </div>
  );
}
