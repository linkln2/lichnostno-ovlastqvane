"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { site } from "@/lib/content";

export default function LoginPage() {
  const { locale } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "coming-soon" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const t = {
    title: locale === "bg" ? "Вход за екипа" : "Team Login",
    subtitle:
      locale === "bg"
        ? "Достъп до администраторския панел"
        : "Access the admin dashboard",
    email: locale === "bg" ? "Имейл" : "Email",
    password: locale === "bg" ? "Парола" : "Password",
    submit: locale === "bg" ? "Вход" : "Sign in",
    loading: locale === "bg" ? "Влизане…" : "Signing in…",
    comingSoonTitle:
      locale === "bg" ? "Очаквайте скоро" : "Coming Soon",
    comingSoonBody:
      locale === "bg"
        ? "Достъпът до администраторския панел е ограничен. Ако смятате, че трябва да имате достъп, свържете се с нас."
        : "Dashboard access is currently restricted. If you believe you should have access, please contact us.",
    back: locale === "bg" ? "Обратно към сайта" : "Back to site",
    invalid: locale === "bg" ? "Невалидни данни" : "Invalid credentials",
    backToLogin: locale === "bg" ? "Опитайте отново" : "Try again",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === "coming-soon") {
        setStatus("coming-soon");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.message || t.invalid);
        return;
      }

      // Success — redirect to dashboard
      // Use full page navigation (not client-side) so the proxy sees the
      // freshly-set payload-token cookie on the server request
      window.location.href = "/dashboard";
    } catch {
      setStatus("error");
      setErrorMsg(t.invalid);
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
            className="h-16 w-16 rounded-full object-cover shadow-md ring-4 ring-white/60"
          />
        </div>

        {status === "coming-soon" ? (
          /* Coming soon gate */
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-amber-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-stone-900">
              {t.comingSoonTitle}
            </h1>
            <p className="mt-2 text-sm text-stone-500">{t.comingSoonBody}</p>
            <button
              onClick={() => {
                setStatus("idle");
                setEmail("");
                setPassword("");
              }}
              className="mt-6 rounded-full bg-stone-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-900"
            >
              {t.backToLogin}
            </button>
          </div>
        ) : (
          /* Login form */
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-stone-200 bg-white p-8 shadow-lg"
          >
            <h1 className="text-center text-xl font-bold text-stone-900">
              {t.title}
            </h1>
            <p className="mt-1 text-center text-sm text-stone-500">
              {t.subtitle}
            </p>

            <div className="mt-6 space-y-4">
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
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-2.5 pr-10 text-sm text-stone-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:text-stone-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-center text-sm text-rose-600">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 w-full rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-60"
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
        )}
      </div>
    </div>
  );
}
