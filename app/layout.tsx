import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizSaver AI",
  description: "Taglia i costi aziendali in modo intelligente con l'AI."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-background text-foreground">
        {children}
      </body>
    </html>
  );
}
