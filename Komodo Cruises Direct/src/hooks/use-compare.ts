import { create } from "zustand";

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompare = create<CompareState>((set, get) => ({
  ids: [],
  toggle: (id) =>
    set((s) => {
      if (s.ids.includes(id)) return { ids: s.ids.filter((x) => x !== id) };
      if (s.ids.length >= 4) return s;
      return { ids: [...s.ids, id] };
    }),
  clear: () => set({ ids: [] }),
  has: (id) => get().ids.includes(id),
}));
