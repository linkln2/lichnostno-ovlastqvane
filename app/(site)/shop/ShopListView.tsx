"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import type { ShopProduct } from "@/lib/api";

export default function ShopPage({ products }: { products: ShopProduct[] }) {
  const { locale } = useLocale();

  const t = {
    title: locale === "bg" ? "Магазин" : "Shop",
    subtitle:
      locale === "bg"
        ? "Цифрови продукти, курсове и материали."
        : "Digital products, courses, and materials.",
    soldOut: locale === "bg" ? "Изчерпано" : "Sold out",
    empty: locale === "bg" ? "Няма продукти все още." : "No products yet.",
  };

  function fmtPrice(cents: number) {
    return `€${(cents / 100).toFixed(0)}`;
  }

  function imageUrl(img: any): string | null {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (img.url) return img.url;
    if (img.sizes?.thumbnail?.url) return img.sizes.thumbnail.url;
    return null;
  }

  function isSoldOut(p: ShopProduct) {
    return p.productType === "physical" && typeof p.inventory === "number" && p.inventory <= 0;
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-lg text-stone-600">{t.subtitle}</p>
        </div>
      </section>

      {/* Product grid — 2-col on mobile, 3-4 on larger */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {products.length === 0 ? (
          <p className="py-20 text-center text-lg text-stone-500">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const img = p.images?.[0];
              const url = imageUrl(img) || p.image;
              const soldOut = isSoldOut(p);
              return (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md ${
                    soldOut ? "opacity-60" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-square w-full overflow-hidden bg-stone-100">
                    {url ? (
                      <img
                        src={url}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-300">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.5-3.5L7 22" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-stone-900 sm:text-base">
                      {p.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-amber-700">
                        {fmtPrice(p.priceCents)}
                      </span>
                      {soldOut && (
                        <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-500">
                          {t.soldOut}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
