import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { SiteHeader, SiteFooter, ScrollProgress } from "@/components/site-chrome";
import { CompareDock } from "@/components/compare-dock";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CruiseCard } from "@/components/cruise-card";
import { CRUISES, type Departure } from "@/data/cruises";
import { getCruisePriceNumeric } from "@/data/boats";
import { TIERS, getTierForCruise, type TierSlug } from "@/data/budget-tiers";

import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { PriceHistogramSlider } from "@/components/price-histogram-slider";

const PRICE_MIN = Math.floor(Math.min(...CRUISES.map((c) => c.priceFrom)) / 2) * 2;
const PRICE_MAX = Math.ceil(Math.max(...CRUISES.map((c) => c.priceFrom)) / 2) * 2;

const searchSchema = z.object({
  tier: z.enum(["backpacker", "budget-smart", "standard", "premium", "ultra-luxe"]).optional().catch(undefined),
});

export const Route = createFileRoute("/cruises/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Toutes les croisières Komodo — Komodo·Sail" },
      { name: "description", content: "Parcourez et filtrez toutes les croisières Komodo : luxe, premium, mid-range, budget. Départs Labuan Bajo et Lombok." },
    ],
  }),
  component: CruisesPage,
});

const DEPARTURES: Departure[] = ["Labuan Bajo", "Lombok"];
const DURATIONS = [
  { id: "Journée", label: "Journée", match: (d: string) => /journ[ée]e/i.test(d) },
  { id: "2J1N", label: "2j/1n", match: (d: string) => /2j1n|2j\/1n/i.test(d) },
  { id: "3J2N", label: "3j/2n", match: (d: string) => /3j2n|3j\/2n/i.test(d) },
  { id: "4J3N", label: "4j/3n", match: (d: string) => /4j3n|4j\/3n/i.test(d) },
  { id: "5J+", label: "5j+", match: (d: string) => {
    const m = d.match(/(\d+)\s*j/i);
    return m ? parseInt(m[1], 10) >= 5 : false;
  } },
] as const;
type DurationId = (typeof DURATIONS)[number]["id"];
const SORTS = [
  { id: "popular", label: "Plus populaires" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "rating", label: "Mieux notées" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

function CruisesPage() {
  const { tier: initialTier } = Route.useSearch();
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<TierSlug | undefined>(initialTier);
  const [deps, setDeps] = useState<Departure[]>([]);
  const [durs, setDurs] = useState<DurationId[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [sort, setSort] = useState<SortId>("popular");
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    let list = CRUISES.filter((c) => {
      if (q && !`${c.name} ${c.operator} ${c.boatType}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (tier && getTierForCruise(c).slug !== tier) return false;
      if (deps.length && !c.departures.some((d) => deps.includes(d))) return false;
      if (durs.length) {
        const matchers = DURATIONS.filter((d) => durs.includes(d.id));
        if (!c.durations.some((cd) => matchers.some((m) => m.match(cd)))) return false;
      }
      if (c.priceFrom > maxPrice) return false;
      return true;
    });
    const numericPriceFor = (c: typeof CRUISES[number]): number | null => {
      const idr = getCruisePriceNumeric(c.website, c.name);
      // Fallback: convert USD priceFrom to IDR-equivalent so all items sort on one scale.
      return idr ?? (typeof c.priceFrom === "number" ? c.priceFrom * 15000 : null);
    };
    const cmpAsc = (a: typeof CRUISES[number], b: typeof CRUISES[number]) => {
      const na = numericPriceFor(a); const nb = numericPriceFor(b);
      if (na === null && nb === null) return 0;
      if (na === null) return 1;
      if (nb === null) return -1;
      return na - nb;
    };
    switch (sort) {
      case "price-asc": list = [...list].sort(cmpAsc); break;
      case "price-desc": list = [...list].sort((a, b) => -cmpAsc(a, b)); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [q, tier, deps, durs, maxPrice, sort]);

  const toggle = <T,>(arr: T[], v: T, set: (v: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const activeCount = (tier ? 1 : 0) + deps.length + durs.length + (maxPrice < PRICE_MAX ? 1 : 0);
  const itinCount = durs.length;

  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120) setCollapsed(false);
      else if (y > lastScrollY.current + 4) setCollapsed(true);
      else if (y < lastScrollY.current - 4) setCollapsed(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const expanded = !collapsed || hovered;


  return (
    <div className="bg-background min-h-screen">
      <ScrollProgress />
      <SiteHeader />
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">{filtered.length} croisières</p>
            <h1 className="font-display text-5xl md:text-7xl text-balance text-[#0a2540]">
              Trouvez votre <em className="italic">phinisi</em>.
            </h1>
          </motion.div>

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="sticky top-20 z-30 -mx-6 px-6 glass border-y border-border mb-10 transition-all duration-300 ease-out overflow-hidden"
            style={{ paddingTop: expanded ? 16 : 8, paddingBottom: expanded ? 16 : 8 }}
          >
            <AnimatePresence initial={false} mode="wait">
              {!expanded ? (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <SlidersHorizontal className="size-4" />
                    <span>Filtres</span>
                    {activeCount > 0 && (
                      <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">{activeCount}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{filtered.length} résultats</span>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[240px] relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Rechercher un bateau, un opérateur…"
                        className="w-full pl-11 pr-4 h-11 rounded-full bg-card border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters((s) => !s)}
                      className="inline-flex items-center gap-2 px-4 h-11 rounded-full bg-card border border-border text-sm hover:border-foreground/30 transition-colors"
                    >
                      <SlidersHorizontal className="size-4" />
                      Filtres {activeCount > 0 && <span className="ml-1 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">{activeCount}</span>}
                    </button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="inline-flex items-center gap-2 px-4 h-11 rounded-full bg-card border border-border text-sm hover:border-foreground/30 transition-colors">
                          Itinéraires
                          {itinCount > 0 && <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">{itinCount}</span>}
                          <ChevronDown className="size-4 opacity-60" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-72 p-0">
                        <div className="p-4 border-b border-border">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Durée</p>
                          <ul className="space-y-1">
                            {DURATIONS.map((d) => {
                              const active = durs.includes(d.id);
                              return (
                                <li key={d.id}>
                                  <button
                                    onClick={() => toggle(durs, d.id, setDurs)}
                                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
                                  >
                                    <span>{d.label}</span>
                                    {active && <Check className="size-4 text-accent" />}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        {itinCount > 0 && (
                          <div className="px-4 pb-3">
                            <button
                              onClick={() => { setDeps([]); setDurs([]); }}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Réinitialiser
                            </button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortId)}
                      className="h-11 px-4 rounded-full bg-card border border-border text-sm hover:border-foreground/30 cursor-pointer"
                    >
                      {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>

                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 pb-2"
                    >
                      <div className="grid gap-6 md:grid-cols-4">
                        <FilterGroup label="Catégorie de budget">
                          {TIERS.map((t) => (
                            <Pill key={t.slug} active={tier === t.slug} onClick={() => setTier(tier === t.slug ? undefined : t.slug)}>
                              <span className="mr-1">{t.emoji}</span>{t.name}
                            </Pill>
                          ))}
                        </FilterGroup>
                        <FilterGroup label="Départ">
                          {DEPARTURES.map((dep) => (
                            <Pill key={dep} active={deps.includes(dep)} onClick={() => toggle(deps, dep, setDeps)}>
                              {dep}
                            </Pill>
                          ))}
                        </FilterGroup>
                        <FilterGroup label="Durée">
                          {DURATIONS.map((d) => (
                            <Pill key={d.id} active={durs.includes(d.id)} onClick={() => toggle(durs, d.id, setDurs)}>
                              {d.label}
                            </Pill>
                          ))}
                        </FilterGroup>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Fourchette de prix</p>
                          <PriceHistogramSlider
                            prices={CRUISES.map((c) => c.priceFrom)}
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            step={2}
                            value={maxPrice}
                            onChange={setMaxPrice}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {filtered.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-display text-3xl mb-4">Aucune croisière trouvée</p>
              <button onClick={() => { setTier(undefined); setDeps([]); setDurs([]); setMaxPrice(PRICE_MAX); setQ(""); }} className="text-accent">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => <CruiseCard key={c.id} cruise={c} index={i} />)}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <CompareDock />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
        active ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}
