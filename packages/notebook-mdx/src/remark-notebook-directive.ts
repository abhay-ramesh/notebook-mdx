import { readFileSync } from "fs";
import type { Root } from "mdast";
import { dirname, resolve } from "path";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export interface NotebookDirectiveOptions {
  /**
   * Base directory for resolving relative notebook paths
   * Defaults to the directory of the processed file
   */
  baseDir?: string;

  /**
   * Custom component name to use for rendering notebooks
   * Defaults to 'NotebookLoader'
   */
  componentName?: string;
}

const toBooleanProp = (value: string | undefined): boolean | undefined =>
  value !== undefined ? value === "true" || value === "" : undefined;

/**
 * Remark plugin to handle notebook directives
 * Requires remark-directive to be used before this plugin
 */
export const remarkNotebookDirective: Plugin<
  [NotebookDirectiveOptions?],
  Root
> = (options = {}) => {
  const { componentName = "NotebookLoader" } = options;

  return (tree: Root, file: VFile) => {
    visit(tree, (node: any) => {
      if (
        !["containerDirective", "leafDirective", "textDirective"].includes(
          node.type
        ) ||
        node.name !== "notebook"
      )
        return;

      if (node.type === "textDirective") {
        file.fail(
          "Unexpected `:notebook` text directive, use two colons for a leaf directive or three colons for a container directive",
          node
        );
      }

      const notebookPath = node.attributes?.file;
      if (!notebookPath) {
        file.fail(
          "Unexpected missing `file` attribute on `notebook` directive",
          node
        );
      }

      try {
        const baseDir =
          options.baseDir || (file.path ? dirname(file.path) : process.cwd());
        const resolvedNotebookPath = resolve(baseDir, notebookPath);

        // 🔥 Add VFile dependency tracking for hot reloading
        // This tells the build system that this file depends on the notebook file
        const fileData = file.data as any;
        if (!fileData.dependencies) {
          fileData.dependencies = [];
        }
        if (!fileData.dependencies.includes(resolvedNotebookPath)) {
          fileData.dependencies.push(resolvedNotebookPath);
        }

        // Also add to history for additional tracking support
        if (!file.history.includes(resolvedNotebookPath)) {
          file.history.push(resolvedNotebookPath);
        }

        const notebookContent = readFileSync(resolvedNotebookPath, "utf-8");
        const notebookData = JSON.parse(notebookContent);

        const { file: _file, ...attributes } = node.attributes || {};
        const componentProps: Record<string, any> = {
          notebookDataJson: JSON.stringify(notebookData),
          ...attributes
        };

        // Handle boolean props
        [
          "hideCode",
          "showOutputs",
          "showCellNumbers",
          "showLanguageIndicators",
          "interactive"
        ].forEach((key) => {
          const boolValue = toBooleanProp(attributes[key]);
          if (boolValue !== undefined) componentProps[key] = boolValue;
        });

        // Transform directive to MDX component
        const data = node.data || (node.data = {});
        data.hName = componentName;
        data.hProperties = componentProps;

        // Handle caption for container directives
        if (node.type === "containerDirective" && node.children?.length > 0) {
          componentProps.caption = node.children;
          node.children = [];
        }
      } catch (error) {
        file.fail(
          `Failed to process notebook file "${notebookPath}": ${error instanceof Error ? error.message : String(error)}`,
          node
        );
      }
    });
  };
};

export default remarkNotebookDirective;
