import { Info } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="w-full bg-ocean-deep text-white/95 text-xs sm:text-sm px-4 py-2 flex items-start gap-2 justify-center">
      <Info className="size-4 shrink-0 mt-0.5" />
      <p className="leading-snug">
        Tous les prix sont indicatifs et proviennent de{" "}
        <a
          href="https://lebaliblog.com/bateaux/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 font-medium hover:text-white"
        >
          Le Bali Blog
        </a>
        . Vérifiez les tarifs à jour directement sur Le Bali Blog avant de réserver.
      </p>
    </div>
  );
}
