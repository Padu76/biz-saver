import { createClient } from "@/lib/supabaseClient";
import { HistoryTable } from "@/components/HistoryTable";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Errore caricamento storico:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Storico analisi</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-300">
          Qui trovi tutte le analisi effettuate e salvate automaticamente.
        </p>
      </div>

      <HistoryTable analyses={data || []} />
    </div>
  );
}
