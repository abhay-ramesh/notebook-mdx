"use client";

// Client-side React components only
// This file should be imported with "use client" directive

import {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
} from "./components.js";

// Export essential types for TypeScript users
export type {
  JupyterOptions,
  NotebookCell,
  NotebookData,
  NotebookMetadata,
  NotebookOutput
} from "./types.js";

// Helper for easier MDX component setup
export {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
};
