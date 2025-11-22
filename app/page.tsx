// app/page.tsx
export const dynamic = "force-dynamic";

const CATEGORIES = [
  {
    key: "energia",
    title: "Utenze energia / gas",
    desc: "Bollette luce e gas per uffici, studi, negozi e piccole attività (1–10 dipendenti).",
    hint: "Carica la bolletta in PDF o foto.",
  },
  {
    key: "internet",
    title: "Internet / Fibra",
    desc: "Linee fibra, FTTC o FWA per la connessione dell’ufficio o studio professionale.",
    hint: "Contratti business con canone mensile fisso.",
  },
  {
    key: "telefonia_mobile",
    title: "Telefonia mobile business",
    desc: "SIM aziendali, piani voce + dati, bundle per titolari e collaboratori.",
    hint: "Ideale per flotte da 1 a 10 smartphone.",
  },
  {
    key: "assicurazioni",
    title: "Assicurazioni aziendali",
    desc: "Polizze RC aziendale, ufficio/immobile, RC professionale (no veicoli, per ora).",
    hint: "Contratti annuali con premio ricorrente.",
  },
  {
    key: "noleggio_auto",
    title: "Noleggio auto lungo termine",
    desc: "Veicoli aziendali con canone mensile (RC, Kasko, manutenzione inclusa).",
    hint: "Contratti 24–48 mesi con canone fisso.",
  },
  {
    key: "altro",
    title: "Altre spese ricorrenti",
    desc: "In sviluppo: software, servizi digitali, manutenzioni periodiche.",
    hint: "Roadmap per le prossime versioni.",
  },
];

export default async function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Biz Saver AI – Panoramica
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Collega le bollette e i contratti della tua azienda, lascia che
          l&apos;AI li legga al posto tuo e scopri in pochi secondi dove puoi
          tagliare costi fissi senza impazzire tra offerte e preventivi.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-accent/40 hover:bg-accent/90"
          >
            + Carica un documento
          </a>
          <a
            href="/report"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            Vedi report risparmi
          </a>
        </div>

        <div className="mt-4 grid gap-3 text-xs text-slate-300 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              1. Carica
            </div>
            <p className="mt-1">
              Bolletta, polizza o contratto (PDF o immagine) direttamente dalla
              sezione &quot;Carica documenti&quot;.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              2. L&apos;AI legge per te
            </div>
            <p className="mt-1">
              L&apos;AI estrae fornitore, costi mensili/annuali e categoria di
              spesa e li salva nello storico.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              3. Confronto e risparmi
            </div>
            <p className="mt-1">
              Biz Saver confronta con le offerte del catalogo interno e ti
              mostra solo le alternative realmente più convenienti.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIE ANALIZZABILI */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Categorie di costo che puoi analizzare oggi
          </h2>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
            Target: micro-imprese 1–10 dipendenti
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-200"
            >
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {cat.title}
                </div>
                <p className="mt-2 text-[11px] text-slate-300">{cat.desc}</p>
              </div>
              <div className="mt-3 text-[11px] text-slate-400">
                {cat.hint}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION FINALE */}
      <section className="rounded-2xl border border-emerald-700/60 bg-emerald-950/20 p-5 text-sm text-emerald-50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-emerald-200">
              Pronto per il primo test?
            </div>
            <p className="mt-1 text-xs text-emerald-50">
              Carica una sola bolletta e guarda quanto potresti risparmiare in
              un anno. Poi decidi se estendere l&apos;analisi a tutta
              l&apos;azienda.
            </p>
          </div>
          <a
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-xs font-semibold text-black shadow-md shadow-emerald-500/40 hover:bg-emerald-300"
          >
            Inizia dall&apos;analisi di una bolletta
          </a>
        </div>
      </section>
    </div>
  );
}
