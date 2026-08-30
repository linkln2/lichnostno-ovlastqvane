"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Pencil, Plus, Trash2, Upload, X, Star, Package } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Modal, Field, inputClass, selectClass, FormActions } from "./Modal";
import { cn } from "@/lib/utils";

// ─── Shared helpers ──────────────────────────────────────────────

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

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
  }, [url, reloadKey]);

  return { data, loading, error, reload };
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
      <p className="text-center text-sm text-rose-500">Failed to load: {message}</p>
    </GlassCard>
  );
}

function EmptyState({ message, onCreate, createLabel }: { message: string; onCreate?: () => void; createLabel?: string }) {
  return (
    <GlassCard className="p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </div>
        <p className="text-sm text-zinc-400">{message}</p>
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
          >
            <Plus className="h-4 w-4" />
            {createLabel || "Create"}
          </button>
        )}
      </div>
    </GlassCard>
  );
}

function PageHeader({
  title,
  subtitle,
  count,
  onCreate,
  createLabel,
}: {
  title: string;
  subtitle: string;
  count?: number;
  onCreate?: () => void;
  createLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {count !== undefined && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {count} total
          </span>
        )}
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            {createLabel || "Create"}
          </button>
        )}
      </div>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onEdit}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-700 outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtPrice(cents: number, currency = "eur") {
  const symbols: Record<string, string> = { eur: "€", bgn: "€", usd: "$" };
  return `${symbols[currency] || "€"}${(cents / 100).toFixed(2)}`;
}

async function apiCall(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Products tab ────────────────────────────────────────────────

const productStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  published: "paid",
  draft: "pending",
  archived: "refunded",
};

export function ProductsTab() {
  const { data, loading, error, reload } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/products");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    excerpt: "",
    priceCents: "",
    compareAtCents: "",
    currency: "eur",
    sku: "",
    category: "digital",
    productType: "digital",
    tags: "",
    inventory: "0",
    lowStockThreshold: "5",
    weightGrams: "",
    status: "draft",
    featured: false,
    stripePriceId: "",
    seoTitle: "",
    seoDescription: "",
  });

  function openCreate() {
    setEditing(null);
    setForm({
      name: "", slug: "", excerpt: "", priceCents: "", compareAtCents: "",
      currency: "eur", sku: "", category: "digital", productType: "digital",
      tags: "", inventory: "0", lowStockThreshold: "5", weightGrams: "",
      status: "draft", featured: false, stripePriceId: "", seoTitle: "", seoDescription: "",
    });
    setImageUrls([]);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(p: any) {
    setEditing(p);
    setForm({
      name: p.name || "",
      slug: p.slug || "",
      excerpt: p.excerpt || "",
      priceCents: String(p.priceCents ?? ""),
      compareAtCents: String(p.compareAtCents ?? ""),
      currency: p.currency || "eur",
      sku: p.sku || "",
      category: p.category || "digital",
      productType: p.productType || "digital",
      tags: p.tags || "",
      inventory: String(p.inventory ?? "0"),
      lowStockThreshold: String(p.lowStockThreshold ?? "5"),
      weightGrams: String(p.weightGrams ?? ""),
      status: p.status || "draft",
      featured: p.featured || false,
      stripePriceId: p.stripePriceId || "",
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
    });
    setImageUrls(p.images || []);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", file.name);
        const res = await fetch("/api/dashboard/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        if (data.url) {
          setImageUrls((prev) => [...prev, data.url]);
        }
      }
    } catch (err) {
      setFormError(`Image upload failed: ${err}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, images: imageUrls };
      if (editing) {
        await apiCall(`/api/dashboard/products/${editing.id}`, "PATCH", payload);
      } else {
        await apiCall("/api/dashboard/products", "POST", payload);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: any) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await apiCall(`/api/dashboard/products/${p.id}`, "DELETE");
      reload();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Products" subtitle="Shop inventory and digital goods" count={data?.totalDocs} onCreate={openCreate} createLabel="New product" />
      {data?.docs.length === 0 ? (
        <EmptyState message="No products yet." onCreate={openCreate} createLabel="New product" />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>Image</TH>
                <TH>Name</TH>
                <TH>Category</TH>
                <TH className="text-right">Price</TH>
                <TH>Inventory</TH>
                <TH>Status</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((p) => (
                <TR key={p.id}>
                  <TD>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-300">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </TD>
                  <TD className="font-medium text-zinc-900">
                    <div className="flex items-center gap-1.5">
                      {p.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      {p.name}
                    </div>
                  </TD>
                  <TD className="text-zinc-600">{p.category}</TD>
                  <TD className="text-right font-mono font-medium text-zinc-900">
                    {fmtPrice(p.priceCents, p.currency)}
                    {p.compareAtCents > 0 && (
                      <span className="ml-1 text-xs text-zinc-400 line-through">{fmtPrice(p.compareAtCents, p.currency)}</span>
                    )}
                  </TD>
                  <TD className="font-mono text-zinc-700">{p.productType === "physical" ? p.inventory : "—"}</TD>
                  <TD><Badge variant={productStatusVariant[p.status] || "default"}>{p.status}</Badge></TD>
                  <TD><RowActions onEdit={() => openEdit(p)} onDelete={() => handleDelete(p)} /></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit product" : "New product"} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">Product images</label>
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-stone-200">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute right-1 top-1 rounded-full bg-rose-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-stone-300 text-stone-400 transition-colors hover:border-amber-400 hover:text-amber-600 disabled:opacity-50"
              >
                {uploading ? (
                  <span className="text-xs">Uploading…</span>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span className="text-xs">Upload</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </div>
          </div>

          {/* Name + Slug */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="Slug"><input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" /></Field>
          </div>

          {/* Excerpt */}
          <Field label="Short description / excerpt"><textarea className={inputClass} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief product summary shown in grid" /></Field>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Price (cents)"><input type="number" className={inputClass} value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: e.target.value })} required placeholder="1900 = €19.00" /></Field>
            <Field label="Compare-at (cents)"><input type="number" className={inputClass} value={form.compareAtCents} onChange={(e) => setForm({ ...form, compareAtCents: e.target.value })} placeholder="0 = none" /></Field>
            <Field label="Currency">
              <select className={selectClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="eur">EUR (€)</option>
                <option value="usd">USD ($)</option>
              </select>
            </Field>
            <Field label="SKU"><input className={inputClass} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="optional" /></Field>
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select className={selectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
                <option value="merchandise">Merchandise</option>
                <option value="course">Course</option>
                <option value="bracelets">Bracelets</option>
                <option value="crystals">Crystals</option>
                <option value="potions">Potions</option>
              </select>
            </Field>
            <Field label="Product type">
              <select className={selectClass} value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })}>
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
              </select>
            </Field>
          </div>

          {/* Tags */}
          <Field label="Tags"><input className={inputClass} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="bestseller, new, limited" /></Field>

          {/* Physical-only fields */}
          {form.productType === "physical" && (
            <div className="grid grid-cols-3 gap-4">
              <Field label="Inventory"><input type="number" className={inputClass} value={form.inventory} onChange={(e) => setForm({ ...form, inventory: e.target.value })} /></Field>
              <Field label="Low stock alert"><input type="number" className={inputClass} value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} /></Field>
              <Field label="Weight (g)"><input type="number" className={inputClass} value={form.weightGrams} onChange={(e) => setForm({ ...form, weightGrams: e.target.value })} placeholder="0" /></Field>
            </div>
          )}

          {/* Status + Featured */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <select className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <Star className="h-4 w-4 text-amber-400" />
                Featured product
              </label>
            </div>
          </div>

          {/* Stripe */}
          <Field label="Stripe Price ID"><input className={inputClass} value={form.stripePriceId} onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })} placeholder="price_... (optional, for checkout)" /></Field>

          {/* SEO */}
          <div className="border-t border-stone-200 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">SEO (optional)</p>
            <div className="space-y-3">
              <Field label="SEO title"><input className={inputClass} value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Custom title for search engines" /></Field>
              <Field label="SEO description"><textarea className={inputClass} rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} placeholder="Meta description for search engines" /></Field>
            </div>
          </div>

          {formError && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{formError}</p>}
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update product" : "Create product"} />
        </form>
      </Modal>
    </div>
  );
}

// ─── Events tab ──────────────────────────────────────────────────

const eventStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  upcoming: "paid",
  past: "refunded",
  cancelled: "pending",
};

export function EventsTab() {
  const { data, loading, error, reload } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/events");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    titleBg: "", titleEn: "", slug: "", locationBg: "", locationEn: "",
    startsAt: "", endsAt: "", capacity: "0", status: "upcoming",
  });

  function openCreate() {
    setEditing(null);
    setForm({ titleBg: "", titleEn: "", slug: "", locationBg: "", locationEn: "", startsAt: "", endsAt: "", capacity: "0", status: "upcoming" });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(e: any) {
    setEditing(e);
    setForm({
      titleBg: "", titleEn: e.title || "", slug: e.slug || "",
      locationBg: "", locationEn: e.location || "",
      startsAt: e.startsAt ? e.startsAt.slice(0, 16) : "",
      endsAt: e.endsAt ? e.endsAt.slice(0, 16) : "",
      capacity: String(e.capacity ?? "0"),
      status: e.status || "upcoming",
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form };
      if (editing) {
        await apiCall(`/api/dashboard/events/${editing.id}`, "PATCH", payload);
      } else {
        await apiCall("/api/dashboard/events", "POST", payload);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(e: any) {
    if (!confirm(`Delete "${e.title}"?`)) return;
    try {
      await apiCall(`/api/dashboard/events/${e.id}`, "DELETE");
      reload();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Events" subtitle="Seminars and workshops" count={data?.totalDocs} onCreate={openCreate} createLabel="New event" />
      {data?.docs.length === 0 ? (
        <EmptyState message="No events yet." onCreate={openCreate} createLabel="New event" />
      ) : (
        <div className="space-y-4">
          {data?.docs.map((e) => (
            <EventRow key={e.id} event={e} onEdit={() => openEdit(e)} onDelete={() => handleDelete(e)} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit event" : "New event"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title (BG)"><input className={inputClass} value={form.titleBg} onChange={(e) => setForm({ ...form, titleBg: e.target.value })} placeholder="Български" /></Field>
            <Field label="Title (EN)"><input className={inputClass} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required placeholder="English" /></Field>
          </div>
          <Field label="Slug"><input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="my-event-2026" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location (BG)"><input className={inputClass} value={form.locationBg} onChange={(e) => setForm({ ...form, locationBg: e.target.value })} /></Field>
            <Field label="Location (EN)"><input className={inputClass} value={form.locationEn} onChange={(e) => setForm({ ...form, locationEn: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Starts at"><input type="datetime-local" className={inputClass} value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required /></Field>
            <Field label="Ends at"><input type="datetime-local" className={inputClass} value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Capacity"><input type="number" className={inputClass} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required /></Field>
            <Field label="Status">
              <select className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>
          </div>
          {formError && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{formError}</p>}
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update" : "Create"} />
        </form>
      </Modal>
    </div>
  );
}

// ─── Event row with expandable ticket packages ───────────────────

function EventRow({ event, onEdit, onDelete }: { event: any; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard>
      {/* Event header row */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-3 text-left outline-none"
        >
          <svg
            className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${expanded ? "rotate-90" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-zinc-900">{event.title}</p>
            <p className="truncate text-xs text-zinc-500">{event.location} · {fmtDate(event.startsAt)}</p>
          </div>
        </button>
        <Badge variant={eventStatusVariant[event.status] || "default"}>{event.status}</Badge>
        <span className="hidden font-mono text-xs text-zinc-500 sm:inline">cap: {event.capacity}</span>
        <RowActions onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Expanded: ticket packages */}
      {expanded && <EventPackages eventId={event.id} />}
    </GlassCard>
  );
}

function EventPackages({ eventId }: { eventId: number }) {
  const { data, loading, error, reload } = useFetch<{ docs: any[]; totalDocs: number }>(
    `/api/dashboard/event-packages?eventId=${eventId}`
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nameBg: "", nameEn: "", priceCents: "", priceDisplayBg: "", priceDisplayEn: "",
    spotsBg: "", spotsEn: "", stripePriceId: "", capacity: "0",
  });

  function openCreate() {
    setEditing(null);
    setForm({ nameBg: "", nameEn: "", priceCents: "", priceDisplayBg: "", priceDisplayEn: "", spotsBg: "", spotsEn: "", stripePriceId: "", capacity: "0" });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(p: any) {
    setEditing(p);
    setForm({
      nameBg: "", nameEn: p.name || "",
      priceCents: String(p.priceCents ?? ""),
      priceDisplayBg: "", priceDisplayEn: p.priceDisplay || "",
      spotsBg: "", spotsEn: p.spots || "",
      stripePriceId: p.stripePriceId || "",
      capacity: String(p.capacity ?? "0"),
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, eventId };
      if (editing) {
        await apiCall(`/api/dashboard/event-packages/${editing.id}`, "PATCH", payload);
      } else {
        await apiCall("/api/dashboard/event-packages", "POST", payload);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: any) {
    if (!confirm(`Delete package "${p.name}"?`)) return;
    try {
      await apiCall(`/api/dashboard/event-packages/${p.id}`, "DELETE");
      reload();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  }

  return (
    <div className="border-t border-white/60 px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ticket packages</h4>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-800"
        >
          <Plus className="h-3.5 w-3.5" />
          Add tier
        </button>
      </div>

      {loading ? (
        <p className="py-4 text-center text-sm text-zinc-400">Loading…</p>
      ) : error ? (
        <p className="py-4 text-center text-sm text-rose-500">Error: {error}</p>
      ) : data?.docs.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-400">No ticket packages yet. Add one to start selling.</p>
      ) : (
        <div className="space-y-2">
          {data?.docs.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/40 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{p.name}</p>
                <p className="text-xs text-zinc-500">
                  {fmtPrice(p.priceCents)} · cap: {p.capacity || "∞"} · {p.stripePriceId ? "Stripe ✓" : "No Stripe ID"}
                </p>
              </div>
              <RowActions onEdit={() => openEdit(p)} onDelete={() => handleDelete(p)} />
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit package" : "New ticket package"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name (BG)"><input className={inputClass} value={form.nameBg} onChange={(e) => setForm({ ...form, nameBg: e.target.value })} placeholder="Български" /></Field>
            <Field label="Name (EN)"><input className={inputClass} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required placeholder="English" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (cents)"><input type="number" className={inputClass} value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: e.target.value })} required placeholder="e.g. 8900 = €89.00" /></Field>
            <Field label="Capacity"><input type="number" className={inputClass} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="0 = unlimited" /></Field>
          </div>
          <Field label="Stripe Price ID"><input className={inputClass} value={form.stripePriceId} onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })} required placeholder="price_..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price display (BG)"><input className={inputClass} value={form.priceDisplayBg} onChange={(e) => setForm({ ...form, priceDisplayBg: e.target.value })} placeholder="8900 лв" /></Field>
            <Field label="Price display (EN)"><input className={inputClass} value={form.priceDisplayEn} onChange={(e) => setForm({ ...form, priceDisplayEn: e.target.value })} placeholder="€89" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Spots included (BG)"><textarea className={inputClass} rows={2} value={form.spotsBg} onChange={(e) => setForm({ ...form, spotsBg: e.target.value })} placeholder="Какво включва..." /></Field>
            <Field label="Spots included (EN)"><textarea className={inputClass} rows={2} value={form.spotsEn} onChange={(e) => setForm({ ...form, spotsEn: e.target.value })} placeholder="What's included..." /></Field>
          </div>
          {formError && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{formError}</p>}
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update" : "Create"} />
        </form>
      </Modal>
    </div>
  );
}

// ─── Blog tab ────────────────────────────────────────────────────

const blogStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  published: "paid",
  draft: "pending",
  scheduled: "pending",
};

export function BlogTab() {
  const { data, loading, error, reload } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/blog-posts");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    titleBg: "", titleEn: "", slug: "", excerptBg: "", excerptEn: "",
    status: "draft", visibility: "public", publishAt: "",
  });

  function openCreate() {
    setEditing(null);
    setForm({ titleBg: "", titleEn: "", slug: "", excerptBg: "", excerptEn: "", status: "draft", visibility: "public", publishAt: "" });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(p: any) {
    setEditing(p);
    setForm({
      titleBg: "", titleEn: p.title || "", slug: p.slug || "",
      excerptBg: "", excerptEn: p.excerpt || "",
      status: p.status || "draft", visibility: p.visibility || "public",
      publishAt: p.publishAt ? p.publishAt.slice(0, 16) : "",
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await apiCall(`/api/dashboard/blog-posts/${editing.id}`, "PATCH", form);
      } else {
        await apiCall("/api/dashboard/blog-posts", "POST", form);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: any) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await apiCall(`/api/dashboard/blog-posts/${p.id}`, "DELETE");
      reload();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Blog" subtitle="Published posts and drafts" count={data?.totalDocs} onCreate={openCreate} createLabel="New post" />
      {data?.docs.length === 0 ? (
        <EmptyState message="No blog posts yet." onCreate={openCreate} createLabel="New post" />
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
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((p) => (
                <TR key={p.id}>
                  <TD className="font-medium text-zinc-900">{p.title}</TD>
                  <TD className="max-w-xs truncate text-zinc-600">{p.excerpt || "—"}</TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(p.publishAt)}</TD>
                  <TD className="text-zinc-600">{p.visibility}</TD>
                  <TD><Badge variant={blogStatusVariant[p.status] || "default"}>{p.status}</Badge></TD>
                  <TD><RowActions onEdit={() => openEdit(p)} onDelete={() => handleDelete(p)} /></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit post" : "New post"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title (BG)"><input className={inputClass} value={form.titleBg} onChange={(e) => setForm({ ...form, titleBg: e.target.value })} /></Field>
            <Field label="Title (EN)"><input className={inputClass} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} required /></Field>
          </div>
          <Field label="Slug"><input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="my-post" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Excerpt (BG)"><textarea className={inputClass} rows={2} value={form.excerptBg} onChange={(e) => setForm({ ...form, excerptBg: e.target.value })} /></Field>
            <Field label="Excerpt (EN)"><textarea className={inputClass} rows={2} value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Status">
              <select className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </Field>
            <Field label="Visibility">
              <select className={selectClass} value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                <option value="public">Public</option>
                <option value="members-only">Members only</option>
              </select>
            </Field>
            <Field label="Publish at"><input type="datetime-local" className={inputClass} value={form.publishAt} onChange={(e) => setForm({ ...form, publishAt: e.target.value })} /></Field>
          </div>
          {formError && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{formError}</p>}
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update" : "Create"} />
        </form>
      </Modal>
    </div>
  );
}

// ─── Orders tab (read-only) ──────────────────────────────────────

const orderStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  paid: "paid",
  pending: "pending",
  refunded: "refunded",
  cancelled: "refunded",
};

export function OrdersTab() {
  const { data, loading, error, reload } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/orders");
  const [refunding, setRefunding] = useState<number | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);

  async function handleRefund(orderId: number) {
    if (!confirm(`Refund order #${orderId}? This will issue a full refund via Stripe.`)) return;
    setRefunding(orderId);
    setRefundError(null);
    try {
      const res = await apiCall(`/api/dashboard/orders/${orderId}/refund`, "POST");
      reload();
    } catch (err) {
      setRefundError(String(err));
    } finally {
      setRefunding(null);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Orders" subtitle="All transactions" count={data?.totalDocs} />
      {refundError && (
        <p className="mb-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{refundError}</p>
      )}
      {data?.docs.length === 0 ? (
        <EmptyState message="No orders yet. They'll appear here after Stripe checkout." />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>Order ID</TH>
                <TH>Source</TH>
                <TH>Items</TH>
                <TH className="text-right">Total</TH>
                <TH>Date</TH>
                <TH>Status</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((o) => (
                <TR key={o.id}>
                  <TD className="font-mono text-xs text-zinc-500">#{o.id}</TD>
                  <TD>
                    {o.source && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        {o.source}
                      </span>
                    )}
                  </TD>
                  <TD className="text-zinc-600">{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? "s" : ""}</TD>
                  <TD className="text-right font-mono font-medium text-zinc-900">{fmtPrice(o.totalCents, o.currency)}</TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(o.createdAt)}</TD>
                  <TD><Badge variant={orderStatusVariant[o.status] || "default"}>{o.status}</Badge></TD>
                  <TD>
                    {o.status === "paid" && (
                      <button
                        onClick={() => handleRefund(o.id)}
                        disabled={refunding === o.id}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                      >
                        {refunding === o.id ? "Refunding…" : "Refund"}
                      </button>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Subscribers tab (with tiers management) ─────────────────────

const subStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  active: "paid",
  trialing: "pending",
  past_due: "pending",
  cancelled: "refunded",
  incomplete: "pending",
};

export function SubscribersTab() {
  const { data: subData, loading: subLoading, error: subError } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/subscriptions");
  const { data: tierData, loading: tierLoading, error: tierError, reload: reloadTiers } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/subscription-tiers");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [perksInput, setPerksInput] = useState("");
  const [form, setForm] = useState({
    name: "", priceCents: "", interval: "month", stripePriceId: "",
  });

  function openCreateTier() {
    setEditing(null);
    setForm({ name: "", priceCents: "", interval: "month", stripePriceId: "" });
    setPerksInput("");
    setFormError(null);
    setModalOpen(true);
  }

  function openEditTier(t: any) {
    setEditing(t);
    setForm({
      name: t.name || "",
      priceCents: String(t.priceCents ?? ""),
      interval: t.interval || "month",
      stripePriceId: t.stripePriceId || "",
    });
    setPerksInput((t.perks || []).map((p: any) => p.perk).join("\n"));
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const perks = perksInput.split("\n").map((p) => p.trim()).filter(Boolean);
      const payload = { ...form, perks };
      if (editing) {
        await apiCall(`/api/dashboard/subscription-tiers/${editing.id}`, "PATCH", payload);
      } else {
        await apiCall("/api/dashboard/subscription-tiers", "POST", payload);
      }
      setModalOpen(false);
      reloadTiers();
    } catch (err) {
      setFormError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTier(t: any) {
    if (!confirm(`Delete tier "${t.name}"?`)) return;
    try {
      await apiCall(`/api/dashboard/subscription-tiers/${t.id}`, "DELETE");
      reloadTiers();
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  }

  if (subLoading || tierLoading) return <LoadingState />;
  if (subError || tierError) return <ErrorState message={subError || tierError || ""} />;

  return (
    <div className="space-y-8">
      {/* Subscription tiers */}
      <div>
        <PageHeader title="Subscription Tiers" subtitle="Manage membership plans" count={tierData?.totalDocs} onCreate={openCreateTier} createLabel="New tier" />
        {tierData?.docs.length === 0 ? (
          <EmptyState message="No tiers yet." onCreate={openCreateTier} createLabel="New tier" />
        ) : (
          <GlassCard>
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH>Name</TH>
                  <TH>Interval</TH>
                  <TH className="text-right">Price</TH>
                  <TH>Stripe Price ID</TH>
                  <TH>Perks</TH>
                  <TH></TH>
                </TR>
              </THead>
              <TBody>
                {tierData?.docs.map((t) => (
                  <TR key={t.id}>
                    <TD className="font-medium text-zinc-900">{t.name}</TD>
                    <TD className="text-zinc-600">{t.interval}</TD>
                    <TD className="text-right font-mono font-medium text-zinc-900">{fmtPrice(t.priceCents)}</TD>
                    <TD className="font-mono text-xs text-zinc-500">{t.stripePriceId || "—"}</TD>
                    <TD className="text-zinc-600">{(t.perks || []).length}</TD>
                    <TD><RowActions onEdit={() => openEditTier(t)} onDelete={() => handleDeleteTier(t)} /></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </GlassCard>
        )}
      </div>

      {/* Active subscriptions */}
      <div>
        <PageHeader title="Subscriptions" subtitle="Active and past memberships" count={subData?.totalDocs} />
        {subData?.docs.length === 0 ? (
          <EmptyState message="No subscribers yet." />
        ) : (
          <GlassCard>
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH>ID</TH>
                  <TH>Tier</TH>
                  <TH>Period start</TH>
                  <TH>Period end</TH>
                  <TH>Cancel at end</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {subData?.docs.map((s) => (
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit tier" : "New tier"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="VIP / Premium / Basic" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (cents)"><input type="number" className={inputClass} value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: e.target.value })} required placeholder="e.g. 1900 = €19.00" /></Field>
            <Field label="Interval">
              <select className={selectClass} value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })}>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </Field>
          </div>
          <Field label="Stripe Price ID"><input className={inputClass} value={form.stripePriceId} onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })} placeholder="price_..." /></Field>
          <Field label="Perks (one per line)"><textarea className={inputClass} rows={4} value={perksInput} onChange={(e) => setPerksInput(e.target.value)} placeholder="Exclusive content&#10;Monthly group call&#10;Priority booking" /></Field>
          {formError && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{formError}</p>}
          <FormActions onCancel={() => setModalOpen(false)} loading={saving} submitLabel={editing ? "Update" : "Create"} />
        </form>
      </Modal>
    </div>
  );
}

// ─── Registrations tab ──────────────────────────────────────────

const regStatusVariant: Record<string, "paid" | "pending" | "refunded"> = {
  confirmed: "paid",
  checked_in: "paid",
  pending: "pending",
  waitlisted: "pending",
  cancelled: "refunded",
};

export function RegistrationsTab() {
  const { data, loading, error } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/registrations");

  function handleExportCsv() {
    if (!data?.docs?.length) return;
    const headers = ["ID", "Name", "Email", "Phone", "Event", "Package", "Status", "QR", "Created"];
    const rows = data.docs.map((r) => [
      r.id,
      `"${r.name || ""}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${typeof r.event === "object" ? r.event?.title : r.event || ""}"`,
      `"${r.package || ""}"`,
      r.status,
      r.hasQr ? "Yes" : "No",
      r.createdAt,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Registrations" subtitle="Event attendees and check-in status" count={data?.totalDocs} />
        {data?.docs && data.docs.length > 0 && (
          <button
            onClick={handleExportCsv}
            className="rounded-lg border border-white/60 bg-white/40 px-4 py-2 text-sm font-medium text-zinc-700 backdrop-blur-xl transition-colors hover:bg-white/60"
          >
            Export CSV
          </button>
        )}
      </div>
      {data?.docs && data.docs.length === 0 ? (
        <EmptyState message="No registrations yet." />
      ) : (
        <GlassCard>
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Package</TH>
                <TH>Status</TH>
                <TH>QR</TH>
                <TH>Date</TH>
              </TR>
            </THead>
            <TBody>
              {data?.docs.map((r) => (
                <TR key={r.id}>
                  <TD className="font-medium text-zinc-900">{r.name}</TD>
                  <TD className="text-zinc-600">{r.email}</TD>
                  <TD className="text-zinc-600">{r.package || "—"}</TD>
                  <TD><Badge variant={regStatusVariant[r.status] || "default"}>{r.status}</Badge></TD>
                  <TD>
                    {r.hasQr ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : "—"}
                  </TD>
                  <TD className="font-mono text-xs text-zinc-500">{fmtDate(r.createdAt)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

// ─── Analytics tab ──────────────────────────────────────────────

export function AnalyticsTab() {
  const { data, loading, error } = useFetch<{
    subscribers: { active: number; cancelled: number; pastDue: number; churnRate: number };
    eventStats: { id: number; title: string; views: number; registrations: number; conversionRate: number }[];
    topBlogPosts: { id: number; title: string; slug: string; views: number }[];
    revenueTimeSeries: { date: string; cents: number }[];
  }>("/api/dashboard/analytics");

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState message="No analytics data yet." />;

  function fmtEur(cents: number) {
    return `€${(cents / 100).toFixed(0)}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Subscriber retention, event conversion, and content performance" />

      {/* Subscriber stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AnalyticsCard label="Active subscribers" value={String(data.subscribers.active)} color="text-indigo-700" />
        <AnalyticsCard label="Cancelled" value={String(data.subscribers.cancelled)} color="text-rose-600" />
        <AnalyticsCard label="Past due" value={String(data.subscribers.pastDue)} color="text-amber-600" />
        <AnalyticsCard label="Churn rate" value={`${data.subscribers.churnRate}%`} color="text-rose-600" />
      </section>

      {/* Event conversion */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Event conversion (views → registrations)
        </h3>
        {data.eventStats.length === 0 ? (
          <p className="text-sm text-zinc-400">No events yet.</p>
        ) : (
          <div className="space-y-3">
            {data.eventStats.map((e) => (
              <div key={e.id} className="rounded-xl border border-white/60 bg-white/40 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{e.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                      <span>{e.views} views</span>
                      <span>→</span>
                      <span>{e.registrations} registrations</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${e.conversionRate > 10 ? "text-green-600" : e.conversionRate > 0 ? "text-amber-600" : "text-zinc-400"}`}>
                      {e.conversionRate}%
                    </span>
                  </div>
                </div>
                {/* Conversion bar */}
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className={`h-full rounded-full ${e.conversionRate > 10 ? "bg-green-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, e.conversionRate)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top blog posts */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Most-read blog posts
        </h3>
        {data.topBlogPosts.length === 0 || data.topBlogPosts.every((p) => p.views === 0) ? (
          <p className="text-sm text-zinc-400">No blog views tracked yet.</p>
        ) : (
          <div className="space-y-2">
            {data.topBlogPosts
              .filter((p) => p.views > 0)
              .map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/40 p-3 backdrop-blur">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{p.title}</p>
                  </div>
                  <span className="shrink-0 text-sm font-mono text-zinc-500">{p.views} views</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Revenue over time */}
      {data.revenueTimeSeries.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Revenue (last 90 days)
          </h3>
          <div className="rounded-2xl border border-white/60 bg-white/40 p-6 backdrop-blur">
            <div className="flex items-end gap-1 h-32">
              {data.revenueTimeSeries.slice(-30).map((point, i) => {
                const maxCents = Math.max(...data.revenueTimeSeries.slice(-30).map((p) => p.cents), 1);
                const heightPct = (point.cents / maxCents) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-indigo-600 to-teal-400 transition-all hover:opacity-80"
                    style={{ height: `${Math.max(2, heightPct)}%` }}
                    title={`${point.date}: ${fmtEur(point.cents)}`}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-xs text-zinc-400">Last 30 days of paid orders</p>
          </div>
        </div>
      )}

      {/* Social stats */}
      <SocialStatsSection />
    </div>
  );
}

// ─── Social Stats section (inside Analytics tab) ────────────────

const platformIcons: Record<string, string> = {
  facebook: "f",
  instagram: "IG",
  tiktok: "TT",
  youtube: "YT",
};

const platformColors: Record<string, string> = {
  facebook: "text-blue-600",
  instagram: "text-pink-600",
  tiktok: "text-zinc-900",
  youtube: "text-red-600",
};

function SocialStatsSection() {
  const { data, loading, reload } = useFetch<{ docs: any[]; totalDocs: number }>("/api/dashboard/social-stats");
  const [editing, setEditing] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [adding, setAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState("facebook");

  async function handleSave(id: number) {
    try {
      await apiCall(`/api/dashboard/social-stats/${id}`, "PATCH", editValues);
      setEditing(null);
      reload();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd() {
    try {
      await apiCall("/api/dashboard/social-stats", "POST", {
        platform: newPlatform,
        handle: "",
        followers: 0,
        posts: 0,
        engagementRate: 0,
      });
      setAdding(false);
      reload();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this social stat entry?")) return;
    try {
      await apiCall(`/api/dashboard/social-stats/${id}`, "DELETE");
      reload();
    } catch (err) {
      console.error(err);
    }
  }

  function startEdit(s: any) {
    setEditing(s.id);
    setEditValues({
      handle: s.handle || "",
      followers: s.followers || 0,
      posts: s.posts || 0,
      engagementRate: s.engagementRate || 0,
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Social media stats
        </h3>
        <button
          onClick={() => setAdding(true)}
          className="rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-800"
        >
          + Add platform
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">Loading…</p>
      ) : data?.docs.length === 0 && !adding ? (
        <p className="text-sm text-zinc-400">
          No social stats yet. Add a platform to start tracking followers and engagement.
        </p>
      ) : (
        <div className="space-y-3">
          {adding && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
              <div className="flex items-center gap-3">
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>
                <button
                  onClick={handleAdd}
                  className="rounded-lg bg-indigo-700 px-4 py-2 text-xs font-medium text-white"
                >
                  Add
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="rounded-lg px-3 py-2 text-xs text-zinc-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {data?.docs.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/60 bg-white/40 p-4 backdrop-blur">
              {editing === s.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <label className="text-xs text-zinc-500">Handle</label>
                      <input
                        type="text"
                        value={editValues.handle}
                        onChange={(e) => setEditValues({ ...editValues, handle: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Followers</label>
                      <input
                        type="number"
                        value={editValues.followers}
                        onChange={(e) => setEditValues({ ...editValues, followers: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Posts</label>
                      <input
                        type="number"
                        value={editValues.posts}
                        onChange={(e) => setEditValues({ ...editValues, posts: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500">Engagement %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editValues.engagementRate}
                        onChange={(e) => setEditValues({ ...editValues, engagementRate: e.target.value })}
                        className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(s.id)}
                      className="rounded-lg bg-indigo-700 px-4 py-1.5 text-xs font-medium text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="rounded-lg px-3 py-1.5 text-xs text-zinc-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold ${platformColors[s.platform] || "text-zinc-600"}`}>
                      {platformIcons[s.platform] || s.platform[0]?.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium capitalize text-zinc-900">{s.platform}</p>
                      {s.handle && <p className="text-xs text-zinc-500">{s.handle}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-zinc-900">{(s.followers || 0).toLocaleString()}</p>
                      <p className="text-xs text-zinc-400">followers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-zinc-900">{(s.posts || 0).toLocaleString()}</p>
                      <p className="text-xs text-zinc-400">posts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-zinc-900">{s.engagementRate || 0}%</p>
                      <p className="text-xs text-zinc-400">engagement</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(s)}
                        className="rounded-lg px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="rounded-lg px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {s.lastUpdated && editing !== s.id && (
                <p className="mt-2 text-xs text-zinc-400">
                  Last updated: {new Date(s.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/40 p-5 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
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
            <Field label="Studio name"><input className={inputClass} defaultValue="Личностно овластяване" /></Field>
            <Field label="Support email"><input className={inputClass} defaultValue="info@lichnostno.bg" /></Field>
            <Field label="Currency">
              <select className={selectClass}>
                <option selected>EUR (€)</option>
                <option>USD ($)</option>
              </select>
            </Field>
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
