import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, ExternalLink, Search, Ship } from "lucide-react";
import { BOATS, formatIDR, type Boat } from "@/data/boats";

export const Route = createFileRoute("/bateaux")({
  head: () => ({
    meta: [
      { title: "Comparateur de croisières Komodo — Tous les bateaux & prix" },
      {
        name: "description",
        content:
          "Comparez les prix de tous les bateaux pour une croisière à Komodo. Données issues de Le Bali Blog, prix les plus bas en IDR.",
      },
    ],
  }),
  component: BateauxPage,
});

type SortKey = "price-asc" | "price-desc" | "name";

function BateauxPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [type, setType] = useState<"all" | "perPerson" | "charter">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list: Boat[] = BOATS.filter((b) => {
      if (type !== "all" && b.priceType !== type) return false;
      if (q && !b.name.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-desc") return b.priceIDR - a.priceIDR;
      return a.priceIDR - b.priceIDR;
    });
    return list;
  }, [query, sort, type]);

  return (
    <main className="min-h-screen bg-sand">
      {/* Hero */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean to-lagoon text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-[0.25em] mb-4">
            <Ship className="size-4" />
            Komodo · Indonésie
          </div>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight max-w-3xl">
            Comparateur de croisières Komodo
          </h1>
          <p className="mt-4 text-white/90 max-w-2xl text-base sm:text-lg">
            {BOATS.length} bateaux référencés. Prix les plus bas en roupies
            indonésiennes (IDR), agrégés depuis Le Bali Blog.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="mx-auto max-w-6xl px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-soft border border-border p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un bateau…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-sand border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ocean"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Tarif :</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="px-3 py-2 rounded-lg bg-sand border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ocean"
              >
                <option value="all">Tous</option>
                <option value="perPerson">Par personne</option>
                <option value="charter">Charter privé</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowUpDown className="size-3.5" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="px-3 py-2 rounded-lg bg-sand border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ocean"
              >
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom (A→Z)</option>
              </select>
            </label>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 px-1">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </p>
      </section>

      {/* List */}
      <section className="mx-auto max-w-6xl px-6 py-8 pb-20">
        <ul className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <li
              key={b.url}
              className="group bg-white rounded-2xl border border-border p-5 shadow-soft hover:shadow-elevated transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl text-ocean-deep leading-snug">
                  {b.name}
                </h2>
                <span
                  className={`shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                    b.priceType === "charter"
                      ? "bg-ocean-deep/10 text-ocean-deep"
                      : "bg-lagoon/15 text-ocean-deep"
                  }`}
                >
                  {b.priceType === "charter" ? "Charter" : "Par pers."}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  À partir de
                </p>
                <p className="font-display text-2xl text-foreground mt-0.5">
                  {formatIDR(b.priceIDR)}
                  <span className="text-xs text-muted-foreground font-sans ml-1">
                    {b.priceType === "charter" ? "/ charter" : "/ pers"}
                  </span>
                </p>
              </div>
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg bg-ocean text-white text-sm font-medium hover:bg-ocean-deep transition-colors"
              >
                Voir & réserver sur Le Bali Blog
                <ExternalLink className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            Aucun bateau ne correspond à votre recherche.
          </div>
        )}
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground text-center">
          Données agrégées depuis{" "}
          <a
            href="https://lebaliblog.com/bateaux/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ocean-deep"
          >
            lebaliblog.com/bateaux
          </a>
          . Comparateur indépendant, à vocation informative.
        </div>
      </footer>
    </main>
  );
}
