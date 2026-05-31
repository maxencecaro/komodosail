import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Users, MapPin, Star, Bed } from "lucide-react";
import type { Cruise } from "@/data/cruises";
import { useCompare } from "@/hooks/use-compare";
import { formatPrice } from "@/lib/utils";
import { useCruisePriceLabel } from "@/data/boats";
import { getTierForCruise } from "@/data/budget-tiers";

export function CruiseCard({ cruise, index = 0 }: { cruise: Cruise; index?: number }) {
  const { toggle, has } = useCompare();
  const compared = has(cruise.id);
  const idr = useCruisePriceLabel(cruise.website, cruise.name);
  const firstDuration = cruise.durations[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
    >
      <Link to="/cruises/$id" params={{ id: cruise.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={cruise.image}
            alt={cruise.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${getTierForCruise(cruise).badgeClass}`}>
              <span className="mr-1">{getTierForCruise(cruise).emoji}</span>
              {getTierForCruise(cruise).name}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-background">
            <div>
              <p className="text-xs opacity-80">{cruise.operator}</p>
              <h3 className="font-display text-2xl text-background drop-shadow-md">{cruise.name}</h3>
            </div>
            <div className="flex items-center gap-1 text-sm glass-dark text-background px-2.5 py-1 rounded-full">
              <Star className="size-3.5 fill-current" />
              {cruise.rating}
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{cruise.departures.join(" · ")}</span>
            <span className="inline-flex items-center gap-1"><Users className="size-3.5" />{cruise.capacity} pax</span>
            <span className="inline-flex items-center gap-1"><Bed className="size-3.5" />{cruise.cabins} cabines</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cruise.durations.map((d) => (
              <span key={d} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{d}</span>
            ))}
          </div>
          <div className="flex items-end justify-between pt-2 border-t border-border">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">À partir de</p>
              <p className="font-display text-2xl text-foreground leading-tight">
                {idr ? (
                  <>
                    {idr.price}
                    <span className="text-xs text-muted-foreground font-sans"> {idr.unit}</span>
                  </>
                ) : (
                  <>
                    ${formatPrice(cruise.priceFrom)}
                    <span className="text-xs text-muted-foreground font-sans"> /pers</span>
                  </>
                )}
              </p>
              {firstDuration && (
                <p className="text-xs text-muted-foreground mt-0.5">{firstDuration}</p>
              )}
            </div>
            <span className="text-sm text-accent group-hover:translate-x-1 transition-transform">Voir →</span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggle(cruise.id); }}
        aria-label="Ajouter au comparateur"
        className={`absolute top-4 right-4 size-9 rounded-full grid place-items-center transition-all ${
          compared
            ? "bg-accent text-accent-foreground scale-110"
            : "glass text-foreground hover:scale-110"
        }`}
      >
        <Check className={`size-4 transition-opacity ${compared ? "opacity-100" : "opacity-50"}`} />
      </button>
    </motion.article>
  );
}
