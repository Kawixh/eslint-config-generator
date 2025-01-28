export type Language = "javascript" | "typescript";
export type Framework = "react" | "next.js" | "nest.js" | "svelte" | "none";
export type TestFramework = "jest" | "vitest" | "none";

// Add this type to represent possible ESLint rule values
export type ESLintRuleValue =
  | 0
  | 1
  | 2
  | "off"
  | "warn"
  | "error"
  | [0 | 1 | 2 | "off" | "warn" | "error", Record<string, unknown>];

export interface ConfigOptions {
  language: Language;
  framework: Framework;
  testFramework: TestFramework;
  rules: Record<string, ESLintRuleValue>;
}
