import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { LangCurrencySwitcher } from "@/components/lang-currency-switcher";
import { useT } from "@/contexts/i18n";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isSubPage = pathname !== "/" && (
    pathname.startsWith("/cruises") || pathname.startsWith("/compare") || pathname.startsWith("/guide") || pathname.startsWith("/tier") || pathname.startsWith("/bateaux")
  );
  const navyMode = isSubPage; // logo + titles in navy on these pages
  const t = useT();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Logo + nav text color: navy on subpages always; on home keep transparent->white / scrolled->foreground behaviour.
  const logoColor = navyMode ? "text-[#0a2540]" : scrolled ? "text-foreground" : "drop-shadow-sm text-white";
  const navColor = navyMode
    ? "text-[#0a2540]/85"
    : scrolled
    ? "text-foreground/80"
    : "text-white/90";
  const linkHover = navyMode ? "text-[#0a2540] hover:opacity-80" : scrolled ? "hover:text-foreground" : "text-white";

  const switcherTone: "dark" | "light" = navyMode ? "dark" : scrolled ? "dark" : "light";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || navyMode ? "glass border-b border-border/60 pt-5 pb-4" : "pt-10 pb-8"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <WaveMark navy={navyMode} scrolled={scrolled} />
          <span className={`font-display text-xl tracking-tight transition-colors ${logoColor}`}>
            Komodo<span className="text-accent">·</span>Sail
          </span>
        </Link>
        <nav className={`hidden md:flex items-center gap-8 text-sm font-semibold transition-colors ${navColor}`}>
          <Link to="/cruises" className={`transition-colors ${linkHover}`}>{t("cruises")}</Link>
          <Link to="/compare" className={`transition-colors ${linkHover}`}>{t("compare")}</Link>
          <Link to="/guide" className={`transition-colors ${linkHover}`}>{t("guide")}</Link>
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <LangCurrencySwitcher tone={switcherTone} />
          <Link
            to="/cruises"
            className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full transition-all ${
              navyMode
                ? "bg-[#0a2540] text-white hover:opacity-90"
                : scrolled
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-white/90 text-ocean-deep hover:bg-white"
            }`}
          >
            {t("explore")}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function WaveMark({ navy, scrolled }: { navy?: boolean; scrolled?: boolean }) {
  const color = navy ? "text-[#0a2540]" : scrolled ? "text-ocean-deep" : "text-white";
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className={color}>
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 18c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 22c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-gradient-deep text-background/80 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-background">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 18c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-display text-2xl">Komodo·Sail</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            Le comparateur de référence pour les croisières dans le parc national de Komodo.
            Tous les opérateurs, toutes les compagnies, un seul endroit.
          </p>
        </div>
        <div>
          <p className="text-background font-medium mb-4">Naviguer</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/cruises" className="hover:text-background">Toutes les croisières</Link></li>
            <li><Link to="/compare" className="hover:text-background">Comparateur</Link></li>
            <li><Link to="/guide" className="hover:text-background">Guide Komodo</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-background font-medium mb-4">Départs</p>
          <ul className="space-y-2 text-sm">
            <li>Labuan Bajo, Flores</li>
            <li>Lombok</li>
            <li>Bali (transferts)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-background/50">
          <p>© {new Date().getFullYear()} Komodo·Sail. Comparateur indépendant.</p>
          <p>Conçu pour les voyageurs curieux.</p>
        </div>
      </div>
    </footer>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 inset-x-0 h-[2px] bg-accent z-[60]"
    />
  );
}
