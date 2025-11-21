# BizSaver AI – PDF + Immagini (ibrido testo + Vision)

Questo aggiornamento sistema la pipeline per:

- Accettare **PDF** e **immagini**
- Per i **PDF**:
  - il server estrae il testo con `pdf-parse`
  - invia il testo a OpenAI (`gpt-4.1-mini`) insieme al SYSTEM_PROMPT
  - riceve un JSON normalizzato con categoria, spese, dettagli
- Per le **immagini**:
  - il server converte l'immagine in base64
  - chiama OpenAI Vision via `image_url`
  - riceve lo stesso JSON normalizzato

Il resto del flusso resta invariato:

- calcolo alternative con `suggestAlternatives`
- salvataggio su Supabase (`analyses`)
- visualizzazione in `/upload` e `/history`.

## File inclusi

- `package.json` (aggiunta dipendenza `pdf-parse`)
- `lib/supabaseClient.ts`
- `app/api/analyze/route.ts`
- `app/(dashboard)/upload/page.tsx`

## Env richieste

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- opzionale: `SUPABASE_SERVICE_ROLE_KEY`

## Comandi

```bash
npm install
npm run build
git add .
git commit -m "feat: hybrid PDF (text) + image Vision analyze API"
git push
```
