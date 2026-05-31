import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SSR-stable price formatter — avoids locale-driven hydration mismatch.
// Uses a thin non-breaking space as thousands separator (e.g. "4 500").
export function formatPrice(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
}
