"use client";

import { FormEvent, useState } from "react";
import { ComparisonReport } from "@/components/ComparisonReport";
import type { CurrentCostProfile, SuggestedAlternative } from "@/types/cost-comparison";

interface AnalyzeResponse {
  profile: CurrentCostProfile;
  suggestions: SuggestedAlternative[];
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("Seleziona prima un file da caricare.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Errore durante l'analisi del documento.");
      }

      const data: AnalyzeResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Si è verificato un errore imprevisto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Carica documenti</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          Carica una bolletta, una polizza o un contratto (PDF o immagine). L&apos;AI legger&agrave;
          il documento, estrarr&agrave; i costi principali e confronter&agrave; automaticamente
          le tue spese con le offerte a catalogo.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-dashed border-slate-700 bg-black/40 p-6 text-sm"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              setResult(null);
              setError(null);
            }}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-medium text-slate-100 hover:border-accent hover:text-accent"
          >
            Seleziona un file (PDF o immagine)
          </label>
          <p className="text-xs text-slate-400">
            Formati supportati: PDF, JPG, PNG, WEBP &middot; Max 10MB per file
          </p>
          {file && (
            <p className="text-xs text-emerald-300">
              File selezionato: <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !file}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-accent/40 hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/60"
          >
            {loading ? "Analisi in corso..." : "Analizza documento"}
          </button>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {!error && !result && (
          <p className="text-xs text-slate-500">
            Suggerimento: per risultati migliori, carica il PDF o la pagina riepilogo della bolletta
            con i totali ben visibili (importo da pagare, periodo di riferimento, ecc.).
          </p>
        )}
      </form>

      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
            <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
              Anteprima analisi AI
            </div>
            <p>
              Categoria rilevata:{" "}
              <span className="font-semibold">{result.profile.categoria}</span>
            </p>
            <p>
              Spesa mensile stimata:{" "}
              <span className="font-semibold">
                {result.profile.spesa_mensile_attuale} {result.profile.valuta}
              </span>
            </p>
            <p className="mt-1 text-slate-400">
              I dati sono stati estratti automaticamente dal documento caricato. Controlla sempre
              che importi e categoria siano coerenti prima di agire sui cambi di fornitore.
            </p>
          </div>

          <ComparisonReport profile={result.profile} suggestions={result.suggestions} />
        </div>
      )}
    </div>
  );
}
