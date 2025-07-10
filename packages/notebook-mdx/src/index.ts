// Export components
export {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
} from "./components.js";

// Main plugin export - the only thing users need to import
export { remarkNotebookDirective } from "./remark-notebook-directive.js";
export type { NotebookDirectiveOptions } from "./remark-notebook-directive.js";

// Export essential types for TypeScript users
export type {
  JupyterOptions,
  NotebookCell,
  NotebookData,
  NotebookMetadata,
  NotebookOutput
} from "./types.js";

// Helper for easier MDX component setup
import {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
} from "./components.js";

/**
 * All notebook components in one object for easy spreading in mdx-components.tsx
 * Usage: ...notebookComponents
 */
export const notebookComponents = {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
};
