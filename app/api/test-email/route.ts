// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("RESEND_API_KEY non impostata nelle env.");
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      // HARD-CODED: niente bizsaver.ai qui.
      from: "BizSaver AI <onboarding@resend.dev>",
      to: "andrea.padoan@gmail.com",
      subject: "Test BizSaver AI (Resend)",
      html: "<p>Email di test inviata con successo 🚀</p>",
    });

    return NextResponse.json(
      {
        ok: true,
        fromUsed: "BizSaver AI <onboarding@resend.dev>",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Errore sconosciuto",
      },
      { status: 500 }
    );
  }
}
