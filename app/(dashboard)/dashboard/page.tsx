export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Panoramica risparmi</h1>
      <p className="text-sm text-slate-300 max-w-2xl">
        Da qui avrai una vista complessiva delle spese analizzate e dei risparmi
        potenziali. Carica qualche documento per iniziare a popolare il cruscotto.
      </p>

      <div className="grid gap-4 md:grid-cols-3 text-sm">
        <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Risparmio potenziale stimato
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-400">
            0 &euro;/anno
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Una volta analizzate le bollette, qui vedrai il totale annuo potenziale.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Documenti analizzati
          </div>
          <div className="mt-2 text-2xl font-semibold">0</div>
          <p className="mt-1 text-xs text-slate-400">
            Conta di bollette, polizze e contratti che hai caricato.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Categorie coperte
          </div>
          <div className="mt-2 text-2xl font-semibold">4</div>
          <p className="mt-1 text-xs text-slate-400">
            Energia, telefonia, assicurazioni, noleggio auto.
          </p>
        </div>
      </div>
    </div>
  );
}
