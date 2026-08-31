// Route-level loading UI for the public site. Shown while a route segment's
// server work is in flight, so navigations get immediate feedback instead of
// sitting on the previous page until JS boots.
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center px-4 py-24"
    >
      <span className="sr-only">Зареждане…</span>
      <div className="flex flex-col items-center gap-4" aria-hidden="true">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-300 border-t-amber-600 dark:border-stone-700 dark:border-t-amber-400" />
        <div className="h-2 w-24 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
      </div>
    </div>
  );
}
