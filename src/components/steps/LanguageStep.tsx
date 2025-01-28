"use client";

import { Language } from "@/types/config";

interface LanguageStepProps {
  onSelect: (language: Language) => void;
  selected: Language;
}

export default function LanguageStep({
  onSelect,
  selected,
}: LanguageStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Language</h2>
      <div className="flex gap-4">
        <button
          onClick={() => onSelect("javascript")}
          className={`px-4 py-2 rounded transition-colors ${
            selected === "javascript"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500 hover:text-white"
          }`}
        >
          JavaScript
        </button>
        <button
          onClick={() => onSelect("typescript")}
          className={`px-4 py-2 rounded transition-colors ${
            selected === "typescript"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500 hover:text-white"
          }`}
        >
          TypeScript
        </button>
      </div>
    </div>
  );
}
