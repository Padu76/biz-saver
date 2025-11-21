import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabaseClient";
import {
  type CurrentCostProfile,
  type CategoriaProvider,
} from "@/types/cost-comparison";
import { suggestAlternatives } from "@/lib/providerEngine";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const runtime = "nodejs";

// ------------------ PROMPT MIGLIORATO ------------------
const SYSTEM_PROMPT = `
Sei un analista italiano di costi aziendali.

Leggi documenti di:
- bollette energia
- bollette gas
- telefonia mobile business
- internet/fibra business
- assicurazioni
- noleggio auto lungo termine

ESTRAI SOLO QUESTO JSON:

{
  "categoria": "energia | gas | telefonia_mobile | internet | assicurazioni | noleggio_auto",
  "tipo_documento": "string | null",
  "fornitore_attuale": "string",
  "spesa_mensile_attuale": number,
  "spesa_annua_attuale": number,
  "valuta": "EUR",
  "dettagli": {
    "periodo_riferimento": "string | null",
    "note": "string | null"
  }
}

REGOLE:

- Se la bolletta è bimestrale → dividi per 2.
- Se esiste solo spesa annua → dividi per 12.
- Se trovi canone mensile → moltiplica per 12.
- Usa SEMPRE numeri, non stringhe. Separatore decimale con il punto: 121.76 (non "121,76").
- "valuta" deve essere sempre "EUR".

NON aggiungere alcun testo fuori dal JSON.
`;

// categorie supportate dal motore di confronto
const VALID_CATEGORIES: CategoriaProvider[] = [
  "energia",
  "telefonia_mobile",
  "internet",
  "assicurazioni",
  "noleggio_auto",
];

// ------------------ NORMALIZZAZIONE ------------------
function normalizeProfile(raw: any): CurrentCostProfile {
  let categoria: CategoriaProvider = "energia";

  if (typeof raw.categoria === "string") {
    const c = raw.categoria.toLowerCase().trim();

    if (c === "gas") {
      // interno: "gas" lo trattiamo come "energia"
      categoria = "energia";
    } else {
      const match = (VALID_CATEGORIES as readonly string[]).find(
        (cat) => cat === c
      );
      if (match) {
        categoria = match as CategoriaProvider;
      }
    }
  }

  const mensile = Number(raw.spesa_mensile_attuale ?? 0) || 0;
  const annua = Number(raw.spesa_annua_attuale ?? 0) || 0;

  let m = mensile;
  let a = annua;

  if (m > 0 && a === 0) a = m * 12;
  if (a > 0 && m === 0) m = a / 12;

  if (!Number.isFinite(m)) m = 0;
  if (!Number.isFinite(a)) a = 0;

  const fornitore =
    typeof raw.fornitore_attuale === "string" &&
    raw.fornitore_attuale.trim().length > 0
      ? raw.fornitore_attuale.trim()
      : "Non specificato";

  const dettagli =
    raw.dettagli && typeof raw.dettagli === "object" ? raw.dettagli : {};

  return {
    categoria,
    tipo_documento:
      typeof raw.tipo_documento === "string" ? raw.tipo_documento : null,
    fornitore_attuale: fornitore,
    spesa_mensile_attuale: m,
    spesa_annua_attuale: a,
    valuta:
      typeof raw.valuta === "string" && raw.valuta.trim() !== ""
        ? raw.valuta
        : "EUR",
    dettagli,
  };
}

// ------------------ ANALISI PDF ------------------
async function analyzePdf(buffer: Buffer): Promise<CurrentCostProfile> {
  const pdfModule = await import("pdf-parse");
  const pdfParse = (pdfModule as any).default || (pdfModule as any);

  const data = await pdfParse(buffer);
  const fullText: string = String((data as any)?.text || "");
  const cut = fullText.length > 12000 ? fullText.slice(0, 12000) : fullText;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content:
          "Di seguito trovi il testo estratto da un PDF di bolletta/assicurazione/contratto. Analizza e restituisci SOLO il JSON richiesto.\n\n" +
          cut,
      },
    ],
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content || "";
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("[analyzePdf] Errore parse JSON:", e, "RAW:", raw);
    throw new Error(
      "Impossibile interpretare il PDF. Prova con un documento più leggibile."
    );
  }

  return normalizeProfile(parsed);
}

// ------------------ ANALISI IMMAGINE ------------------
async function analyzeImage(file: File): Promise<CurrentCostProfile> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analizza questa bolletta/polizza/contratto e restituisci SOLO il JSON richiesto.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${file.type};base64,${base64}`,
            },
          },
        ],
      },
    ],
    temperature: 0,
  });

  const raw = completion.choices[0]?.message?.content || "";
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("[analyzeImage] Errore parse JSON:", e, "RAW:", raw);
    throw new Error(
      "Impossibile interpretare l'immagine. Prova con una scansione o foto più leggibile."
    );
  }

  return normalizeProfile(parsed);
}

// ------------------ ENDPOINT PRINCIPALE ------------------
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nessun file caricato." },
        { status: 400 }
      );
    }

    const mime = file.type || "";
    let profile: CurrentCostProfile;

    if (mime === "application/pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      profile = await analyzePdf(buffer);
    } else if (mime.startsWith("image/")) {
      profile = await analyzeImage(file);
    } else {
      return NextResponse.json(
        {
          error: `Formato non supportato (${mime}). Usa PDF o immagini.`,
        },
        { status: 400 }
      );
    }

    // Aggiorno dettagli con filename
    profile.dettagli = {
      ...(profile.dettagli || {}),
      filename_originale: file.name,
    };

    // Calcolo alternative dal motore interno
    const suggestions = suggestAlternatives({
      categoria: profile.categoria,
      spesa_mensile_attuale: profile.spesa_mensile_attuale,
    });

    // Arricchisco con flag is_best
    const enriched = suggestions.map((s, idx) => ({
      ...s,
      is_best: idx === 0,
    }));

    const best = enriched[0];
    const migliorRisparmio =
      best && best.risparmio_annuo_stimato > 0
        ? best.risparmio_annuo_stimato
        : 0;

    // Salvataggio su Supabase (incluso alternatives JSONB)
    try {
      await supabase.from("analyses").insert({
        categoria: profile.categoria,
        tipo_documento: profile.tipo_documento ?? null,
        fornitore_attuale: profile.fornitore_attuale,
        spesa_mensile_attuale: profile.spesa_mensile_attuale,
        spesa_annua_attuale: profile.spesa_annua_attuale,
        miglior_risparmio_annuo: migliorRisparmio,
        alternatives: enriched,
        filename: file.name,
      });
    } catch (e) {
      console.error("[/api/analyze] Errore Supabase:", e);
      // non blocchiamo la risposta all'utente se il salvataggio fallisce
    }

    return NextResponse.json(
      {
        profile,
        alternatives: enriched,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[/api/analyze] Errore generale:", err);
    return NextResponse.json(
      {
        error:
          err?.message ||
          "Errore interno durante l'analisi del documento. Riprova più tardi.",
      },
      { status: 500 }
    );
  }
}
