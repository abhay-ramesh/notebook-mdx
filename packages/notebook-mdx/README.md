# notebook-mdx

**Jupyter Notebook support for MDX via Remark and Rehype plugins**

A comprehensive solution for rendering Jupyter notebooks in MDX with authentic styling, syntax highlighting, and full cell type support.

## ✨ Features

- 🎯 **Authentic Jupyter styling** - Matches real Jupyter notebook appearance
- 🎨 **Syntax highlighting** - Full language support with Shiki
- 📊 **All cell types** - Code, markdown, and raw cells
- 🔧 **TypeScript ready** - Full type safety and IntelliSense
- ⚡ **Fast rendering** - Optimized for performance
- 🌐 **Multi-language** - Cell-level language detection
- 🖼️ **Image support** - PNG, JPEG, GIF, and SVG outputs

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

## 🔧 Configuration

### Plugin Options

```typescript
// Remark plugin options
remarkJupyter({
  executeCode: false,           // Don't execute code cells
  showCellNumbers: true,        // Show In[n]/Out[n] numbers
  showLanguageIndicators: true, // Show language badges
  languageMapping: {            // Custom language aliases
    'py': 'python',
    'js': 'javascript'
  }
})

// Rehype plugin options
rehypeJupyter({
  showCellNumbers: true,        // Show execution counts
  syntaxHighlighting: true,     // Enable syntax highlighting
  classPrefix: 'jupyter-'       // CSS class prefix
})
```

### Component Props

```typescript
// NotebookLoader
<NotebookLoader
  notebookData={parsedNotebook}
  showCellNumbers={true}
  showLanguageIndicators={true}
  className="custom-notebook"
/>

// NotebookCodeCell
<NotebookCodeCell
  source="print('Hello')"
  executionCount={1}
  language="python"
  outputs={outputs}
  showLanguageIndicator={true}
/>
```

## 📚 Documentation

For complete documentation, examples, and API reference:

**[View Documentation →](https://your-docs-url.com)**

## 🎯 Use Cases

- **Documentation sites** - Embed notebooks in your docs
- **Technical blogs** - Share code examples with outputs
- **Educational content** - Interactive learning materials
- **API documentation** - Live code examples
- **Data science** - Share analysis and visualizations

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  NotebookData, 
  CellData, 
  CellOutput, 
  CellMetadata 
} from 'notebook-mdx';
```

## 🎨 CSS Custom Properties

Customize styling with CSS variables:

```css
:root {
  --jp-input-prompt-color: #307FC1;
  --jp-output-prompt-color: #D84315;
  --jp-cell-border-color: #e0e0e0;
  --jp-code-font-family: 'SFMono-Regular', Consolas, monospace;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

---

**notebook-mdx** - Bring your Jupyter notebooks to life in MDX!
