// app/page.tsx
export const dynamic = "force-dynamic";

const CATEGORIES = [
  {
    key: "energia",
    icon: "⚡",
    title: "Utenze energia / gas",
    desc: "Bollette luce e gas per uffici, studi, negozi e piccole attività (1–10 dipendenti).",
    hint: "Carica la bolletta in PDF o come foto scattata dal telefono.",
  },
  {
    key: "internet",
    icon: "🌐",
    title: "Internet / Fibra",
    desc: "Linee fibra, FTTC o FWA per la connessione dell’ufficio o studio professionale.",
    hint: "Contratti business con canone mensile fisso.",
  },
  {
    key: "telefonia_mobile",
    icon: "📱",
    title: "Telefonia mobile business",
    desc: "SIM aziendali, piani voce + dati, bundle per titolari e collaboratori.",
    hint: "Perfetto per flotte da 1 a 10 smartphone.",
  },
  {
    key: "assicurazioni",
    icon: "🛡️",
    title: "Assicurazioni aziendali",
    desc: "Polizze RC aziendale, ufficio/immobile, RC professionale (no veicoli, per ora).",
    hint: "Contratti annuali con premio ricorrente.",
  },
  {
    key: "noleggio_auto",
    icon: "🚗",
    title: "Noleggio auto lungo termine",
    desc: "Veicoli aziendali con canone mensile (RC, Kasko, manutenzione inclusa).",
    hint: "Contratti 24–48 mesi con canone fisso.",
  },
  {
    key: "altro",
    icon: "📦",
    title: "Altre spese ricorrenti",
    desc: "In roadmap: software, servizi digitali, manutenzioni periodiche, abbonamenti vari.",
    hint: "Saranno aggiunte nelle prossime versioni.",
  },
];

const FAQ = [
  {
    q: "Perché dovrei usarlo se ho già un commercialista?",
    a: "Il commercialista registra i costi, Biz Saver ti aiuta a tagliarli. È focalizzato solo su bollette, contratti e canoni ricorrenti, con un occhio al risparmio concreto.",
  },
  {
    q: "Quanto è complicato da usare?",
    a: "Carichi un PDF o una foto dal telefono. Stop. L’AI legge per te, fa i conti e ti mostra solo 2 numeri: quanto spendi ora e quanto potresti risparmiare.",
  },
  {
    q: "Devo cambiare fornitore da solo?",
    a: "Sì, per ora Biz Saver ti mostra il confronto e l’offerta consigliata. Tu scegli se cambiare o meno, con i dati chiari davanti.",
  },
];

export default async function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 md:px-10 md:py-10">
          {/* Glow */}
          <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Testo */}
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Pensato per micro-imprese 1–10 persone
              </span>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Quante volte hai pensato
                <span className="text-emerald-400"> “questa bolletta è una follia”</span>…
                ma non avevi tempo di capirla?
              </h1>

              <p className="text-sm text-slate-200">
                Biz Saver AI legge bollette e contratti al posto tuo,
                calcola quanto stai pagando davvero e ti mostra in chiaro
                se esistono offerte migliori dal nostro catalogo interno.
                Tu vedi solo il succo: <span className="font-semibold">quanto puoi risparmiare all’anno.</span>
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
                  className="inline-flex items-center justify-center rounded-lg border border-slate-600/80 bg-slate-950/40 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-900/70"
                >
                  Guarda un esempio di report
                </a>
              </div>

              <p className="text-[11px] text-slate-400">
                Nessun impegno: prova con una sola bolletta. Nel peggiore dei casi
                scopri che stai già pagando il giusto, nel migliore ti trovi
                qualche centinaio di euro l&apos;anno in tasca.
              </p>
            </div>

            {/* Box “screenshot” mockup */}
            <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl shadow-black/40">
              <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Esempio reale di analisi
                </span>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                  Energia • Ufficio
                </span>
              </div>

              <div className="space-y-3 rounded-xl bg-slate-900/80 p-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[11px] text-slate-400">
                      Spesa attuale
                    </div>
                    <div className="text-sm font-semibold text-slate-100">
                      42,70 € / mese
                    </div>
                    <div className="text-[11px] text-slate-500">
                      S4 Energia – utenza business
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-emerald-300">
                      Se cambi offerta:
                    </div>
                    <div className="text-sm font-semibold text-emerald-400">
                      -34,10 € / mese
                    </div>
                    <div className="text-[11px] text-emerald-200/80">
                      ≈ 409,20 € / anno
                    </div>
                  </div>
                </div>

                {/* mini “grafico” a colonne */}
                <div className="mt-2 rounded-lg bg-slate-950/70 p-3">
                  <div className="flex items-end gap-2 h-20">
                    <div className="flex-1">
                      <div className="flex h-full items-end">
                        <div className="w-full rounded-t-md bg-slate-600" style={{ height: "80%" }} />
                      </div>
                      <div className="mt-1 text-center text-[10px] text-slate-400">
                        Ora
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex h-full items-end">
                        <div className="w-full rounded-t-md bg-emerald-400" style={{ height: "20%" }} />
                      </div>
                      <div className="mt-1 text-center text-[10px] text-emerald-300">
                        Con Biz Saver
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
                  <span className="font-semibold">Suggerimento AI:</span>{" "}
                  “Per questa utenza l&apos;offerta più conveniente è Sorgenia
                  Next Energy Business. Stessa tipologia di servizio, costo
                  stimato 8,60€/mese e risparmio annuo intorno ai 400€.”
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Come funziona */}
        <div className="grid gap-3 text-xs text-slate-300 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              1. Carichi un documento
            </div>
            <p className="mt-1">
              Bolletta, polizza o contratto (PDF o foto dal telefono). Niente
              form infiniti da compilare, usi i documenti che hai già.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              2. L&apos;AI legge e normalizza
            </div>
            <p className="mt-1">
              Biz Saver riconosce categoria, fornitore, spesa mensile e annua.
              Tutti i numeri vengono portati su base annua per confronto pulito.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              3. Vedi solo il risparmio potenziale
            </div>
            <p className="mt-1">
              Il sistema confronta con il catalogo interno e mostra solo
              offerte che ti fanno risparmiare. Una viene evidenziata come
              “miglior scelta”.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIE ANALIZZABILI */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Su quali costi aziendali può aiutarti
          </h2>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
            Focus: costi fissi ricorrenti
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-emerald-500/60 hover:bg-slate-900/90"
            >
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-base">
                    {cat.icon}
                  </span>
                  <span>{cat.title}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">{cat.desc}</p>
              </div>
              <div className="mt-3 text-[11px] text-slate-400">{cat.hint}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL / EMPATIA */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-100">
            “Ho caricato 3 bollette in pausa pranzo. Ho trovato 900€ di risparmio annuo.”
          </h2>
          <p className="text-xs text-slate-300">
            L’obiettivo di Biz Saver non è diventare l’ennesimo gestionale, ma
            un alleato pratico per il titolare che non ha tempo da perdere.
            Ti mostra cifre concrete, non grafici incomprensibili.
          </p>
          <p className="text-xs text-slate-300">
            Pensato per chi apre la mail della bolletta, scuote la testa e
            pensa: “ci guardo quando ho tempo”. Qui il tempo lo mettiamo noi:
            tu carichi il documento, Biz Saver fa il resto.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-accent text-xs font-semibold text-black">
              AP
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Caso tipo: studio / piccola azienda
              </div>
              <div className="text-[11px] text-slate-400">
                1 sede • 4 persone • utenze standard
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1 text-[11px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Energia ufficio</span>
              <span className="font-semibold text-emerald-300">
                -409 €/anno
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Fibra business</span>
              <span className="font-semibold text-emerald-300">
                -192 €/anno
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Telefonia mobile</span>
              <span className="font-semibold text-emerald-300">
                -300 €/anno
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
            Totale potenziale: circa{" "}
            <span className="font-semibold">900 €/anno</span> di costi fissi in
            meno, solo mettendo a confronto poche bollette.
          </div>
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
      <section className="sticky bottom-4 z-10 rounded-2xl border border-emerald-700/60 bg-emerald-950/80 p-4 text-sm text-emerald-50 shadow-lg shadow-emerald-900/40 md:static md:shadow-none">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-emerald-200">
              Fai un test concreto, non teorico
            </div>
            <p className="mt-1 text-xs text-emerald-50">
              Prendi una bolletta che ti dà fastidio da mesi, caricala e guarda
              se Biz Saver trova davvero margine di risparmio. È il modo più
              veloce per capire se vale la pena usarlo per tutta l&apos;azienda.
            </p>
          </div>
          <a
            href="/upload"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-xs font-semibold text-black shadow-md shadow-emerald-500/40 hover:bg-emerald-300"
          >
            Carica ora una bolletta di prova
          </a>
        </div>
      </section>
    </div>
  );
}
