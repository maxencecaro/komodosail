import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { SiteHeader, SiteFooter, ScrollProgress } from "@/components/site-chrome";
import { useCompare } from "@/hooks/use-compare";
import { CRUISES } from "@/data/cruises";
import { formatPrice } from "@/lib/utils";
import { useCruisePriceLabel } from "@/data/boats";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Comparateur — Komodo·Sail" },
      { name: "description", content: "Comparez vos croisières Komodo côte à côte : prix, capacité, itinéraires, équipements." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { ids, toggle, clear } = useCompare();
  const items = CRUISES.filter((c) => ids.includes(c.id));

  return (
    <div className="bg-background min-h-screen">
      <ScrollProgress />
      <SiteHeader />
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-end justify-between flex-wrap gap-4"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Comparateur</p>
              <h1 className="font-display text-5xl md:text-7xl text-balance text-[#0a2540]">
                Côte à côte.
              </h1>
            </div>
            {items.length > 0 && (
              <button onClick={clear} className="text-sm text-muted-foreground hover:text-foreground">
                Tout effacer
              </button>
            )}
          </motion.div>

          {items.length === 0 ? (
            <div className="text-center py-32 rounded-3xl bg-secondary">
              <p className="font-display text-3xl mb-4">Aucune croisière sélectionnée</p>
              <p className="text-muted-foreground mb-8">Ajoutez jusqu'à 4 croisières au comparateur.</p>
              <Link to="/cruises" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background">
                Parcourir les croisières →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="min-w-full border-separate border-spacing-x-3">
                <thead>
                  <tr>
                    <th className="text-left text-xs uppercase tracking-wider text-muted-foreground font-normal pb-4 w-40"></th>
                    {items.map((c) => (
                      <th key={c.id} className="text-left pb-4 min-w-[260px] align-top">
                        <div className="rounded-2xl overflow-hidden bg-card shadow-soft">
                          <div className="relative aspect-[4/3]">
                            <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                            <button
                              onClick={() => toggle(c.id)}
                              className="absolute top-2 right-2 size-7 rounded-full bg-background/90 grid place-items-center"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground">{c.operator}</p>
                            <Link to="/cruises/$id" params={{ id: c.id }} className="font-display text-xl hover:text-accent">
                              {c.name}
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <Row label="Prix dès">{items.map((c) => (
                    <PriceCell key={c.id} cruise={c} />
                  ))}</Row>
                  <Row label="Catégorie">{items.map((c) => <span key={c.id}>{c.category}</span>)}</Row>
                  <Row label="Type">{items.map((c) => <span key={c.id}>{c.boatType}</span>)}</Row>
                  <Row label="Départ">{items.map((c) => <span key={c.id}>{c.departures.join(", ")}</span>)}</Row>
                  <Row label="Durées">{items.map((c) => <span key={c.id}>{c.durations.join(", ")}</span>)}</Row>
                  <Row label="Capacité">{items.map((c) => <span key={c.id}>{c.capacity} pax</span>)}</Row>
                  <Row label="Cabines">{items.map((c) => <span key={c.id}>{c.cabins}</span>)}</Row>
                  <Row label="Longueur">{items.map((c) => <span key={c.id}>{c.length ? `${c.length} m` : "—"}</span>)}</Row>
                  <Row label="Note">{items.map((c) => <span key={c.id}>★ {c.rating} ({c.reviews})</span>)}</Row>
                  <Row label="Étapes">{items.map((c) => <span key={c.id} className="text-xs leading-relaxed">{c.highlights.join(" · ")}</span>)}</Row>
                  <AmenityRows items={items} />
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function PriceCell({ cruise }: { cruise: typeof CRUISES[number] }) {
  const idr = useCruisePriceLabel(cruise.website, cruise.name);
  return (
    <div className="leading-tight">
      <span className="font-display text-2xl">
        {idr ? idr.price : `$${formatPrice(cruise.priceFrom)}`}
        <span className="text-xs text-muted-foreground font-sans"> {idr ? idr.unit : "/pers"}</span>
      </span>
      {cruise.durations[0] && (
        <div className="text-xs text-muted-foreground mt-0.5">{cruise.durations[0]}</div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode[] }) {
  return (
    <tr className="border-t border-border">
      <td className="py-4 text-xs uppercase tracking-wider text-muted-foreground align-top">{label}</td>
      {children.map((child, i) => <td key={i} className="py-4 align-top">{child}</td>)}
    </tr>
  );
}

function AmenityRows({ items }: { items: typeof CRUISES }) {
  const all = Array.from(new Set(items.flatMap((c) => c.amenities))).sort();
  return (
    <>
      {all.map((a) => (
        <tr key={a} className="border-t border-border">
          <td className="py-3 text-xs text-muted-foreground align-top">{a}</td>
          {items.map((c) => (
            <td key={c.id} className="py-3">
              {c.amenities.includes(a) ? (
                <Check className="size-4 text-accent" />
              ) : (
                <Minus className="size-4 text-muted-foreground/40" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
