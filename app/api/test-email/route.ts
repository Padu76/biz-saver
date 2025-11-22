import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: process.env.ALERT_EMAIL_FROM!,
      to: process.env.ALERT_EMAIL_TO!,
      subject: "Test BizSaver AI",
      html: "<p>Email di test inviata con successo 🚀</p>",
    });

    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message });
  }
}
