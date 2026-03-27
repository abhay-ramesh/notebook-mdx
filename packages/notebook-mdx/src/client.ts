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

export {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
};

// Convenience object — spread into your MDX components map instead of importing 4 names
export const notebookComponents = {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles,
};

// Astro-specific: Astro lowercases hast node names when resolving MDX components,
// so PascalCase keys like NotebookLoader won't match. Use this in Astro MDX pages.
export const notebookComponentsAstro = {
  notebookloader: NotebookLoader,
  notebookcodecell: NotebookCodeCell,
  notebookmarkdowncell: NotebookMarkdownCell,
  notebookstyles: NotebookStyles,
};
