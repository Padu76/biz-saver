import { supabase } from "@/lib/supabaseClient";
import { HistoryTable } from "@/components/HistoryTable";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  if (!supabase) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Storico analisi</h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Per visualizzare lo storico, configura prima Supabase impostando le variabili
          <code className="mx-1 rounded bg-slate-900 px-1 py-0.5 text-[11px]">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          e
          <code className="mx-1 rounded bg-slate-900 px-1 py-0.5 text-[11px]">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          (e opzionalmente{" "}
          <code className="mx-1 rounded bg-slate-900 px-1 py-0.5 text-[11px]">
            SUPABASE_SERVICE_ROLE_KEY
          </code>
          ) su Vercel.
        </p>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("analyses")
    .select("id, created_at, categoria, fornitore_attuale, spesa_mensile_attuale, spesa_annua_attuale, miglior_risparmio_annuo, filename")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[history] errore supabase:", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Storico analisi</h1>
        <p className="text-sm text-red-400">
          Errore nel recupero dei dati da Supabase: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Storico analisi</h1>
      <p className="text-sm text-slate-300 max-w-2xl">
        Elenco delle ultime analisi effettuate. Quando l&apos;AI sar&agrave; collegata ai PDF
        reali, qui vedrai la cronologia completa delle tue ottimizzazioni di costo.
      </p>
      <HistoryTable records={data || []} />
    </div>
  );
}
