import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "en" | "id" | "de" | "es";
export type Currency = "IDR" | "EUR" | "USD" | "GBP" | "AUD" | "SGD";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "IDR", symbol: "Rp", label: "IDR" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "USD", symbol: "$", label: "USD" },
  { code: "GBP", symbol: "£", label: "GBP" },
  { code: "AUD", symbol: "A$", label: "AUD" },
  { code: "SGD", symbol: "S$", label: "SGD" },
];

// Fallback rates: 1 IDR = X currency. Updated when live rates fetched.
const FALLBACK_RATES: Record<Currency, number> = {
  IDR: 1,
  EUR: 1 / 17000,
  USD: 1 / 15800,
  GBP: 1 / 20000,
  AUD: 1 / 10500,
  SGD: 1 / 11800,
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<Currency, number>; // 1 IDR -> X target
  formatPriceFromIDR: (idr: number) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const l = localStorage.getItem("ks_lang") as Lang | null;
      const c = localStorage.getItem("ks_currency") as Currency | null;
      if (l && LANGS.some((x) => x.code === l)) setLangState(l);
      if (c && CURRENCIES.some((x) => x.code === c)) setCurrencyState(c);
    } catch {}
  }, []);

  // Fetch live rates (cached 24h)
  useEffect(() => {
    const CACHE_KEY = "ks_rates_v1";
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < 24 * 3600 * 1000 && data?.IDR) {
          setRates(data);
          return;
        }
      }
    } catch {}
    fetch("https://api.exchangerate.host/latest?base=IDR&symbols=EUR,USD,GBP,AUD,SGD")
      .then((r) => r.json())
      .then((j) => {
        if (j?.rates) {
          const next: Record<Currency, number> = {
            IDR: 1,
            EUR: j.rates.EUR ?? FALLBACK_RATES.EUR,
            USD: j.rates.USD ?? FALLBACK_RATES.USD,
            GBP: j.rates.GBP ?? FALLBACK_RATES.GBP,
            AUD: j.rates.AUD ?? FALLBACK_RATES.AUD,
            SGD: j.rates.SGD ?? FALLBACK_RATES.SGD,
          };
          setRates(next);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: next }));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("ks_lang", l); } catch {}
  };
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try { localStorage.setItem("ks_currency", c); } catch {}
  };

  const formatPriceFromIDR = useMemo(() => (idr: number) => {
    const rate = rates[currency] ?? FALLBACK_RATES[currency];
    const value = idr * rate;
    const sym = CURRENCIES.find((c) => c.code === currency)!.symbol;
    if (currency === "IDR") {
      return `${sym} ${Math.round(value).toLocaleString("en-US")}`;
    }
    // Round to nearest whole unit; thousand separators
    const rounded = Math.round(value);
    return `${sym} ${rounded.toLocaleString("en-US")}`;
  }, [rates, currency]);

  return (
    <Ctx.Provider value={{ lang, setLang, currency, setCurrency, rates, formatPriceFromIDR }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// Minimal UI string dictionary
const UI: Record<string, Record<Lang, string>> = {
  cruises: { fr: "Croisières", en: "Cruises", id: "Pelayaran", de: "Kreuzfahrten", es: "Cruceros" },
  compare: { fr: "Comparer", en: "Compare", id: "Bandingkan", de: "Vergleichen", es: "Comparar" },
  guide: { fr: "Guide Komodo", en: "Komodo Guide", id: "Panduan Komodo", de: "Komodo-Reiseführer", es: "Guía Komodo" },
  explore: { fr: "Explorer", en: "Explore", id: "Jelajahi", de: "Entdecken", es: "Explorar" },
  perPerson: { fr: "/pers", en: "/person", id: "/orang", de: "/Person", es: "/persona" },
  fromPrice: { fr: "À partir de", en: "From", id: "Mulai dari", de: "Ab", es: "Desde" },
};

export function useT() {
  const { lang } = useI18n();
  return (key: keyof typeof UI) => UI[key]?.[lang] ?? UI[key]?.fr ?? String(key);
}
