"use client";

import { useRulesStore } from "@/stores/rulesStore";
import { Octokit } from "@octokit/rest";
import { useEffect, useState } from "react";

interface VersionStepProps {
  onSelect: (version: string) => void;
  selected: string;
}

export default function VersionStep({ onSelect, selected }: VersionStepProps) {
  const [versions, setVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { rules, setRules } = useRulesStore();

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const octokit = new Octokit();
        const { data } = await octokit.repos.listTags({
          owner: "eslint",
          repo: "eslint",
          per_page: 10,
        });

        const stableVersions = data
          .map((tag) => tag.name.replace("v", ""))
          .filter(
            (version) =>
              !version.includes("alpha") &&
              !version.includes("beta") &&
              !version.includes("rc")
          );

        setVersions(stableVersions);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch ESLint versions");
        setLoading(false);
        console.error("Error fetching versions:", error);
      }
    };

    fetchVersions();
  }, []);

  const fetchRulesForVersion = async (version: string) => {
    try {
      setLoading(true);

      // Try new path structure first
      let response = await fetch(
        `https://raw.githubusercontent.com/eslint/eslint/v${version}/packages/js/src/rules/index.js`
      );

      if (!response.ok) {
        // Try alternative path
        response = await fetch(
          `https://raw.githubusercontent.com/eslint/eslint/v${version}/packages/eslint-core/src/rules/index.js`
        );
      }

      if (!response.ok) {
        // Try legacy path
        response = await fetch(
          `https://raw.githubusercontent.com/eslint/eslint/v${version}/lib/rules/index.js`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch rules");
      }

      const rulesText = await response.text();
      const ruleNames = extractRuleNames(rulesText);
      const rulesData = await fetchRulesMetadata(version, ruleNames);

      // Keep existing plugin rules and add/update core rules
      const existingPluginRules = rules.filter((rule) =>
        rule.name.includes("/")
      );
      const coreRules = rulesData.map((rule) => ({
        ...rule,
        category: "ESLint Core",
      }));

      setRules([...existingPluginRules, ...coreRules]);
      onSelect(version);
    } catch (error) {
      setError("Failed to fetch ESLint rules");
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractRuleNames = (rulesText: string): string[] => {
    const ruleMatches =
      rulesText.match(/["']([\w-]+)["']:\s*(?:require|rule)/g) || [];
    return ruleMatches
      .map((match) => match.match(/["']([\w-]+)["']/)?.[1])
      .filter((name): name is string => Boolean(name));
  };

  const fetchRulesMetadata = async (version: string, ruleNames: string[]) => {
    const rulePaths = [
      `packages/js/src/rules/`,
      `packages/eslint-core/src/rules/`,
      `lib/rules/`,
    ];

    const rulesData = await Promise.all(
      ruleNames.map(async (ruleName) => {
        for (const path of rulePaths) {
          try {
            const response = await fetch(
              `https://raw.githubusercontent.com/eslint/eslint/v${version}/${path}${ruleName}.js`
            );

            if (response.ok) {
              const content = await response.text();
              const metadata = extractMetadata(content, ruleName);
              if (metadata) return metadata;
            }
          } catch {
            continue;
          }
        }

        // Return basic metadata if all attempts fail
        return {
          name: ruleName,
          description: "No description available",
          category: "other",
          schema: [],
          fixable: false,
          recommended: false,
        };
      })
    );

    return rulesData;
  };

  const extractMetadata = (content: string, ruleName: string) => {
    try {
      const metaMatch = content.match(/meta:\s*({[\s\S]*?})[,\n]/);
      if (!metaMatch) return null;

      const metaString = metaMatch[1]
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
        .replace(/,(\s*[}\]])/g, "$1")
        .replace(/`[\s\S]*?`/g, '""');

      const metadata = JSON.parse(metaString);

      return {
        name: ruleName,
        description: metadata.docs?.description || "No description available",
        category: metadata.docs?.category || "other",
        schema: metadata.schema || [],
        fixable: !!metadata.fixable,
        recommended: !!metadata.docs?.recommended,
        type: metadata.type || "suggestion",
      };
    } catch {
      return null;
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Select ESLint Version</h2>
        <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select ESLint Version</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {versions.map((version) => (
            <button
              key={version}
              onClick={() => fetchRulesForVersion(version)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selected === version
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500 hover:text-white"
              }`}
              disabled={loading}
            >
              {version}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
