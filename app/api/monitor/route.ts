// app/api/monitor/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseClient";
import { suggestAlternatives } from "@/lib/providerEngine";
import type { CategoriaProvider } from "@/types/cost-comparison";
import { Resend } from "resend";

export const runtime = "nodejs";

const resendApiKey = process.env.RESEND_API_KEY || "";
const ALERT_EMAIL_FROM = process.env.ALERT_EMAIL_FROM || "";
const ALERT_EMAIL_TO = process.env.ALERT_EMAIL_TO || "";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(_req: NextRequest) {
  try {
    const supabase = createClient();

    // prendiamo tutte le analisi con info per il monitoraggio
    const { data, error } = await supabase
      .from("analyses")
      .select(
        `
        id,
        categoria,
        tipo_documento,
        spesa_mensile_attuale,
        spesa_annua_attuale,
        miglior_risparmio_annuo,
        has_new_better_offer,
        new_best_saving,
        monitor_best_alternative,
        filename,
        fornitore_attuale
      `
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
    const newlyImprovedForEmail: any[] = [];

    const threshold = 10; // almeno 10 €/anno in più di risparmio

    for (const row of analyses) {
      const categoria = (row.categoria || "energia") as CategoriaProvider;

      const spesaMensile =
        Number(row.spesa_mensile_attuale ?? 0) ||
        (Number(row.spesa_annua_attuale ?? 0) || 0) / 12;

      const oldSaving = Number(row.miglior_risparmio_annuo ?? 0) || 0;
      const prevBestSaving = Number(row.new_best_saving ?? 0) || 0;
      const hadBetterFlag = !!row.has_new_better_offer;

      // ricalcolo alternative col catalogo attuale
      const suggestions = suggestAlternatives({
        categoria,
        spesa_mensile_attuale: spesaMensile,
        tipo_documento: row.tipo_documento ?? null,
      });

      if (!suggestions.length) {
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

      let hasNewBetterOffer = hadBetterFlag;
      let newBestSaving = prevBestSaving || oldSaving || null;
      let monitorBestAlternative = row.monitor_best_alternative || null;
      let isNewImprovement = false;

      // criterio: nuova offerta davvero migliore?
      if (newSaving > oldSaving + threshold) {
        // se prima non c'era mai stata un'offerta migliore
        // OPPURE questa è ancora più conveniente di quella già salvata
        if (!hadBetterFlag || newSaving > prevBestSaving + threshold) {
          isNewImprovement = true;
        }

        hasNewBetterOffer = true;
        newBestSaving = newSaving;
        monitorBestAlternative = best;
        improved++;
      } else {
        // nessun miglioramento reale rispetto a prima
        unchanged++;
        // manteniamo eventuale info precedente
        hasNewBetterOffer = hadBetterFlag;
        newBestSaving = prevBestSaving || oldSaving || null;
        monitorBestAlternative = hadBetterFlag
          ? row.monitor_best_alternative
          : null;
      }

      updatedRows.push({
        id: row.id,
        last_monitored_at: now,
        has_new_better_offer: hasNewBetterOffer,
        new_best_saving: newBestSaving,
        monitor_best_alternative: monitorBestAlternative,
      });

      if (isNewImprovement) {
        newlyImprovedForEmail.push({
          id: row.id,
          filename: row.filename,
          categoria: row.categoria,
          fornitore_attuale: row.fornitore_attuale,
          oldSaving,
          newSaving,
          best,
        });
      }
    }

    // upsert in Supabase
    if (updatedRows.length > 0) {
      const { error: updateError } = await supabase
        .from("analyses")
        .upsert(updatedRows, { onConflict: "id" });

      if (updateError) {
        console.error("[/api/monitor] errore upsert analyses:", updateError);
      }
    }

    // EMAIL ALERT se ci sono nuove opportunità
    if (
      newlyImprovedForEmail.length > 0 &&
      resend &&
      ALERT_EMAIL_FROM &&
      ALERT_EMAIL_TO
    ) {
      const lines = newlyImprovedForEmail.map((item) => {
        const best = item.best;
        const delta = item.newSaving - item.oldSaving;

        return [
          `Documento: ${item.filename || "sconosciuto"}`,
          `Categoria: ${item.categoria || "-"}`,
          `Fornitore attuale: ${item.fornitore_attuale || "-"}`,
          `Nuova offerta consigliata: ${best.fornitore} – ${best.nome_offerta}`,
          `Nuovo risparmio stimato: ${item.newSaving.toFixed(2)} €/anno`,
          item.oldSaving > 0
            ? `Risparmio precedente: ${item.oldSaving.toFixed(2)} €/anno (delta +${delta.toFixed(
                2
              )} €/anno)`
            : `In precedenza non risultavano risparmi significativi`,
          "",
        ].join("\n");
      });

      const textBody =
        `Biz Saver – Nuove opportunità di risparmio trovate.\n\n` +
        lines.join("\n") +
        `---\nQuesto monitoraggio è stato eseguito il ${new Date(
          now
        ).toLocaleString("it-IT")}.\n\n` +
        `Accedi al pannello per vedere i dettagli: /report`;

      try {
        await resend.emails.send({
          from: ALERT_EMAIL_FROM,
          to: ALERT_EMAIL_TO,
          subject: "Biz Saver – Nuove offerte più convenienti trovate",
          text: textBody,
        });
      } catch (mailErr) {
        console.error("[/api/monitor] errore invio email Resend:", mailErr);
      }
    }

    return NextResponse.json(
      {
        checked: analyses.length,
        improved,
        unchanged,
        noAlternatives,
        newlyImproved: newlyImprovedForEmail.length,
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
