"use client";

import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ScanResult = {
  success: boolean;
  status: "checked_in" | "duplicate" | "invalid" | "not_found";
  message: string;
  registration?: { name: string; email: string; package: string };
};

export default function CheckInPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader";

  async function startScanner() {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Got a QR code — stop scanner and verify
          await scanner.stop();
          setScanning(false);

          try {
            const res = await fetch("/api/checkin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: decodedText }),
            });
            const data = await res.json();
            setResult(data);
          } catch {
            setError("Network error — try again");
          }

          // Auto-restart after 3 seconds for continuous scanning
          setTimeout(() => {
            setResult(null);
            startScanner();
          }, 3000);
        },
        () => {
          // Per-frame error — ignore
        }
      );
    } catch (err) {
      setError("Camera access denied. Allow camera permissions and try again.");
      setScanning(false);
    }
  }

  async function stopScanner() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-900">
      {/* Minimal header — no sidebar, just title */}
      <header className="flex items-center justify-between px-4 py-4">
        <h1 className="text-lg font-semibold text-white">Check-in Scanner</h1>
        <button
          onClick={() => (scanning ? stopScanner() : startScanner())}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            scanning
              ? "bg-rose-600 text-white hover:bg-rose-700"
              : "bg-amber-600 text-white hover:bg-amber-700"
          }`}
        >
          {scanning ? "Stop" : "Start scanning"}
        </button>
      </header>

      {/* Camera view — full screen on mobile */}
      <div className="flex flex-1 items-center justify-center p-4">
        {!scanning && !result && !error && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                <rect x="3" y="3" width="6" height="6" rx="1" />
                <rect x="15" y="3" width="6" height="6" rx="1" />
                <rect x="3" y="15" width="6" height="6" rx="1" />
                <path d="M15 15h6v6h-6z" />
                <path d="M9 9l6 6" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">Tap "Start scanning" to open the camera</p>
          </div>
        )}

        <div id={containerId} className={scanning ? "w-full max-w-md" : "hidden"} />

        {/* Result overlay */}
        {result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/80 p-4">
            <div
              className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl ${
                result.success
                  ? "bg-green-600"
                  : result.status === "duplicate"
                    ? "bg-amber-600"
                    : "bg-rose-600"
              }`}
            >
              {/* Big icon */}
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                {result.success ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : result.status === "duplicate" ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white">{result.message}</h2>

              {result.registration && (
                <div className="mt-4 rounded-2xl bg-white/10 p-4 text-left">
                  <p className="text-lg font-semibold text-white">{result.registration.name}</p>
                  <p className="text-sm text-white/80">{result.registration.email}</p>
                  <p className="mt-1 text-sm text-white/60">{result.registration.package}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              onClick={startScanner}
              className="mt-4 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
