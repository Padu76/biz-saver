// components/HistoryTable.tsx
import { format } from "date-fns";
import { it } from "date-fns/locale";

type AnalysisRow = {
  id: number;
  created_at: string | null;
  categoria: string | null;
  fornitore_attuale: string | null;
  spesa_mensile_attuale: number | null;
  spesa_annua_attuale: number | null;
  miglior_risparmio_annuo: number | null;
  filename: string | null;
};

interface HistoryTableProps {
  analyses: AnalysisRow[];
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return format(d, "dd MMM yyyy HH:mm", { locale: it });
}

function formatEuro(value: number | null | undefined) {
  if (value == null) return "-";
  return `${value.toFixed(2)} €`;
}

export function HistoryTable({ analyses }: HistoryTableProps) {
  if (!analyses || analyses.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
        <p className="font-medium">Nessuna analisi salvata.</p>
        <p className="mt-1 text-slate-400">
          Carica una bolletta o un contratto dalla sezione &quot;Carica
          documenti&quot; per iniziare a costruire lo storico risparmi.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse text-xs text-slate-200">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">Data</th>
              <th className="px-3 py-2 text-left">Categoria</th>
              <th className="px-3 py-2 text-left">Fornitore attuale</th>
              <th className="px-3 py-2 text-right">Spesa mensile</th>
              <th className="px-3 py-2 text-right">Spesa annua</th>
              <th className="px-3 py-2 text-right">Miglior risparmio annuo</th>
              <th className="px-3 py-2 text-left">File</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((row, idx) => (
              <tr
                key={row.id ?? idx}
                className="border-t border-slate-800/60 hover:bg-slate-900/40"
              >
                <td className="px-3 py-2 align-middle text-[11px] text-slate-300">
                  {formatDate(row.created_at)}
                </td>
                <td className="px-3 py-2 align-middle text-[11px] capitalize text-slate-200">
                  {row.categoria || "-"}
                </td>
                <td className="px-3 py-2 align-middle text-[11px] text-slate-200">
                  {row.fornitore_attuale || "-"}
                </td>
                <td className="px-3 py-2 align-middle text-right text-[11px]">
                  {formatEuro(row.spesa_mensile_attuale)}
                </td>
                <td className="px-3 py-2 align-middle text-right text-[11px]">
                  {formatEuro(row.spesa_annua_attuale)}
                </td>
                <td className="px-3 py-2 align-middle text-right text-[11px] text-emerald-300">
                  {formatEuro(row.miglior_risparmio_annuo)}
                </td>
                <td className="px-3 py-2 align-middle text-[11px] text-slate-300">
                  {row.filename || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
