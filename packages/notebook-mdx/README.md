# notebook-mdx

A powerful remark plugin for rendering Jupyter notebooks in MDX with full support for code execution, rich outputs, and interactive features.

## Quick Setup

### 1. Install

```bash
npm install notebook-mdx remark-directive
```

### 2. Configure Your MDX Setup

Add the remark plugin to your MDX configuration:

```typescript
// next.config.js or mdx.config.js
import remarkDirective from 'remark-directive';
import { remarkNotebookDirective } from 'notebook-mdx';

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkDirective,
      remarkNotebookDirective,
    ],
  },
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
});
```

### 3. Use in Your MDX Files

That's it! Now you can use notebook directives directly in your MDX:

```mdx
# My Article

:::notebook{file="./example.ipynb" cells="1-5" showCellNumbers}
This notebook shows data analysis results
:::

More content here...

:::notebook{file="./demo.ipynb" hideCode showOutputs}
Another notebook with different options
:::
```

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 📱 **Responsive Design** - Adapts beautifully to all screen sizes  
- 🎨 **Theme Adaptive** - Automatically inherits your site's theme colors
- ⚡ **High Performance** - Optimized rendering with syntax highlighting
- 🔧 **Highly Customizable** - Extensive configuration options
- 📖 **Clean Directive Syntax** - Simple MDX integration

## Directive Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `file` | `string` | **Required** | Path to the notebook file |
| `cells` | `string` | `undefined` | Specific cells to show (e.g., "1-5", "1,3,5") |
| `hideCode` | `boolean` | `false` | Hide code cells |
| `showOutputs` | `boolean` | `true` | Show cell outputs |
| `showCellNumbers` | `boolean` | `false` | Show cell numbers |
| `showLanguageIndicators` | `boolean` | `false` | Show language indicators |
| `interactive` | `boolean` | `false` | Enable interactive execution |
| `theme` | `string` | `undefined` | Theme for syntax highlighting |
| `className` | `string` | `undefined` | CSS class name |
| `width` | `string` | `undefined` | Container width |
| `height` | `string` | `undefined` | Container height |

## Usage Examples

### Basic Usage

```mdx
:::notebook{file="./example.ipynb"}
:::
```

### With Options

```mdx
:::notebook{file="./analysis.ipynb" cells="1-10" hideCode showCellNumbers}
This notebook shows our data analysis results
:::
```

### Selective Cells

```mdx
:::notebook{file="./demo.ipynb" cells="3,5,7-9"}
:::
```

### Interactive Mode

```mdx
:::notebook{file="./interactive.ipynb" interactive}
Try running the cells yourself!
:::
```

## Configuration

You can configure the plugin behavior:

```typescript
import { remarkNotebookDirective } from 'notebook-mdx';

// With options
remarkPlugins: [
  remarkDirective,
  [remarkNotebookDirective, {
    baseDir: './notebooks',
    componentName: 'CustomNotebookLoader'
  }]
]
```

### Plugin Options

- `baseDir`: Base directory for resolving relative notebook paths
- `componentName`: Custom component name for rendering (default: 'NotebookLoader')

## How It Works

1. **Remark Plugin**: Processes `:::notebook` directives in your MDX
2. **Automatic Loading**: Reads and parses notebook files at build time
3. **Component Injection**: Transforms directives into React components
4. **Seamless Rendering**: Displays notebooks with authentic Jupyter styling

No manual component imports needed - everything works automatically through the remark plugin!

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
  NotebookDirectiveOptions,
  NotebookData,
  NotebookCell 
} from 'notebook-mdx';
```

## License

MIT
