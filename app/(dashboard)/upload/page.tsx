export default function UploadPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Carica documenti</h1>
      <p className="text-sm text-slate-300 max-w-2xl">
        Carica bollette, polizze e contratti in formato PDF o immagine.
        In questa versione base la logica di upload &amp; analisi non è ancora collegata,
        ma la UI è pronta per essere integrata con l&apos;API di analisi AI.
      </p>

      <div className="mt-4 rounded-xl border border-dashed border-slate-700 bg-black/40 p-8 text-center text-sm text-slate-400">
        <p className="mb-2 font-medium text-slate-200">
          Trascina qui i tuoi file oppure clicca per selezionarli
        </p>
        <p className="text-xs text-slate-500">
          Formati supportati: PDF, JPG, PNG &middot; Max 10MB per file
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-black/40 p-4 text-xs text-slate-400">
        Suggerimento: in produzione, da qui puoi chiamare una route API che:
        esegue OCR sul PDF, crea il profilo di costo e salva tutto in database
        prima di generare il report di comparazione.
      </div>
    </div>
  );
}
