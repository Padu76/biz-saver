// lib/providerEngine.ts
// Motore di comparazione offerte + catalogo interno

export type CategoriaProvider =
  | "energia"
  | "telefonia_mobile"
  | "internet"
  | "assicurazioni"
  | "noleggio_auto";

export type SuggestedTag =
  | "massimo_risparmio"
  | "equilibrata"
  | "flessibile"
  | "green"
  | "premium"
  | "nessuna";

export interface SuggestedAlternative {
  id: string;
  categoria: CategoriaProvider;
  fornitore: string;
  nome_offerta: string;
  tipo_offerta?: string;
  costo_mensile_stimato: number;
  risparmio_annuo_stimato: number;
  risparmio_percentuale: number;
  vincolo_mesi?: number;
  link_offerta?: string;
  note?: string;
  tag?: SuggestedTag;
  score: number;
}

interface ProviderOffer {
  id: string;
  categoria: CategoriaProvider;
  fornitore: string;
  nome_offerta: string;
  tipo_offerta?: string;
  costo_mensile_base: number; // € / mese
  vincolo_mesi?: number;
  link_offerta?: string;
  note?: string;
  tag_predefinito?: SuggestedTag;
}

// Catalogo interno – MVP (20+ offerte realistiche)
const PROVIDERS_CATALOG: ProviderOffer[] = [
  // ENERGIA
  {
    id: "eni-business-flex",
    categoria: "energia",
    fornitore: "Eni Plenitude",
    nome_offerta: "Business Flex Luce",
    tipo_offerta: "Luce business variabile",
    costo_mensile_base: 9.5,
    vincolo_mesi: 12,
    link_offerta: "https://www.eniplenitude.com",
    note: "Prezzo energia indicizzato ingrosso, ideale per consumi stabili.",
    tag_predefinito: "equilibrata",
  },
  {
    id: "eni-business-fissa",
    categoria: "energia",
    fornitore: "Eni Plenitude",
    nome_offerta: "Business Fissa 24",
    tipo_offerta: "Luce business a prezzo fisso",
    costo_mensile_base: 10.2,
    vincolo_mesi: 24,
    link_offerta: "https://www.eniplenitude.com",
    note: "Prezzo fisso 24 mesi, stabilità su budget energetico.",
    tag_predefinito: "premium",
  },
  {
    id: "sorgenia-next-business",
    categoria: "energia",
    fornitore: "Sorgenia",
    nome_offerta: "Next Energy Business",
    tipo_offerta: "Luce business green",
    costo_mensile_base: 8.9,
    vincolo_mesi: 12,
    link_offerta: "https://www.sorgenia.it",
    note: "Energia 100% rinnovabile, gestione completamente online.",
    tag_predefinito: "green",
  },
  {
    id: "illumia-business-smart",
    categoria: "energia",
    fornitore: "Illumia",
    nome_offerta: "Business Smart",
    tipo_offerta: "Luce business indicizzata",
    costo_mensile_base: 9.1,
    vincolo_mesi: 12,
    link_offerta: "https://www.illumia.it",
    note: "Offerta agile per PMI con consumi medi.",
    tag_predefinito: "equilibrata",
  },

  // INTERNET
  {
    id: "fastweb-fibra-business",
    categoria: "internet",
    fornitore: "Fastweb",
    nome_offerta: "Fibra Business",
    tipo_offerta: "Fibra FTTH",
    costo_mensile_base: 28.0,
    vincolo_mesi: 24,
    link_offerta: "https://www.fastweb.it",
    note: "Fibra fino a 1 Gbps, modem incluso, assistenza dedicata.",
    tag_predefinito: "premium",
  },
  {
    id: "tim-impresa-semplice",
    categoria: "internet",
    fornitore: "TIM",
    nome_offerta: "Impresa Semplice Fibra",
    tipo_offerta: "Fibra FTTC",
    costo_mensile_base: 26.0,
    vincolo_mesi: 24,
    link_offerta: "https://www.tim.it",
    note: "Buon compromesso prezzo/prestazioni, brand solido.",
    tag_predefinito: "equilibrata",
  },
  {
    id: "vodafone-business-fibra",
    categoria: "internet",
    fornitore: "Vodafone",
    nome_offerta: "Business Fibra Ready",
    tipo_offerta: "Fibra FTTH",
    costo_mensile_base: 27.5,
    vincolo_mesi: 24,
    link_offerta: "https://www.vodafone.it",
    note: "Fibra top prestazioni, ideale per uffici multi-device.",
    tag_predefinito: "premium",
  },
  {
    id: "eolo-aziende-fwa",
    categoria: "internet",
    fornitore: "Eolo",
    nome_offerta: "Eolo Ufficio",
    tipo_offerta: "FWA",
    costo_mensile_base: 24.0,
    vincolo_mesi: 12,
    link_offerta: "https://www.eolo.it",
    note: "Soluzione valida dove la fibra non arriva.",
    tag_predefinito: "flessibile",
  },

  // TELEFONIA MOBILE
  {
    id: "iliad-business-unlimited",
    categoria: "telefonia_mobile",
    fornitore: "Iliad Business",
    nome_offerta: "Unlimited Business",
    tipo_offerta: "Mobile flat",
    costo_mensile_base: 9.99,
    link_offerta: "https://www.iliad.it",
    note: "Minuti/SMS illimitati, tanti GB, nessun vincolo.",
    tag_predefinito: "equilibrata",
  },
  {
    id: "vodafone-red-business",
    categoria: "telefonia_mobile",
    fornitore: "Vodafone",
    nome_offerta: "Red Business",
    tipo_offerta: "Mobile aziendale",
    costo_mensile_base: 14.99,
    vincolo_mesi: 24,
    link_offerta: "https://www.vodafone.it",
    note: "Assistenza dedicata e priorità rete.",
    tag_predefinito: "premium",
  },
  {
    id: "tim-business-mobile",
    categoria: "telefonia_mobile",
    fornitore: "TIM",
    nome_offerta: "TIM Business Mobile",
    tipo_offerta: "Mobile aziendale",
    costo_mensile_base: 12.99,
    vincolo_mesi: 12,
    link_offerta: "https://www.tim.it",
    note: "Offerta equilibrata per flotte aziendali.",
    tag_predefinito: "equilibrata",
  },
  {
    id: "poste-mobile-professionisti",
    categoria: "telefonia_mobile",
    fornitore: "PosteMobile",
    nome_offerta: "PM Ufficio",
    tipo_offerta: "Mobile low cost",
    costo_mensile_base: 7.99,
    link_offerta: "https://www.postemobile.it",
    note: "Per chi vuole solo chiamate e pochi GB a basso costo.",
    tag_predefinito: "massimo_risparmio",
  },

  // ASSICURAZIONI (tutte aziendali, NON moto)
  {
    id: "unipol-rc-aziendale",
    categoria: "assicurazioni",
    fornitore: "UnipolSai",
    nome_offerta: "RC Azienda Smart",
    tipo_offerta: "RC aziendale",
    costo_mensile_base: 45.0,
    vincolo_mesi: 12,
    link_offerta: "https://www.unipolsai.it",
    note: "Copertura ampia per attività di servizi.",
    tag_predefinito: "equilibrata",
  },
  {
    id: "allianz-ufficio",
    categoria: "assicurazioni",
    fornitore: "Allianz",
    nome_offerta: "Allianz Ufficio",
    tipo_offerta: "Assicurazione immobile",
    costo_mensile_base: 40.0,
    vincolo_mesi: 12,
    link_offerta: "https://www.allianz.it",
    note: "Buon compromesso tra premio e coperture.",
    tag_predefinito: "equilibrata",
  },
  {
    id: "genertel-rc-professionale",
    categoria: "assicurazioni",
    fornitore: "Genertel",
    nome_offerta: "RC Professionale Online",
    tipo_offerta: "RC professionale",
    costo_mensile_base: 32.0,
    vincolo_mesi: 12,
    link_offerta: "https://www.genertel.it",
    note: "Gestione full online, premio competitivo.",
    tag_predefinito: "massimo_risparmio",
  },
  {
    id: "reale-mutua-premium",
    categoria: "assicurazioni",
    fornitore: "Reale Mutua",
    nome_offerta: "Business Premium",
    tipo_offerta: "Pacchetto completo aziendale",
    costo_mensile_base: 55.0,
    vincolo_mesi: 12,
    link_offerta: "https://www.realemutua.it",
    note: "Pacchetto completo per aziende con rischio medio-alto.",
    tag_predefinito: "premium",
  },

  // NOLEGGIO AUTO
  {
    id: "leaseplan-small-business",
    categoria: "noleggio_auto",
    fornitore: "LeasePlan",
    nome_offerta: "Small Business 36",
    tipo_offerta: "Noleggio 36 mesi 20.000 km/anno",
    costo_mensile_base: 380.0,
    vincolo_mesi: 36,
    link_offerta: "https://www.leaseplan.com",
    note: "Tutto incluso (RC, Kasko, bollo, manutenzione).",
    tag_predefinito: "equilibrata",
  },
  {
    id: "ald-business-flex",
    categoria: "noleggio_auto",
    fornitore: "ALD Automotive",
    nome_offerta: "Business Flex 24",
    tipo_offerta: "Noleggio 24 mesi 15.000 km/anno",
    costo_mensile_base: 360.0,
    vincolo_mesi: 24,
    link_offerta: "https://www.aldautomotive.it",
    note: "Durata più breve, buona flessibilità.",
    tag_predefinito: "flessibile",
  },
  {
    id: "arval-green-ev",
    categoria: "noleggio_auto",
    fornitore: "Arval",
    nome_offerta: "Green EV Business",
    tipo_offerta: "Noleggio elettrico 36 mesi",
    costo_mensile_base: 390.0,
    vincolo_mesi: 36,
    link_offerta: "https://www.arval.it",
    note: "Solo veicoli elettrici, adatta a chi vuole immagine green.",
    tag_predefinito: "green",
  },
  {
    id: "leasys-economy",
    categoria: "noleggio_auto",
    fornitore: "Leasys",
    nome_offerta: "Economy 48",
    tipo_offerta: "Noleggio 48 mesi 20.000 km/anno",
    costo_mensile_base: 340.0,
    vincolo_mesi: 48,
    link_offerta: "https://www.leasys.com",
    note: "Costo più basso, ma vincolo lungo.",
    tag_predefinito: "massimo_risparmio",
  },
];

interface SuggestInput {
  categoria: CategoriaProvider;
  spesa_mensile_attuale: number;
  tipo_documento?: string | null;
}

interface CandidateWithRaw extends SuggestedAlternative {
  rawDeltaMensile: number;
}

// Motore di ranking
export function suggestAlternatives(
  input: SuggestInput
): SuggestedAlternative[] {
  const { categoria, spesa_mensile_attuale, tipo_documento } = input;

  // 1) Caso specifico: polizze moto / motoveicolo → al momento NON offriamo alternative
  if (
    categoria === "assicurazioni" &&
    tipo_documento &&
    tipo_documento.toLowerCase().match(/moto|motocicl|motoveicol/)
  ) {
    return [];
  }

  const baseSpesaMensile =
    spesa_mensile_attuale > 0 ? spesa_mensile_attuale : 1;

  const candidates = PROVIDERS_CATALOG.filter(
    (offer) => offer.categoria === categoria
  );

  if (candidates.length === 0) {
    return [];
  }

  // 2) Calcolo risparmio vs offerta attuale (tenendo traccia anche del delta "vero")
  const withRaw: CandidateWithRaw[] = candidates.map((offer) => {
    const rawDelta = baseSpesaMensile - offer.costo_mensile_base; // positivo = offerta più economica
    const risparmioMensile = Math.max(0, rawDelta);
    const risparmioAnnuale = risparmioMensile * 12;
    const perc =
      baseSpesaMensile > 0 ? risparmioMensile / baseSpesaMensile : 0;

    let score = risparmioAnnuale;

    if (offer.vincolo_mesi && offer.vincolo_mesi > 24) {
      score -= 40; // penalizza vincoli lunghi
    } else if (offer.vincolo_mesi && offer.vincolo_mesi <= 12) {
      score += 20; // premia flessibilità
    }

    if (offer.tag_predefinito === "green") {
      score += 10;
    }
    if (offer.tag_predefinito === "premium") {
      score += 5;
    }

    return {
      id: offer.id,
      categoria: offer.categoria,
      fornitore: offer.fornitore,
      nome_offerta: offer.nome_offerta,
      tipo_offerta: offer.tipo_offerta,
      costo_mensile_stimato: offer.costo_mensile_base,
      risparmio_annuo_stimato: risparmioAnnuale,
      risparmio_percentuale: perc,
      vincolo_mesi: offer.vincolo_mesi,
      link_offerta: offer.link_offerta,
      note: offer.note,
      tag: offer.tag_predefinito ?? "nessuna",
      score,
      rawDeltaMensile: rawDelta,
    };
  });

  // 3) Se nessuna offerta è ECONOMICAMENTE migliore → non proponiamo alternative
  const hasRealSaving = withRaw.some((c) => c.rawDeltaMensile > 0);
  if (!hasRealSaving) {
    return [];
  }

  // 4) Filtra solo le offerte che portano un risparmio reale (>0)
  const onlyBetter = withRaw.filter((c) => c.rawDeltaMensile > 0);

  // 5) Ordina per score (risparmio + condizioni)
  const sorted = onlyBetter.sort((a, b) => b.score - a.score);

  // 6) Etichette intelligenti
  if (sorted.length > 0) {
    const maxPerc = Math.max(
      ...sorted.map((s) => s.risparmio_percentuale || 0)
    );

    sorted.forEach((s, idx) => {
      if (idx === 0) {
        if (s.risparmio_percentuale >= maxPerc * 0.8) {
          s.tag = "massimo_risparmio";
        } else {
          s.tag = s.tag ?? "equilibrata";
        }
      } else if (s.vincolo_mesi && s.vincolo_mesi <= 12) {
        s.tag = "flessibile";
      } else if (s.tag === "green") {
        s.tag = "green";
      } else if (s.tag === "premium") {
        s.tag = "premium";
      } else {
        s.tag = "equilibrata";
      }
    });
  }

  // 7) Rimuovo il campo interno rawDeltaMensile prima di restituire
  return sorted.map(({ rawDeltaMensile, ...rest }) => rest);
}
