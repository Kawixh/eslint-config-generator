"use client";

import { useRulesStore } from "@/stores/rulesStore";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

interface Rule {
  name: string;
  description: string;
  category: string;
  schema: Record<string, unknown>[];
  fixable: boolean;
  recommended: boolean;
}

export type RuleValue = "off" | "warn" | "error";

interface RulesStepProps {
  onSelect: (rules: Record<string, RuleValue>) => void;
  selectedRules: Record<string, RuleValue>;
}

const PLUGIN_RULES: Record<string, string> = {
  react:
    "https://raw.githubusercontent.com/jsx-eslint/eslint-plugin-react/master/lib/rules/index.js",
  "@typescript-eslint":
    "https://raw.githubusercontent.com/typescript-eslint/typescript-eslint/main/packages/eslint-plugin/src/rules/index.ts",
  "jsx-a11y":
    "https://raw.githubusercontent.com/jsx-eslint/eslint-plugin-jsx-a11y/main/src/index.js",
  "@next/next":
    "https://raw.githubusercontent.com/vercel/next.js/canary/packages/eslint-plugin-next/src/index.js",
  import:
    "https://raw.githubusercontent.com/import-js/eslint-plugin-import/main/src/index.js",
  "react-hooks":
    "https://raw.githubusercontent.com/facebook/react/main/packages/eslint-plugin-react-hooks/src/index.js",
};

export default function RulesStep({ onSelect, selectedRules }: RulesStepProps) {
  const { rules, setRules } = useRulesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlugin, setSelectedPlugin] = useState<string>("all");
  const [displayedRules, setDisplayedRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);

  // Move the filter logic to a separate function
  const filterRules = useCallback(
    (query: string, plugin: string) => {
      const filtered = rules.filter((rule) => {
        const matchesSearch =
          rule.name.toLowerCase().includes(query.toLowerCase()) ||
          rule.description.toLowerCase().includes(query.toLowerCase());
        const matchesPlugin = plugin === "all" || rule.name.startsWith(plugin);
        return matchesSearch && matchesPlugin;
      });

      return query ? filtered : filtered.slice(0, 10);
    },
    [rules]
  );

  // Create a stable debounced function
  const debouncedSearch = useCallback(
    debounce((query: string, plugin: string) => {
      const filtered = filterRules(query, plugin);
      setDisplayedRules(filtered);
    }, 300),
    [filterRules, setDisplayedRules]
  );

  // Update the effect to use the stable debounced function
  useEffect(() => {
    debouncedSearch(searchQuery, selectedPlugin);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, selectedPlugin, debouncedSearch]);

  const fetchAllRules = useCallback(async () => {
    try {
      setLoading(true);
      const allRules: Rule[] = [];
      const addedRuleNames = new Set<string>();

      const coreResponse = await fetch(
        "https://raw.githubusercontent.com/eslint/eslint/main/packages/js/src/configs/eslint-all.js"
      );

      if (coreResponse.ok) {
        const coreText = await coreResponse.text();
        const rulesMatch = coreText.match(/rules:\s*({[\s\S]*?})[,\n]/);
        if (rulesMatch) {
          const rulesText = rulesMatch[1]
            .replace(/'/g, '"')
            .replace(/,(\s*[}\]])/g, "$1")
            .replace(/:\s*\[.*?\]/g, ': "error"');
          try {
            const rulesObject = JSON.parse(rulesText);
            const coreRules = Object.keys(rulesObject).map((name) => ({
              name,
              description: getRuleDescription(name),
              category: "ESLint Core",
              schema: [],
              fixable: false,
              recommended: false,
            }));
            allRules.push(...coreRules);
            coreRules.forEach((rule) => addedRuleNames.add(rule.name));
          } catch (e) {
            console.error("Error parsing core rules:", e);
          }
        }
      }

      for (const [plugin, baseUrl] of Object.entries(PLUGIN_RULES)) {
        try {
          const dirResponse = await fetch(baseUrl);
          if (dirResponse.ok) {
            const dirText = await dirResponse.text();
            const ruleNames = dirText
              .match(/["']([\w-]+)["']/g)
              ?.map((rule) => rule.replace(/["']/g, ""));
            ruleNames?.forEach((name) => {
              if (name !== "index") {
                const fullRuleName = `${plugin}/${name}`;
                // Only add if we haven't seen this rule name before
                if (!addedRuleNames.has(fullRuleName)) {
                  allRules.push({
                    name: fullRuleName,
                    description: getRuleDescription(fullRuleName),
                    category: plugin,
                    schema: [],
                    fixable: false,
                    recommended: false,
                  });
                  addedRuleNames.add(fullRuleName);
                }
              }
            });
          }
        } catch (error) {
          console.error(`Error fetching ${plugin} rules:`, error);
        }
      }

      setRules(allRules);
      setDisplayedRules(allRules.slice(0, 10));
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  }, [setRules, setDisplayedRules, setLoading]);

  useEffect(() => {
    fetchAllRules();
  }, [fetchAllRules]);

  const getRuleDescription = (ruleName: string) => {
    const descriptions: Record<string, string> = {
      "no-unused-vars": "Disallow unused variables",
      "react/jsx-key": "Detect missing key prop",
      "@typescript-eslint/no-explicit-any": "Disallow usage of the any type",
    };
    return descriptions[ruleName] || "No description available.";
  };

  // Add function to find duplicate rules
  const getDuplicatePlugins = (ruleName: string) => {
    const baseName = ruleName.split("/").pop() || "";
    const plugins = rules
      .filter((r) => r.name.endsWith(`/${baseName}`))
      .map((r) => r.category);

    return plugins.length >= 2 ? plugins : [];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search rules by name or description..."
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <select
          value={selectedPlugin}
          onChange={(e) => setSelectedPlugin(e.target.value)}
          className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="all">All Plugins</option>
          {Object.keys(PLUGIN_RULES).map((plugin) => (
            <option key={plugin} value={plugin}>
              {plugin}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {displayedRules.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {loading ? "Loading rules..." : "No rules found"}
          </p>
        ) : (
          displayedRules.map((rule) => {
            const duplicatePlugins = getDuplicatePlugins(rule.name);
            const uniqueKey = `${rule.category}-${rule.name}`;
            return (
              <div
                key={uniqueKey}
                className="p-4 rounded-lg border dark:border-gray-700 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {rule.description}
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <select
                      value={selectedRules[rule.name] || "off"}
                      onChange={(e) => {
                        const value = e.target.value as RuleValue;
                        onSelect({
                          ...selectedRules,
                          [rule.name]: value,
                        });
                      }}
                      className="px-2 py-1 text-sm rounded border dark:border-gray-700 dark:bg-gray-800"
                    >
                      <option value="off">Off</option>
                      <option value="warn">Warn</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                    {rule.category}
                  </span>
                  {duplicatePlugins.length >= 2 && (
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      Also in:{" "}
                      {duplicatePlugins
                        .filter((p) => p !== rule.category)
                        .join(", ")}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        {rules.length > displayedRules.length && (
          <button
            onClick={() =>
              setDisplayedRules(rules.slice(0, displayedRules.length + 10))
            }
            className="w-full py-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Load more rules...
          </button>
        )}
      </div>
    </div>
  );
}
