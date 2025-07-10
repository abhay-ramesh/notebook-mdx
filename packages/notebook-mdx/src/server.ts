// Server-side Node.js only
// This file uses Node.js APIs like fs and should not be bundled for the browser

// Main plugin export - the only thing users need to import for MDX processing
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
