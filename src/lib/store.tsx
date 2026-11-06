import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { seedCategories, seedProducts, type Category, type Product } from "./data";
import { translate, type Lang, type TKey } from "./i18n";
import { CATALOG_VERSION, upgradeCatalog } from "./catalog-upgrade";

export type OrderStatus = "Yangi" | "Tasdiqlangan" | "Yetkazilmoqda" | "Yetkazildi" | "Bekor qilindi";
export const ORDER_STATUSES: OrderStatus[] = ["Yangi", "Tasdiqlangan", "Yetkazilmoqda", "Yetkazildi", "Bekor qilindi"];

export type Order = {
  id: string;
  createdAt: number;
  name: string;
  phone: string;
  address: string;
  payment: "cash" | "install" | "online";
  months?: number | undefined;
  items: { id: string; name: string; price: number; qty: number; image: string }[];
  delivery: number;
  total: number;
  status: OrderStatus;
};

export type Settings = {
  storeName: string;
  phone: string;
  email: string;
  deliveryFee: number;
  freeDeliveryFrom: number;
  banner: string;
  bannerOn: boolean;
  promoVideo: string;
  promoTitle: string;
  promoOn: boolean;
};

export type User = { name: string; email: string; phone: string; addresses: string[]; pro?: string };

const defaultSettings: Settings = {
  storeName: "MirfayzIshonch",
  phone: "+998 XX XXX XX XX",
  email: "info@example.com",
  deliveryFee: 50000,
  freeDeliveryFrom: 5000000,
  banner: "🔥 Kuz mavsumi chegirmalari: 25% gacha! (demo aksiya)",
  bannerOn: true,
  promoVideo: "",
  promoTitle: "MirfayzIshonch — yangi mavsum aksiyasi",
  promoOn: true,
};

type Store = {
  ready: boolean;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  products: Product[];
  setProducts: (fn: (p: Product[]) => Product[]) => void;
  categories: Category[];
  setCategories: (fn: (c: Category[]) => Category[]) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  cart: Record<string, number>;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  favorites: string[];
  toggleFav: (id: string) => void;
  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrder: (id: string, status: OrderStatus) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  members: { email: string; plan: string; at: number }[];
  setMembers: (fn: (m: Store["members"]) => Store["members"]) => void;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  getProduct: (id: string) => Product | undefined;
};

const Ctx = createContext<Store | null>(null);
const KEY = "mi_store_v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Lang>("uz");
  const [products, _setProducts] = useState<Product[]>(seedProducts);
  const [categories, _setCategories] = useState<Category[]>(seedCategories);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [members, _setMembers] = useState<Store["members"]>([]);
  const [isAdmin, setAdmin] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.lang) setLang(s.lang);
        const upgraded = upgradeCatalog(s.products || [], s.categories || seedCategories, s.catalogVersion);
        _setProducts(upgraded.products);
        _setCategories(upgraded.categories);
        if (s.settings) setSettings({ ...defaultSettings, ...s.settings });
        if (s.cart) setCart(s.cart);
        if (s.favorites) setFavorites(s.favorites);
        if (s.orders) setOrders(s.orders);
        if (s.user !== undefined) setUser(s.user);
        if (s.members) _setMembers(s.members);
      }
      setAdmin(sessionStorage.getItem("mi_admin") === "1");
    } catch {
      /* ignore corrupt storage */
    }
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify({ catalogVersion: CATALOG_VERSION, lang, products, categories, settings, cart, favorites, orders, user, members })); } catch { console.warn("Storage full"); }
  }, [lang, products, categories, settings, cart, favorites, orders, user, members]);

  useEffect(() => {
    if (!loaded.current) return;
    if (isAdmin) sessionStorage.setItem("mi_admin", "1");
    else sessionStorage.removeItem("mi_admin");
  }, [isAdmin]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((k: TKey) => translate(lang, k), [lang]);

  const value = useMemo<Store>(
    () => ({
      ready, lang, setLang, t,
      products, setProducts: (fn) => _setProducts(fn),
      categories, setCategories: (fn) => _setCategories(fn),
      settings, setSettings,
      cart,
      addToCart: (id, qty = 1) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty })),
      setQty: (id, qty) => setCart((c) => (qty <= 0 ? Object.fromEntries(Object.entries(c).filter(([k]) => k !== id)) : { ...c, [id]: qty })),
      removeFromCart: (id) => setCart((c) => Object.fromEntries(Object.entries(c).filter(([k]) => k !== id))),
      clearCart: () => setCart({}),
      cartCount: Object.values(cart).reduce((a, b) => a + b, 0),
      favorites,
      toggleFav: (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      orders,
      addOrder: (o) => setOrders((os) => [o, ...os]),
      updateOrder: (id, status) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o))),
      user, setUser,
      members, setMembers: (fn) => _setMembers(fn),
      isAdmin, setAdmin,
      getProduct: (id) => products.find((p) => p.id === id),
    }),
    [ready, lang, t, products, categories, settings, cart, favorites, orders, user, members, isAdmin],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used within StoreProvider");
  return s;
}

export type SortKey = "default" | "priceAsc" | "priceDesc" | "monAsc" | "monDesc" | "new" | "disc" | "pop";

export function sortProducts(list: Product[], key: SortKey): Product[] {
  const d = (p: Product) => (p.oldPrice > p.price ? 1 - p.price / p.oldPrice : 0);
  const arr = [...list];
  switch (key) {
    case "priceAsc": return arr.sort((a, b) => a.price - b.price);
    case "priceDesc": return arr.sort((a, b) => b.price - a.price);
    case "monAsc": return arr.sort((a, b) => a.monthly - b.monthly);
    case "monDesc": return arr.sort((a, b) => b.monthly - a.monthly);
    case "new": return arr.sort((a, b) => b.createdAt - a.createdAt);
    case "disc": return arr.sort((a, b) => d(b) - d(a));
    case "pop": return arr.sort((a, b) => b.reviews - a.reviews);
    default: return arr;
  }
}

export function searchProducts(list: Product[], q: string, categories: Category[]) {
  const s = q.trim().toLowerCase();
  if (!s) return list;
  return list.filter((p) => {
    const cat = categories.find((c) => c.slug === p.category);
    const hay = [p.name, p.brand, p.category, cat?.uz, cat?.ru, p.id].join(" ").toLowerCase();
    return s.split(/\s+/).every((w) => hay.includes(w));
  });
}
