import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabaseClient";
import type { CurrentCostProfile } from "@/types/cost-comparison";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
Sei un assistente che analizza documenti ITALIANI di costi aziendali:
- bollette luce/gas
- offerte internet/fibra
- contratti / fatture telefonia mobile
- polizze assicurative
- contratti di noleggio auto a lungo termine.

Devi estrarre i dati ECONOMICI principali e normalizzarli in questo JSON ESATTO:

{
  "categoria": "energia | internet | telefonia_mobile | assicurazioni | noleggio_auto",
  "fornitore_attuale": "string",
  "spesa_mensile_attuale": number,
  "spesa_annua_attuale": number,
  "valuta": "EUR",
  "dettagli": {
    "periodo_riferimento": "string | null",
    "tipo_documento": "string | null",
    "note": "string | null"
  }
}

REGOLE IMPORTANTI:

- "categoria" DEVE essere UNA SOLA tra:
  - "energia"
  - "internet"
  - "telefonia_mobile"
  - "assicurazioni"
  - "noleggio_auto"

- "fornitore_attuale": usa il nome dell'azienda che emette la bolletta/contratto (es. ENEL ENERGIA, TIM, VODAFONE, UNIPOLSAI, LEASEPLAN...).

- IMPORTI:
  - Se vedi un importo TOTALE da pagare per un PERIODO (mese, bimestre, ecc.), usa quello.
  - Se la bolletta è BIMESTRALE: calcola spesa_mensile_attuale = totale / 2.
  - Se nel documento è indicato SOLO un importo annuo o un premio annuale:
      - spesa_annua_attuale = importo annuo
      - spesa_mensile_attuale = importo annuo / 12
  - Se vedi importi mensili di canone/abbonamento:
      - spesa_mensile_attuale = canone mensile
      - spesa_annua_attuale = canone mensile * 12

- VALORI NUMERICI:
  - Usa numeri, NON stringhe.
  - Usa il punto come separatore decimale (es. 121.76, non "121,76").

- "valuta": usa SEMPRE "EUR".

- "dettagli":
  - "periodo_riferimento": se trovi "fattura dal ... al ..." o "conguaglio ...", inserisci una stringa sintetica.
  - "tipo_documento": esempio "bolletta luce", "fattura telefonia mobile", "polizza RC auto", "contratto noleggio auto".
  - "note": eventuali info utili (es. "importo include IVA", "bolletta di conguaglio", ecc.).

NON aggiungere testo fuori dal JSON.
Rispondi SOLO con un JSON valido.
`;

// categorie valide per sicurezza
const VALID_CATEGORIES = [
  "energia",
  "internet",
  "telefonia_mobile",
  "assicurazioni",
  "noleggio_auto",
] as const;
type ValidCategoria = (typeof VALID_CATEGORIES)[number];

function normalizeProfile(raw: any): CurrentCostProfile {
  // categoria
  let categoria: ValidCategoria = "energia";
  if (typeof raw.categoria === "string") {
    const catLower = raw.categoria.toLowerCase();
    const match = VALID_CATEGORIES.find((c) => c === catLower);
    if (match) {
      categoria = match;
    }
  }

  // importi
  const rawMensile = Number(raw.spesa_mensile_attuale ?? 0) || 0;
  const rawAnnua = Number(raw.spesa_annua_attuale ?? 0) || 0;

  let spesaMensile = rawMensile;
  let spesaAnnua = rawAnnua;

  if (spesaMensile > 0 && spesaAnnua === 0) {
    spesaAnnua = spesaMensile * 12;
  } else if (spesaAnnua > 0 && spesaMensile === 0) {
    spesaMensile = spesaAnnua / 12;
  }

  // sicurezza minima: niente NaN
  if (!Number.isFinite(spesaMensile)) spesaMensile = 0;
  if (!Number.isFinite(spesaAnnua)) spesaAnnua = 0;

  const fornitore =
    typeof raw.fornitore_attuale === "string" && raw.fornitore_attuale.trim().length > 0
      ? raw.fornitore_attuale.trim()
      : "Fornitore non specificato";

  const dettagli =
    raw.dettagli && typeof raw.dettagli === "object" ? raw.dettagli : {};

  return {
    categoria,
    fornitore_attuale: fornitore,
    spesa_mensile_attuale: spesaMensile,
    spesa_annua_attuale: spesaAnnua,
    valuta: typeof raw.valuta === "string" && raw.valuta.trim() !== "" ? raw.valuta : "EUR",
    dettagli,
  };
}

// ---- FUNZIONE: analisi PDF -> testo ----
async function analyzePdf(buffer: Buffer): Promise<CurrentCostProfile> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = (pdfParseModule as any).default || (pdfParseModule as any);

  const data = await pdfParse(buffer);
  const fullText: string = String((data as any)?.text || "");

  const maxLen = 12000;
  const truncated = fullText.length > maxLen ? fullText.slice(0, maxLen) : fullText;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Di seguito trovi il testo estratto da un PDF di bolletta/assicurazione/contratto. Analizza il contenuto e restituisci SOLO il JSON richiesto.\n\n${truncated}`,
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
    throw new Error("Impossibile interpretare il PDF. Prova con un documento più leggibile.");
  }

  return normalizeProfile(parsed);
}

// ---- FUNZIONE: analisi immagine -> Vision ----
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

// ---- ENDPOINT PRINCIPALE ----
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file caricato." }, { status: 400 });
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
        { error: `Formato non supportato (${mime}). Usa PDF o immagini.` },
        { status: 400 }
      );
    }

    // arricchisco dettagli con filename
    profile.dettagli = {
      ...(profile.dettagli || {}),
      filename_originale: file.name,
    };

    // calcolo alternative
    const { suggestAlternatives } = await import("@/lib/providerEngine");
    const suggestions = suggestAlternatives({
      categoria: profile.categoria,
      spesa_mensile_attuale: profile.spesa_mensile_attuale,
    });

    const best = suggestions[0];
    const migliorRisparmio =
      best && best.risparmio_annuo_stimato && best.risparmio_annuo_stimato > 0
        ? best.risparmio_annuo_stimato
        : 0;

    // salvataggio su Supabase
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
    console.error("[/api/analyze] Errore generale:", err);
    return NextResponse.json(
      { error: err?.message || "Errore interno durante l'analisi del documento." },
      { status: 500 }
    );
  }
}
