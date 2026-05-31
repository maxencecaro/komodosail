import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Bed, MapPin, Star, Calendar, Ruler, ExternalLink, Check } from "lucide-react";
import { SiteHeader, SiteFooter, ScrollProgress } from "@/components/site-chrome";
import { CompareDock } from "@/components/compare-dock";
import { CruiseCard } from "@/components/cruise-card";
import { CRUISES } from "@/data/cruises";
import { useCompare } from "@/hooks/use-compare";
import { formatPrice } from "@/lib/utils";
import { useCruisePriceLabel } from "@/data/boats";

export const Route = createFileRoute("/cruises/$id")({
  loader: ({ params }) => {
    const cruise = CRUISES.find((c) => c.id === params.id);
    if (!cruise) throw notFound();
    return cruise;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Croisière Komodo` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — Komodo·Sail` },
          { property: "og:description", content: loaderData.description },
          { property: "og:image", content: loaderData.image },
        ]
      : [],
  }),
  component: CruiseDetail,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <Link to="/cruises" className="text-accent">← Retour aux croisières</Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center">
      <button onClick={reset} className="text-accent">Réessayer</button>
    </div>
  ),
});

function CruiseDetail() {
  const cruise = Route.useLoaderData();
  const { toggle, has } = useCompare();
  const compared = has(cruise.id);
  const idr = useCruisePriceLabel(cruise.website, cruise.name);
  const related = CRUISES.filter((c) => c.id !== cruise.id && c.category === cruise.category).slice(0, 3);

  return (
    <div className="bg-background">
      <ScrollProgress />
      <SiteHeader />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            src={cruise.image}
            alt={cruise.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
            <div className="mx-auto max-w-7xl w-full text-white">
              <Link to="/cruises" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6">
                <ArrowLeft className="size-4" /> Toutes les croisières
              </Link>
              <p className="text-sm text-white/80">{cruise.operator}</p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-display text-6xl md:text-8xl tracking-tight text-balance"
              >
                {cruise.name}
              </motion.h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Tag><Star className="size-3.5 fill-current" /> {cruise.rating} · {cruise.reviews} avis</Tag>
                <Tag>{cruise.category}</Tag>
                <Tag>{cruise.boatType}</Tag>
              </div>
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="px-6 -mt-16 relative z-10">
          <div className="mx-auto max-w-7xl bg-card rounded-3xl shadow-elevated p-8 md:p-10 grid grid-cols-2 md:grid-cols-5 gap-6">
            <Spec icon={Users} label="Capacité" value={`${cruise.capacity} pax`} />
            <Spec icon={Bed} label="Cabines" value={`${cruise.cabins}`} />
            <Spec icon={Ruler} label="Longueur" value={cruise.length ? `${cruise.length} m` : "—"} />
            <Spec icon={Calendar} label="Année" value={cruise.yearBuilt?.toString() ?? "—"} />
            <Spec icon={MapPin} label="Départ" value={cruise.departures.join(" · ")} />
          </div>
        </section>

        {/* Body */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">À propos</p>
                <p className="text-2xl font-display leading-relaxed text-balance text-foreground/90">
                  {cruise.description}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Itinéraires</p>
                <div className="flex flex-wrap gap-3">
                  {cruise.durations.map((d: string) => (
                    <div key={d} className="px-5 py-3 rounded-2xl bg-secondary">
                      <p className="font-display text-xl">{d}</p>
                      <p className="text-xs text-muted-foreground">Au départ de {cruise.departures[0]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Étapes phares</p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {cruise.highlights.map((h: string) => (
                    <li key={h} className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/60">
                      <span className="size-2 rounded-full bg-accent" />
                      <span className="font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">À bord</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {cruise.amenities.map((a: string) => (
                    <li key={a} className="flex items-center gap-3 text-sm">
                      <Check className="size-4 text-accent" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking card */}
            <aside className="lg:sticky lg:top-32 h-fit">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">À partir de</p>
                {idr ? (
                  <>
                    <p className="font-display text-5xl mt-1 leading-tight">{idr.price}
                      <span className="text-sm text-muted-foreground font-sans font-normal"> {idr.unit}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{cruise.durations[0]}</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-5xl mt-1">${formatPrice(cruise.priceFrom)}
                      <span className="text-sm text-muted-foreground font-sans font-normal"> /pers</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{cruise.durations[0]}</p>
                    {cruise.priceTo && (
                      <p className="text-xs text-muted-foreground mt-1">jusqu'à ${formatPrice(cruise.priceTo)}/pers</p>
                    )}
                  </>
                )}
                <div className="mt-6 space-y-3">
                  {cruise.website && (
                    <a
                      href={cruise.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90"
                    >
                      Site officiel <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => toggle(cruise.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border font-medium transition-all ${
                      compared ? "bg-accent text-accent-foreground border-accent" : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {compared ? "Retiré du comparateur" : "Ajouter au comparateur"}
                  </button>
                </div>
                <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
                  Komodo·Sail est indépendant. Nous n'appliquons aucune commission cachée.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="px-6 py-20 bg-gradient-tide">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-display text-4xl md:text-5xl mb-10">Croisières similaires</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((c, i) => <CruiseCard key={c.id} cruise={c} index={i} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <CompareDock />
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 glass-dark text-white px-3 py-1 rounded-full text-xs">
      {children}
    </span>
  );
}

function Spec({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <Icon className="size-4 text-accent mb-2" />
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-xl mt-1">{value}</p>
    </div>
  );
}
