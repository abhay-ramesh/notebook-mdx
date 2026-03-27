// Server-side Node.js only
// This file uses Node.js APIs like fs and should not be bundled for the browser

// Recommended: single plugin, no need to install remark-directive separately
export { remarkNotebook } from "./remark-notebook-directive.js";

// Advanced: use this if you need to control plugin order manually (requires remark-directive peer)
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
