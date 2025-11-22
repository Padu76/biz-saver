// app/api/monitor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseClient";
import { suggestAlternatives } from "@/lib/providerEngine";
import type { CategoriaProvider } from "@/types/cost-comparison";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  try {
    const supabase = createClient();

    // Prendiamo tutte le analisi
    const { data, error } = await supabase
      .from("analyses")
      .select(
        "id, categoria, tipo_documento, spesa_mensile_attuale, spesa_annua_attuale, miglior_risparmio_annuo"
      );

    if (error) {
      console.error("[/api/monitor] errore fetch analyses:", error);
      return NextResponse.json(
        { error: "Errore durante il caricamento delle analisi." },
        { status: 500 }
      );
    }

    const analyses = (data as any[]) || [];
    const now = new Date().toISOString();

    let improved = 0;
    let unchanged = 0;
    let noAlternatives = 0;

    const updatedRows: any[] = [];

    for (const row of analyses) {
      const categoria = (row.categoria || "energia") as CategoriaProvider;
      const spesaMensile =
        Number(row.spesa_mensile_attuale ?? 0) ||
        (Number(row.spesa_annua_attuale ?? 0) || 0) / 12;

      // Calcola di nuovo le alternative con il catalogo attuale
      const suggestions = suggestAlternatives({
        categoria,
        spesa_mensile_attuale: spesaMensile,
        tipo_documento: row.tipo_documento ?? null,
      });

      if (!suggestions.length) {
        // Nessuna alternativa migliore oggi
        noAlternatives++;
        updatedRows.push({
          id: row.id,
          last_monitored_at: now,
          has_new_better_offer: false,
          new_best_saving: null,
          monitor_best_alternative: null,
        });
        continue;
      }

      const best = suggestions[0];
      const newSaving = Number(best.risparmio_annuo_stimato ?? 0) || 0;
      const oldSaving = Number(row.miglior_risparmio_annuo ?? 0) || 0;

      // Soglia: consideriamo "migliore" se guadagno almeno 10€ in più all'anno
      const threshold = 10;

      if (newSaving > oldSaving + threshold) {
        improved++;
        updatedRows.push({
          id: row.id,
          last_monitored_at: now,
          has_new_better_offer: true,
          new_best_saving: newSaving,
          monitor_best_alternative: best,
        });
      } else {
        unchanged++;
        updatedRows.push({
          id: row.id,
          last_monitored_at: now,
          has_new_better_offer: false,
          new_best_saving: oldSaving || null,
          monitor_best_alternative: best,
        });
      }
    }

    // Aggiorno in Supabase (batch via upsert)
    if (updatedRows.length > 0) {
      const { error: updateError } = await supabase
        .from("analyses")
        .upsert(updatedRows, { onConflict: "id" });

      if (updateError) {
        console.error("[/api/monitor] errore upsert analyses:", updateError);
      }
    }

    return NextResponse.json(
      {
        checked: analyses.length,
        improved,
        unchanged,
        noAlternatives,
        timestamp: now,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[/api/monitor] errore generale:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Errore interno durante il monitoraggio delle offerte.",
      },
      { status: 500 }
    );
  }
}
