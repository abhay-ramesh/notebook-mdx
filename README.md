# notebook-mdx

A comprehensive solution for rendering Jupyter notebooks in MDX with support for syntax highlighting, cell types, and authentic Jupyter styling.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) documentation app showcasing notebook-mdx features
- `notebook-mdx`: the main package providing Jupyter notebook support for MDX
- `@repo/ui`: shared React component library
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Quick Start

### Installation

```bash
npm install notebook-mdx
```

### Basic Usage

```typescript
import { remarkJupyter, rehypeJupyter } from 'notebook-mdx';

// Configure in your MDX pipeline
const mdxOptions = {
  remarkPlugins: [remarkJupyter],
  rehypePlugins: [rehypeJupyter],
};
```

```mdx
<!-- In your .mdx files -->
import { NotebookLoader, NotebookStyles } from 'notebook-mdx';
import notebookRaw from './my-notebook.ipynb';

<NotebookStyles />
<NotebookLoader notebook={notebookRaw} />
```

## Features

- 🎯 **Authentic Jupyter styling** - Matches real Jupyter notebook appearance
- 🎨 **Syntax highlighting** - Full language support with Shiki
- 📊 **All cell types** - Code, markdown, and raw cells
- 🔧 **TypeScript ready** - Full type safety and IntelliSense
- ⚡ **Fast rendering** - Optimized for performance
- 🎪 **Extensible** - Plugin-based architecture

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

## Documentation

Visit the [documentation site](./apps/docs) for comprehensive examples and usage guides.

## License

MIT
