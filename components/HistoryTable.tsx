"use client";

import { useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface HistoryRow {
  id: number;
  created_at: string;
  categoria: string;
  fornitore_attuale: string;
  spesa_mensile_attuale: number;
  spesa_annua_attuale: number;
  miglior_risparmio_annuo: number;
  filename: string | null;
}

interface Props {
  analyses: HistoryRow[];
}

export function HistoryTable({ analyses }: Props) {
  const [rows, setRows] = useState<HistoryRow[]>(analyses || []);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Vuoi davvero eliminare questa analisi?")) return;

    try {
      setDeletingId(id);
      setError(null);

      const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Errore durante l'eliminazione.");
      }

      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      console.error("Delete error:", e);
      setError(e?.message || "Errore imprevisto.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!rows.length) {
    return (
      <p className="text-sm text-slate-400">
        Nessuna analisi ancora registrata. Carica una bolletta dalla sezione
        &quot;Carica documenti&quot;.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-md border border-red-500/70 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
        <table className="min-w-full text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/90 text-[11px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">Data</th>
              <th className="px-3 py-2 text-left">Categoria</th>
              <th className="px-3 py-2 text-left">Fornitore</th>
              <th className="px-3 py-2 text-right">Spesa mensile</th>
              <th className="px-3 py-2 text-right">Risparmio annuo</th>
              <th className="px-3 py-2 text-left">File</th>
              <th className="px-3 py-2 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const date =
                row.created_at &&
                format(new Date(row.created_at), "dd MMM yyyy HH:mm", {
                  locale: it,
                });

              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-900/60 last:border-0 hover:bg-slate-900/50"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-slate-200">
                    {date}
                  </td>
                  <td className="px-3 py-2 capitalize text-slate-300">
                    {row.categoria || "-"}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {row.fornitore_attuale || "-"}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-200">
                    {row.spesa_mensile_attuale.toFixed(2)} €
                  </td>
                  <td className="px-3 py-2 text-right text-emerald-400">
                    {row.miglior_risparmio_annuo.toFixed(2)} €
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {row.filename || "-"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      disabled={deletingId === row.id}
                      className="rounded-lg border border-red-500/70 bg-red-500/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-200 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === row.id ? "Elimino..." : "Elimina"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
