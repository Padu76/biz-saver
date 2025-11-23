// app/page.tsx
export const dynamic = "force-dynamic";

const CATEGORIES = [
  {
    key: "energia",
    title: "Utenze energia / gas",
    desc: "Bollette luce e gas per uffici, studi, negozi e piccole attività (1–10 dipendenti).",
    hint: "Carica la bolletta in PDF o come foto scattata dal telefono.",
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
    desc: "In roadmap: software, servizi digitali, manutenzioni periodiche, abbonamenti vari.",
    hint: "Saranno aggiunti nelle prossime versioni di Biz Saver.",
  },
];

const FAQ = [
  {
    q: "Cos’è Biz Saver AI, in parole semplici?",
    a: "È un assistente che legge bollette e contratti al posto tuo, calcola quanto stai spendendo e ti suggerisce solo le offerte realmente più convenienti dal nostro catalogo interno.",
  },
  {
    q: "Per chi è pensato?",
    a: "Per micro-aziende, liberi professionisti e studi da 1 a 10 persone che pagano utenze, internet, telefonia e assicurazioni e non hanno tempo di confrontare ogni offerta sul mercato.",
  },
  {
    q: "Devo essere un tecnico per usarlo?",
    a: "No. Carichi un PDF o una foto della bolletta, il resto lo fa l’AI. Tu vedi solo numeri chiari: quanto spendi oggi, quanto potresti risparmiare, con quale fornitore.",
  },
];

export default async function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
              Beta per micro-imprese 1–10 dipendenti
            </span>

            <h1 className="text-3xl font-semibold tracking-tight">
              L&apos;AI che legge le tue bollette e ti dice dove puoi
              risparmiare.
            </h1>

            <p className="text-sm text-slate-300">
              Biz Saver AI analizza bollette, polizze e contratti ricorrenti,
              calcola la spesa annua della tua azienda e la confronta con un
              catalogo di offerte selezionate. Tu vedi subito quanto potresti
              tagliare sui costi fissi, senza perdere ore tra preventivi e call
              con i commerciali.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="/upload"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-accent/40 hover:bg-accent/90"
              >
                + Carica la tua prima bolletta
              </a>
              <a
                href="/report"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900"
              >
                Guarda il report risparmi
              </a>
            </div>

            <p className="text-[11px] text-slate-500">
              Nessun vincolo: usalo per una sola bolletta, giusto per vedere se
              stai pagando troppo.
            </p>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-200 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              A chi risolve un problema
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  Titolari di piccole aziende e studi che non hanno un
                  consulente dedicato ai costi.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  Chi paga luce, gas, internet, telefonia e assicurazioni ma
                  non ha mai il tempo di confrontare le offerte.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  Chi vuole un numero chiaro: “quanto potrei risparmiare
                  all’anno se cambio fornitore?”.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Come funziona */}
        <div className="grid gap-3 text-xs text-slate-300 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              1. Carichi un documento
            </div>
            <p className="mt-1">
              Bolletta, polizza o contratto (PDF o foto). Non servono form da
              compilare: basta il file che usi oggi.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              2. L&apos;AI legge e capisce i numeri
            </div>
            <p className="mt-1">
              Biz Saver estrae fornitore, canone mensile, spesa annua e
              categoria (energia, internet, telefono, assicurazioni, noleggio).
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              3. Confronto e risparmio potenziale
            </div>
            <p className="mt-1">
              Il sistema confronta con il catalogo interno e ti propone solo
              offerte che ti farebbero davvero risparmiare, evidenziando la
              migliore.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIE ANALIZZABILI */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Cosa puoi far analizzare oggi
          </h2>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
            Pensato per aziende 1–10 persone
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

      {/* MINI FAQ */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Domande frequenti veloci
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-200"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {item.q}
              </div>
              <p className="mt-2 text-[11px] text-slate-300">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="rounded-2xl border border-emerald-700/60 bg-emerald-950/20 p-5 text-sm text-emerald-50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-emerald-200">
              Fai un test su una sola bolletta
            </div>
            <p className="mt-1 text-xs text-emerald-50">
              Carica un documento, lascia lavorare l&apos;AI e guarda subito il
              risparmio potenziale annuo. Se ti convince, puoi estendere
              l&apos;analisi a tutte le spese fisse della tua azienda.
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
