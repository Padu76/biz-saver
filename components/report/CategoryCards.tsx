export function CategoryCards({ data }: { data: any[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-300">
        Analisi per categoria
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.map((cat) => (
          <div
            key={cat.categoria}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs"
          >
            <div className="font-semibold capitalize">{cat.categoria}</div>
            <div className="mt-2 text-slate-400">
              Documenti: {cat.documenti}
            </div>
            <div className="text-slate-400">
              Spesa annua: {cat.spesa_annua.toFixed(2)} €
            </div>
            <div className="text-emerald-400 font-semibold">
              Risparmio: {cat.risparmio_annuo.toFixed(2)} € / anno
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
