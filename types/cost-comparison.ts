import type { Provider } from "@/lib/providerEngine";

export interface CurrentCostProfile {
  categoria: "energia" | "telefonia_mobile" | "internet" | "assicurazioni" | "noleggio_auto";
  fornitore_attuale: string;
  spesa_mensile_attuale: number;
  spesa_annua_attuale: number;
  valuta: string;
  dettagli?: Record<string, any>;
}

export interface SuggestedAlternative {
  provider: Provider;
  stima_spesa_mensile: number | null;
  stima_risparmio_mensile: number | null;
  stima_risparmio_annuo: number | null;
  note: string;
}
