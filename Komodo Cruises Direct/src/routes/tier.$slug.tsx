import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { SiteHeader, SiteFooter, ScrollProgress } from "@/components/site-chrome";
import { CompareDock } from "@/components/compare-dock";
import { CruiseCard } from "@/components/cruise-card";
import { CRUISES } from "@/data/cruises";
import { TIERS, getTier, cruisesInTier, bestValue, type TierSlug } from "@/data/budget-tiers";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/tier/$slug")({
  loader: ({ params }) => {
    const tier = getTier(params.slug as TierSlug);
    if (!tier) throw notFound();
    return tier;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.emoji} ${loaderData.name} — Croisières Komodo` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `Croisières Komodo ${loaderData.name}` },
          { property: "og:description", content: loaderData.description },
        ]
      : [],
  }),
  component: TierPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <Link to="/cruises" className="text-accent">← Toutes les croisières</Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center">
      <button onClick={reset} className="text-accent">Réessayer</button>
    </div>
  ),
});

function TierPage() {
  const tier = Route.useLoaderData();
  const list = cruisesInTier(tier.slug, CRUISES).sort((a, b) => b.rating - a.rating);
  const top = list.slice(0, 4);
  const best = tier.slug !== "ultra-luxe" ? bestValue(tier.slug, CRUISES) : undefined;

  return (
    <div className="bg-background min-h-screen">
      <ScrollProgress />
      <SiteHeader />
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Link to="/cruises" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">
              ← Toutes les catégories
            </Link>
            <div className="mt-6 flex items-start gap-4 flex-wrap">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${tier.badgeClass}`}>
                <span className="text-base">{tier.emoji}</span> {tier.name}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm bg-secondary text-secondary-foreground">
                ${formatPrice(tier.priceMin)}{tier.priceMax === Infinity ? "+" : ` – $${formatPrice(tier.priceMax)}`} /pers
              </span>
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl text-balance max-w-4xl">
              {tier.name}.<br />
              <span className="text-muted-foreground">{tier.target}.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">{tier.description}</p>
          </motion.div>

          {/* Quick specs */}
          <div className={`grid sm:grid-cols-2 md:grid-cols-5 gap-3 mb-20 rounded-3xl p-6 ${tier.cardClass}`}>
            <Spec label="Durée" value={tier.duration} />
            <Spec label="Capacité" value={tier.capacity} />
            <Spec label="Cabine" value={tier.cabin} />
            <Spec label="Restauration" value={tier.food} />
            <Spec label="À bord" value={tier.crew} />
          </div>

          {/* Why choose */}
          <section className="mb-20 grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Pour les indécis</p>
              <h2 className="font-display text-3xl md:text-4xl text-balance">
                Pourquoi choisir <em className="italic">{tier.name}</em> ?
              </h2>
            </div>
            <ul className="md:col-span-2 space-y-3">
              {tier.whyChoose.map((w: string) => (
                <li key={w} className="flex items-start gap-3 p-5 rounded-2xl bg-card border border-border">
                  <Check className={`size-5 shrink-0 mt-0.5 ${tier.accentClass}`} />
                  <span className="leading-relaxed">{w}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Best value */}
          {best && (
            <section className="mb-20">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className={`size-5 ${tier.accentClass}`} />
                <p className="text-xs uppercase tracking-[0.3em] text-accent">Meilleur rapport qualité/prix</p>
              </div>
              <div className={`rounded-3xl p-6 md:p-8 ${tier.cardClass}`}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <Link to="/cruises/$id" params={{ id: best.id }} className="block aspect-[4/3] rounded-2xl overflow-hidden">
                    <img src={best.image} alt={best.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </Link>
                  <div>
                    <p className="text-xs text-muted-foreground">{best.operator}</p>
                    <Link to="/cruises/$id" params={{ id: best.id }}>
                      <h3 className="font-display text-4xl md:text-5xl mt-1 hover:text-accent transition-colors">{best.name}</h3>
                    </Link>
                    <p className="mt-3 text-sm">★ {best.rating} · {best.reviews} avis · {best.boatType}</p>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{best.description}</p>
                    <div className="mt-6 flex items-baseline gap-3">
                      <span className="font-display text-4xl">${formatPrice(best.priceFrom)}</span>
                      <span className="text-sm text-muted-foreground">/pers</span>
                    </div>
                    <Link
                      to="/cruises/$id"
                      params={{ id: best.id }}
                      className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90"
                    >
                      Découvrir <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Top recommendations */}
          <section className="mb-20">
            <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Notre sélection</p>
                <h2 className="font-display text-4xl md:text-5xl">Top {tier.name}</h2>
              </div>
              <Link
                to="/cruises"
                search={{ tier: tier.slug }}
                className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
              >
                Voir toutes les croisières {tier.name} <ArrowRight className="size-4" />
              </Link>
            </div>
            {top.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-secondary">
                <p className="font-display text-2xl mb-2">Aucune croisière dans cette catégorie pour l'instant.</p>
                <p className="text-muted-foreground">Notre catalogue s'étoffe en continu.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {top.map((c, i) => <CruiseCard key={c.id} cruise={c} index={i} />)}
              </div>
            )}
          </section>

          {/* Reviews preview */}
          {top.length > 0 && (
            <section className="mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Avis voyageurs</p>
              <h2 className="font-display text-3xl md:text-4xl mb-8">Ils ont choisi {tier.name}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {fakeReviewsFor(tier.slug).map((r, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                    <p className="text-sm leading-relaxed">"{r.text}"</p>
                    <p className="mt-4 text-xs text-muted-foreground">— {r.name}, {r.country}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other tiers nav */}
          <section className="border-t border-border pt-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">Autres catégories</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TIERS.filter((t) => t.slug !== tier.slug).map((t) => (
                <Link
                  key={t.slug}
                  to="/tier/$slug"
                  params={{ slug: t.slug }}
                  className={`p-5 rounded-2xl hover:scale-[1.02] transition-transform ${t.cardClass}`}
                >
                  <p className="text-2xl mb-2">{t.emoji}</p>
                  <p className="font-display text-xl">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${formatPrice(t.priceMin)}{t.priceMax === Infinity ? "+" : `–$${formatPrice(t.priceMax)}`}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
      <CompareDock />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium leading-snug">{value}</p>
    </div>
  );
}

function fakeReviewsFor(slug: TierSlug): { name: string; country: string; text: string }[] {
  const map: Record<TierSlug, { name: string; country: string; text: string }[]> = {
    backpacker: [
      { name: "Léa", country: "France", text: "Parfait pour un backpacker. Speedboat, dragons, manta rays — tout en une journée. Aucun regret." },
      { name: "Tom", country: "Australia", text: "Best value day trip in Indonesia. Crew was fun and the snorkeling was insane." },
      { name: "Maria", country: "Spain", text: "Pas de luxe mais l'essentiel y est. Les paysages font le reste." },
    ],
    "budget-smart": [
      { name: "Julien & Sarah", country: "France", text: "2 nuits à bord pour le prix d'une nuit d'hôtel. Cabines simples, sympas, équipage adorable." },
      { name: "Anna", country: "Germany", text: "Great balance. Comfortable enough, real adventure feel, met amazing people." },
      { name: "Marco", country: "Italy", text: "Très bon rapport qualité-prix. La nourriture était une vraie surprise." },
    ],
    standard: [
      { name: "Famille Dubois", country: "France", text: "Cabine privée avec SDB, parfait avec les enfants. Le sun deck était notre QG." },
      { name: "Emma", country: "UK", text: "Lovely balance of comfort and value. Crew was incredibly professional." },
      { name: "Hiroshi", country: "Japan", text: "Confortable, propre, repas excellents. Idéal pour une première croisière." },
    ],
    premium: [
      { name: "Camille & Antoine", country: "France", text: "Notre lune de miel. Service impeccable, jacuzzi sur le pont, dîner aux chandelles. Inoubliable." },
      { name: "David", country: "USA", text: "Exceptional crew, fantastic food, intimate group. Worth every penny." },
      { name: "Sophie", country: "Belgique", text: "Petits groupes, vraie attention au détail. On a été bichonnés." },
    ],
    "ultra-luxe": [
      { name: "Famille R.", country: "France", text: "Charter privé, chef étoilé, itinéraire sur-mesure. Niveau yacht 5 étoiles." },
      { name: "James", country: "Singapore", text: "Best private charter we've ever booked. Concierge service was flawless." },
      { name: "Olivia", country: "UK", text: "Discreet, refined, magical. The crew anticipated every wish." },
    ],
  };
  return map[slug];
}
