# Deployment Guide

This guide covers deploying the documentation site to Vercel and publishing the package to NPM.

## 📖 Documentation Site (Vercel)

### Prerequisites

- [Vercel account](https://vercel.com)
- GitHub repository connected to Vercel

### Setup

1. **Connect Repository to Vercel**

   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Connect project
   vercel link
   ```

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/docs`
   - **Build Command**: `cd ../.. && pnpm build --filter=docs`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `cd ../.. && pnpm install`

3. **Environment Variables**
   No special environment variables needed for the basic setup.

### Automatic Deployments

Vercel will automatically deploy:

- **Production**: When you push to `main` branch
- **Preview**: When you create pull requests

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `notebook-mdx.your-domain.com`)
4. Update DNS records as instructed

## 📦 NPM Package Publishing

### Prerequisites

- [NPM account](https://www.npmjs.com)
- NPM token with publish permissions

### Setup NPM Token

1. **Create NPM Token**

   ```bash
   npm login
   npm token create --type=automation
   ```

2. **Add to GitHub Secrets**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add new secret: `NPM_TOKEN` with your token value

### Publishing Process

The package is automatically published when you create a GitHub release:

1. **Update Version**

   ```bash
   # Update version in packages/notebook-mdx/package.json
   cd packages/notebook-mdx
   npm version patch  # or minor, major
   ```

2. **Commit Changes**

   ```bash
   git add .
   git commit -m "chore: bump version to x.x.x"
   git push origin main
   ```

3. **Create GitHub Release**

   ```bash
   # Create and push tag
   git tag v1.0.0
   git push origin v1.0.0
   
   # Or use GitHub UI to create release
   ```

4. **Automatic Publishing**
   - GitHub Actions will automatically build and publish to NPM
   - Release notes will be updated with NPM links

### Manual Publishing (Backup)

If you need to publish manually:

```bash
# Build the package
pnpm build --filter=notebook-mdx

# Navigate to package directory
cd packages/notebook-mdx

# Publish to NPM
npm publish --access public
```

### Pre-release Versions

For beta/alpha releases:

```bash
# Update to pre-release version
npm version prerelease --preid=beta

# Create release with pre-release tag
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1

# GitHub Actions will publish with beta tag
npm install notebook-mdx@beta
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

1. **CI (`ci.yml`)**
   - Runs on every push and PR
   - Tests on Node.js 18, 20, 22
   - Builds docs and packages
   - Linting and type checking

2. **Release (`release.yml`)**
   - Triggers on version tags
   - Creates GitHub releases with changelogs
   - Uploads package artifacts

3. **Publish (`publish.yml`)**
   - Triggers on GitHub releases
   - Publishes to NPM with provenance
   - Updates release notes with NPM links
   - Handles both stable and pre-release versions

### Monitoring

- **NPM Downloads**: Check [npm-stat.com](https://npm-stat.com/charts.html?package=notebook-mdx)
- **Vercel Analytics**: Monitor site performance in Vercel dashboard
- **GitHub Insights**: Track repository metrics and traffic

## 🚨 Troubleshooting

### Vercel Build Fails

1. **Check build logs** in Vercel dashboard
2. **Verify build command** includes workspace root context
3. **Ensure dependencies** are properly installed with pnpm

### NPM Publish Fails

1. **Check NPM token** has correct permissions
2. **Verify version** isn't already published
3. **Check package.json** for correct name and version
4. **Review GitHub Actions logs** for detailed errors

### Documentation Not Updating

1. **Clear Vercel cache** and redeploy
2. **Check build output** for any errors
3. **Verify file paths** in content directory

---

For additional help, check the [Contributing Guide](CONTRIBUTING.md) or open an issue.
