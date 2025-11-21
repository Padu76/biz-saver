import { ComparisonReport } from "@/components/ComparisonReport";
import { suggestAlternatives } from "@/lib/providerEngine";

export default function ReportPage() {
  // Esempio statico di profilo, in attesa del collegamento con l'analisi reale
  const profile = {
    categoria: "telefonia_mobile" as const,
    fornitore_attuale: "TIM",
    spesa_mensile_attuale: 89,
    spesa_annua_attuale: 89 * 12,
    valuta: "EUR",
    dettagli: {
      numero_linee: 3,
      gb_totali: 150
    }
  };

  const suggestions = suggestAlternatives({
    categoria: profile.categoria,
    spesa_mensile_attuale: profile.spesa_mensile_attuale
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Report di comparazione</h1>
      <p className="text-sm text-slate-300 max-w-2xl">
        Qui vedrai i report generati dalle tue bollette. Per ora mostriamo
        un esempio statico basato su un profilo di telefonia mobile.
      </p>
      <ComparisonReport profile={profile} suggestions={suggestions} />
    </div>
  );
}
