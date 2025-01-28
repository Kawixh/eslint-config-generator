import { create } from "zustand";

export interface ESLintRule {
  name: string;
  description: string;
  category: string;
  schema: JSONSchemaDefinition[];
  fixable: boolean;
  recommended: boolean;
}

type JSONSchemaDefinition = {
  type?: string | string[];
  properties?: Record<string, JSONSchemaDefinition>;
  items?: JSONSchemaDefinition | JSONSchemaDefinition[];
  enum?: (string | number | boolean | null)[];
  required?: string[];
  additionalProperties?: boolean | JSONSchemaDefinition;
  [key: string]: unknown;
};

interface RulesStore {
  rules: ESLintRule[];
  setRules: (rules: ESLintRule[]) => void;
}

export const useRulesStore = create<RulesStore>((set) => ({
  rules: [],
  setRules: (rules) => set({ rules }),
}));
