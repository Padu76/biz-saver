"use client";

import { FormEvent, useState } from "react";
import { ComparisonReport } from "@/components/ComparisonReport";
import type {
  CurrentCostProfile,
  SuggestedAlternative,
} from "@/types/cost-comparison";

interface AnalyzeResponse {
  profile: CurrentCostProfile;
  suggestions: SuggestedAlternative[];
}

const CATEGORIES = [
  {
    key: "energia",
    label: "Utenze energia / gas",
    desc: "Bollette luce, gas, forniture energetiche per uffici e attività.",
  },
  {
    key: "internet",
    label: "Internet / Fibra",
    desc: "Connessioni fibra, FTTC, FWA per uffici e studi professionali.",
  },
  {
    key: "telefonia_mobile",
    label: "Telefonia mobile business",
    desc: "Sim aziendali, flotte mobile, bundle voce + dati.",
  },
  {
    key: "assicurazioni",
    label: "Assicurazioni",
    desc: "Polizze RC, assicurazioni auto, uffici, responsabilità professionale.",
  },
  {
    key: "noleggio_auto",
    label: "Noleggio auto lungo termine",
    desc: "Contratti di noleggio per veicoli aziendali e auto di servizio.",
  },
];

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
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error || "Errore durante l'analisi del documento."
        );
      }

      const raw = await res.json();
      const data: AnalyzeResponse = {
        profile: raw.profile,
        suggestions: raw.alternatives ?? [],
      };

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Si è verificato un errore imprevisto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Carica documenti</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Carica una bolletta, una polizza o un contratto{" "}
          <span className="font-semibold">in PDF oppure come immagine</span>.
          L&apos;AI legge il documento, estrae i costi principali e li confronta
          con le offerte del catalogo interno.
        </p>
        <p className="max-w-2xl text-xs text-emerald-300">
          I dati che vedi nel report sono basati sulle informazioni reali
          estratte dal documento, non sono più mockati.
        </p>
      </div>

      {/* CATEGORIE SUPPORTATE */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Cosa puoi analizzare
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {cat.label}
              </div>
              <p className="mt-1 text-[11px] text-slate-300">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FORM UPLOAD */}
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
            Formati supportati: PDF, JPG, PNG, WEBP · Max 10MB per file
          </p>
          {file && (
            <p className="text-xs text-emerald-300">
              File selezionato:{" "}
              <span className="font-semibold">{file.name}</span>
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
            Suggerimento: per PDF molto lunghi carica il documento con i totali
            ben visibili (importo da pagare, periodo, fornitore, ecc.).
          </p>
        )}
      </form>

      {/* RISULTATO */}
      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
            <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
              Anteprima analisi AI (dati reali)
            </div>
            <p>
              Categoria rilevata:{" "}
              <span className="font-semibold">{result.profile.categoria}</span>
            </p>
            {result.profile.tipo_documento && (
              <p>
                Tipo documento:{" "}
                <span className="font-semibold">
                  {result.profile.tipo_documento}
                </span>
              </p>
            )}
            <p>
              Fornitore attuale:{" "}
              <span className="font-semibold">
                {result.profile.fornitore_attuale || "Non specificato"}
              </span>
            </p>
            <p>
              Spesa mensile stimata:{" "}
              <span className="font-semibold">
                {result.profile.spesa_mensile_attuale}{" "}
                {result.profile.valuta || "EUR"}
              </span>
            </p>
            <p className="mt-1 text-slate-400">
              Verifica sempre che importi e categoria siano coerenti con il
              documento, prima di cambiare fornitore.
            </p>
          </div>

          <ComparisonReport
            profile={result.profile}
            suggestions={result.suggestions}
          />
        </div>
      )}
    </div>
  );
}
