import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  target: "es2022",
  outDir: "dist",
  external: [
    // React and related - CRITICAL: Don't bundle React
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",

    // Peer dependencies - don't bundle these
    "rehype",
    "remark",
    "remark-directive",
    "unified",

    // Node built-ins
    "fs",
    "path",
    "util",
    "node:fs",
    "node:path",
    "node:util",

    // Large dependencies that should remain external
    "highlight.js",
    "katex",
    "plotly.js-dist-min"
  ],
  platform: "neutral", // Works in both Node.js and browser
  sourcemap: true,
  minify: false // Keep readable for debugging
});
