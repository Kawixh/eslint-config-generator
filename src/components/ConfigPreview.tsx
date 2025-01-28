"use client";

import { useElementHeightStore } from "@/store/headerStore";
import { ConfigOptions } from "@/types/config";
import { getTheme } from "@/utils/check-theme";
import { calculateHeight } from "@/utils/height";
import { Editor } from "@monaco-editor/react";

interface ConfigPreviewProps {
  config: ConfigOptions;
}

export default function ConfigPreview({ config }: ConfigPreviewProps) {
  const pageHeight = useElementHeightStore((state) => state.pageHeight);
  const headerHeight = useElementHeightStore((state) =>
    state.getHeight("header")
  );
  const footerHeight = useElementHeightStore((state) =>
    state.getHeight("footer")
  );

  const generateConfig = () => {
    const baseExtends = ["eslint:recommended"];
    if (config.language === "typescript") {
      baseExtends.push(
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
      );
    }

    if (config.framework === "next.js") {
      baseExtends.push("next/core-web-vitals");
    }

    if (config.framework === "react") {
      baseExtends.push(
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
      );
    }

    const eslintConfig = {
      root: true,
      extends: baseExtends,
      parser:
        config.language === "typescript" ? "@typescript-eslint/parser" : null,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ...(config.language === "typescript" && {
          project: "./tsconfig.json",
        }),
      },
      plugins: [],
      rules: config.rules,
    };

    return JSON.stringify(eslintConfig, null, 2);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Live Preview</h2>
      <div
        className="border rounded"
        style={{
          height: calculateHeight(pageHeight, headerHeight, footerHeight),
        }}
      >
        <Editor
          height="100%"
          defaultLanguage="json"
          value={generateConfig()}
          options={{
            minimap: { enabled: false },
            readOnly: true,
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          theme={getTheme() || "dark"}
        />
      </div>
    </div>
  );
}
