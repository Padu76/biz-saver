import providersData from "@/data/providers.json";

export type CategoriaProvider =
  | "energia"
  | "telefonia_mobile"
  | "internet"
  | "assicurazioni"
  | "noleggio_auto";

export interface Provider {
  categoria: CategoriaProvider;
  fornitore: string;
  tipo_servizi: string;
  offerte: string[];
  range_prezzo: string;
  link: string;
  note: string;
}

const providers: Provider[] = providersData as Provider[];

export function getProvidersByCategory(categoria: CategoriaProvider): Provider[] {
  return providers.filter((p) => p.categoria === categoria);
}

export function parsePriceRange(range_prezzo: string): { min: number; max: number } | null {
  if (!range_prezzo) return null;

  const normalized = range_prezzo.replace("–", "-");

  const match = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;

  const min = parseFloat(match[1]);
  const max = parseFloat(match[2]);

  if (isNaN(min) || isNaN(max)) return null;
  return { min, max };
}

export function getAveragePrice(provider: Provider): number | null {
  const range = parsePriceRange(provider.range_prezzo);
  if (!range) return null;
  return (range.min + range.max) / 2;
}

export function getRankedProvidersByCategory(categoria: CategoriaProvider): Provider[] {
  const list = getProvidersByCategory(categoria);

  return [...list].sort((a, b) => {
    const avgA = getAveragePrice(a);
    const avgB = getAveragePrice(b);

    if (avgA === null && avgB === null) return 0;
    if (avgA === null) return 1;
    if (avgB === null) return -1;

    return avgA - avgB;
  });
}

export interface CurrentCostProfile {
  categoria: CategoriaProvider;
  spesa_mensile_attuale: number;
  dettagli?: Record<string, any>;
}

export interface SuggestedAlternative {
  provider: Provider;
  stima_spesa_mensile: number | null;
  stima_risparmio_mensile: number | null;
  stima_risparmio_annuo: number | null;
  note: string;
}

function estimateMonthlyCostFromProvider(provider: Provider): number | null {
  const avg = getAveragePrice(provider);
  if (avg === null) return null;
  return avg;
}

export function suggestAlternatives(profile: CurrentCostProfile): SuggestedAlternative[] {
  const ranked = getRankedProvidersByCategory(profile.categoria);

  const suggestions: SuggestedAlternative[] = [];

  for (const provider of ranked) {
    const stimaMensile = estimateMonthlyCostFromProvider(provider);
    if (stimaMensile === null) {
      suggestions.push({
        provider,
        stima_spesa_mensile: null,
        stima_risparmio_mensile: null,
        stima_risparmio_annuo: null,
        note: "Nessuna stima numerica disponibile: confronta condizioni e servizi."
      });
      continue;
    }

    const deltaMensile = profile.spesa_mensile_attuale - stimaMensile;
    const risparmioMensile = deltaMensile > 0 ? deltaMensile : 0;
    const risparmioAnnuale = risparmioMensile * 12;

    suggestions.push({
      provider,
      stima_spesa_mensile: stimaMensile,
      stima_risparmio_mensile: risparmioMensile || null,
      stima_risparmio_annuo: risparmioAnnuale || null,
      note:
        risparmioMensile > 0
          ? "Potenziale risparmio rispetto alla spesa attuale."
          : "Questa offerta non sembra più economica di quella attuale."
    });
  }

  const conRisparmio = suggestions
    .filter((s) => s.stima_risparmio_annuo && s.stima_risparmio_annuo > 0)
    .sort((a, b) => (b.stima_risparmio_annuo || 0) - (a.stima_risparmio_annuo || 0));

  const senzaRisparmio = suggestions.filter(
    (s) => !s.stima_risparmio_annuo || s.stima_risparmio_annuo <= 0
  );

  return [...conRisparmio, ...senzaRisparmio];
}
