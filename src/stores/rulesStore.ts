import { create } from "zustand";

export interface ESLintRule {
  name: string;
  description: string;
  category: string;
  schema: any[];
  fixable: boolean;
  recommended: boolean;
}

interface RulesStore {
  rules: ESLintRule[];
  setRules: (rules: ESLintRule[]) => void;
}

export const useRulesStore = create<RulesStore>((set) => ({
  rules: [],
  setRules: (rules) => set({ rules }),
}));
