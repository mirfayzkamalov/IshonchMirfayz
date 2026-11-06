import { catalogProducts } from "./catalog-products";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  oldPrice: number;
  monthly: number;
  description: string;
  specs: Record<string, string>;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  hot: boolean;
  createdAt: number;
};

export type Category = { slug: string; uz: string; ru: string; image: string };

export const seedProducts: Product[] = catalogProducts;

export const seedCategories: Category[] = [
  { slug: "smartfonlar", uz: "Smartfonlar", ru: "Смартфоны", image: catalogProducts.find((p) => p.category === "smartfonlar")?.image ?? "" },
  { slug: "televizorlar", uz: "Televizorlar", ru: "Телевизоры", image: catalogProducts.find((p) => p.category === "televizorlar")?.image ?? "" },
  { slug: "kir-yuvish", uz: "Kir yuvish mashinalari", ru: "Стиральные машины", image: catalogProducts.find((p) => p.category === "kir-yuvish")?.image ?? "" },
  { slug: "sovutgichlar", uz: "Sovutgichlar", ru: "Холодильники", image: catalogProducts.find((p) => p.category === "sovutgichlar")?.image ?? "" },
  { slug: "konditsionerlar", uz: "Konditsionerlar", ru: "Кондиционеры", image: catalogProducts.find((p) => p.category === "konditsionerlar")?.image ?? "" },
  { slug: "audio", uz: "Televizor va audio", ru: "ТВ и аудио", image: catalogProducts.find((p) => p.category === "audio")?.image ?? "" },
  { slug: "noutbuklar", uz: "Noutbuklar", ru: "Ноутбуки", image: catalogProducts.find((p) => p.category === "noutbuklar")?.image ?? "" },
  { slug: "aksessuarlar", uz: "Aksessuarlar", ru: "Аксессуары", image: catalogProducts.find((p) => p.category === "aksessuarlar")?.image ?? "" },
];

export const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(Math.round(n)).replace(/,/g, " ") + " so'm";
export const discount = (pr: Product) => (pr.oldPrice > pr.price ? Math.round((1 - pr.price / pr.oldPrice) * 100) : 0);
