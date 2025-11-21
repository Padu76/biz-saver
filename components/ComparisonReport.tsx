"use client";

import type { CurrentCostProfile, SuggestedAlternative } from "@/types/cost-comparison";

interface ComparisonReportProps {
  profile: CurrentCostProfile;
  suggestions: SuggestedAlternative[];
}

function formatCurrency(value: number | null | undefined, currency: string = "EUR") {
  if (value == null) return "-";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency
  }).format(value);
}

function humanCategoria(categoria: CurrentCostProfile["categoria"]): string {
  switch (categoria) {
    case "telefonia_mobile":
      return "Telefonia Mobile";
    case "internet":
      return "Internet / Fibra";
    case "energia":
      return "Energia";
    case "assicurazioni":
      return "Assicurazioni";
    case "noleggio_auto":
      return "Noleggio Auto";
    default:
      return categoria;
  }
}

export const ComparisonReport: React.FC<ComparisonReportProps> = ({ profile, suggestions }) => {
  const best = suggestions[0];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-black/50 p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">
          Situazione attuale – {humanCategoria(profile.categoria)}
        </h2>
        <p className="text-sm text-slate-300 mb-4">
          Fornitore attuale:{" "}
          <span className="font-medium text-foreground">
            {profile.fornitore_attuale || "N/D"}
          </span>
        </p>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div className="rounded-lg bg-slate-900/70 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Spesa mensile attuale
            </div>
            <div className="mt-1 text-lg font-semibold">
              {formatCurrency(profile.spesa_mensile_attuale, profile.valuta)}
            </div>
          </div>
          <div className="rounded-lg bg-slate-900/70 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Spesa annua attuale
            </div>
            <div className="mt-1 text-lg font-semibold">
              {formatCurrency(profile.spesa_annua_attuale, profile.valuta)}
            </div>
          </div>
          {best?.stima_risparmio_annuo && best.stima_risparmio_annuo > 0 && (
            <div className="rounded-lg bg-emerald-900/40 p-3">
              <div className="text-[11px] uppercase tracking-wide text-emerald-300">
                Risparmio potenziale massimo
              </div>
              <div className="mt-1 text-lg font-semibold text-emerald-300">
                {formatCurrency(best.stima_risparmio_annuo, profile.valuta)}
                <span className="text-xs text-emerald-200 ml-1">/anno</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-black/50 p-5 shadow-sm">
        <h3 className="text-md font-semibold mb-3">Alternative consigliate</h3>

        {suggestions.length === 0 && (
          <p className="text-sm text-slate-300">
            Non abbiamo ancora alternative per questa categoria. Carica una bolletta reale
            e ricalcola il report.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {suggestions.slice(0, 4).map((s, idx) => (
            <div
              key={s.provider.fornitore + idx}
              className={`rounded-lg border p-4 text-sm ${
                s.stima_risparmio_annuo && s.stima_risparmio_annuo > 0
                  ? "border-emerald-500/40 bg-emerald-900/20"
                  : "border-slate-700 bg-slate-950/60"
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Fornitore consigliato
                  </div>
                  <div className="text-base font-semibold">
                    {s.provider.fornitore}
                  </div>
                </div>
                {idx === 0 && s.stima_risparmio_annuo && s.stima_risparmio_annuo > 0 && (
                  <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-black">
                    Miglior risparmio
                  </span>
                )}
              </div>

              <div className="mb-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Offerte rilevanti
                </div>
                <ul className="mt-1 list-disc list-inside text-xs text-slate-200">
                  {s.provider.offerte.slice(0, 2).map((offerta) => (
                    <li key={offerta}>{offerta}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-2 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Stima spesa mensile
                  </div>
                  <div className="mt-1 font-medium">
                    {formatCurrency(s.stima_spesa_mensile, profile.valuta)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Risparmio annuo stimato
                  </div>
                  <div
                    className={
                      s.stima_risparmio_annuo && s.stima_risparmio_annuo > 0
                        ? "mt-1 font-semibold text-emerald-300"
                        : "mt-1 font-medium text-slate-500"
                    }
                  >
                    {s.stima_risparmio_annuo && s.stima_risparmio_annuo > 0
                      ? formatCurrency(s.stima_risparmio_annuo, profile.valuta)
                      : "-"}
                  </div>
                </div>
              </div>

              <p className="mb-3 text-xs text-slate-300">{s.note}</p>

              <div className="flex gap-2">
                <a
                  href={s.provider.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-900"
                >
                  Vai alla pagina offerta
                </a>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-accent px-2 py-1.5 text-xs font-semibold text-black hover:bg-accent/90"
                >
                  Genera email di richiesta
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
