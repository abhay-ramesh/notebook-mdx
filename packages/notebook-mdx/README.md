# notebook-mdx

**Jupyter Notebook support for MDX via Remark and Rehype plugins**

## Installation

```bash
npm install notebook-mdx
```

## Usage

### Basic Setup

Add the plugins to your MDX pipeline:

```typescript
import { remarkJupyter, rehypeJupyter } from 'notebook-mdx';
```

### With Fumadocs

```typescript
// source.config.ts
import { defineConfig } from 'fumadocs-mdx/config';
import { remarkJupyter, rehypeJupyter } from 'notebook-mdx';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [remarkJupyter, { executeCode: false }],
    ],
    rehypePlugins: [
      [rehypeJupyter, { showCellNumbers: true }],
    ],
  },
});
```

### With Next.js + MDX

```javascript
// next.config.js
import { remarkJupyter, rehypeJupyter } from 'notebook-mdx';

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkJupyter],
    rehypePlugins: [rehypeJupyter],
  },
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx', 'ipynb'],
});
```

### Components

```tsx
// mdx-components.tsx
import { JupyterComponents } from 'notebook-mdx';

export function getMDXComponents(components) {
  return {
    ...components,
    ...JupyterComponents,
  };
}
```

## Features

- ✅ Parse `.ipynb` files directly in MDX
- ✅ Render code cells with syntax highlighting
- ✅ Display outputs (text, HTML, images)
- ✅ Show execution counts
- ✅ Customizable components
- 🚧 Code execution during build (coming soon)
- 🚧 Interactive widgets (coming soon)

## API

### remarkJupyter(options)

Remark plugin to parse Jupyter notebooks.

#### Options

- `executeCode` (boolean): Whether to execute code cells during build
- `showCellNumbers` (boolean): Whether to show cell execution numbers

### rehypeJupyter(options)

Rehype plugin to transform notebook elements.

### JupyterComponents

React components for rendering notebook elements:

- `NotebookCodeCell`: Renders code cells with outputs
- `NotebookOutput`: Renders individual outputs

## Example

```mdx
# My Analysis

Here's my data analysis notebook:

import MyNotebook from './analysis.ipynb';

<MyNotebook />
```

## License

MIT
