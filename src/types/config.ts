export type Language = "javascript" | "typescript";
export type Framework = "react" | "next.js" | "nest.js" | "svelte" | "none";
export type TestFramework = "jest" | "vitest" | "none";

export interface ConfigOptions {
  language: Language;
  framework: Framework;
  testFramework: TestFramework;
  rules: Record<string, any>;
}
