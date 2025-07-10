import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    client: "src/client.ts",
    server: "src/server.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
  sourcemap: false,
  target: "es2020",
  platform: "neutral",
  external: [
    // React and related - CRITICAL: Don't bundle React
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",

    // Peer dependencies - don't bundle these
    "remark",
    "remark-directive",
    "unified",

    // Node built-ins - CRITICAL for server/client separation
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
  // Use outExtensions for proper file extensions
  outExtensions: ({ format }) => ({
    js: format === "cjs" ? ".cjs" : ".js"
  }),
  outputOptions: {
    // Add "use client" directive to client-side components
    banner: (chunk) => {
      // Add "use client" to client entry and any components
      if (
        chunk.fileName.includes("client") ||
        chunk.fileName === "index.js" ||
        chunk.fileName === "index.cjs"
      ) {
        return '"use client";';
      }
      return "";
    }
  }
});
