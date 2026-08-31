"use client";

import { useEffect } from "react";

// Last-resort boundary: catches errors thrown in the root layouts themselves,
// which the per-segment error.tsx files cannot reach. Must render its own
// <html> and <body> because the failing layout never rendered them.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="bg">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#fafaf9",
          color: "#292524",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Нещо се обърка
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#57534e" }}>
            Something went wrong. Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              minHeight: 44,
              padding: "0 1.5rem",
              borderRadius: 9999,
              border: "none",
              background: "#d97706",
              color: "#fff",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Опитай отново / Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#a8a29e" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
