import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseClient";

export const runtime = "nodejs";

interface Params {
  params: { id: string };
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const supabase = createClient();
    const idNum = Number(params.id);

    if (!idNum || Number.isNaN(idNum)) {
      return NextResponse.json(
        { error: "ID analisi non valido." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", idNum);

    if (error) {
      console.error("[DELETE /api/analyses/:id] Supabase error:", error);
      return NextResponse.json(
        { error: "Errore durante l'eliminazione dell'analisi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("[DELETE /api/analyses/:id] general error:", err);
    return NextResponse.json(
      { error: "Errore interno durante l'eliminazione." },
      { status: 500 }
    );
  }
}
