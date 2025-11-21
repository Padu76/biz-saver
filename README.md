# BizSaver AI – Base Next.js Repo

Questo è un repo base Next.js 14 (App Router) per l'app di analisi costi aziendali:

- Landing page dark mode con CTA
- Layout dashboard con sidebar laterale
- Pagine:
  - `/dashboard` – panoramica
  - `/upload` – carica documenti (UI placeholder)
  - `/report` – esempio di report comparazione
- Motore di comparazione in `lib/providerEngine.ts`
- Dataset statico fornitori in `data/providers.json`
- API di esempio in `app/api/suggest/route.ts`

## Setup rapido

```bash
npm install
npm run dev
```

Poi apri `http://localhost:3000` nel browser.

Successivamente potrai:

- collegare l'upload dei PDF
- integrare l'analisi AI
- salvare i profili di costo in un database (es. Supabase)
