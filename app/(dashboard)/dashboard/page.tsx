import { createClient } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("analyses")
    .select("categoria, spesa_annua_attuale, miglior_risparmio_annuo");

  if (error) {
    console.error("[Panoramica] errore caricamento analyses:", error);
  }

  const analyses = (data as any[]) || [];

  const totalSaving = analyses.reduce(
    (sum, a) => sum + (Number(a.miglior_risparmio_annuo) || 0),
    0
  );

  const docCount = analyses.length;

  const categoriesSet = new Set<string>();
  analyses.forEach((a) => {
    if (a.categoria) categoriesSet.add(a.categoria as string);
  });
  const categoriesCount = categoriesSet.size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Panoramica risparmi</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          Da qui avrai una vista complessiva delle spese analizzate e dei
          risparmi potenziali. Carica qualche documento per iniziare a
          popolare il cruscotto.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 text-sm">
        <div className="rounded-xl border border-emerald-700/70 bg-emerald-950/40 p-5 text-emerald-50">
          <div className="text-[11px] uppercase tracking-wide text-emerald-200">
            Risparmio potenziale stimato
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {totalSaving.toFixed(2)} €/anno
          </div>
          <p className="mt-1 text-xs text-emerald-100/80">
            Una volta analizzate le bollette, qui vedrai il totale annuo
            potenziale.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-slate-200">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Documenti analizzati
          </div>
          <div className="mt-2 text-3xl font-semibold">{docCount}</div>
          <p className="mt-1 text-xs text-slate-500">
            Conta di bollette, polizze e contratti che hai caricato.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-slate-200">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Categorie coperte
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {categoriesCount}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Energia, telefonia, assicurazioni, noleggio auto, ecc.
          </p>
        </div>
      </div>
    </div>
  );
}
