"use client";

import { useState } from "react";

interface MonitorResult {
  checked: number;
  improved: number;
  unchanged: number;
  noAlternatives: number;
  timestamp: string;
}

export function MonitorButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MonitorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runMonitor() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch("/api/monitor", {
        method: "POST",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error || "Errore durante il monitoraggio delle offerte."
        );
      }

      const data = (await res.json()) as MonitorResult;
      setResult(data);
    } catch (e: any) {
      console.error("[MonitorButton] error:", e);
      setError(e?.message || "Errore imprevisto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 text-xs">
      <button
        type="button"
        onClick={runMonitor}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Monitoraggio in corso..." : "Monitora prezzi ora"}
      </button>

      {!loading && result && (
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-300">
          <div>
            Analisi controllate:{" "}
            <span className="font-semibold">{result.checked}</span>
          </div>
          <div>
            Nuove offerte migliori:{" "}
            <span className="font-semibold text-emerald-300">
              {result.improved}
            </span>
          </div>
          <div>
            Invariate:{" "}
            <span className="font-semibold">{result.unchanged}</span> · Nessuna
            alternativa valida:{" "}
            <span className="font-semibold">{result.noAlternatives}</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500">
            Ultimo controllo:{" "}
            {new Date(result.timestamp).toLocaleString("it-IT")}
          </div>
        </div>
      )}

      {error && (
        <div className="text-[11px] text-red-400">
          Errore monitoraggio: {error}
        </div>
      )}
    </div>
  );
}
