# Contributing to notebook-mdx

Thank you for your interest in contributing to notebook-mdx! 🎉 We welcome all contributions, from bug reports to feature implementations.

## 🚀 Quick Start

1. **Fork and clone** the repository
2. **Install dependencies**: `pnpm install`
3. **Start development**: `pnpm dev`
4. **Make your changes**
5. **Test your changes**: `pnpm test`
6. **Submit a pull request**

## 📋 Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/notebook-mdx.git
cd notebook-mdx

# Install dependencies
pnpm install

# Start the docs site for development
pnpm docs:dev
```

### Project Structure

```
notebook-mdx/
├── packages/
│   └── notebook-mdx/          # Main package
├── tooling/
├── docs/                      # Documentation site
└── .github/                   # GitHub templates & workflows
```

## 🛠 Development Workflow

### Available Scripts

```bash
# Development
pnpm dev                       # Start all development servers
pnpm docs:dev                  # Start only documentation site

# Building
pnpm build                     # Build all packages
pnpm package:build             # Build only the main package

# Testing
pnpm test                      # Run tests
pnpm package:test             # Test only the main package

# Code Quality
pnpm lint                     # Lint all code
pnpm lint:fix                 # Fix linting issues
pnpm type-check              # TypeScript type checking
pnpm format                  # Format code with Prettier
```

### Making Changes

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run tests**: `pnpm test`
6. **Commit** with a [conventional commit](#commit-guidelines) message
7. **Push** and create a pull request

## 📝 Commit Guidelines

We use [Conventional Commits](https://conventionalcommits.org/) for consistent commit messages:

```
<type>(<scope>): <subject>

- <description of changes>
- <more details if needed>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(notebook): add support for custom cell renderers

- Allow users to provide custom cell components
- Update TypeScript types
- Add documentation and examples

fix(styles): resolve CSS conflicts with host styles

- Scope notebook styles more specifically
- Fix z-index issues with overlays
```

## 🧪 Testing

We use a comprehensive testing strategy:

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test component interactions
- **E2E tests**: Test full user workflows (coming soon)

### Writing Tests

```typescript
import { render } from '@testing-library/react';
import { NotebookLoader } from '../src';

describe('NotebookLoader', () => {
  it('should render notebook cells', () => {
    const notebook = {
      cells: [
        {
          cell_type: 'code',
          source: ['print("Hello, World!")'],
          outputs: []
        }
      ]
    };
    
    const { getByText } = render(
      <NotebookLoader notebookData={notebook} />
    );
    
    expect(getByText('print("Hello, World!")')).toBeInTheDocument();
  });
});
```

## 📖 Documentation

- **README updates**: Update relevant README files
- **API docs**: Document new props, methods, or components
- **Examples**: Add examples for new features
- **Migration guides**: For breaking changes

### Documentation Sites

- **Main docs**: `apps/docs/` - Built with Fumadocs
- **Package README**: `packages/notebook-mdx/README.md`
- **Root README**: `README.md`

## 🎯 Areas for Contribution

### High-Impact Areas

1. **Performance Optimization**
   - Bundle size reduction
   - Rendering performance
   - Memory usage optimization

2. **Browser Compatibility**
   - Testing in different browsers
   - Polyfill management
   - Accessibility improvements

3. **Framework Integration**
   - Next.js optimizations
   - Docusaurus plugin
   - Astro support
   - SvelteKit integration

4. **Notebook Features**
   - More cell types support
   - Interactive widgets
   - Plotly/Bokeh support
   - Custom output formats

### Beginner-Friendly Issues

Look for issues labeled:

- `good first issue`
- `help wanted`
- `documentation`

## 📊 Release Process

Releases are handled by maintainers:

1. **Version update**: Update version in `packages/notebook-mdx/package.json`
2. **Create release**: Create a GitHub release with tag (e.g., `v1.0.0`)
3. **Automated publishing**: GitHub Actions will automatically publish to NPM
4. **Documentation**: Release notes are generated automatically

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Credit others for their contributions

## 💡 Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs or request features
- **Discord**: (Coming soon) Real-time community chat

## 🏆 Recognition

Contributors are recognized in:

- README contributors section
- Release notes
- GitHub contributors graph
- Special mentions for significant contributions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making notebook-mdx better! 🙏
