import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  NotebookCodeCell,
  NotebookLoader,
  NotebookMarkdownCell,
  NotebookStyles
} from "notebook-mdx";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    // Add jupyter components directly
    NotebookCodeCell,
    NotebookLoader,
    NotebookMarkdownCell,
    NotebookStyles
  } as MDXComponents;
}
