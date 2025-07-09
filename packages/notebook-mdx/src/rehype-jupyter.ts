// Rehype plugin to transform Jupyter notebook elements
import type { Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { JupyterOptions } from "./types.js";

export const rehypeJupyter: Plugin<[JupyterOptions?], Root> = (
  options = {}
) => {
  return (tree) => {
    visit(tree, "element", (node) => {
      // Transform notebook-specific elements
      if (node.tagName === "NotebookCodeCell") {
        // Convert custom elements to proper JSX
        node.tagName = "div";
        node.properties = {
          ...node.properties,
          className: "notebook-code-cell"
        };
      }
    });
  };
};
