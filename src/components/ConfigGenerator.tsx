"use client";

import { useElementHeightStore } from "@/store/headerStore";
import {
  ConfigOptions,
  ESLintRuleValue,
  Framework,
  Language,
} from "@/types/config";
import { calculateHeight } from "@/utils/height";
import { useState } from "react";
import ConfigPreview from "./ConfigPreview";
import FrameworkStep from "./steps/FrameworkStep";
import LanguageStep from "./steps/LanguageStep";
import type { RuleValue } from "./steps/RulesStep";
import RulesStep from "./steps/RulesStep";
import VersionStep from "./steps/VersionStep";

export default function ConfigGenerator() {
  const [config, setConfig] = useState<
    ConfigOptions & { eslintVersion: string }
  >({
    language: "" as Language,
    framework: "" as Framework,
    testFramework: "none",
    eslintVersion: "",
    rules: {},
  });

  const pageHeight = useElementHeightStore((state) => state.pageHeight);
  const headerHeight = useElementHeightStore((state) =>
    state.getHeight("header")
  );
  const footerHeight = useElementHeightStore((state) =>
    state.getHeight("footer")
  );

  const handleLanguageSelect = (language: Language) => {
    setConfig((prev) => ({ ...prev, language }));
  };

  const handleFrameworkSelect = (framework: Framework) => {
    setConfig((prev) => ({ ...prev, framework }));
  };

  const handleVersionSelect = (eslintVersion: string) => {
    setConfig((prev) => ({ ...prev, eslintVersion }));
  };

  const handleRulesSelect = (rules: Record<string, RuleValue>) => {
    setConfig((prev) => ({
      ...prev,
      rules: Object.fromEntries(
        Object.entries(rules).map(([key, value]) => [
          key,
          value as ESLintRuleValue,
        ])
      ),
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div
        style={{
          height: calculateHeight(pageHeight, headerHeight, footerHeight),
        }}
        className="overflow-y-auto pr-4 min-h-fit scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
      >
        <div
          className="space-y-6 pb-6"
          style={{
            height: calculateHeight(pageHeight, headerHeight, footerHeight),
          }}
        >
          <StepContainer>
            <LanguageStep
              onSelect={handleLanguageSelect}
              selected={config.language}
            />
          </StepContainer>

          <StepContainer>
            <FrameworkStep
              onSelect={handleFrameworkSelect}
              selected={config.framework}
            />
          </StepContainer>

          <StepContainer>
            <VersionStep
              onSelect={handleVersionSelect}
              selected={config.eslintVersion}
            />
          </StepContainer>

          <StepContainer>
            <RulesStep
              onSelect={handleRulesSelect}
              selectedRules={config.rules}
            />
          </StepContainer>
        </div>
      </div>

      <div className="lg:sticky lg:top-4">
        <StepContainer>
          <ConfigPreview config={config} />
        </StepContainer>
      </div>
    </div>
  );
}

// Memoized container component for better stability
const StepContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
    {children}
  </div>
);
