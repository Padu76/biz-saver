import { createClient } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type AlternativeJson = {
  fornitore: string;
  nome_offerta: string;
  costo_mensile_stimato: number;
  risparmio_annuo_stimato: number;
  risparmio_percentuale: number;
  vincolo_mesi?: number;
  link_offerta?: string;
  tag?: string;
  is_best?: boolean;
};

type AnalysisRow = {
  id: number;
  created_at: string | null;
  categoria: string | null;
  tipo_documento: string | null;
  fornitore_attuale: string | null;
  spesa_mensile_attuale: number | null;
  spesa_annua_attuale: number | null;
  miglior_risparmio_annuo: number | null;
  alternatives: AlternativeJson[] | null;
  filename: string | null;
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

function formatDate(value: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ReportPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("analyses")
    .select(
      "id, created_at, categoria, tipo_documento, fornitore_attuale, spesa_mensile_attuale, spesa_annua_attuale, miglior_risparmio_annuo, alternatives, filename"
    );

  if (error) {
    console.error("[Report] Errore caricamento analyses:", error);
  }

  const rows: AnalysisRow[] = (data as any[]) || [];

  // Aggregazione per categoria
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

  // Top opportunità: prendiamo il best alternative per ogni documento
  const opportunities = rows
    .map((row) => {
      const alts = row.alternatives || [];
      if (!alts.length) return null;
      const bestAlt =
        alts.find((a) => a.is_best) ||
        alts.reduce((m, a) =>
          (a.risparmio_annuo_stimato || 0) > (m.risparmio_annuo_stimato || 0)
            ? a
            : m
        );
      const saving = Number(bestAlt.risparmio_annuo_stimato ?? 0) || 0;
      if (saving <= 0) return null;
      return { row, bestAlt, saving };
    })
    .filter(Boolean) as {
    row: AnalysisRow;
    bestAlt: AlternativeJson;
    saving: number;
  }[];

  const topOpportunities = opportunities
    .sort((a, b) => b.saving - a.saving)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Report risparmi</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          Panoramica dei costi analizzati e dei risparmi potenziali individuati
          su bollette, contratti e polizze. I valori sono basati sulle
          alternative presenti nel catalogo interno.
        </p>
      </div>

      {/* KPI PRINCIPALI */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Spesa annua analizzata
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {formatEuro(totaleSpesa)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Somma delle spese annuali stimate su tutti i documenti caricati.
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
            Somma dei risparmi annuali massimi stimati, se tutte le proposte
            consigliate venissero attivate.
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

      {/* TOP OPPORTUNITA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Top opportunità di risparmio
          </h2>
          <p className="text-xs text-slate-400">
            Le analisi dove il passaggio all&apos;offerta consigliata genera il
            maggior risparmio annuo.
          </p>
        </div>

        {topOpportunities.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            Nessuna opportunità significativa ancora. Carica alcune bollette
            dalla sezione &quot;Carica documenti&quot; per popolare il report.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {topOpportunities.map(({ row, bestAlt }) => {
              const current = Number(row.spesa_annua_attuale ?? 0) || 0;
              const saving = Number(bestAlt.risparmio_annuo_stimato ?? 0) || 0;
              const newCost = Math.max(current - saving, 0);
              const perc =
                current > 0 ? (saving / current) * 100 : 0;

              return (
                <div
                  key={row.id}
                  className="flex h-full flex-col justify-between rounded-2xl border border-emerald-700/60 bg-emerald-950/20 p-4 text-xs text-slate-100"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">
                        {row.categoria || "Categoria"}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                        Consigliata
                      </span>
                    </div>
                    <div className="text-sm font-semibold">
                      {row.tipo_documento || "Documento"}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Attuale:{" "}
                      <span className="font-semibold">
                        {row.fornitore_attuale || "-"}
                      </span>{" "}
                      · File: {row.filename || "-"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Analizzato il {formatDate(row.created_at)}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        Situazione attuale
                      </div>
                      <div className="text-sm font-semibold">
                        {formatEuro(current)} / anno
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ≈ {formatEuro(row.spesa_mensile_attuale ?? 0)} / mese
                      </div>
                    </div>
                    <div className="space-y-1 rounded-xl bg-emerald-950/40 p-3">
                      <div className="text-[10px] uppercase tracking-wide text-emerald-300">
                        Offerta consigliata – {bestAlt.fornitore}
                      </div>
                      <div className="text-sm font-semibold text-emerald-200">
                        Nuova spesa stimata: {formatEuro(newCost)} / anno
                      </div>
                      <div className="text-[11px] text-emerald-200/90">
                        Risparmio stimato:{" "}
                        <span className="font-semibold">
                          {formatEuro(saving)}
                        </span>{" "}
                        ({(perc).toFixed(1)}%)
                      </div>
                      {bestAlt.vincolo_mesi && (
                        <div className="text-[11px] text-emerald-100/80">
                          Vincolo: {bestAlt.vincolo_mesi} mesi
                        </div>
                      )}
                      {bestAlt.nome_offerta && (
                        <div className="text-[11px] text-emerald-100/80">
                          Offerta: {bestAlt.nome_offerta}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    {bestAlt.link_offerta && (
                      <a
                        href={bestAlt.link_offerta}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-emerald-400/60 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-500/10"
                      >
                        Vai alla pagina offerta
                      </a>
                    )}
                    <span className="text-[11px] text-slate-400">
                      Puoi generare una mail di richiesta dettagliata dalla
                      scheda analisi specifica.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIPARTIZIONE PER CATEGORIA */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Ripartizione per categoria
        </h2>
        {categorie.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            Nessun dato ancora disponibile. Carica almeno un documento per
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
                        ? (c.risparmio_potenziale_annuo /
                            c.spesa_totale_annua) *
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
