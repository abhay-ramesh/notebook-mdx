# notebook-mdx

A comprehensive solution for rendering Jupyter notebooks in MDX with authentic styling, syntax highlighting, and full cell type support.

## ✨ Features

- 🎯 **Authentic Jupyter styling** - Matches real Jupyter notebook appearance
- 🎨 **Syntax highlighting** - Full language support with Shiki
- 📊 **All cell types** - Code, markdown, and raw cells
- 🔧 **TypeScript ready** - Full type safety and IntelliSense
- ⚡ **Fast rendering** - Optimized for performance
- 🌐 **Multi-language** - Cell-level language detection
- 🖼️ **Image support** - PNG, JPEG, GIF, and SVG outputs

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) documentation app showcasing notebook-mdx features
- `notebook-mdx`: the main package providing Jupyter notebook support for MDX
- `@repo/ui`: shared React component library
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## 📦 Installation

```bash
npm install notebook-mdx
```

## 🚀 Quick Start

### 1. Configure Your MDX Pipeline

Add the plugins to your MDX configuration:

```typescript
import { remarkJupyter, rehypeJupyter } from 'notebook-mdx';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [remarkJupyter, { executeCode: false, showCellNumbers: true }],
    ],
    rehypePlugins: [[rehypeJupyter, { showCellNumbers: true }]],
  },
});
```

### 2. Import and Render Notebooks

```mdx
import { NotebookLoader, NotebookStyles } from 'notebook-mdx';
import notebookRaw from './my-notebook.ipynb';

<NotebookStyles />
<NotebookLoader notebookData={JSON.parse(notebookRaw)} />
```

### 3. Manual Cell Creation

```mdx
import { NotebookCodeCell, NotebookMarkdownCell, NotebookStyles } from 'notebook-mdx';

<NotebookStyles />

<NotebookCodeCell
  source="print('Hello from Python!')"
  executionCount={1}
/>

<NotebookMarkdownCell
  source="## This is a markdown cell"
/>
```

## 🎨 Authentic Styling

The package provides authentic Jupyter notebook styling that matches VSCode and Jupyter Lab:

- **Input prompts**: Blue `In [n]:` indicators
- **Output prompts**: Orange `Out[n]:` indicators  
- **Cell borders**: Subtle borders with hover effects
- **Monospace fonts**: System monospace fonts for code
- **Color scheme**: Authentic Jupyter color palette
- **Responsive design**: Works on all screen sizes

## 🌐 Multi-Language Support

Supports multiple programming languages with automatic detection:

```typescript
// Language detection hierarchy:
// 1. VSCode metadata (cell.metadata.vscode.languageId)
// 2. Cell metadata (cell.metadata.languageId)
// 3. Raw cells (always "raw")
// 4. Notebook kernel language (fallback)
```

### Build

To build all apps and packages, run the following command:

```bash
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```bash
pnpm dev
```

You can develop a specific package by using a filter:

```bash
pnpm dev --filter=docs
```

## 📚 Documentation

Visit the [documentation site](./apps/docs) for comprehensive examples and usage guides.

## 🎯 Use Cases

- **Documentation sites** - Embed notebooks in your docs
- **Technical blogs** - Share code examples with outputs
- **Educational content** - Interactive learning materials
- **API documentation** - Live code examples
- **Data science** - Share analysis and visualizations

## 📄 License

MIT License - see LICENSE file for details.

---

**notebook-mdx** - Bring your Jupyter notebooks to life in MDX!
