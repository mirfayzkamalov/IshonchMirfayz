import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function MarqueeRow({ title, items, duration = 45, to }: { title: string; items: Product[]; duration?: number; to?: string }) {
  const { t } = useStore();
  if (!items.length) return null;
  // Repeat the list so the track is always wider than the viewport, then duplicate for a seamless loop.
  const base = items.length < 6 ? [...items, ...items, ...items].slice(0, Math.max(6, items.length)) : items;
  const loop = [...base, ...base];
  return (
    <Reveal as="section" className="py-6">
      <div className="mx-auto mb-4 flex max-w-7xl items-end justify-between px-4">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        {to && (
          <a href={to} className="group flex items-center gap-1 text-sm font-semibold text-primary">
            {t("viewAll")} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        )}
      </div>
      <div className="marquee-row">
        <div className="marquee-track gap-5 px-2 py-4" style={{ ["--marquee-duration" as string]: `${duration}s` }}>
          {loop.map((p, i) => (
            <div key={p.id + i} aria-hidden={i >= base.length ? true : undefined} className="pr-0">
              <ProductCard p={p} compact />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export { Link };
