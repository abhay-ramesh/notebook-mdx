// Remark plugin to parse Jupyter notebooks
import type { Root } from "mdast";
import type { Plugin } from "unified";
import type { JupyterOptions } from "./types.js";

export const remarkJupyter: Plugin<[JupyterOptions?], Root> = (
  options = {},
) => {
  return (tree, file) => {
    // This plugin processes notebook-related content in MDX
    // For now, it's a pass-through plugin
    // The main notebook processing will happen via React components

    // Log when processing files for debugging
    if (file.path?.endsWith(".ipynb")) {
      console.log("Processing notebook file:", file.path);
    }

    return tree;
  };
};
