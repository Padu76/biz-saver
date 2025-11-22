// app/(dashboard)/report/page.tsx
import { createClient } from "@/lib/supabaseClient";
import { BarChart } from "@/components/report/BarChart";
import { CategoryCards } from "@/components/report/CategoryCards";
import { DocumentAccordion } from "@/components/report/DocumentAccordion";

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("[Report] errore caricamento analyses:", error);
  }

  const analyses = (data as any[]) || [];

  // KPI principali
  const totalAnnualCost = analyses.reduce(
    (sum, a) => sum + (Number(a.spesa_annua_attuale) || 0),
    0
  );

  const totalAnnualSaving = analyses.reduce(
    (sum, a) => sum + (Number(a.miglior_risparmio_annuo) || 0),
    0
  );

  // Raggruppo per categoria
  const categoriesMap: Record<
    string,
    { cost: number; saving: number; count: number }
  > = {};

  for (const a of analyses) {
    const cat = (a.categoria || "altro") as string;
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = { cost: 0, saving: 0, count: 0 };
    }
    categoriesMap[cat].cost += Number(a.spesa_annua_attuale) || 0;
    categoriesMap[cat].saving += Number(a.miglior_risparmio_annuo) || 0;
    categoriesMap[cat].count += 1;
  }

  const categoriesData = Object.entries(categoriesMap).map(
    ([categoria, vals]) => ({
      categoria,
      spesa_annua: vals.cost,
      risparmio_annuo: vals.saving,
      documenti: vals.count,
    })
  );

  const topSavings = analyses
    .filter((a) => (Number(a.miglior_risparmio_annuo) || 0) > 0)
    .sort(
      (a, b) =>
        (Number(b.miglior_risparmio_annuo) || 0) -
        (Number(a.miglior_risparmio_annuo) || 0)
    )
    .slice(0, 5);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Report risparmi</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          Panoramica dei costi analizzati e dei risparmi potenziali individuati
          su bollette, contratti e polizze caricati in Biz Saver.
        </p>
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-200">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Spesa annua analizzata
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {totalAnnualCost.toFixed(2)} €
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Somma delle spese annuali stimate su tutti i documenti.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-700/70 bg-emerald-950/40 p-5 text-sm text-emerald-50">
          <div className="text-[11px] uppercase tracking-wide text-emerald-200">
            Risparmio potenziale annuo
          </div>
          <div className="mt-2 text-3xl font-semibold text-emerald-300">
            {totalAnnualSaving.toFixed(2)} €
          </div>
          <p className="mt-1 text-xs text-emerald-100/80">
            Se tutte le offerte consigliate venissero attivate.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-200">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Documenti analizzati
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {analyses.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Bollette, polizze e contratti letti dall&apos;AI.
          </p>
        </div>
      </div>

      {/* Grafico + card categorie */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart data={categoriesData} />
        <CategoryCards data={categoriesData} />
      </div>

      {/* Top opportunità */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Top opportunità di risparmio
        </h2>

        {topSavings.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
            Nessuna opportunità di risparmio significativa ancora. Carica una
            bolletta o un contratto dalla sezione &quot;Carica documenti&quot;.
          </div>
        ) : (
          <div className="space-y-3">
            {topSavings.map((a) => {
              const annualCost = Number(a.spesa_annua_attuale) || 0;
              const saving = Number(a.miglior_risparmio_annuo) || 0;
              const perc =
                annualCost > 0 ? (saving / annualCost) * 100 : 0;

              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-emerald-700/60 bg-emerald-950/20 p-4 text-xs text-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">
                        {a.filename || "Documento"}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {a.categoria || "categoria non definita"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Fornitore attuale:{" "}
                        <span className="font-semibold">
                          {a.fornitore_attuale || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-[11px] text-slate-400">
                        Spesa annua attuale
                      </div>
                      <div className="text-sm font-semibold">
                        {annualCost.toFixed(2)} €
                      </div>
                      <div className="text-[11px] text-emerald-300">
                        Risparmio potenziale:{" "}
                        <span className="font-semibold">
                          {saving.toFixed(2)} €
                        </span>{" "}
                        ({perc.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dettaglio per documento con alternative salvate */}
      <DocumentAccordion analyses={analyses} />
    </div>
  );
}
