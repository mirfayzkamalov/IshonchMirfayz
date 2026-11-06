import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { LangSwitch } from "./Header";

export function Footer() {
  const { t, settings, categories, lang } = useStore();
  return (
    <footer className="mt-16 bg-primary-dark text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="font-display text-xl font-bold">
            Mirfayz<span className="text-olive-light/70">Ishonch</span>
          </Link>
          <p className="text-sm opacity-75">
            {lang === "uz"
              ? "Ishonchli elektronika va maishiy texnika do'koni. Qulay narxlar va muddatli to'lov."
              : "Надёжный магазин электроники и бытовой техники. Выгодные цены и рассрочка."}
          </p>
          <div className="w-fit rounded-full bg-primary-foreground/10 p-1"><LangSwitch /></div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-70">{t("categories")}</h3>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}><Link to="/category/$category" params={{ category: c.slug }} className="opacity-85 hover:opacity-100 hover:underline">{lang === "uz" ? c.uz : c.ru}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-70">{t("help")}</h3>
          <ul className="space-y-2 text-sm opacity-85">
            <li>{t("delivery")}: {t("deliveryText")}</li>
            <li>{t("warranty")}: {t("warrantyText")}</li>
            <li>{t("returns")} — 14 {lang === "uz" ? "kun (demo)" : "дней (демо)"}</li>
            <li>{t("privacy")}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider opacity-70">{t("about")}</h3>
          <ul className="space-y-2 text-sm opacity-85">
            <li>{settings.phone}</li>
            <li>{settings.email}</li>
            <li>{lang === "uz" ? "Manzil: ko'rsatilmagan (demo)" : "Адрес: не указан (демо)"}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs opacity-60">
        © 2026 {settings.storeName}. {lang === "uz" ? "Demo do'kon. Barcha huquqlar himoyalangan." : "Демо-магазин. Все права защищены."}
      </div>
    </footer>
  );
}
