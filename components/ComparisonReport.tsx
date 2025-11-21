// components/ComparisonReport.tsx
import type {
  CurrentCostProfile,
  SuggestedAlternative,
} from "@/types/cost-comparison";

interface Props {
  profile: CurrentCostProfile;
  suggestions: SuggestedAlternative[];
}

const formatEuro = (value: number, valuta: string = "EUR") =>
  `${value.toFixed(2)} ${valuta}`;

export function ComparisonReport({ profile, suggestions }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
        <p className="font-medium">Nessuna alternativa trovata per questa categoria.</p>
        <p className="mt-1 text-slate-400">
          Il catalogo interno non contiene ancora offerte per questo tipo di costo. Puoi
          comunque usare il report attuale come base per una verifica manuale con il tuo
          consulente di fiducia.
        </p>
      </div>
    );
  }

  const valuta = profile.valuta || "EUR";
  const best = suggestions[0];
  const others = suggestions.slice(1, 4); // max 3 alternative extra

  const risparmioAnnualeBest = best.risparmio_annuo_stimato;
  const risparmioMensileBest = risparmioAnnualeBest / 12;

  const percentualeBest =
    profile.spesa_mensile_attuale > 0
      ? (risparmioMensileBest / profile.spesa_mensile_attuale) * 100
      : 0;

  return (
    <section className="space-y-6">
      {/* Riepilogo situazione attuale + migliore alternativa */}
      <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 md:grid-cols-3">
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Situazione attuale – {profile.categoria}
          </div>
          <div className="text-xs text-slate-400">Fornitore attuale</div>
          <div className="text-base font-semibold">
            {profile.fornitore_attuale || "Non specificato"}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Spesa mensile stimata
          </div>
          <div className="text-xl font-semibold">
            {formatEuro(profile.spesa_mensile_attuale, valuta)}
          </div>
          <div className="text-xs text-slate-400">
            ≈ {formatEuro(profile.spesa_annua_attuale, valuta)} / anno
          </div>
        </div>
        <div className="space-y-1 rounded-xl bg-emerald-950/40 px-3 py-2 text-right">
          <div className="text-[11px] uppercase tracking-wide text-emerald-300">
            Risparmio potenziale massimo
          </div>
          <div className="text-xl font-semibold text-emerald-300">
            {risparmioAnnualeBest > 0
              ? formatEuro(risparmioAnnualeBest, valuta)
              : "0,00 " + valuta}
            {risparmioAnnualeBest > 0 && <span className="text-sm"> / anno</span>}
          </div>
          {risparmioAnnualeBest > 0 && (
            <div className="text-xs text-emerald-200">
              ≈ {risparmioMensileBest.toFixed(2)} {valuta} / mese (
              {percentualeBest.toFixed(1)}%)
            </div>
          )}
        </div>
      </div>

      {/* Scelta consigliata */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              La nostra raccomandazione
            </h2>
            <p className="text-xs text-slate-400">
              Offerta con il miglior equilibrio tra risparmio e condizioni complessive,
              in base alle informazioni disponibili.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
            Scelta consigliata
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/30 p-4 text-sm text-slate-100">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-emerald-300">
                {best.fornitore}
              </div>
              <div className="text-base font-semibold">{best.nome_offerta}</div>
              {best.tipo_offerta && (
                <div className="text-xs text-emerald-200">{best.tipo_offerta}</div>
              )}
              {best.note && (
                <p className="mt-1 text-xs text-emerald-100/80">{best.note}</p>
              )}
              {best.vincolo_mesi && (
                <p className="mt-1 text-[11px] text-emerald-200/90">
                  Vincolo: {best.vincolo_mesi} mesi
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 text-right">
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-wide text-emerald-200">
                  Costo stimato con questa offerta
                </div>
                <div className="text-xl font-semibold text-emerald-200">
                  {formatEuro(best.costo_mensile_stimato, valuta)} / mese
                </div>
                <div className="text-xs text-emerald-100/80">
                  Risparmio annuo stimato:{" "}
                  <span className="font-semibold">
                    {formatEuro(best.risparmio_annuo_stimato, valuta)}
                  </span>{" "}
                  ({(best.risparmio_percentuale * 100).toFixed(1)}%)
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                {best.link_offerta && (
                  <a
                    href={best.link_offerta}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-400/60 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/10"
                  >
                    Vai alla pagina offerta
                  </a>
                )}
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-black shadow-md shadow-accent/40 hover:bg-accent/90"
                >
                  Genera email di richiesta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Altre opzioni */}
      {others.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-100">
              Altre alternative interessanti
            </h3>
            <p className="text-xs text-slate-400">
              Opzioni che possono essere valutate come piano B o C in base alle
              preferenze di vincolo, brand o sostenibilità.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {others.map((alt) => {
              const tagLabel =
                alt.tag === "massimo_risparmio"
                  ? "Massimo risparmio"
                  : alt.tag === "equilibrata"
                  ? "Equilibrata"
                  : alt.tag === "flessibile"
                  ? "Più flessibile"
                  : alt.tag === "green"
                  ? "Opzione green"
                  : alt.tag === "premium"
                  ? "Premium"
                  : "Alternativa";

              return (
                <div
                  key={alt.id}
                  className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-100"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">
                        {alt.fornitore}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
                        {tagLabel}
                      </span>
                    </div>
                    <div className="text-sm font-semibold">{alt.nome_offerta}</div>
                    {alt.tipo_offerta && (
                      <div className="text-[11px] text-slate-300">
                        {alt.tipo_offerta}
                      </div>
                    )}
                    {alt.vincolo_mesi && (
                      <div className="text-[11px] text-slate-400">
                        Vincolo: {alt.vincolo_mesi} mesi
                      </div>
                    )}
                    {alt.note && (
                      <p className="mt-1 text-[11px] text-slate-400">{alt.note}</p>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-400">
                          Costo stimato
                        </div>
                        <div className="text-sm font-semibold">
                          {formatEuro(alt.costo_mensile_stimato, valuta)} / mese
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wide text-emerald-300">
                          Risparmio annuo
                        </div>
                        <div className="text-sm font-semibold text-emerald-300">
                          {formatEuro(alt.risparmio_annuo_stimato, valuta)}
                        </div>
                        <div className="text-[11px] text-emerald-200/90">
                          {(alt.risparmio_percentuale * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {alt.link_offerta && (
                        <a
                          href={alt.link_offerta}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-3 py-1 text-[11px] font-semibold text-slate-100 hover:bg-slate-800"
                        >
                          Vai alla pagina offerta
                        </a>
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1 text-[11px] font-semibold text-black shadow-sm shadow-accent/40 hover:bg-accent/90"
                      >
                        Genera email di richiesta
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default ComparisonReport;
