// types/cost-comparison.ts
import type {
  CategoriaProvider,
  SuggestedAlternative,
} from "@/lib/providerEngine";

export type { CategoriaProvider, SuggestedAlternative };

export interface CurrentCostProfile {
  categoria: CategoriaProvider;
  tipo_documento?: string | null;
  fornitore_attuale: string;
  spesa_mensile_attuale: number;
  spesa_annua_attuale: number;
  valuta: string;
  dettagli?: Record<string, any>;
}
