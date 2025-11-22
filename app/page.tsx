export const dynamic = "force-dynamic";

const CATEGORIES = [
  {
    label: "Utenze energia / gas",
    desc: "Bolletta luce e gas per uffici, studi e piccole attività.",
  },
  {
    label: "Telefonia mobile business",
    desc: "SIM aziendali, flotte mobile, contratti voce + dati.",
  },
  {
    label: "Internet / Fibra",
    desc: "Fibra, FTTC o FWA per uffici, negozi e coworking.",
  },
  {
    label: "Assicurazioni",
    desc: "Polizze RC, assicurazioni auto, uffici, responsabilità professionale.",
  },
  {
    label: "Noleggio auto lungo termine",
    desc: "Contratti di noleggio per veicoli aziendali e auto di servizio.",
  },
];

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold">Biz Saver – Panoramica</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Carica bollette e contratti, lascia che l&apos;AI li legga e scopri
            quanto può risparmiare la tua azienda passando alle offerte più
            efficienti su energia, telefonia, internet, assicurazioni e
            noleggio auto.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-accent/40 hover:bg-accent/90"
          >
            + Nuova analisi
          </a>
          <a
            href="/report"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            Vedi report risparmi
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Tipi di costi che puoi analizzare
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-200"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {cat.label}
              </div>
              <p className="mt-2 text-[11px] text-slate-300">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
