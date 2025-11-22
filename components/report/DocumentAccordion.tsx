"use client";

import { useState } from "react";

export function DocumentAccordion({ analyses }: { analyses: any[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (analyses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dettagli documenti</h2>

      {analyses.map((a, idx) => (
        <div
          key={a.id}
          className="rounded-xl border border-slate-800 bg-slate-950/70"
        >
          <button
            className="w-full text-left p-4 flex justify-between items-center"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <div>
              <div className="text-sm text-slate-300">{a.filename}</div>
              <div className="text-xs text-slate-400 capitalize">
                {a.categoria}
              </div>
            </div>
            <div className="text-emerald-400 font-bold">
              + {a.miglior_risparmio_annuo.toFixed(2)} €
            </div>
          </button>

          {open === idx && (
            <div className="px-4 pb-4 space-y-3">
              <div className="text-sm text-slate-300">
                Spesa attuale: {a.spesa_annua_attuale.toFixed(2)} €
              </div>

              <div className="space-y-2">
                {(a.alternatives || []).length === 0 && (
                  <div className="text-xs text-slate-500">
                    Nessuna alternativa trovata di migliore convenienza.
                  </div>
                )}

                {(a.alternatives || []).map((alt: any) => (
                  <div
                    key={alt.id}
                    className={`rounded-lg border p-3 ${
                      alt.is_best
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      {alt.fornitore} — {alt.nome_offerta}
                    </div>
                    <div className="text-xs text-slate-400">
                      {alt.costo_mensile_stimato.toFixed(2)} €/mese
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold">
                      Risparmio: {alt.risparmio_annuo_stimato.toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
