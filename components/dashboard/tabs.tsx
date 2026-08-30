"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Shared helpers ──────────────────────────────────────────────

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

function LoadingState() {
  return (
    <GlassCard className="p-12">
      <div className="flex items-center justify-center gap-3 text-zinc-400">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="text-sm">Loading…</span>
      </div>
    </GlassCard>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <GlassCard className="p-12">
      <p className="text-center text-sm text-rose-500">
        Failed to load: {message}
      </p>
    </GlassCard>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <GlassCard className="p-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </div>
        <p className="text-sm text-zinc-400">{message}</p>
      </div>
    </GlassCard>
  );
}

function PageHeader({ title, subtitle, count }: { title: string; subtitle: string; count?: number }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>
      {count !== undefined && (
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {count} total
        </span>
      )}
    </div>
  );
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtPrice(cents: number, currency = "eur") {
  const symbols: Record<string, string> = { eur: "€", bgn: "лв", usd: "$" };
  const sym = symbols[currency] || "€";
  return `${sym}${(cents / 100).toFixed(2)}`;
}

// ─── Events tab ──────────────────────────────────────────────────

const eventStatusColors: Record<string, "paid" | "pending" | "refunded"> = {
  upcoming: "paid",
  past: "refunded",
  cancelled: "pending",
};

export function EventsTab() {
  const { data, loading, error } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/events");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Events" subtitle="Manage seminars and workshops" count={data?.totalDocs} />
      {data?.docs.length === 0 ? (
        <EmptyState message="No events yet. Create one in the Payload admin." />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>Title</TH>
                <TH>Location</TH>
                <TH>Starts</TH>
                <TH>Capacity</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((e) => (
                <TR key={e.id}>
                  <TD className="font-medium text-zinc-900">{e.title}</TD>
                  <TD className="text-zinc-600">{e.location}</TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(e.startsAt)}</TD>
                  <TD className="font-mono text-zinc-700">{e.capacity}</TD>
                  <TD><Badge variant={eventStatusColors[e.status] || "default"}>{e.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Blog tab ────────────────────────────────────────────────────

const blogStatusColors: Record<string, "paid" | "pending" | "refunded"> = {
  published: "paid",
  draft: "pending",
  scheduled: "pending",
};

export function BlogTab() {
  const { data, loading, error } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/blog-posts");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Blog" subtitle="Published posts and drafts" count={data?.totalDocs} />
      {data?.docs.length === 0 ? (
        <EmptyState message="No blog posts yet. Create one in the Payload admin." />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>Title</TH>
                <TH>Excerpt</TH>
                <TH>Publish date</TH>
                <TH>Visibility</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((p) => (
                <TR key={p.id}>
                  <TD className="font-medium text-zinc-900">{p.title}</TD>
                  <TD className="max-w-xs truncate text-zinc-600">{p.excerpt || "—"}</TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(p.publishAt)}</TD>
                  <TD className="text-zinc-600">{p.visibility}</TD>
                  <TD><Badge variant={blogStatusColors[p.status] || "default"}>{p.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Products tab ────────────────────────────────────────────────

export function ProductsTab() {
  const { data, loading, error } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/products");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Products" subtitle="Shop inventory and digital goods" count={data?.totalDocs} />
      {data?.docs.length === 0 ? (
        <EmptyState message="No products yet. Create one in the Payload admin." />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>Name</TH>
                <TH>Category</TH>
                <TH>Type</TH>
                <TH className="text-right">Price</TH>
                <TH>Inventory</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((p) => (
                <TR key={p.id}>
                  <TD className="font-medium text-zinc-900">{p.name}</TD>
                  <TD className="text-zinc-600">{p.category}</TD>
                  <TD className="text-zinc-600">{p.productType}</TD>
                  <TD className="text-right font-mono font-medium text-zinc-900">{fmtPrice(p.priceCents)}</TD>
                  <TD className="font-mono text-zinc-700">{p.productType === "physical" ? p.inventory : "—"}</TD>
                  <TD><Badge variant={p.status === "published" ? "paid" : p.status === "draft" ? "pending" : "refunded"}>{p.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Orders tab ──────────────────────────────────────────────────

const orderStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  paid: "paid",
  pending: "pending",
  refunded: "refunded",
  cancelled: "refunded",
};

export function OrdersTab() {
  const { data, loading, error } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/orders");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Orders" subtitle="All transactions" count={data?.totalDocs} />
      {data?.docs.length === 0 ? (
        <EmptyState message="No orders yet. They'll appear here after Stripe checkout." />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>Order ID</TH>
                <TH>Items</TH>
                <TH className="text-right">Total</TH>
                <TH>Date</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((o) => (
                <TR key={o.id}>
                  <TD className="font-mono text-xs text-zinc-500">#{o.id}</TD>
                  <TD className="text-zinc-600">
                    {o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? "s" : ""}
                  </TD>
                  <TD className="text-right font-mono font-medium text-zinc-900">{fmtPrice(o.totalCents, o.currency)}</TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(o.createdAt)}</TD>
                  <TD><Badge variant={orderStatusVariant[o.status] || "default"}>{o.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Subscribers tab ─────────────────────────────────────────────

const subStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  active: "paid",
  trialing: "pending",
  past_due: "pending",
  cancelled: "refunded",
  incomplete: "pending",
};

export function SubscribersTab() {
  const { data, loading, error } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/subscriptions");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Subscribers" subtitle="Active and past subscriptions" count={data?.totalDocs} />
      {data?.docs.length === 0 ? (
        <EmptyState message="No subscribers yet. They'll appear here after Stripe checkout." />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>ID</TH>
                <TH>Tier</TH>
                <TH>Period start</TH>
                <TH>Period end</TH>
                <TH>Cancel at period end</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((s) => (
                <TR key={s.id}>
                  <TD className="font-mono text-xs text-zinc-500">#{s.id}</TD>
                  <TD className="text-zinc-600">{s.tier || "—"}</TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(s.currentPeriodStart)}</TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(s.currentPeriodEnd)}</TD>
                  <TD className="text-zinc-600">{s.cancelAtPeriodEnd ? "Yes" : "No"}</TD>
                  <TD><Badge variant={subStatusVariant[s.status] || "default"}>{s.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Settings tab (presentational) ───────────────────────────────

export function SettingsTab() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Studio configuration" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900">Studio profile</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Studio name</label>
              <input
                type="text"
                defaultValue="Личностно овластяване"
                className="w-full rounded-lg border border-white/60 bg-white/40 px-3 py-2 text-sm text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Support email</label>
              <input
                type="email"
                defaultValue="info@lichnostno.bg"
                className="w-full rounded-lg border border-white/60 bg-white/40 px-3 py-2 text-sm text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">Currency</label>
              <select className="w-full rounded-lg border border-white/60 bg-white/40 px-3 py-2 text-sm text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700">
                <option>EUR (€)</option>
                <option>BGN (лв)</option>
                <option>USD ($)</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-zinc-900">Integrations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/40 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white text-xs font-bold">S</div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">Stripe</p>
                  <p className="text-xs text-zinc-500">Connected · Live mode</p>
                </div>
              </div>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/40 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-400 text-white text-xs font-bold">R</div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">Resend</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
              </div>
              <button className="text-xs font-medium text-indigo-700 hover:text-indigo-800">Connect</button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/40 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-400 text-white text-xs font-bold">C</div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">Cal.com</p>
                  <p className="text-xs text-zinc-500">Not connected</p>
                </div>
              </div>
              <button className="text-xs font-medium text-indigo-700 hover:text-indigo-800">Connect</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
