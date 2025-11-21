import { NextRequest, NextResponse } from "next/server";
import { suggestAlternatives, type CategoriaProvider } from "@/lib/providerEngine";
import { supabase } from "@/lib/supabaseClient";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
Sei un assistente specializzato nell’analisi di costi aziendali.

Riceverai come input l'immagine o il PDF di:
- una bolletta (telefonia, internet, energia),
- oppure una polizza assicurativa,
- oppure un contratto/fattura di noleggio auto.

Il tuo compito è:
1. Capire di che tipo di costo si tratta.
2. Estrarre i dati economici principali.
3. Normalizzare tutto in un JSON con questo schema ESATTO:

{
  "categoria": "...",
  "fornitore_attuale": "...",
  "spesa_mensile_attuale": 0,
  "spesa_annua_attuale": 0,
  "valuta": "EUR",
  "dettagli": {
    "tipo_documento": "...",
    "data_emissione": "...",
    "periodo_riferimento": "...",
    "note": "...",
    "...": "altri campi specifici per la categoria"
  }
}

Regole IMPORTANTI:

- "categoria" DEVE essere una di queste stringhe:
  - "telefonia_mobile"
  - "internet"
  - "energia"
  - "assicurazioni"
  - "noleggio_auto"

- Se la spesa è indicata solo come annua:
  - metti "spesa_annua_attuale" al valore trovato
  - e calcola "spesa_mensile_attuale" = spesa_annua / 12 (2 decimali).

- Se la spesa è indicata solo come mensile:
  - metti "spesa_mensile_attuale"
  - e calcola "spesa_annua_attuale" = spesa_mensile * 12 (2 decimali).

- Se sono presenti più voci (es. più linee, più veicoli):
  - considera la SPESA TOTALE complessiva per l’azienda, non per singola linea/veicolo.

Campi specifici consigliati in "dettagli":

- Per "telefonia_mobile":
  - numero_linee
  - gb_totali (se possibile)
  - minuti_illimitati (true/false)
  - sms_illimitati (true/false)
  - vincolo_mesi (se indicato)

- Per "internet":
  - tipo_connessione (fibra, FTTC, ADSL, FWA...)
  - velocita_download_mbps
  - velocita_upload_mbps
  - modem_incluso (true/false)
  - indirizzo_fornitura (se visibile)

- Per "energia":
  - tipo_energia (luce, gas, luce+gas)
  - potenza_impegnata_kw
  - consumo_periodo_kwh
  - consumo_annuo_stimato_kwh (se indicato)
  - quota_potenza
  - oneri_sistema
  - altri_costi_rilevanti

- Per "assicurazioni":
  - tipo_polizza (auto, immobile, RC, ecc.)
  - veicolo_o_immobile_assicurato
  - massimale_rc
  - franchigia
  - durata_contratto
  - scadenza_polizza

- Per "noleggio_auto":
  - modello_veicolo
  - durata_contratto_mesi
  - km_annui
  - servizi_inclusi (manutenzione, assicurazione, gomme, ecc.)
  - anticipo (se presente)

Output:
- Rispondi SOLO con un JSON valido.
- NON aggiungere testo fuori dal JSON.
- Se qualche campo non è disponibile, omettilo da "dettagli".
`;

interface AIProfile {
  categoria: CategoriaProvider;
  fornitore_attuale: string;
  spesa_mensile_attuale: number;
  spesa_annua_attuale: number;
  valuta: string;
  dettagli?: Record<string, any>;
}

interface AnalyzeResult {
  profile: AIProfile;
  suggestions: any[];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "File mancante. Invia un file nel campo 'file' del FormData." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY non configurata nelle variabili di ambiente." },
        { status: 500 }
      );
    }

    // Convertiamo il file in buffer base64 per la Vision API
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Chiamata a OpenAI Vision: il modello vede il documento e restituisce JSON
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Analizza questo documento e restituisci SOLO il JSON richiesto."
            },
            {
              type: "input_image",
              image_url: {
                url: `data:${file.type};base64,${base64Data}`
              }
            }
          ] as any
        }
      ],
      temperature: 0
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Nessuna risposta ricevuta dal modello AI.");
    }

    let parsed: AIProfile;
    try {
      // A volte il modello può restituire testo con triple backtick: ripuliamo
      const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Errore nel parse del JSON AI:", e, "raw:", raw);
      throw new Error(
        "Impossibile interpretare la risposta AI come JSON. Riprova con un documento più leggibile."
      );
    }

    // Validazione minima
    if (!parsed.categoria || !parsed.spesa_mensile_attuale || !parsed.spesa_annua_attuale) {
      throw new Error(
        "La risposta AI non contiene i campi minimi necessari (categoria, spesa_mensile_attuale, spesa_annua_attuale)."
      );
    }

    const profile: AIProfile = {
      categoria: parsed.categoria,
      fornitore_attuale: parsed.fornitore_attuale || "Fornitore non specificato",
      spesa_mensile_attuale: parsed.spesa_mensile_attuale,
      spesa_annua_attuale: parsed.spesa_annua_attuale,
      valuta: parsed.valuta || "EUR",
      dettagli: parsed.dettagli || {
        filename_originale: file.name
      }
    };

    const suggestions = suggestAlternatives({
      categoria: profile.categoria,
      spesa_mensile_attuale: profile.spesa_mensile_attuale
    });

    // Salvataggio su Supabase (se configurato)
    if (supabase) {
      try {
        const best = suggestions[0];
        const migliorRisparmio =
          best && best.stima_risparmio_annuo && best.stima_risparmio_annuo > 0
            ? best.stima_risparmio_annuo
            : 0;

        await supabase.from("analyses").insert({
          categoria: profile.categoria,
          fornitore_attuale: profile.fornitore_attuale,
          spesa_mensile_attuale: profile.spesa_mensile_attuale,
          spesa_annua_attuale: profile.spesa_annua_attuale,
          miglior_risparmio_annuo: migliorRisparmio,
          filename: file.name
        });
      } catch (e) {
        console.error("[/api/analyze] Errore inserimento Supabase:", e);
      }
    }

    const result: AnalyzeResult = {
      profile,
      suggestions
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[/api/analyze] Errore generale:", err);
    return NextResponse.json(
      { error: err.message || "Errore imprevisto durante l'analisi del documento." },
      { status: 500 }
    );
  }
}
