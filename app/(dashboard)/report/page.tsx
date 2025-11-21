"use client";

import { FormEvent, useState } from "react";
import { ComparisonReport } from "@/components/ComparisonReport";
import type {
  CurrentCostProfile,
  SuggestedAlternative
} from "@/types/cost-comparison";
import type { CategoriaProvider } from "@/lib/providerEngine";

interface ApiResponse {
  suggestions: SuggestedAlternative[];
}

const CATEGORIE: { value: CategoriaProvider; label: string }[] = [
  { value: "telefonia_mobile", label: "Telefonia mobile" },
  { value: "internet", label: "Internet / Fibra" },
  { value: "energia", label: "Energia" },
  { value: "assicurazioni", label: "Assicurazioni" },
  { value: "noleggio_auto", label: "Noleggio auto" }
];

export default function ReportPage() {
  const [categoria, setCategoria] = useState<CategoriaProvider>("telefonia_mobile");
  const [spesaMensile, setSpesaMensile] = useState<string>("89");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<CurrentCostProfile | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedAlternative[] | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const valore = Number(spesaMensile.replace(",", "."));
    if (isNaN(valore) || valore <= 0) {
      setError("Inserisci una spesa mensile valida (es. 89).");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoria,
          spesa_mensile_attuale: valore
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Errore nella richiesta al motore di comparazione.");
      }

      const data: ApiResponse = await res.json();

      const profilo: CurrentCostProfile = {
        categoria,
        fornitore_attuale: "Tuo fornitore attuale",
        spesa_mensile_attuale: valore,
        spesa_annua_attuale: valore * 12,
        valuta: "EUR",
        dettagli: {}
      };

      setProfile(profilo);
      setSuggestions(data.suggestions);
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
        <h1 className="text-2xl font-semibold">Report di comparazione</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          Inserisci la categoria di spesa e quanto stai pagando al mese. Il motore confronterà
          la tua spesa con il catalogo di fornitori e ti suggerirà alternative più convenienti.
        </p>
      </div>

      {/* FORM DI INPUT */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-800 bg-black/50 p-4 text-sm space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-300">
              Categoria di spesa
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaProvider)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            >
              {CATEGORIE.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-300">
              Spesa mensile attuale (€)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={spesaMensile}
              onChange={(e) => setSpesaMensile(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Es. 89"
            />
            <span className="text-[11px] text-slate-500">
              Usa l&apos;importo totale mensile (tutte le linee/veicoli inclusi).
            </span>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-accent/40 hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/60"
            >
              {loading ? "Calcolo in corso..." : "Calcola alternative"}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}
      </form>

      {/* REPORT DINAMICO */}
      {profile && suggestions && suggestions.length > 0 && (
        <ComparisonReport profile={profile} suggestions={suggestions} />
      )}

      {profile && suggestions && suggestions.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-black/50 p-4 text-sm text-slate-300">
          Nessuna alternativa più conveniente trovata per questa categoria con la spesa attuale
          indicata. Puoi comunque usare il report per verificare le offerte presenti nel mercato.
        </div>
      )}

      {!profile && (
        <div className="rounded-xl border border-slate-800 bg-black/40 p-4 text-xs text-slate-400">
          Suggerimento: carica prima qualche bolletta dalla pagina{" "}
          <span className="font-semibold text-slate-200">“Carica documenti”</span>,
          poi usa qui la spesa mensile risultante per vedere quanto potresti risparmiare.
        </div>
      )}
    </div>
  );
}
