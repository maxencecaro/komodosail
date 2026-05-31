import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Sparkles, Compass, Anchor, Wind } from "lucide-react";
import { SiteHeader, SiteFooter, ScrollProgress } from "@/components/site-chrome";
import { CompareDock } from "@/components/compare-dock";
import { CruiseCard } from "@/components/cruise-card";
import { CRUISES } from "@/data/cruises";
import { TIERS, cruisesInTier, type BudgetTier } from "@/data/budget-tiers";
import { formatPrice } from "@/lib/utils";
import heroPadar from "@/assets/hero-padar.jpg";
import pinkBeach from "@/assets/pink-beach.jpg";
import komodo from "@/assets/komodo-dragon.jpg";
import manta from "@/assets/manta-ray.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Komodo·Sail — Le comparateur de croisières Komodo" },
      { name: "description", content: "Toutes les croisières du parc national de Komodo réunies. Comparez phinisi, liveaboards et yachts au départ de Labuan Bajo et Lombok." },
      { property: "og:title", content: "Komodo·Sail — Comparateur de croisières Komodo" },
      { property: "og:description", content: "Comparez tous les opérateurs de croisière Komodo en un seul endroit." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-background">
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <TravelerProfiles />
        <Featured />
        <BudgetEstimator />
        <Experience />
        <Departures />
        <CTA />
      </main>
      <SiteFooter />
      <CompareDock />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroPadar} alt="Île de Padar, parc national de Komodo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative h-full flex flex-col justify-end pb-24 px-6">
        <div className="mx-auto max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-foreground mb-6"
          >
            <Sparkles className="size-3.5 text-accent" />
            Le comparateur n°1 des croisières Komodo
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-white text-balance text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-tight max-w-5xl"
          >
            Naviguez vers <em className="italic">Komodo</em>.
            <br />
            <span className="text-white/80">Choisissez votre bateau.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 max-w-xl text-white/80 text-lg leading-relaxed"
          >
            Phinisi de luxe, liveaboards, voiliers, speedboats. Tous les opérateurs
            au départ de Labuan Bajo et Lombok, comparés côte à côte.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              to="/cruises"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-ocean-deep font-medium hover:bg-white/90 transition-all"
            >
              Explorer les croisières
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-dark text-white hover:bg-white/10 transition-all"
            >
              Guide Komodo
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2"
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-8 bg-white/40"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Marquee() {
  const operators = Array.from(new Set(CRUISES.map((c) => c.operator)));
  const items = operators.length >= 8 ? operators : [...operators, ...operators];
  const idFor = (op: string) => CRUISES.find((c) => c.operator === op)?.id ?? "lamima";

  return (
    <section className="border-y border-border bg-secondary/40 py-10 md:py-12 overflow-hidden">
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
        {operators.length}+ opérateurs · 1 destination · 0 commission cachée
      </p>
      <div className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-secondary/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-secondary/80 to-transparent z-10" />

        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((track) => (
            <ul
              key={track}
              aria-hidden={track === 1}
              className="flex shrink-0 items-center gap-10 md:gap-16 pr-10 md:pr-16 whitespace-nowrap"
            >
              {items.map((op, i) => (
                <li key={`${track}-${i}`}>
                  <Link
                    to="/cruises/$id"
                    params={{ id: idFor(op) }}
                    className="font-display text-2xl md:text-3xl text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {op}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}


function Featured() {
  const featured = CRUISES.slice(0, 6);
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Sélection</p>
            <h2 className="font-display text-5xl md:text-7xl text-balance max-w-2xl">
              Les croisières qui marquent.
            </h2>
          </div>
          <Link to="/cruises" className="text-sm inline-flex items-center gap-2 text-foreground hover:gap-3 transition-all">
            Voir toutes les croisières <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((c, i) => <CruiseCard key={c.id} cruise={c} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const tiles = [
    { img: heroPadar, title: "Padar", text: "Le panorama le plus iconique d'Indonésie. Trois croissants de sable, une crête volcanique." },
    { img: pinkBeach, title: "Pink Beach", text: "Sable rose nacré, fruit du corail rouge. Snorkeling cristallin." },
    { img: manta, title: "Manta Point", text: "Nagez aux côtés de raies manta géantes, toute l'année." },
    { img: komodo, title: "Dragons de Komodo", text: "Rencontrez l'animal le plus rare de la planète sur Rinca ou Komodo." },
  ];
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-tide relative overflow-hidden">
      <div className="mx-auto max-w-7xl relative">
        <div className="max-w-2xl mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">L'expérience</p>
          <h2 className="font-display text-5xl md:text-7xl text-balance">
            Quatre raisons de lever l'ancre.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {tiles.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-3xl overflow-hidden aspect-[4/3] group ${i % 3 === 0 ? "md:aspect-[16/10]" : ""}`}
            >
              <img src={t.img} alt={t.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="font-display text-3xl mb-2">{t.title}</h3>
                <p className="text-sm text-white/80 max-w-sm">{t.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Departures() {
  const stats = [
    { icon: Anchor, value: "2", label: "Ports principaux" },
    { icon: Compass, value: "12+", label: "Opérateurs" },
    { icon: Wind, value: "3–7j", label: "Durées" },
    { icon: Sparkles, value: "365", label: "Jours par an" },
  ];
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Départs</p>
          <h2 className="font-display text-5xl md:text-6xl text-balance mb-6">
            Deux portes d'entrée pour le même paradis.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
            <strong className="text-foreground">Labuan Bajo</strong> est la porte historique :
            au cœur de Flores, à 20 minutes des premières îles. <strong className="text-foreground">Lombok</strong> offre
            les croisières longues, plus sauvages, traversant Sumbawa avant d'atteindre Komodo.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="p-5 rounded-2xl bg-secondary">
                <s.icon className="size-5 text-accent mb-3" />
                <p className="font-display text-3xl text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-deep">
          <img src={pinkBeach} alt="Plage de Komodo" className="w-full h-full object-cover" loading="lazy" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 right-8 glass rounded-2xl p-4 shadow-elevated"
          >
            <p className="text-xs text-muted-foreground">Meilleure saison</p>
            <p className="font-display text-2xl text-foreground">Avril → Nov</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-5xl relative rounded-[2.5rem] overflow-hidden p-16 md:p-24 text-center bg-gradient-ocean text-white shadow-deep">
        <div className="grain absolute inset-0" />
        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6">Prêt à embarquer ?</p>
        <h2 className="font-display text-5xl md:text-7xl text-balance leading-[0.95]">
          Votre croisière Komodo<br />vous attend.
        </h2>
        <p className="mt-6 text-white/80 max-w-xl mx-auto">
          Comparez les opérateurs, lisez les vraies caractéristiques, économisez des heures.
        </p>
        <Link
          to="/cruises"
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-ocean-deep font-medium hover:bg-white/90 transition-all group"
        >
          Découvrir toutes les croisières
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

function TravelerProfiles() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Par profil de voyageur</p>
            <h2 className="font-display text-5xl md:text-7xl text-balance max-w-3xl">
              Cinq façons de naviguer Komodo.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Choisissez la catégorie qui colle à votre style — du speedboat backpacker au charter privé 5 étoiles.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TIERS.map((t, i) => {
            const count = cruisesInTier(t.slug, CRUISES).length;
            return (
              <motion.div
                key={t.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to="/tier/$slug"
                  params={{ slug: t.slug }}
                  className={`group block h-full p-6 rounded-3xl transition-all hover:scale-[1.02] hover:shadow-elevated ${t.cardClass}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{t.emoji}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${t.badgeClass}`}>
                      {count} bateaux
                    </span>
                  </div>
                  <p className="font-display text-2xl mb-1">{t.name}</p>
                  <p className={`text-sm font-medium ${t.accentClass} mb-3`}>
                    ${formatPrice(t.priceMin)}{t.priceMax === Infinity ? "+" : `–$${formatPrice(t.priceMax)}`} <span className="text-muted-foreground font-normal">/pers</span>
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.target}</p>
                  <span className="inline-flex items-center gap-1 text-sm group-hover:gap-2 transition-all">
                    Explorer <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BudgetEstimator() {
  const [budget, setBudget] = useState(500);
  const match: BudgetTier =
    TIERS.find((t) => budget >= t.priceMin && budget < t.priceMax) ?? TIERS[TIERS.length - 1];

  return (
    <section className="py-24 md:py-32 px-6 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Estimateur rapide</p>
          <h2 className="font-display text-4xl md:text-5xl text-balance mb-4">
            Quel est mon budget ?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Glissez le curseur sur votre budget par personne, on vous oriente vers la bonne catégorie.
          </p>
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Budget /pers</span>
              <span className="font-display text-3xl">${formatPrice(budget)}</span>
            </div>
            <input
              type="range"
              min={50}
              max={3000}
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
              <span>$50</span>
              <span>$3000+</span>
            </div>
          </div>
        </div>
        <motion.div
          key={match.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-8 rounded-3xl ${match.cardClass}`}
        >
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${match.badgeClass}`}>
            <span>{match.emoji}</span> {match.name}
          </span>
          <h3 className="font-display text-3xl md:text-4xl mt-4">{match.target}.</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{match.description}</p>
          <div className="mt-6 space-y-2 text-sm">
            <Row label="Durée">{match.duration}</Row>
            <Row label="Cabine">{match.cabin}</Row>
            <Row label="Restauration">{match.food}</Row>
          </div>
          <Link
            to="/tier/$slug"
            params={{ slug: match.slug }}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90"
          >
            Voir les croisières {match.name} <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-t border-border/60 pt-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
