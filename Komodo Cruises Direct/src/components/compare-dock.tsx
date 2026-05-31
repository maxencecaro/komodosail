import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCompare } from "@/hooks/use-compare";
import { CRUISES } from "@/data/cruises";

export function CompareDock() {
  const { ids, toggle, clear } = useCompare();
  const items = CRUISES.filter((c) => ids.includes(c.id));

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-6 inset-x-0 z-40 px-4"
        >
          <div className="mx-auto max-w-3xl glass shadow-elevated rounded-2xl border border-border/60 p-3 flex items-center gap-3">
            <div className="flex -space-x-2">
              {items.map((c) => (
                <div key={c.id} className="relative size-10 rounded-full overflow-hidden ring-2 ring-background">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => toggle(c.id)}
                    className="absolute -top-1 -right-1 size-4 rounded-full bg-foreground text-background grid place-items-center"
                    aria-label="Retirer"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {items.length} croisière{items.length > 1 ? "s" : ""} à comparer
              </p>
              <p className="text-xs text-muted-foreground">Jusqu'à 4 sélections</p>
            </div>
            <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground px-3">
              Effacer
            </button>
            <Link
              to="/compare"
              className="text-sm font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90"
            >
              Comparer →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
