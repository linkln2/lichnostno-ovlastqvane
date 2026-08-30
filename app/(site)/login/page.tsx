"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { site } from "@/lib/content";

type User = {
  id: number;
  email: string;
  name: string;
  collection: string;
};

type Registration = {
  id: number;
  name: string;
  email: string;
  phone: string;
  package: string;
  status: string;
  hasQr: boolean;
  qrToken: string;
  eventTitle: string;
  eventStartsAt: string;
  createdAt: string;
};

type Subscription = {
  id: number;
  status: string;
  tier: any;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
};

export default function LoginPage() {
  const { locale } = useLocale();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-amber-600" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Staff → redirect to dashboard
  if (user && user.collection === "staff") {
    window.location.href = "/dashboard";
    return null;
  }

  // Customer → show account dashboard
  if (user && user.collection === "customers") {
    return <AccountDashboard user={user} locale={locale} onLogout={() => setUser(null)} />;
  }

  // Not logged in → show unified login/signup form
  return <AuthForms locale={locale} onAuthed={() => window.location.reload()} />;
}

// ─── Auth forms (login + signup) ─────────────────────────────────

function AuthForms({ locale, onAuthed }: { locale: string; onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const t = {
    loginTitle: locale === "bg" ? "Вход" : "Sign In",
    signupTitle: locale === "bg" ? "Регистрация" : "Sign Up",
    loginSub: locale === "bg" ? "Влезте в акаунта си" : "Access your account",
    signupSub: locale === "bg" ? "Създайте нов акаунт" : "Create a new account",
    name: locale === "bg" ? "Име" : "Name",
    email: locale === "bg" ? "Имейл" : "Email",
    password: locale === "bg" ? "Парола" : "Password",
    submit: locale === "bg" ? "Продължи" : "Continue",
    loading: locale === "bg" ? "Изчакайте…" : "Loading…",
    loginTab: locale === "bg" ? "Вход" : "Login",
    signupTab: locale === "bg" ? "Регистрация" : "Sign Up",
    noAccount: locale === "bg" ? "Нямате акаунт?" : "No account?",
    haveAccount: locale === "bg" ? "Имате акаунт?" : "Have an account?",
    back: locale === "bg" ? "Обратно към сайта" : "Back to site",
    invalid: locale === "bg" ? "Невалидни данни" : "Invalid credentials",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      if (mode === "login") {
        // Try staff login first, then customer login
        const staffRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (staffRes.ok) {
          // Staff login succeeded — redirect to dashboard
          window.location.href = "/dashboard";
          return;
        }

        // Staff login failed — try customer login
        const custRes = await fetch("/api/auth/customer-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (custRes.ok) {
          onAuthed();
          return;
        }

        // Both failed
        const custData = await custRes.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(custData.error || t.invalid);
      } else {
        // Signup — customer only
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setStatus("error");
          setErrorMsg(data.error || "Signup failed");
          return;
        }

        onAuthed();
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error");
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/logo.png"
            alt={locale === "bg" ? site.name : site.nameEn}
            className="h-16 w-16 rounded-full object-cover shadow-md ring-4 ring-white/60 dark:hidden"
          />
          <img
            src="/pictures/dark-mode-logo.png"
            alt={locale === "bg" ? site.name : site.nameEn}
            className="hidden h-16 w-16 rounded-full object-cover shadow-md ring-4 ring-white/60 dark:block"
          />
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-full border border-stone-200 bg-white p-1">
          <button
            onClick={() => { setMode("login"); setStatus("idle"); }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              mode === "login" ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {t.loginTab}
          </button>
          <button
            onClick={() => { setMode("signup"); setStatus("idle"); }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              mode === "signup" ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {t.signupTab}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-white p-8 shadow-lg"
        >
          <h1 className="text-center text-xl font-bold text-stone-900">
            {mode === "login" ? t.loginTitle : t.signupTitle}
          </h1>
          <p className="mt-1 text-center text-sm text-stone-500">
            {mode === "login" ? t.loginSub : t.signupSub}
          </p>

          <div className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {t.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder={locale === "bg" ? "Твоето име" : "Your name"}
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">
                {t.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 pr-10 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:text-stone-600"
                  aria-label={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.87 13.87 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <path d="M2 2l20 20" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {status === "error" && (
            <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 w-full rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {status === "loading" ? t.loading : t.submit}
          </button>

          <a
            href="/"
            className="mt-4 block text-center text-xs font-medium text-stone-400 hover:text-stone-600"
          >
            {t.back}
          </a>
        </form>
      </div>
    </div>
  );
}

// ─── Account dashboard (customers) ───────────────────────────────

function AccountDashboard({ user, locale, onLogout }: { user: User; locale: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"registrations" | "subscriptions">("registrations");
  const [regs, setRegs] = useState<Registration[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/customer/registrations", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/customer/subscriptions", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([r, s]) => {
        setRegs(r.docs || []);
        setSubs(s.docs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    onLogout();
  }

  const t = {
    welcome: locale === "bg" ? "Здравей" : "Hello",
    logout: locale === "bg" ? "Изход" : "Log out",
    registrations: locale === "bg" ? "Моите регистрации" : "My registrations",
    subscriptions: locale === "bg" ? "Моето членство" : "My membership",
    noRegs: locale === "bg" ? "Нямате регистрации за събития." : "No event registrations yet.",
    noSubs: locale === "bg" ? "Нямате активен абонамент." : "No active subscription.",
    manage: locale === "bg" ? "Управление" : "Manage",
    viewTicket: locale === "bg" ? "Виж билета" : "View ticket",
    status: locale === "bg" ? "Статус" : "Status",
    event: locale === "bg" ? "Събитие" : "Event",
    package: locale === "bg" ? "Пакет" : "Package",
    date: locale === "bg" ? "Дата" : "Date",
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    checked_in: "bg-green-100 text-green-700",
    waitlisted: "bg-amber-100 text-amber-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-rose-100 text-rose-700",
    active: "bg-green-100 text-green-700",
    trialing: "bg-amber-100 text-amber-700",
    past_due: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            {t.welcome}, {user.name}
          </h1>
          <p className="text-sm text-stone-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
        >
          {t.logout}
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setTab("registrations")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "registrations" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {t.registrations}
        </button>
        <button
          onClick={() => setTab("subscriptions")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "subscriptions" ? "border-amber-600 text-amber-700" : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {t.subscriptions}
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-stone-400">Loading…</div>
        ) : tab === "registrations" ? (
          regs.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-400">{t.noRegs}</p>
          ) : (
            <div className="space-y-3">
              {regs.map((r) => (
                <div key={r.id} className="rounded-xl border border-stone-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-900">{r.eventTitle || "Event"}</p>
                      {r.eventStartsAt && (
                        <p className="mt-1 text-xs text-stone-500">
                          {new Date(r.eventStartsAt).toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      )}
                      {r.package && (
                        <p className="mt-1 text-xs text-stone-500">{t.package}: {r.package}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[r.status] || "bg-zinc-100 text-zinc-600"}`}>
                        {r.status}
                      </span>
                      {r.hasQr && r.status === "confirmed" && (
                        <a
                          href={`/api/qr/${r.qrToken}`}
                          target="_blank"
                          className="text-xs text-amber-600 hover:text-amber-700"
                        >
                          {t.viewTicket} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          subs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-stone-400">{t.noSubs}</p>
              <a
                href="/membership"
                className="mt-4 inline-block rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white"
              >
                {locale === "bg" ? "Стани член" : "Become a member"}
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {subs.map((s) => {
                const tierName = typeof s.tier === "object" ? s.tier?.name : "Membership";
                return (
                  <div key={s.id} className="rounded-xl border border-stone-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-stone-900">{tierName}</p>
                        {s.currentPeriodEnd && (
                          <p className="mt-1 text-xs text-stone-500">
                            {locale === "bg" ? "Следващо плащане" : "Next billing"}:{" "}
                            {new Date(s.currentPeriodEnd).toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US")}
                          </p>
                        )}
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[s.status] || "bg-zinc-100 text-zinc-600"}`}>
                        {s.status}
                      </span>
                    </div>
                    <a
                      href="/membership"
                      className="mt-3 inline-block text-xs text-amber-600 hover:text-amber-700"
                    >
                      {t.manage} →
                    </a>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
