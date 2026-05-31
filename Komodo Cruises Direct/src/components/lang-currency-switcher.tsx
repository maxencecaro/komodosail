import { ChevronDown, Globe } from "lucide-react";
import { useI18n, LANGS, CURRENCIES, type Lang, type Currency } from "@/contexts/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LangCurrencySwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { lang, setLang, currency, setCurrency } = useI18n();
  const currentLang = LANGS.find((l) => l.code === lang)!;
  const currentCur = CURRENCIES.find((c) => c.code === currency)!;
  const triggerCls =
    tone === "light"
      ? "text-white/95 hover:bg-white/10 border-white/30"
      : "text-foreground hover:bg-foreground/5 border-border";

  return (
    <div className="hidden md:flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-colors ${triggerCls}`}
          aria-label="Langue"
        >
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <span className="uppercase">{currentLang.code}</span>
          <ChevronDown className="size-3 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          {LANGS.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => setLang(l.code as Lang)}
              className={l.code === lang ? "bg-accent/10" : ""}
            >
              <span className="mr-2">{l.flag}</span>
              {l.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-colors ${triggerCls}`}
          aria-label="Devise"
        >
          <span className="font-semibold">{currentCur.symbol}</span>
          <span>{currentCur.label}</span>
          <ChevronDown className="size-3 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {CURRENCIES.map((c) => (
            <DropdownMenuItem
              key={c.code}
              onClick={() => setCurrency(c.code as Currency)}
              className={c.code === currency ? "bg-accent/10" : ""}
            >
              <span className="font-semibold mr-2 w-6 inline-block">{c.symbol}</span>
              {c.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile compact: only globe icon (no-op placeholder for visual density on small screens) */}
      <Globe className="hidden size-4 opacity-0" />
    </div>
  );
}
