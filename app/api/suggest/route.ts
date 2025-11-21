import { NextRequest, NextResponse } from "next/server";
import { suggestAlternatives, type CategoriaProvider } from "@/lib/providerEngine";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const categoria = body.categoria as CategoriaProvider;
  const spesa_mensile_attuale = Number(body.spesa_mensile_attuale);

  if (!categoria || isNaN(spesa_mensile_attuale)) {
    return NextResponse.json(
      { error: "categoria e spesa_mensile_attuale sono obbligatorie" },
      { status: 400 }
    );
  }

  const suggestions = suggestAlternatives({
    categoria,
    spesa_mensile_attuale
  });

  return NextResponse.json({ suggestions });
}
