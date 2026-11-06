import type { Product } from "./data";
const iphone16 = "/assets/iphone16.jpg", iphone17 = "/assets/iphone17.jpg";
const galaxyS25 = "/assets/galaxy-s25.jpg", galaxyA = "/assets/galaxy-a.jpg";
const tv = "/assets/tv.jpg", washer = "/assets/washer.jpg", fridge = "/assets/fridge.jpg";
const ac = "/assets/ac.jpg", laptop = "/assets/laptop.jpg";
const headphones = "/assets/headphones.jpg", soundbar = "/assets/soundbar.jpg";
const day = 86400000;
const base = Date.UTC(2026, 9, 1);
const p = (
  id: string, name: string, brand: string, category: string, image: string,
  price: number, oldPrice: number, months: number, description: string,
  specs: Record<string, string>, stock: number, rating: number, reviews: number,
  featured: boolean, hot: boolean, age: number,
): Product => ({
  id, name, brand, category, image, price, oldPrice, monthly: Math.round(price / months / 1000) * 1000,
  description, specs, stock, rating, reviews, featured, hot, createdAt: base - age * day,
});

export const legacyProducts: Product[] = [
  p("iphone-17-pro", "Apple iPhone 17 Pro 256GB", "Apple", "smartfonlar", iphone17, 17990000, 19490000, 12,
    "Yangi avlod A19 Pro protsessori, yangilangan kamera bloki va titan korpus.",
    { Ekran: '6.3" ProMotion OLED', Xotira: "256 GB", Kamera: "48+48+48 MP", Batareya: "3700 mAh" }, 14, 4.9, 214, true, false, 2),
  p("iphone-16-pro", "Apple iPhone 16 Pro 128GB", "Apple", "smartfonlar", iphone16, 13490000, 15990000, 12,
    "A18 Pro chipi, Natural Titanium rang, kamera boshqaruv tugmasi.",
    { Ekran: '6.3" Super Retina XDR', Xotira: "128 GB", Kamera: "48+48+12 MP", Batareya: "3582 mAh" }, 22, 4.8, 532, true, true, 40),
  p("iphone-16", "Apple iPhone 16 128GB", "Apple", "smartfonlar", iphone16, 10990000, 12490000, 12,
    "Kundalik foydalanish uchun ishonchli va tezkor iPhone.",
    { Ekran: '6.1" OLED', Xotira: "128 GB", Kamera: "48+12 MP", Batareya: "3561 mAh" }, 30, 4.7, 389, false, true, 60),
  p("galaxy-s25-ultra", "Samsung Galaxy S25 Ultra 512GB", "Samsung", "smartfonlar", galaxyS25, 16490000, 18990000, 12,
    "S Pen, 200 MP kamera va Galaxy AI imkoniyatlari bilan flagman.",
    { Ekran: '6.9" Dynamic AMOLED 2X', Xotira: "512 GB", Kamera: "200+50+50+10 MP", Batareya: "5000 mAh" }, 9, 4.9, 301, true, true, 10),
  p("galaxy-a56", "Samsung Galaxy A56 256GB", "Samsung", "smartfonlar", galaxyA, 4790000, 5490000, 12,
    "Yorqin AMOLED ekran va uzoq ishlaydigan batareya.",
    { Ekran: '6.7" Super AMOLED', Xotira: "256 GB", Kamera: "50+12+5 MP", Batareya: "5000 mAh" }, 40, 4.6, 812, false, true, 5),
  p("galaxy-a36", "Samsung Galaxy A36 128GB", "Samsung", "smartfonlar", galaxyA, 3590000, 3990000, 12,
    "Arzon narxda zamonaviy Samsung smartfoni.",
    { Ekran: '6.7" Super AMOLED', Xotira: "128 GB", Kamera: "50+8+5 MP", Batareya: "5000 mAh" }, 3, 4.5, 145, false, false, 15),
  p("samsung-qled-65", 'Samsung 65" QLED Smart TV Q80D', "Samsung", "televizorlar", tv, 12990000, 15490000, 12,
    "Quantum Dot texnologiyasi, 4K 120Hz va Tizen Smart TV.",
    { Diagonal: '65"', Ruxsat: "4K UHD", Chastota: "120 Hz", OS: "Tizen" }, 7, 4.8, 96, true, true, 20),
  p("lg-oled-55", 'LG 55" OLED evo C4', "LG", "televizorlar", tv, 14490000, 16990000, 12,
    "Mukammal qora rang va kinematografik tasvir.",
    { Diagonal: '55"', Ruxsat: "4K OLED", Chastota: "144 Hz", OS: "webOS" }, 5, 4.9, 61, false, false, 3),
  p("lg-washer-9kg", "LG F4V5 9kg kir yuvish mashinasi", "LG", "kir-yuvish", washer, 6290000, 7290000, 12,
    "AI DD texnologiyasi, bug' bilan yuvish va inverter dvigatel.",
    { Sigim: "9 kg", Aylanish: "1400 rpm", Sinf: "A+++", Dvigatel: "Inverter Direct Drive" }, 12, 4.7, 178, true, true, 25),
  p("artel-fridge", "Artel HD 455 sovutgich", "Artel", "sovutgichlar", fridge, 5490000, 6190000, 12,
    "No Frost tizimi, keng ichki hajm va energiya tejamkorlik.",
    { Hajm: "455 L", Tizim: "No Frost", Sinf: "A+", Rang: "Kumush" }, 8, 4.6, 233, true, false, 30),
  p("samsung-fridge", "Samsung RT38 sovutgich", "Samsung", "sovutgichlar", fridge, 7190000, 7990000, 12,
    "Twin Cooling Plus va Digital Inverter kompressor.",
    { Hajm: "384 L", Tizim: "No Frost", Sinf: "A++", Rang: "Inox" }, 2, 4.7, 88, false, true, 8),
  p("artel-ac-12", "Artel Split 12 HE konditsioner", "Artel", "konditsionerlar", ac, 3990000, 4690000, 12,
    "Inverter split tizim, tez sovutish va jim ishlash.",
    { Quvvat: "12000 BTU", Maydon: "35 m²", Rejim: "Sovutish/isitish", Shovqin: "24 dB" }, 18, 4.5, 204, false, true, 12),
  p("macbook-air", "Apple MacBook Air 13 M3", "Apple", "noutbuklar", laptop, 13990000, 15490000, 12,
    "Yengil, jim va kun bo'yi ishlaydigan noutbuk.",
    { Protsessor: "Apple M3", RAM: "16 GB", SSD: "512 GB", Ekran: '13.6" Liquid Retina' }, 10, 4.9, 147, true, false, 18),
  p("lenovo-ideapad", "Lenovo IdeaPad Slim 5", "Lenovo", "noutbuklar", laptop, 8490000, 9690000, 12,
    "O'qish va ish uchun universal noutbuk.",
    { Protsessor: "Ryzen 7 8845HS", RAM: "16 GB", SSD: "1 TB", Ekran: '14" OLED' }, 6, 4.6, 74, false, true, 1),
  p("sony-wh1000", "Sony WH-1000XM5 quloqchin", "Sony", "aksessuarlar", headphones, 3990000, 4790000, 6,
    "Sanoatdagi eng yaxshi shovqinni yo'qotish texnologiyasi.",
    { Turi: "Simsiz", Batareya: "30 soat", ANC: "Ha", Ulanish: "Bluetooth 5.2" }, 25, 4.8, 640, true, true, 22),
  p("samsung-soundbar", "Samsung HW-Q600C saundbar", "Samsung", "audio", soundbar, 3490000, 4290000, 6,
    "Dolby Atmos va simsiz sabvufer bilan uy kinoteatri.",
    { Kanal: "3.1.2", Quvvat: "360 W", Atmos: "Ha", Ulanish: "HDMI eARC" }, 11, 4.6, 112, false, true, 6),
];
