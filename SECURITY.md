# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of notebook-mdx seriously. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them privately to:

- **Email**: [security@your-domain.com](mailto:security@your-domain.com)
- **GitHub Security**: Use GitHub's [private vulnerability reporting](https://github.com/abhay-ramesh/notebook-mdx/security/advisories/new)

### 📋 What to Include

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### 🚀 Response Timeline

- **Initial Response**: Within 48 hours of receiving your report
- **Status Update**: Within 7 days with a more detailed response
- **Fix Timeline**: Security issues will be prioritized and typically resolved within 30 days

### 🏆 Security Bounty

While we don't currently offer a formal bug bounty program, we greatly appreciate security researchers who responsibly disclose vulnerabilities. Contributors who report valid security issues will be:

- Credited in our security acknowledgments (with permission)
- Given priority in feature requests and support
- Considered for future collaboration opportunities

## Security Best Practices

### For Users

- Always keep notebook-mdx updated to the latest version
- Be cautious when rendering untrusted notebook content
- Sanitize user-provided notebook data before rendering
- Use Content Security Policy (CSP) headers when possible

### For Contributors

- Run security audits: `pnpm audit`
- Use TypeScript for type safety
- Validate all inputs and outputs
- Follow secure coding practices
- Keep dependencies updated

## Security Features

### Built-in Protections

- **No code execution**: notebook-mdx only renders, never executes notebook code
- **Content sanitization**: All user content is properly escaped
- **Type safety**: TypeScript prevents many common vulnerabilities
- **Dependency auditing**: Regular security scans of dependencies

### Security Considerations

- notebook-mdx processes and renders Jupyter notebook JSON
- While we sanitize content, always validate notebooks from untrusted sources
- Consider implementing additional CSP policies for production use

## Contact

For security-related questions or concerns, please contact:

- **Security Team**: [security@your-domain.com](mailto:security@your-domain.com)
- **Maintainer**: [@abhay-ramesh](https://github.com/abhay-ramesh)

---

Thank you for helping keep notebook-mdx secure! 🔒
