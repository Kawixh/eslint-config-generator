import type { NextConfig } from "next";
import ReactComponentName from "react-scan/react-component-name/webpack";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  webpack: (config) => {
    config.plugins.push(ReactComponentName({}));
    return config;
  },
};

export default nextConfig;
