# BizSaver AI – Vision FIX (solo immagini)

A causa delle limitazioni attuali dell'endpoint Vision, i PDF non sono supportati direttamente.
Questo aggiornamento:

- Limita `/api/analyze` alle **sole immagini** (JPG, PNG, WEBP)
- Aggiorna la UI di upload per riflettere chiaramente questa limitazione
- Mantiene invariata tutta la logica di:
  - chiamata a OpenAI Vision
  - normalizzazione JSON
  - comparazione con `suggestAlternatives`
  - salvataggio storico su Supabase

## Uso consigliato

- Se hai una bolletta/polizza/contratto in PDF:
  - apri il PDF
  - fai uno **screenshot** della pagina riepilogo (importo totale + periodo)
  - carica lo screenshot come immagine.

## File inclusi

- `app/api/analyze/route.ts`
- `app/(dashboard)/upload/page.tsx`

## Comandi

```bash
npm install
npm run build
git add .
git commit -m "fix: analyze API to support images only with Vision"
git push
```
