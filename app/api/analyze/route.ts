import { NextRequest, NextResponse } from "next/server";
import { suggestAlternatives, type CategoriaProvider } from "@/lib/providerEngine";
import { supabase } from "@/lib/supabaseClient";

interface AnalyzeResult {
  profile: {
    categoria: CategoriaProvider;
    fornitore_attuale: string;
    spesa_mensile_attuale: number;
    spesa_annua_attuale: number;
    valuta: string;
    dettagli?: Record<string, any>;
  };
  suggestions: any[];
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "File mancante. Invia un file nel campo 'file' del FormData." },
      { status: 400 }
    );
  }

  const filename = file.name.toLowerCase();

  let categoria: CategoriaProvider = "telefonia_mobile";
  if (filename.includes("gas") || filename.includes("luce") || filename.includes("energia")) {
    categoria = "energia";
  } else if (filename.includes("fibra") || filename.includes("internet") || filename.includes("adsl")) {
    categoria = "internet";
  } else if (filename.includes("rca") || filename.includes("assicurazione")) {
    categoria = "assicurazioni";
  } else if (filename.includes("nolo") || filename.includes("nlt") || filename.includes("lease")) {
    categoria = "noleggio_auto";
  }

  const spesaMensile = 89;
  const spesaAnnua = spesaMensile * 12;

  const profile: AnalyzeResult["profile"] = {
    categoria,
    fornitore_attuale: "Fornitore da definire (mock)",
    spesa_mensile_attuale: spesaMensile,
    spesa_annua_attuale: spesaAnnua,
    valuta: "EUR",
    dettagli: {
      filename_originale: file.name,
      nota: "Profilo mock di esempio. Qui andrà il risultato vero dell'analisi AI del PDF."
    }
  };

  const suggestions = suggestAlternatives({
    categoria: profile.categoria,
    spesa_mensile_attuale: profile.spesa_mensile_attuale
  });

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
}
