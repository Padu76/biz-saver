import { createClient } from "@/lib/supabaseClient";
import { HistoryTable } from "@/components/HistoryTable";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[History] errore caricamento analyses:", error);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Storico analisi</h1>
        <p className="mt-1 text-sm text-slate-300">
          Qui trovi tutte le analisi effettuate. Puoi eliminare record doppi o
          non più rilevanti.
        </p>
      </div>

      <HistoryTable analyses={(data as any[]) || []} />
    </div>
  );
}
