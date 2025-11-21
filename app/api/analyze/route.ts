import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabaseClient";
import { suggestAlternatives } from "@/lib/providerEngine";
import type { CurrentCostProfile } from "@/types/cost-comparison";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = "nodejs";

// Prompt per estrazione dati
const SYSTEM_PROMPT = `
Sei un assistente che legge documenti italiani: bollette, assicurazioni, telefonia, internet, contratti.
Estrai SOLO i dati richiesti e restituisci un JSON valido.

RESTITUISCI SOLO QUESTO:

{
  "categoria": "energia | internet | telefonia_mobile | assicurazioni | noleggio_auto",
  "fornitore_attuale": "string",
  "spesa_mensile_attuale": number,
  "spesa_annua_attuale": number,
  "valuta": "EUR",
  "dettagli": {
    "periodo_riferimento": "string|null",
    "note": "string|null"
  }
}

REGOLE:
- Se trovi importi riferiti al totale da pagare → usa quelli.
- Se trovi importi bimestrali → calcola mensile = totale / 2.
- Se il documento mostra solo l’importo annuo → dividi per 12.
- Mai inventare valori. Se mancano, stima in modo prudente.
- Output **solo JSON**, senza testo aggiuntivo.
`;


// ---- FUNZIONE: Analisi PDF tramite testuale ----
async function analyzePdf(buffer: Buffer): Promise<CurrentCostProfile> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = (pdfParseModule as any).default || (pdfParseModule as any);

  const data = await pdfParse(buffer);
  const text: string = String((data as any)?.text || "");

  const maxLen = 12000;
  const truncated = text.length > maxLen ? text.slice(0, maxLen) : text;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Estratto testo PDF:\n\n${truncated}`
      }
    ],
    temperature: 0,
  });

  const raw = completion.choices[0].message.content || "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned) as CurrentCostProfile;
}


// ---- FUNZIONE: Analisi immagine tramite Vision ----
async function analyzeImage(file: File): Promise<CurrentCostProfile> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Leggi questi dati dalla bolletta o contratto:" },
          {
            type: "image_url",
            image_url: {
              url: `data:${file.type};base64,${base64}`
            }
          }
        ]
      }
    ],
    temperature: 0,
  });

  const raw = completion.choices[0].message.content || "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned) as CurrentCostProfile;
}


// ---- ENDPOINT PRINCIPALE ----
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file caricato." }, { status: 400 });
    }

    const mime = file.type;
    let profile: CurrentCostProfile | null = null;

    // PDF
    if (mime === "application/pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      profile = await analyzePdf(buffer);
    }
    // IMMAGINI (Vision)
    else if (mime.startsWith("image/")) {
      profile = await analyzeImage(file);
    }
    else {
      return NextResponse.json(
        {
          error: `Formato non supportato (${mime}). Usa PDF o immagini.`,
        },
        { status: 400 }
      );
    }

    // Validazione minima
    if (!profile || !profile.categoria) {
      return NextResponse.json(
        { error: "Impossibile estrarre dati dal documento." },
        { status: 422 }
      );
    }

    const suggestions = suggestAlternatives({
      categoria: profile.categoria,
      spesa_mensile_attuale: profile.spesa_mensile_attuale,
    });

    // MIGLIOR RISPARMIO (aggiornato al nuovo naming)
    const best = suggestions[0];
    const migliorRisparmio =
      best && best.risparmio_annuo_stimato > 0
        ? best.risparmio_annuo_stimato
        : 0;

    // Salvataggio Supabase
    try {
      await supabase.from("analyses").insert({
        categoria: profile.categoria,
        fornitore_attuale: profile.fornitore_attuale,
        spesa_mensile_attuale: profile.spesa_mensile_attuale,
        spesa_annua_attuale: profile.spesa_annua_attuale,
        miglior_risparmio_annuo: migliorRisparmio,
        filename: file.name,
      });
    } catch (e) {
      console.error("[/api/analyze] Errore Supabase:", e);
    }

    return NextResponse.json(
      {
        profile,
        suggestions,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Errore generale /api/analyze:", err);
    return NextResponse.json(
      {
        error: err?.message || "Errore interno.",
      },
      { status: 500 }
    );
  }
}
