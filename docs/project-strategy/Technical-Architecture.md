# notebook-mdx Technical Architecture

## 🏗️ System Overview

notebook-mdx is a dual-package system that processes Jupyter notebooks at build time and renders them with React components at runtime, providing authentic Jupyter styling with optimal web performance.

## 📊 Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Build Time    │    │   MDX Processing │    │   Runtime       │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ .ipynb file │ │───▶│ │ Remark Plugin│ │───▶│ │ React       │ │
│ └─────────────┘ │    │ │ Processing   │ │    │ │ Components  │ │
│                 │    │ └──────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ .mdx files  │ │───▶│ │ Directive    │ │───▶│ │ Styled      │ │
│ └─────────────┘ │    │ │ Transform    │ │    │ │ Notebook    │ │
│                 │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Core Components

### 1. Remark Plugin (`remark-notebook-directive.ts`)

**Responsibility**: Transform `:::notebook{}` directives into React components during MDX compilation

**Key Features**:

- Parses notebook files at build time
- Extracts and validates directive options
- Tracks file dependencies for hot reload
- Transforms directives to JSX elements

**Technical Implementation**:

```typescript
export const remarkNotebookDirective: Plugin<[NotebookDirectiveOptions?], Root> = (options = {}) => {
  return (tree: Root, file: VFile) => {
    visit(tree, (node: any) => {
      // Process :::notebook{} directives
      // Read and parse .ipynb files
      // Transform to React component calls
    });
  };
};
```

### 2. React Components (`components.tsx`)

**Core Components**:

- `NotebookLoader` - Main container component
- `NotebookCodeCell` - Individual code cell rendering
- `NotebookMarkdownCell` - Markdown cell rendering  
- `NotebookStyles` - CSS-in-JS styling system

**Component Hierarchy**:

```
NotebookLoader
├── NotebookStyles (CSS injection)
├── NotebookCodeCell[]
│   ├── CodeHighlighter (highlight.js)
│   ├── OutputRenderer
│   └── CopyButton
└── NotebookMarkdownCell[]
    └── MarkdownRenderer
```

### 3. Type System (`types.ts`)

**Key Interfaces**:

```typescript
interface NotebookData {
  cells: NotebookCell[];
  metadata: NotebookMetadata;
  nbformat: number;
  nbformat_minor: number;
}

interface NotebookCell {
  cell_type: 'code' | 'markdown' | 'raw';
  source: string | string[];
  outputs?: NotebookOutput[];
  execution_count?: number | null;
}
```

## 🔄 Data Flow

### Build-Time Processing

1. **MDX Compilation** starts
2. **Remark Plugin** encounters `:::notebook{file="path.ipynb"}`
3. **File Reading** - Synchronously read notebook file
4. **JSON Parsing** - Parse notebook content
5. **Dependency Tracking** - Add to build dependencies
6. **Component Transform** - Convert to `<NotebookLoader notebookDataJson={...} />`

### Runtime Rendering

1. **Component Mount** - `NotebookLoader` receives parsed data
2. **Cell Processing** - Filter and sort cells based on options
3. **Language Detection** - Determine syntax highlighting language
4. **Style Injection** - Apply Jupyter CSS classes
5. **Progressive Rendering** - Render cells with syntax highlighting

## 📦 Package Structure

### Modular Exports

```
notebook-mdx/
├── /           - Main export (client + server)
├── /client     - React components only
├── /server     - Remark plugin only (Node.js)
└── /types      - TypeScript definitions
```

### Bundle Optimization

**Client Bundle** (~10KB):

- React components
- highlight.js integration
- CSS styles
- Type definitions

**Server Bundle** (~5KB):

- Remark plugin
- File system utilities
- Notebook parsing
- Dependency tracking

## 🎨 Styling Architecture

### CSS-in-JS Approach

```typescript
const NotebookStyles = () => (
  <style jsx global>{`
    .jp-notebook {
      /* Jupyter Lab styling */
    }
    .jp-cell {
      /* Cell container styling */
    }
    .jp-input-output {
      /* Input/output styling */
    }
  `}</style>
);
```

### Theme Integration

- **CSS Custom Properties** for theme variables
- **Framework-agnostic** styling approach
- **Dark/Light mode** automatic detection
- **Override-friendly** class structure

## ⚡ Performance Optimizations

### Build-Time Optimizations

1. **Synchronous File Reading** - No async overhead during build
2. **JSON Caching** - Parse notebooks once per build
3. **Dependency Tracking** - Efficient hot reload
4. **Bundle Splitting** - Separate client/server code

### Runtime Optimizations

1. **useMemo** - Cache syntax highlighting results
2. **Lazy Loading** - Optional progressive cell loading
3. **Virtual Scrolling** - For large notebooks (future)
4. **Code Splitting** - Dynamic highlight.js language loading

## 🔌 Framework Integration

### MDX Configuration Pattern

```typescript
// next.config.js
import { remarkNotebookDirective } from 'notebook-mdx/server';

export default {
  remarkPlugins: [
    remarkDirective,
    remarkNotebookDirective,
  ],
};
```

### Component Registration

```typescript
// mdx-components.tsx
import { NotebookLoader, NotebookCodeCell, NotebookMarkdownCell, NotebookStyles } from 'notebook-mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    NotebookLoader,
    NotebookCodeCell,
    NotebookMarkdownCell,
    NotebookStyles,
  };
}
```

## 🛡️ Error Handling Strategy

### Build-Time Errors

- **File Not Found** - Clear path resolution errors
- **Invalid JSON** - Notebook parsing error details
- **Missing Attributes** - Required directive options

### Runtime Errors

- **Graceful Degradation** - Show error boundary with details
- **Development Hints** - Helpful error messages in dev mode
- **Performance Monitoring** - Track render failures

## 🔮 Extensibility Architecture

### Plugin System (Future)

```typescript
interface NotebookPlugin {
  name: string;
  transform: (cell: NotebookCell) => NotebookCell;
  render?: (cell: NotebookCell) => ReactNode;
}
```

### Custom Renderers

```typescript
interface CustomRenderers {
  codeCell?: ComponentType<CodeCellProps>;
  markdownCell?: ComponentType<MarkdownCellProps>;
  output?: ComponentType<OutputProps>;
}
```

## 📊 Performance Metrics

### Target Benchmarks

- **Bundle Size**: <50KB gzipped total
- **Parse Time**: <10ms per notebook
- **Render Time**: <100ms for 20-cell notebook
- **Memory Usage**: <10MB heap per notebook

### Monitoring Strategy

- **Build-time metrics** via bundler plugins
- **Runtime performance** via React Profiler
- **Bundle analysis** via webpack-bundle-analyzer
- **User metrics** via optional analytics

---

**Document Owner**: Abhay Ramesh  
**Last Updated**: July 10, 2025  
**Version**: 1.0  
**Status**: Active Development
