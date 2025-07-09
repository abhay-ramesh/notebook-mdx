# notebook-mdx

A powerful library for rendering Jupyter notebooks in MDX with full support for code execution, rich outputs, and interactive features.

## Quick Setup

### 1. Install

```bash
npm install notebook-mdx remark-directive
```

### 2. Configure MDX Components (Automatic)

Instead of manually importing each component, use this pattern in your `mdx-components.tsx`:

```typescript
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  notebookComponents
} from "notebook-mdx";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ...notebookComponents, // Automatically includes all notebook components
  } as MDXComponents;
}
```

### 3. Configure Remark Plugin

```typescript
import { remarkNotebookDirective } from 'notebook-mdx';
import remarkDirective from 'remark-directive';

// In your MDX configuration
const mdxOptions = {
  remarkPlugins: [
    remarkDirective,
    remarkNotebookDirective
  ]
};
```

### 4. Use in MDX

```mdx
<NotebookStyles />

:::notebook{file="./example.ipynb" cells="1-5" showCellNumbers}
This is a caption for the notebook
:::
```

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 📱 **Responsive Design** - Adapts beautifully to all screen sizes  
- 🎨 **Theme Adaptive** - Automatically inherits your site's theme colors
- ⚡ **High Performance** - Optimized rendering with code splitting
- 🔧 **Highly Customizable** - Extensive configuration options
- 📖 **Directive Syntax** - Clean MDX integration with remark-directive
