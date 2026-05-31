import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteHeader, SiteFooter, ScrollProgress } from "@/components/site-chrome";
import heroPadar from "@/assets/hero-padar.jpg";
import pinkBeach from "@/assets/pink-beach.jpg";
import komodo from "@/assets/komodo-dragon.jpg";
import manta from "@/assets/manta-ray.jpg";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Guide Komodo — Komodo·Sail" },
      { name: "description", content: "Tout savoir pour préparer votre croisière Komodo : meilleure saison, itinéraires, sites incontournables, conseils pratiques." },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const sections = [
    {
      title: "Quand partir",
      img: heroPadar,
      text: "La saison idéale s'étend d'avril à novembre. Mer calme, ciel bleu, visibilité sous-marine optimale. Décembre à mars : saison des pluies, beaucoup de bateaux à quai.",
    },
    {
      title: "Sites incontournables",
      img: pinkBeach,
      text: "Padar (panorama), Pink Beach (sable rose), Manta Point (raies manta), Komodo & Rinca (dragons), Kanawa & Kelor (snorkeling), Taka Makassar (banc de sable).",
    },
    {
      title: "Rencontrer les dragons",
      img: komodo,
      text: "Deux options : Komodo Island (plus authentique) ou Rinca (plus accessible). Toujours accompagné d'un ranger. Évitez les heures les plus chaudes.",
    },
    {
      title: "Plonger & snorkeler",
      img: manta,
      text: "Eaux parmi les plus riches du monde. Manta Point toute l'année, Batu Bolong et Castle Rock pour les courants, Crystal Rock pour les débutants confirmés.",
    },
  ];

  return (
    <div className="bg-background">
      <ScrollProgress />
      <SiteHeader />
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Guide</p>
            <h1 className="font-display text-5xl md:text-7xl text-balance text-[#0a2540]">
              Préparez votre <em className="italic">Komodo</em>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Tout ce qu'il faut savoir avant de réserver. Saisons, itinéraires, sites,
              budget et conseils de voyageurs.
            </p>
          </motion.div>

          <div className="space-y-24">
            {sections.map((s, i) => (
              <motion.section
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[&>:first-child]:order-2" : ""}`}
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">0{i + 1}</p>
                  <h2 className="font-display text-4xl md:text-5xl mb-5 text-balance">{s.title}</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
