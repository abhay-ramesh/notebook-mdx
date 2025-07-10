// Main entry point - exports both client and server functionality
// Users should import from specific subpaths when possible:
// - "notebook-mdx/client" for React components
// - "notebook-mdx/server" for remark plugins

// Re-export everything from client (React components)
export * from "./client.js";

// Re-export everything from server (remark plugin)
export * from "./server.js";
