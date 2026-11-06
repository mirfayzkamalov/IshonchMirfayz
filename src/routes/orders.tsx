import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { fmt } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Buyurtmalar tarixi — MirfayzIshonch" },
      { name: "description", content: "Sizning demo buyurtmalaringiz va ularning holati." },
      { property: "og:title", content: "Buyurtmalar — MirfayzIshonch" },
      { property: "og:description", content: "Buyurtmalar tarixi." },
    ],
  }),
  component: OrdersPage,
});

export function OrdersList() {
  const { orders, t } = useStore();
  if (!orders.length)
    return (
      <div className="rounded-3xl border bg-card p-12 text-center">
        <Package className="mx-auto h-12 w-12 animate-float text-primary" />
        <p className="mt-3 font-semibold">{t("orders")}: 0</p>
        <Link to="/products" className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{t("continue")}</Link>
      </div>
    );
  return (
    <ul className="space-y-3">
      {orders.map((o, i) => (
        <li key={o.id} className="animate-rise rounded-3xl border bg-card p-5 shadow-soft" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold">№ {o.id}</span>
            <span className="rounded-full bg-olive-light px-3 py-1 text-xs font-bold text-primary-dark">{o.status}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()} · {t(o.payment)}</div>
          <div className="mt-3 text-sm">{o.items.map((x) => `${x.name} × ${x.qty}`).join(", ")}</div>
          <div className="mt-2 font-extrabold text-primary-dark">{fmt(o.total)}</div>
        </li>
      ))}
    </ul>
  );
}

function OrdersPage() {
  const { t } = useStore();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">{t("orders")}</h1>
      <OrdersList />
    </div>
  );
}
