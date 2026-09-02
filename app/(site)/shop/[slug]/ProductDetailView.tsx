"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";

type Product = {
  id: number;
  name: string;
  slug: string;
  priceCents: number;
  category: string;
  productType: string;
  inventory: number;
  images: any[];
  image?: string;
  description: any;
  downloadFile?: { id: number | string; url: string | null; filename?: string | null } | null;
};

export default function ProductDetailPage() {
  const { locale } = useLocale();
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  // Checkout state
  const [email, setEmail] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error">("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(async (r) => {
        if (r.status === 404) {
          setNotFoundFlag(true);
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setProduct(d);
      })
      .catch(() => setNotFoundFlag(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (notFoundFlag) return notFound();
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <svg className="h-8 w-8 animate-spin text-amber-600" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (!product) return notFound();

  function fmtPrice(cents: number) {
    return `€${(cents / 100).toFixed(0)}`;
  }

  function imageUrl(img: any): string | null {
    if (!img) return null;
    if (typeof img === "string") return img;
    if (img.url) return img.url;
    return null;
  }

  function isSoldOut() {
    return (
      product!.productType === "physical" &&
      typeof product!.inventory === "number" &&
      product!.inventory <= 0
    );
  }

  async function handleBuy() {
    setShowEmailModal(true);
    setCheckoutStatus("idle");
    setCheckoutError("");
  }

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutStatus("loading");
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product!.id,
          customerEmail: email,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCheckoutStatus("error");
        setCheckoutError(data.error || "Checkout failed");
        return;
      }

      window.location.href = data.url;
    } catch {
      setCheckoutStatus("error");
      setCheckoutError("Network error");
    }
  }

  // Render rich text description (Payload Lexical format — simplified)
  function renderDescription(desc: any): React.ReactNode {
    if (!desc) return null;
    if (typeof desc === "string") return <p className="leading-relaxed text-stone-600">{desc}</p>;
    // Lexical JSON — extract text nodes
    if (desc.root?.children) {
      const text = desc.root.children
        .map((node: any) => {
          if (node.type === "text") return node.text;
          if (node.children) return node.children.map((c: any) => c.text || "").join("");
          return "";
        })
        .join("\n");
      return (
        <div className="space-y-3">
          {text.split("\n").filter(Boolean).map((line: string, i: number) => (
            <p key={i} className="leading-relaxed text-stone-600">{line}</p>
          ))}
        </div>
      );
    }
    return null;
  }

  const t = {
    back: locale === "bg" ? "Магазин" : "Shop",
    buy: locale === "bg" ? "Купи сега" : "Buy now",
    soldOut: locale === "bg" ? "Изчерпано" : "Sold out",
    emailLabel: locale === "bg" ? "Имейл" : "Email",
    continue: locale === "bg" ? "Продължи" : "Continue",
    cancel: locale === "bg" ? "Отказ" : "Cancel",
    enterEmail: locale === "bg" ? "Въведи имейл за покупка" : "Enter your email to buy",
    description: locale === "bg" ? "Описание" : "Description",
    inStock: locale === "bg" ? "В наличност" : "In stock",
    digital: locale === "bg" ? "Цифров продукт" : "Digital product",
  };

  const soldOut = isSoldOut();
  const mainImg = product.images?.[0];
  const mainImgUrl = imageUrl(mainImg) || product.image;

  return (
    <>
      {/* Back link */}
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <Link href="/shop" className="text-sm text-stone-500 hover:text-stone-800">
          ← {t.back}
        </Link>
      </div>

      {/* Product detail */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
            {mainImgUrl ? (
              <img
                src={mainImgUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-300">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.5-3.5L7 22" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-amber-700">
              {fmtPrice(product.priceCents)}
            </p>

            {/* Stock / type badge */}
            <div className="mt-3 flex gap-2">
              {product.productType === "digital" ? (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  {t.digital}
                </span>
              ) : soldOut ? (
                <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-stone-500">
                  {t.soldOut}
                </span>
              ) : (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {t.inStock}: {product.inventory}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
                  {t.description}
                </h2>
                {renderDescription(product.description)}
              </div>
            )}

            {/* Desktop buy button */}
            <div className="mt-8 hidden md:block">
              <button
                onClick={handleBuy}
                disabled={soldOut}
                className="w-full rounded-full bg-amber-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {soldOut ? t.soldOut : `${t.buy} → ${fmtPrice(product.priceCents)}`}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky bottom buy bar — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-stone-500">{product.name}</p>
            <p className="text-xl font-bold text-amber-700">{fmtPrice(product.priceCents)}</p>
          </div>
          <button
            onClick={handleBuy}
            disabled={soldOut}
            className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {soldOut ? t.soldOut : t.buy}
          </button>
        </div>
      </div>

      {/* Spacer for sticky bar on mobile */}
      <div className="h-20 md:hidden" />

      {/* Email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-stone-200 bg-white p-6 shadow-xl sm:rounded-2xl">
            <h2 className="text-lg font-bold text-stone-900">{t.enterEmail}</h2>
            <p className="mt-1 text-sm text-stone-500">
              {product.name} · {fmtPrice(product.priceCents)}
            </p>
            <form onSubmit={handleCheckoutSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  inputMode="email"
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="you@example.com"
                />
              </div>

              {checkoutStatus === "error" && (
                <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
                  {checkoutError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={checkoutStatus === "loading"}
                  className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
                >
                  {checkoutStatus === "loading"
                    ? locale === "bg" ? "Отваряне…" : "Opening…"
                    : t.continue}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
