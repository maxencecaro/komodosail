import type { Cruise } from "./cruises";

export type TierSlug = "backpacker" | "budget-smart" | "standard" | "premium" | "ultra-luxe";

export interface BudgetTier {
  slug: TierSlug;
  name: string;
  emoji: string;
  shortLabel: string; // for compact badge
  priceMin: number;
  priceMax: number; // Infinity for top
  duration: string;
  capacity: string;
  cabin: string;
  food: string;
  crew: string;
  target: string;
  description: string;
  whyChoose: string[];
  // Tailwind utility presets — tuned for distinct visual identity
  badgeClass: string; // for the inline category badge
  accentClass: string; // for icon / heading accent
  ringClass: string;
  cardClass: string; // soft tinted background for tier cards
}

export const TIERS: BudgetTier[] = [
  {
    slug: "backpacker",
    name: "Backpacker",
    emoji: "🎒",
    shortLabel: "Backpacker",
    priceMin: 50,
    priceMax: 150,
    duration: "Journée (6-8h)",
    capacity: "15-20+ pax",
    cabin: "Sans cabine ou dortoir",
    food: "Repas simples · eau · snacks",
    crew: "Équipage basique multilingue",
    target: "Solo, jeunes voyageurs, routards",
    description:
      "L'aventure brute, sans fioritures. Speedboats partagés et open-trips à la journée pour découvrir Komodo au prix le plus juste.",
    whyChoose: [
      "Le ticket d'entrée le plus accessible pour Komodo",
      "Format court, parfait pour combiner avec un voyage en sac à dos",
      "Ambiance jeune et internationale à bord",
    ],
    badgeClass: "bg-sky-100 text-sky-800 border border-sky-200",
    accentClass: "text-sky-600",
    ringClass: "ring-sky-300",
    cardClass: "bg-sky-50/60",
  },
  {
    slug: "budget-smart",
    name: "Budget Smart",
    emoji: "💰",
    shortLabel: "Budget",
    priceMin: 150,
    priceMax: 350,
    duration: "2-3 jours / 1-2 nuits",
    capacity: "12-20 pax",
    cabin: "Cabines basiques propres · AC simple",
    food: "Bonne nourriture · fruits frais",
    crew: "Guide anglais/français",
    target: "Couples, petits groupes, voyageurs économes",
    description:
      "Le meilleur rapport qualité-prix pour passer une nuit à bord. Phinisi partagés, propres et conviviaux, sans casser la tirelire.",
    whyChoose: [
      "Dormir sous les étoiles au mouillage à un prix raisonnable",
      "Format idéal pour goûter à la croisière sans s'engager 5 jours",
      "Cabines correctes, repas variés, ambiance backpacker-confort",
    ],
    badgeClass: "bg-orange-100 text-orange-800 border border-orange-200",
    accentClass: "text-orange-600",
    ringClass: "ring-orange-300",
    cardClass: "bg-orange-50/60",
  },
  {
    slug: "standard",
    name: "Standard",
    emoji: "⭐",
    shortLabel: "Standard",
    priceMin: 350,
    priceMax: 550,
    duration: "3-4 jours / 2-3 nuits",
    capacity: "12-30 pax",
    cabin: "Cabine privée · AC · SDB privée",
    food: "Trois repas variés · petit-déj inclus",
    crew: "Équipage pro · sun deck · hamacs",
    target: "Familles, groupes d'amis, couples",
    description:
      "Le juste milieu. Phinisi confortables, cabines privées avec salle de bain, suffisamment d'espace pour vraiment se détendre.",
    whyChoose: [
      "Confort réel sans tomber dans le luxe inutile",
      "Format 3-4 jours = vraie immersion dans le parc",
      "Idéal pour les familles et premiers voyageurs en liveaboard",
    ],
    badgeClass: "bg-zinc-100 text-zinc-800 border border-zinc-300",
    accentClass: "text-zinc-700",
    ringClass: "ring-zinc-400",
    cardClass: "bg-zinc-50",
  },
  {
    slug: "premium",
    name: "Premium",
    emoji: "👑",
    shortLabel: "Premium",
    priceMin: 550,
    priceMax: 1500,
    duration: "4-5 jours / 3-4 nuits",
    capacity: "Max 20 pax",
    cabin: "Cabines luxe avec vue · grande SDB",
    food: "Gastronomie · buffet varié · bar inclus",
    crew: "Jacuzzi · lounge · guide expert",
    target: "Anniversaires, lune de miel, groupes d'adultes",
    description:
      "L'expérience signature. Petits groupes, cabines avec vue, gastronomie soignée et un équipage qui anticipe vos envies.",
    whyChoose: [
      "Petits groupes pour une atmosphère intime",
      "Service aux petits soins, gastronomie à bord",
      "Le sweet-spot pour une occasion spéciale",
    ],
    badgeClass: "bg-amber-100 text-amber-900 border border-amber-300",
    accentClass: "text-amber-700",
    ringClass: "ring-amber-400",
    cardClass: "bg-amber-50/70",
  },
  {
    slug: "ultra-luxe",
    name: "Ultra Luxe",
    emoji: "💎",
    shortLabel: "Ultra Luxe",
    priceMin: 1500,
    priceMax: Infinity,
    duration: "5-7+ jours",
    capacity: "Charter privé · 8-12 pax",
    cabin: "Suites avec balcon · SDB luxe",
    food: "Chef personnel · menu sur mesure",
    crew: "Zodiacs privés · concierge · 5★",
    target: "VVIP, lune de miel ultra premium, corporate",
    description:
      "Le yachting absolu. Charters privés, suites avec balcon, chef personnel et itinéraire 100% taillé à vos envies.",
    whyChoose: [
      "Un yacht entier rien que pour vous",
      "Chef privé, menu personnalisé, service hôtelier 5 étoiles",
      "Itinéraire flexible, tenders Zodiac, concierge dédié",
    ],
    badgeClass:
      "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-900 border border-slate-400",
    accentClass: "text-slate-700",
    ringClass: "ring-slate-400",
    cardClass:
      "bg-gradient-to-br from-slate-100 via-white to-slate-50 border border-slate-200",
  },
];

export function getTierForCruise(cruise: Cruise): BudgetTier {
  const p = cruise.priceFrom;
  if (p < TIERS[0].priceMin) return TIERS[0];
  return (
    TIERS.find((t) => p >= t.priceMin && p < t.priceMax) ?? TIERS[TIERS.length - 1]
  );
}

export function getTier(slug: TierSlug): BudgetTier | undefined {
  return TIERS.find((t) => t.slug === slug);
}

export function cruisesInTier(slug: TierSlug, all: Cruise[]): Cruise[] {
  return all.filter((c) => getTierForCruise(c).slug === slug);
}

// "Best value" = highest rating in tier, then lowest price
export function bestValue(slug: TierSlug, all: Cruise[]): Cruise | undefined {
  const list = cruisesInTier(slug, all);
  return [...list].sort(
    (a, b) => b.rating - a.rating || a.priceFrom - b.priceFrom,
  )[0];
}
