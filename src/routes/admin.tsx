import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Crown, FolderTree, LayoutDashboard, LogOut, Package, Percent, Settings as SettingsIcon, ShoppingBag, Users, Video, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductImage } from "@/components/shop/ProductCard";
import { discount, fmt, type Product } from "@/lib/data";
import { ORDER_STATUSES, useStore, type OrderStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Admin panel — MirfayzIshonch" },
      { name: "description", content: "MirfayzIshonch do'konini boshqarish paneli (demo)." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — MirfayzIshonch" },
      { property: "og:description", content: "Admin panel." },
    ],
  }),
  component: Admin,
});

// DEMO ONLY: a password checked in browser code is not secure.
const DEMO_PASSWORD = "2016m";

type Tab = "dash" | "products" | "categories" | "orders" | "customers" | "discounts" | "pro" | "video" | "settings";
const input = "h-10 w-full rounded-xl border bg-card px-3 text-sm outline-none focus:border-primary";

const readFile = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(f); });

function Admin() {
  const { isAdmin, setAdmin, ready } = useStore();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState<Tab>("dash");
  const [nav, setNav] = useState(false);

  if (!ready) return <div className="min-h-screen bg-primary-dark" />;
  if (!isAdmin)
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero px-4">
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-blob bg-primary/50 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 animate-blob bg-sale/25 blur-3xl [animation-delay:-6s]" />
        <form onSubmit={(e) => { e.preventDefault(); if (pw === DEMO_PASSWORD) { setAdmin(true); setErr(false); } else setErr(true); }}
          className={cn("relative w-full max-w-sm rounded-3xl bg-card p-8 shadow-lift animate-rise", err && "animate-pop")}>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-hero font-display font-bold text-primary-foreground">MI</div>
          <h1 className="mt-4 text-center text-xl font-bold">Admin panel</h1>
          <input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Parol" aria-label="Parol" className={cn(input, "mt-6 h-12")} />
          {err && <p className="mt-2 text-sm font-semibold text-destructive">Parol noto'g'ri</p>}
          <button type="submit" className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:bg-primary-dark">Kirish</button>
          <p className="mt-4 text-center text-xs text-muted-foreground">Demo kirish. Brauzerdagi parol himoyalanmagan.</p>
          <Link to="/" className="mt-2 block text-center text-xs text-primary">← Do'konga qaytish</Link>
        </form>
      </div>
    );

  const items: { k: Tab; l: string; i: typeof Package }[] = [
    { k: "dash", l: "Dashboard", i: LayoutDashboard },
    { k: "products", l: "Mahsulotlar", i: Package },
    { k: "categories", l: "Kategoriyalar", i: FolderTree },
    { k: "orders", l: "Buyurtmalar", i: ShoppingBag },
    { k: "customers", l: "Mijozlar", i: Users },
    { k: "discounts", l: "Chegirmalar", i: Percent },
    { k: "pro", l: "Pro a'zolar", i: Crown },
    { k: "video", l: "Reklama video", i: Video },
    { k: "settings", l: "Sozlamalar", i: SettingsIcon },
  ];

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-sidebar p-4 text-sidebar-foreground transition-transform lg:static lg:translate-x-0", nav ? "translate-x-0" : "-translate-x-full")}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sm text-sidebar-primary-foreground">MI</span> Admin</div>
          <button type="button" className="lg:hidden" aria-label="Close" onClick={() => setNav(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1">
          {items.map((x) => (
            <button key={x.k} type="button" onClick={() => { setTab(x.k); setNav(false); }} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", tab === x.k ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent")}>
              <x.i className="h-4 w-4" /> {x.l}
            </button>
          ))}
        </nav>
        <div className="mt-8 space-y-1 border-t border-sidebar-border pt-4">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent">← Do'kon</Link>
          <button type="button" onClick={() => setAdmin(false)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent"><LogOut className="h-4 w-4" /> Chiqish</button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card px-5 py-4">
          <button type="button" className="lg:hidden" aria-label="Menu" onClick={() => setNav(true)}><BarChart3 className="h-5 w-5" /></button>
          <h1 className="text-lg font-bold">{items.find((x) => x.k === tab)?.l}</h1>
          <span className="ml-auto rounded-full bg-olive-light px-3 py-1 text-xs font-bold text-primary-dark">DEMO</span>
        </header>
        <div key={tab} className="p-5 animate-rise">
          {tab === "dash" && <Dash />}
          {tab === "products" && <Products />}
          {tab === "categories" && <Categories />}
          {tab === "orders" && <Orders />}
          {tab === "customers" && <Customers />}
          {tab === "discounts" && <Discounts />}
          {tab === "pro" && <ProMembers />}
          {tab === "video" && <PromoVideo />}
          {tab === "settings" && <StoreSettings />}
        </div>
      </div>
    </div>
  );
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={cn("rounded-2xl border bg-card p-5 shadow-soft", className)}>{children}</div>;

function Dash() {
  const { products, orders } = useStore();
  const revenue = orders.filter((o) => o.status !== "Bekor qilindi").reduce((s, o) => s + o.total, 0);
  const low = products.filter((p) => p.stock <= 5);
  const stats = [
    { l: "Mahsulotlar", v: products.length },
    { l: "Buyurtmalar", v: orders.length },
    { l: "Daromad (demo)", v: fmt(revenue) },
    { l: "Kam qolgan", v: low.length },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={s.l} className="animate-rise transition hover:-translate-y-1">
            <div className="text-xs font-semibold uppercase text-muted-foreground" style={{ animationDelay: `${i * 80}ms` }}>{s.l}</div>
            <div className="mt-2 text-2xl font-extrabold text-primary-dark">{s.v}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-bold">Kam qolgan mahsulotlar</h2>
          {low.map((p) => <div key={p.id} className="flex justify-between border-b py-2 text-sm last:border-0"><span>{p.name}</span><span className="font-bold text-sale">{p.stock}</span></div>)}
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">So'nggi buyurtmalar</h2>
          {orders.slice(0, 5).map((o) => <div key={o.id} className="flex justify-between border-b py-2 text-sm last:border-0"><span>{o.id} · {o.name}</span><span className="font-bold">{fmt(o.total)}</span></div>)}
          {!orders.length && <p className="text-sm text-muted-foreground">Hali buyurtma yo'q</p>}
        </Card>
      </div>
    </div>
  );
}

const empty = (): Product => ({ id: "", name: "", brand: "", category: "smartfonlar", image: "", price: 0, oldPrice: 0, monthly: 0, description: "", specs: {}, stock: 10, rating: 5, reviews: 0, featured: false, hot: false, createdAt: Date.now() });

function ProductForm({ initial, onClose }: { initial: Product; onClose: () => void }) {
  const { setProducts, categories, products } = useStore();
  const [p, setP] = useState<Product>(initial);
  const [specs, setSpecs] = useState(Object.entries(initial.specs).map(([k, v]) => `${k}: ${v}`).join("\n"));
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const spec = Object.fromEntries(specs.split("\n").map((l) => l.split(":")).filter((a) => a.length >= 2).map(([k, ...v]) => [k!.trim(), v.join(":").trim()]));
    const id = p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
    const final = { ...p, id, specs: spec, monthly: p.monthly || Math.round(p.price / 12) };
    setProducts((list) => (products.some((x) => x.id === p.id) && p.id ? list.map((x) => (x.id === p.id ? final : x)) : [final, ...list]));
    toast.success("Saqlandi");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 animate-in fade-in">
      <form onSubmit={save} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-card p-6 shadow-lift animate-in zoom-in-95">
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold">{initial.id ? "Tahrirlash" : "Yangi mahsulot"}</h2><button type="button" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold sm:col-span-2">Nomi<input required value={p.name} onChange={(e) => set("name", e.target.value)} className={input} /></label>
          <label className="text-xs font-semibold">Brend<input required value={p.brand} onChange={(e) => set("brand", e.target.value)} className={input} /></label>
          <label className="text-xs font-semibold">Kategoriya<select value={p.category} onChange={(e) => set("category", e.target.value)} className={input}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.uz}</option>)}</select></label>
          <label className="text-xs font-semibold">Narx<input type="number" required value={p.price || ""} onChange={(e) => set("price", Number(e.target.value))} className={input} /></label>
          <label className="text-xs font-semibold">Eski narx<input type="number" value={p.oldPrice || ""} onChange={(e) => set("oldPrice", Number(e.target.value))} className={input} /></label>
          <label className="text-xs font-semibold">Oylik to'lov<input type="number" value={p.monthly || ""} onChange={(e) => set("monthly", Number(e.target.value))} className={input} /></label>
          <label className="text-xs font-semibold">Ombordagi soni<input type="number" value={p.stock} onChange={(e) => set("stock", Number(e.target.value))} className={input} /></label>
          <label className="text-xs font-semibold sm:col-span-2">Rasm URL<input value={p.image.startsWith("data:") ? "(yuklangan fayl)" : p.image} onChange={(e) => set("image", e.target.value)} className={input} /></label>
          <label className="text-xs font-semibold sm:col-span-2">yoki rasm yuklash<input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) set("image", await readFile(f)); }} className="mt-1 block text-sm" /></label>
          {p.image && <ProductImage src={p.image} alt="" className="h-24 w-24 rounded-xl" />}
          <label className="text-xs font-semibold sm:col-span-2">Tavsif<textarea value={p.description} onChange={(e) => set("description", e.target.value)} className={cn(input, "h-20 py-2")} /></label>
          <label className="text-xs font-semibold sm:col-span-2">Xususiyatlar (har qatorda "Nomi: qiymat")<textarea value={specs} onChange={(e) => setSpecs(e.target.value)} className={cn(input, "h-24 py-2")} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-primary" /> Tavsiya etilgan</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.hot} onChange={(e) => set("hot", e.target.checked)} className="accent-primary" /> Qaynoq chegirma</label>
        </div>
        <button type="submit" className="mt-5 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground">Saqlash</button>
      </form>
    </div>
  );
}

function Products() {
  const { products, setProducts, categories } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [edit, setEdit] = useState<Product | null>(null);
  const list = products.filter((p) => (!cat || p.category === cat) && (p.name + p.brand).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Qidirish..." className={cn(input, "max-w-xs")} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={cn(input, "max-w-[200px]")}><option value="">Barchasi</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.uz}</option>)}</select>
        <button type="button" onClick={() => setEdit(empty())} className="ml-auto rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">+ Qo'shish</button>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase text-muted-foreground"><tr><th className="p-3">Mahsulot</th><th>Narx</th><th>Soni</th><th>Belgilar</th><th /></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t transition hover:bg-muted/50">
                <td className="flex items-center gap-3 p-3"><ProductImage src={p.image} alt="" className="h-10 w-10 rounded-lg" /><div><div className="font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{p.brand}</div></div></td>
                <td className="font-semibold">{fmt(p.price)}</td>
                <td className={cn(p.stock <= 5 && "font-bold text-sale")}>{p.stock}</td>
                <td className="space-x-1">{p.featured && <span className="rounded bg-olive-light px-1.5 text-xs">⭐</span>}{p.hot && <span className="rounded bg-sale/15 px-1.5 text-xs">🔥</span>}</td>
                <td className="whitespace-nowrap pr-3 text-right">
                  <button type="button" onClick={() => setEdit(p)} className="rounded-lg px-2 py-1 text-primary hover:bg-olive-light">Tahrir</button>
                  <button type="button" onClick={() => { if (confirm("O'chirilsinmi?")) setProducts((l) => l.filter((x) => x.id !== p.id)); }} className="rounded-lg px-2 py-1 text-destructive hover:bg-destructive/10">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {edit && <ProductForm initial={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function Categories() {
  const { categories, setCategories, products } = useStore();
  const [f, setF] = useState({ slug: "", uz: "", ru: "", image: "" });
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <Card key={c.slug} className="flex items-center gap-3">
              <ProductImage src={c.image} alt="" className="h-14 w-14 rounded-xl" />
              <div className="flex-1">
                <input value={c.uz} onChange={(e) => setCategories((l) => l.map((x) => (x.slug === c.slug ? { ...x, uz: e.target.value } : x)))} className="w-full bg-transparent font-semibold outline-none" aria-label="UZ" />
                <input value={c.ru} onChange={(e) => setCategories((l) => l.map((x) => (x.slug === c.slug ? { ...x, ru: e.target.value } : x)))} className="w-full bg-transparent text-xs text-muted-foreground outline-none" aria-label="RU" />
                <div className="text-xs text-muted-foreground">{count} ta mahsulot</div>
              </div>
              <button type="button" disabled={count > 0} title={count > 0 ? "Avval mahsulotlarni ko'chiring" : ""} onClick={() => setCategories((l) => l.filter((x) => x.slug !== c.slug))} className="text-destructive disabled:opacity-30" aria-label="Delete"><X className="h-4 w-4" /></button>
            </Card>
          );
        })}
      </div>
      <Card>
        <h2 className="mb-3 font-bold">Yangi kategoriya</h2>
        <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); const slug = f.slug || f.uz.toLowerCase().replace(/[^a-z0-9]+/g, "-"); if (!slug || categories.some((c) => c.slug === slug)) { toast.error("Slug band yoki bo'sh"); return; } setCategories((l) => [...l, { ...f, slug, ru: f.ru || f.uz }]); setF({ slug: "", uz: "", ru: "", image: "" }); }}>
          <input required placeholder="Nomi (UZ)" value={f.uz} onChange={(e) => setF({ ...f, uz: e.target.value })} className={input} />
          <input placeholder="Название (RU)" value={f.ru} onChange={(e) => setF({ ...f, ru: e.target.value })} className={input} />
          <input placeholder="slug" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} className={input} />
          <input type="file" accept="image/*" onChange={async (e) => { const x = e.target.files?.[0]; if (x) setF({ ...f, image: await readFile(x) }); }} className="text-sm" />
          <button type="submit" className="w-full rounded-xl bg-primary py-2.5 font-bold text-primary-foreground">Qo'shish</button>
        </form>
      </Card>
    </div>
  );
}

function Orders() {
  const { orders, updateOrder } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  if (!orders.length) return <Card>Hali buyurtma yo'q. Do'kondan demo buyurtma bering.</Card>;
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Card key={o.id}>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setOpen(open === o.id ? null : o.id)} className="font-bold text-primary">{o.id}</button>
            <span className="text-sm">{o.name} · {o.phone}</span>
            <span className="ml-auto font-bold">{fmt(o.total)}</span>
            <select value={o.status} onChange={(e) => updateOrder(o.id, e.target.value as OrderStatus)} className={cn(input, "w-44")}>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          {open === o.id && (
            <div className="mt-3 space-y-1 border-t pt-3 text-sm animate-rise">
              <div>Manzil: {o.address}</div>
              <div>To'lov: {o.payment}{o.months ? ` (${o.months} oy)` : ""} · Yetkazish: {fmt(o.delivery)}</div>
              {o.items.map((i) => <div key={i.id}>• {i.name} × {i.qty} — {fmt(i.price * i.qty)}</div>)}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function Customers() {
  const { orders, user } = useStore();
  const map = new Map<string, { name: string; phone: string; count: number; sum: number }>();
  orders.forEach((o) => { const c = map.get(o.phone) || { name: o.name, phone: o.phone, count: 0, sum: 0 }; c.count++; c.sum += o.total; map.set(o.phone, c); });
  const list = [...map.values()];
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left text-xs uppercase text-muted-foreground"><tr><th className="p-3">Ism</th><th>Telefon</th><th>Buyurtmalar</th><th>Jami</th></tr></thead>
        <tbody>
          {user && <tr className="border-t"><td className="p-3 font-semibold">{user.name} (kabinet)</td><td>{user.phone || user.email}</td><td>—</td><td>—</td></tr>}
          {list.map((c) => <tr key={c.phone} className="border-t"><td className="p-3 font-semibold">{c.name}</td><td>{c.phone}</td><td>{c.count}</td><td>{fmt(c.sum)}</td></tr>)}
        </tbody>
      </table>
      {!list.length && !user && <p className="p-5 text-sm text-muted-foreground">Mijozlar yo'q</p>}
    </Card>
  );
}

function Discounts() {
  const { products, setProducts } = useStore();
  const upd = (id: string, patch: Partial<Product>) => setProducts((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {products.map((p) => (
        <Card key={p.id} className="flex items-center gap-3">
          <ProductImage src={p.image} alt="" className="h-12 w-12 rounded-lg" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{p.name}</div>
            <div className="mt-1 flex items-center gap-2">
              <input type="number" value={p.price} onChange={(e) => upd(p.id, { price: Number(e.target.value) })} className={cn(input, "h-8 w-32")} aria-label="Sotuv narxi" />
              <span className="rounded-full bg-sale px-2 py-0.5 text-xs font-bold text-sale-foreground">-{discount(p)}%</span>
            </div>
          </div>
          <label className="flex items-center gap-1 text-xs font-semibold"><input type="checkbox" checked={p.hot} onChange={(e) => upd(p.id, { hot: e.target.checked })} className="accent-primary" /> 🔥</label>
        </Card>
      ))}
    </div>
  );
}

function ProMembers() {
  const { members, setMembers } = useStore();
  return (
    <Card>
      <h2 className="mb-3 font-bold">Pro a'zolar (demo) — {members.length}</h2>
      {members.map((m, i) => (
        <div key={i} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
          <span>{m.email} · <b>{m.plan}</b> · {new Date(m.at).toLocaleDateString()}</span>
          <button type="button" onClick={() => setMembers((l) => l.filter((_, j) => j !== i))} className="text-destructive">Bekor qilish</button>
        </div>
      ))}
      {!members.length && <p className="text-sm text-muted-foreground">Hali a'zo yo'q</p>}
    </Card>
  );
}

function PromoVideo() {
  const { settings, setSettings } = useStore();
  const [url, setUrl] = useState(settings.promoVideo.startsWith("data:") ? "" : settings.promoVideo);
  const [title, setTitle] = useState(settings.promoTitle);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="space-y-3">
        <h2 className="font-bold">Bosh sahifadagi reklama video</h2>
        <label className="block text-xs font-semibold">Sarlavha<input value={title} onChange={(e) => setTitle(e.target.value)} className={input} /></label>
        <label className="block text-xs font-semibold">Video havolasi (.mp4 yoki YouTube)<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={input} /></label>
        <label className="block text-xs font-semibold">yoki video fayl yuklash (kichik, ~4MB gacha)
          <input type="file" accept="video/*" className="mt-1 block text-sm" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (f.size > 4 * 1024 * 1024) {
              toast.error("Fayl juda katta — havola orqali qo'shing");
              return;
            }
            setSettings({ ...settings, promoVideo: await readFile(f), promoTitle: title, promoOn: true });
            toast.success("Video yuklandi");
          }} />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.promoOn} onChange={(e) => setSettings({ ...settings, promoOn: e.target.checked })} className="accent-primary" /> Bosh sahifada ko'rsatish</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setSettings({ ...settings, promoVideo: url.trim() || settings.promoVideo, promoTitle: title, promoOn: true }); toast.success("Saqlandi"); }} className="rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground">Saqlash</button>
          <button type="button" onClick={() => { setSettings({ ...settings, promoVideo: "" }); setUrl(""); }} className="rounded-xl border px-5 py-2.5 font-semibold">O'chirish</button>
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 font-bold">Ko'rinishi</h2>
        {settings.promoVideo ? <PromoPlayer src={settings.promoVideo} /> : <p className="text-sm text-muted-foreground">Video qo'shilmagan</p>}
      </Card>
    </div>
  );
}

export function PromoPlayer({ src }: { src: string }) {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return <iframe title="Promo" className="aspect-video w-full rounded-2xl" src={`https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}`} allow="autoplay; encrypted-media" allowFullScreen />;
  return <video src={src} className="aspect-video w-full rounded-2xl object-cover" autoPlay muted loop playsInline controls />;
}

function StoreSettings() {
  const { settings, setSettings } = useStore();
  const [s, setS] = useState(settings);
  return (
    <Card className="max-w-2xl">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setSettings({ ...settings, ...s, promoVideo: settings.promoVideo }); toast.success("Sozlamalar saqlandi"); }}>
        <label className="text-xs font-semibold">Do'kon nomi<input value={s.storeName} onChange={(e) => setS({ ...s, storeName: e.target.value })} className={input} /></label>
        <label className="text-xs font-semibold">Telefon<input value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} className={input} /></label>
        <label className="text-xs font-semibold">Email<input value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} className={input} /></label>
        <label className="text-xs font-semibold">Yetkazish narxi<input type="number" value={s.deliveryFee} onChange={(e) => setS({ ...s, deliveryFee: Number(e.target.value) })} className={input} /></label>
        <label className="text-xs font-semibold">Bepul yetkazish (dan)<input type="number" value={s.freeDeliveryFrom} onChange={(e) => setS({ ...s, freeDeliveryFrom: Number(e.target.value) })} className={input} /></label>
        <label className="text-xs font-semibold sm:col-span-2">Aksiya banneri<input value={s.banner} onChange={(e) => setS({ ...s, banner: e.target.value })} className={input} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={s.bannerOn} onChange={(e) => setS({ ...s, bannerOn: e.target.checked })} className="accent-primary" /> Bannerni ko'rsatish</label>
        <button type="submit" className="rounded-xl bg-primary py-2.5 font-bold text-primary-foreground sm:col-span-2">Saqlash</button>
      </form>
    </Card>
  );
}
