# Publishing Guide

This guide will help you publish your LinkedIn Post MCP server to npm so users can access it via `npx`.

## Prerequisites

1. **npm Account**: Create one at https://www.npmjs.com/signup
2. **npm CLI**: Already installed with Node.js
3. **Package Name**: Choose a unique name on npm

## Step-by-Step Publishing

### 1. Choose Your Package Name

The package name in `package.json` is currently `@yourusername/linkedin-post-mcp`. You have two options:

**Option A: Scoped Package (Recommended)**
```json
"name": "@your-npm-username/linkedin-post-mcp"
```
- Replace `your-npm-username` with your actual npm username
- Scoped packages are grouped under your username
- Example: `@johnsmith/linkedin-post-mcp`

**Option B: Unscoped Package**
```json
"name": "linkedin-post-mcp-yourname"
```
- Must be globally unique across all of npm
- Might be harder to find an available name

### 2. Update Package Metadata

Edit `package.json` and update:

```json
{
  "name": "@your-npm-username/linkedin-post-mcp",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/linkedin-post-mcp.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/linkedin-post-mcp/issues"
  },
  "homepage": "https://github.com/yourusername/linkedin-post-mcp#readme"
}
```

### 3. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

### 4. Build the Project

```bash
npm install
npm run build
```

This will:
- Install all dependencies
- Compile TypeScript to JavaScript in the `dist/` folder

### 5. Test Locally (Optional but Recommended)

Test the package locally before publishing:

```bash
npm link
```

Then in Claude Desktop config, use:
```json
{
  "mcpServers": {
    "linkedin-post": {
      "command": "linkedin-post-mcp",
      "args": [
        "--access-token",
        "YOUR_TOKEN",
        "--user-urn",
        "YOUR_URN"
      ]
    }
  }
}
```

### 6. Publish to npm

For a scoped package (first time):
```bash
npm publish --access public
```

For subsequent updates or unscoped packages:
```bash
npm publish
```

### 7. Verify Publication

Visit your package page:
```
https://www.npmjs.com/package/@your-username/linkedin-post-mcp
```

### 8. Test with npx

Test that users can run it:
```bash
npx @your-username/linkedin-post-mcp --access-token test --user-urn test
```

## Updating Your Package

When you make changes:

1. **Update version** in `package.json`:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1 (bug fixes)
   npm version minor  # 1.0.0 -> 1.1.0 (new features)
   npm version major  # 1.0.0 -> 2.0.0 (breaking changes)
   ```

2. **Rebuild and publish**:
   ```bash
   npm run build
   npm publish
   ```

## Quick Reference

```bash
# Initial setup
npm login
npm install
npm run build

# First publish (scoped package)
npm publish --access public

# Update package
npm version patch
npm run build
npm publish

# Unpublish (within 72 hours only)
npm unpublish @your-username/linkedin-post-mcp@1.0.0
```

## Common Issues

### "Package name already exists"
- Choose a different name
- Use a scoped package: `@your-username/package-name`

### "You need to authorize this machine"
- Run `npm login` again
- Check you're logged into the correct account: `npm whoami`

### "403 Forbidden"
- For scoped packages, use `--access public`
- Verify you own the package/scope

### TypeScript errors
```bash
npm run build
```
Fix any errors shown before publishing.

## Distribution

After publishing, users can:

1. **Use via npx** (no installation):
   ```bash
   npx @your-username/linkedin-post-mcp
   ```

2. **Install globally**:
   ```bash
   npm install -g @your-username/linkedin-post-mcp
   ```

3. **Add to Claude Desktop** config:
   ```json
   {
     "mcpServers": {
       "linkedin-post": {
         "command": "npx",
         "args": [
           "@your-username/linkedin-post-mcp",
           "--access-token",
           "TOKEN",
           "--user-urn",
           "URN"
         ]
       }
     }
   }
   ```

## Security Notes

- Never publish with credentials in the code
- Add `.env` and sensitive files to `.gitignore`
- Review files before publishing: `npm pack --dry-run`
- Consider using `.npmignore` to exclude source files

## Support Your Users

Update your npm package description and README to help users:
- Clear installation instructions
- Configuration examples
- Troubleshooting guide
- Link to issues/support

---

**Next Steps**: After publishing, share your package with clients by providing:
1. Package name (e.g., `@your-username/linkedin-post-mcp`)
2. Configuration instructions from the README
3. How to get LinkedIn credentials

