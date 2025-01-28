export type Language = "javascript" | "typescript";
export type Framework = "react" | "next.js" | "nest.js" | "svelte" | "none";
export type TestFramework = "jest" | "vitest" | "none";

// Add this type to represent possible ESLint rule values
export type ESLintRuleValue = "off" | "warn" | "error";

export interface ConfigOptions {
  language: Language;
  framework: Framework;
  testFramework: TestFramework;
  rules: Record<string, ESLintRuleValue>;
}
