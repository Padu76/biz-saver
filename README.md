# BizSaver AI – Integrazione OpenAI Vision (immagini + PDF)

Questo aggiornamento aggiunge:

- Supporto a **immagini e PDF** per l'endpoint `/api/analyze`
- Integrazione con **OpenAI Vision** tramite file upload (`openai.files.create` con `purpose: "vision"`)
- Estrazione automatica dei costi e normalizzazione in JSON
- UI di upload aggiornata per accettare PDF + immagini

## File inclusi

- `package.json` (aggiornato con dipendenze: `openai`, `@supabase/supabase-js`, `date-fns`)
- `lib/supabaseClient.ts`
- `app/api/analyze/route.ts`
- `app/(dashboard)/upload/page.tsx`

## Env richieste

In `.env.local` e in Vercel:

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- opzionale: `SUPABASE_SERVICE_ROLE_KEY`

## Comandi

```bash
npm install
npm run build
git add .
git commit -m "update analyze API with OpenAI Vision (PDF + images)"
git push
```
