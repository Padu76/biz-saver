"use client";

import { format } from "date-fns";
import { it } from "date-fns/locale";

interface HistoryRecord {
  id: string;
  created_at: string;
  categoria: string;
  fornitore_attuale: string | null;
  spesa_mensile_attuale: number | null;
  spesa_annua_attuale: number | null;
  miglior_risparmio_annuo: number | null;
  filename: string | null;
}

interface Props {
  records: HistoryRecord[];
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

export function HistoryTable({ records }: Props) {
  if (!records || records.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-black/50 p-4 text-sm text-slate-300">
        Nessuna analisi salvata al momento. Carica un documento dalla pagina{" "}
        <span className="font-semibold text-slate-100">Carica documenti</span> per iniziare
        a popolare lo storico.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-black/50">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-950/80">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Data
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Categoria
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              File
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Spesa mensile
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Spesa annua
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Miglior risparmio annuo
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-black/40">
          {records.map((r) => (
            <tr key={r.id}>
              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-300">
                {r.created_at
                  ? format(new Date(r.created_at), "dd/MM/yyyy HH:mm", { locale: it })
                  : "-"}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-200">
                {r.categoria || "-"}
              </td>
              <td className="max-w-[180px] truncate px-3 py-2 text-xs text-slate-400">
                {r.filename || "-"}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right text-xs text-slate-200">
                {formatCurrency(r.spesa_mensile_attuale)}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right text-xs text-slate-200">
                {formatCurrency(r.spesa_annua_attuale)}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-right text-xs">
                <span
                  className={
                    r.miglior_risparmio_annuo && r.miglior_risparmio_annuo > 0
                      ? "font-semibold text-emerald-300"
                      : "text-slate-400"
                  }
                >
                  {formatCurrency(r.miglior_risparmio_annuo)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
