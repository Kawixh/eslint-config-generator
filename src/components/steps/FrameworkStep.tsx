"use client";

import { Framework } from "@/types/config";

interface FrameworkStepProps {
  onSelect: (framework: Framework) => void;
  selected: Framework;
}

export default function FrameworkStep({
  onSelect,
  selected,
}: FrameworkStepProps) {
  const frameworks: Framework[] = [
    "react",
    "next.js",
    "nest.js",
    "svelte",
    "none",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Framework</h2>
      <div className="flex flex-wrap gap-4">
        {frameworks.map((fw) => (
          <button
            key={fw}
            onClick={() => onSelect(fw)}
            className={`px-4 py-2 rounded transition-colors ${
              selected === fw
                ? "bg-blue-600 text-white"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {fw}
          </button>
        ))}
      </div>
    </div>
  );
}
