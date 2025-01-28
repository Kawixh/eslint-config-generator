import { create } from "zustand";

interface HeightEntry {
  name: string;
  height: number;
}

interface ElementHeightState {
  heights: HeightEntry[];
  pageHeight: number;
  addOrUpdateHeight: (name: string, height: number) => void;
  removeHeight: (name: string) => void;
  setPageHeight: (height: number) => void;
  getHeight: (name: string) => number;
  getAvailableHeightNames: () => string[];
  getAllHeights: () => HeightEntry[];
}

export const useElementHeightStore = create<ElementHeightState>((set, get) => ({
  heights: [],
  pageHeight: 0,

  addOrUpdateHeight: (name: string, height: number) =>
    set((state) => {
      const existing = state.heights.findIndex((h) => h.name === name);
      if (existing !== -1) {
        const newHeights = [...state.heights];
        newHeights[existing] = { name, height };
        return { heights: newHeights };
      }
      return { heights: [...state.heights, { name, height }] };
    }),

  removeHeight: (name: string) =>
    set((state) => ({
      heights: state.heights.filter((h) => h.name !== name),
    })),

  setPageHeight: (height: number) => set({ pageHeight: height }),

  getHeight: (name: string) => {
    const entry = get().heights.find((h) => h.name === name);
    return entry?.height ?? 0;
  },

  getAvailableHeightNames: () => get().heights.map((h) => h.name),

  getAllHeights: () => get().heights,
}));
