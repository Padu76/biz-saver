import { createClient } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type AnalysisRow = {
  categoria: string | null;
  spesa_annua_attuale: number | null;
  miglior_risparmio_annuo: number | null;
};

type CategoriaAgg = {
  categoria: string;
  spesa_totale_annua: number;
  risparmio_potenziale_annuo: number;
  numero_documenti: number;
};

function formatEuro(value: number) {
  return `${value.toFixed(2)} €`;
}

export default async function ReportPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("analyses")
    .select("categoria, spesa_annua_attuale, miglior_risparmio_annuo");

  if (error) {
    console.error("[Report] Errore caricamento analyses:", error);
  }

  const rows: AnalysisRow[] = (data as any[]) || [];

  const perCategoria = new Map<string, CategoriaAgg>();

  for (const row of rows) {
    const cat = (row.categoria || "Altro").toString();
    const spesa = Number(row.spesa_annua_attuale ?? 0) || 0;
    const risparmio = Number(row.miglior_risparmio_annuo ?? 0) || 0;

    if (!perCategoria.has(cat)) {
      perCategoria.set(cat, {
        categoria: cat,
        spesa_totale_annua: 0,
        risparmio_potenziale_annuo: 0,
        numero_documenti: 0,
      });
    }

    const agg = perCategoria.get(cat)!;
    agg.spesa_totale_annua += spesa;
    agg.risparmio_potenziale_annuo += risparmio;
    agg.numero_documenti += 1;
  }

  const categorie = Array.from(perCategoria.values()).sort(
    (a, b) => b.risparmio_potenziale_annuo - a.risparmio_potenziale_annuo
  );

  const totaleSpesa = categorie.reduce(
    (sum, c) => sum + c.spesa_totale_annua,
    0
  );
  const totaleRisparmio = categorie.reduce(
    (sum, c) => sum + c.risparmio_potenziale_annuo,
    0
  );
  const percentualeMedia =
    totaleSpesa > 0 ? (totaleRisparmio / totaleSpesa) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Report risparmi</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          Riepilogo dei risparmi potenziali stimati sulle bollette e sui contratti
          caricati. I valori sono calcolati sulla base dei confronti con il catalogo
          interno di offerte.
        </p>
      </div>

      {/* KPI principali */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Spesa annua analizzata
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {formatEuro(totaleSpesa)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Somma delle spese annuali stimate sui documenti caricati.
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/30 p-4 text-sm text-emerald-50">
          <div className="text-[11px] uppercase tracking-wide text-emerald-200">
            Risparmio potenziale annuo
          </div>
          <div className="mt-1 text-2xl font-semibold text-emerald-300">
            {formatEuro(totaleRisparmio)}
          </div>
          <div className="mt-1 text-xs text-emerald-100/80">
            Somma dei risparmi annui massimi stimati rispetto ai contratti attuali.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Risparmio medio potenziale
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {percentualeMedia.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Rapporto tra risparmio potenziale e spesa totale analizzata.
          </div>
        </div>
      </div>

      {/* Tabella per categoria */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Ripartizione per categoria
        </h2>
        {categorie.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            Nessun dato ancora disponibile. Carica una bolletta o un contratto per
            iniziare a popolare il report.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-collapse text-xs text-slate-200">
                <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-3 py-2 text-left">Categoria</th>
                    <th className="px-3 py-2 text-right">Spesa annua</th>
                    <th className="px-3 py-2 text-right">
                      Risparmio potenziale annuo
                    </th>
                    <th className="px-3 py-2 text-right">% risparmio</th>
                    <th className="px-3 py-2 text-right">Documenti</th>
                  </tr>
                </thead>
                <tbody>
                  {categorie.map((c) => {
                    const perc =
                      c.spesa_totale_annua > 0
                        ? (c.risparmio_potenziale_annuo / c.spesa_totale_annua) *
                          100
                        : 0;
                    return (
                      <tr
                        key={c.categoria}
                        className="border-t border-slate-800/60 hover:bg-slate-900/40"
                      >
                        <td className="px-3 py-2 text-[11px] capitalize">
                          {c.categoria}
                        </td>
                        <td className="px-3 py-2 text-right text-[11px]">
                          {formatEuro(c.spesa_totale_annua)}
                        </td>
                        <td className="px-3 py-2 text-right text-[11px] text-emerald-300">
                          {formatEuro(c.risparmio_potenziale_annuo)}
                        </td>
                        <td className="px-3 py-2 text-right text-[11px]">
                          {perc.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2 text-right text-[11px]">
                          {c.numero_documenti}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
