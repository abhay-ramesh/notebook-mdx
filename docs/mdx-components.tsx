import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
} from "notebook-mdx";

// Direct import approach to avoid timing issues
const notebookComponents = {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ...notebookComponents
  } as MDXComponents;
}
