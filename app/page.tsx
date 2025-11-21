import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 ring-1 ring-accent/40">
            <span className="text-lg font-bold text-accent">λ</span>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide uppercase text-accent">
              BizSaver AI
            </div>
            <p className="text-xs text-slate-400">
              Smart Cost Reduction
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="#come-funziona" className="hover:text-accent transition-colors">
            Come funziona
          </Link>
          <Link href="#categorie" className="hover:text-accent transition-colors">
            Categorie
          </Link>
          <Link href="#sicurezza" className="hover:text-accent transition-colors">
            Sicurezza
          </Link>
        </nav>
        <Link
          href="/dashboard"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-accent/40 hover:bg-accent/90"
        >
          Entra nella web app
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center px-6 pb-10 pt-6 md:px-10 md:pt-10">
        <div className="flex w-full max-w-5xl flex-1 flex-col gap-10 md:flex-row">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/40 px-3 py-1 text-xs text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Analisi automatica di bollette, polizze e contratti
            </div>
            <div>
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Taglia i costi aziendali
                <span className="text-accent"> senza tagliare il tempo.</span>
              </h1>
              <p className="mt-4 max-w-xl text-balance text-sm text-slate-300 md:text-base">
                Carica bollette di energia, telefonia, assicurazioni e noleggio.
                BizSaver AI legge i PDF, trova gli sprechi e ti propone fornitori
                alternativi pi&ugrave; convenienti in pochi secondi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-accent/40 hover:bg-accent/90"
              >
                Inizia l&apos;analisi gratuita
              </Link>
              <span className="text-xs text-slate-400 md:text-sm">
                Nessuna carta di credito • Pensato per aziende 1&ndash;10 dipendenti
              </span>
            </div>

            <div className="mt-4 grid max-w-xl grid-cols-2 gap-3 text-xs text-slate-300 md:text-sm">
              <div className="rounded-xl border border-slate-800 bg-black/40 p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Categorie coperte
                </div>
                <ul className="mt-2 space-y-1">
                  <li>⚡ Energia &amp; Gas</li>
                  <li>📱 Telefonia &amp; Internet</li>
                  <li>🛡️ Assicurazioni</li>
                  <li>🚗 Noleggio auto</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-800 bg-black/40 p-3">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Risparmi tipici
                </div>
                <ul className="mt-2 space-y-1">
                  <li>Fino al 30% su telefonia</li>
                  <li>Fino al 20% su energia</li>
                  <li>Fino al 15% su noleggio</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative mt-6 h-full rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 shadow-2xl md:mt-0">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  Anteprima pannello risparmi
                </span>
                <span className="rounded-full bg-slate-900/60 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-400">
                  Live demo
                </span>
              </div>

              <div className="space-y-3 rounded-xl bg-black/60 p-3 text-xs text-slate-200">
                <div className="flex items-center justify-between">
                  <span>Telefonia Mobile</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                    -780 &euro;/anno
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Spesa attuale</span>
                  <span>89 &euro;/mese</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Spesa stimata con offerta consigliata</span>
                  <span>24 &euro;/mese</span>
                </div>
              </div>

              <div className="mt-3 space-y-3 rounded-xl bg-black/40 p-3 text-xs text-slate-200">
                <div className="flex items-center justify-between">
                  <span>Energia &amp; Gas</span>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-400">
                    -430 &euro;/anno
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Spesa attuale stimata</span>
                  <span>2.400 &euro;/anno</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Range mercato per il tuo profilo</span>
                  <span>1.700&ndash;2.000 &euro;/anno</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-3 text-xs text-accent">
                BizSaver AI genera automaticamente un piano di azione pratico:
                chi contattare, quali offerte valutare e quanto puoi risparmiare ogni anno.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
