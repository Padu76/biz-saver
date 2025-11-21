# BizSaver AI – Aggiornamento: Upload, Analisi mock & Storico

Questo pacchetto aggiunge:

- Upload documenti con anteprima analisi mock: `app/(dashboard)/upload/page.tsx`
- API `/api/analyze` che:
  - accetta un file nel `FormData`
  - crea un profilo di costo mock (in attesa dell'integrazione con l'AI reale)
  - usa `suggestAlternatives` per generare i suggerimenti
  - salva (se configurato Supabase) un record nella tabella `analyses`
- Client Supabase in `lib/supabaseClient.ts`
- Pagina storico analisi: `app/(dashboard)/history/page.tsx`
- Tabella storico: `components/HistoryTable.tsx`

## Setup Supabase

1. Crea un progetto Supabase.
2. Crea una tabella `analyses` con queste colonne minime:

```sql
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  categoria text,
  fornitore_attuale text,
  spesa_mensile_attuale numeric,
  spesa_annua_attuale numeric,
  miglior_risparmio_annuo numeric,
  filename text
);
```

3. Imposta queste variabili di ambiente (in `.env.local` e su Vercel):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- opzionale: `SUPABASE_SERVICE_ROLE_KEY` (solo lato server)

## Comandi utili

```bash
npm install
npm run build
git add .
git commit -m "update upload/analyze/history"
git push
```
