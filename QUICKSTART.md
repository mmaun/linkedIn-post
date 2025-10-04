# Quick Start Guide

Get your LinkedIn Post MCP server running in 5 minutes!

## Before You Start

You need two things from LinkedIn:

1. **Access Token** - OAuth 2.0 token with `w_member_social` permission
2. **User URN** - Your LinkedIn user ID (format: `urn:li:person:XXXXXXXXXX`)

### Getting LinkedIn Credentials

1. Go to https://www.linkedin.com/developers/apps
2. Create a new app or select existing one
3. Add these permissions: `w_member_social`, `r_liteprofile`
4. Generate an access token
5. Get your User URN from the API or app settings

## Local Testing (Before Publishing)

### 1. Install Dependencies

```bash
cd linked-in-post
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Test Locally

```bash
node dist/index.js --access-token YOUR_TOKEN --user-urn YOUR_URN
```

You should see:
```
LinkedIn Post MCP Server starting...
User URN: urn:li:person:YOUR_ID
LinkedIn Post MCP Server running on stdio
```

Press `Ctrl+C` to stop.

### 4. Link for Local Testing with Claude

```bash
npm link
```

Then update your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "linkedin-post": {
      "command": "linkedin-post-mcp",
      "args": [
        "--access-token",
        "YOUR_ACTUAL_TOKEN_HERE",
        "--user-urn",
        "urn:li:person:YOUR_ACTUAL_ID"
      ]
    }
  }
}
```

Restart Claude Desktop and test!

## Publishing to npm

### 1. Update Package Name

Edit `package.json`:
```json
{
  "name": "@your-npm-username/linkedin-post-mcp",
  "author": "Your Name <email@example.com>"
}
```

### 2. Login to npm

```bash
npm login
```

### 3. Publish

```bash
npm run build
npm publish --access public
```

### 4. Test Published Package

```bash
npx @your-npm-username/linkedin-post-mcp --access-token test --user-urn test
```

## Share with Clients

Send them this configuration:

```json
{
  "mcpServers": {
    "linkedin-post": {
      "command": "npx",
      "args": [
        "@your-npm-username/linkedin-post-mcp",
        "--access-token",
        "THEIR_LINKEDIN_ACCESS_TOKEN",
        "--user-urn",
        "urn:li:person:THEIR_USER_ID"
      ]
    }
  }
}
```

Plus instructions on:
1. How to get LinkedIn credentials
2. Where to add the config file
3. Restart Claude Desktop

## Usage Examples

Once configured in Claude, users can:

```
"Generate 3 LinkedIn post options from this transcript: [paste transcript]"

"Show me the current LinkedIn post options"

"Post option 2 to LinkedIn"

"Post this directly to LinkedIn: [custom text]"
```

## Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Can't publish?**
```bash
npm whoami  # Check you're logged in
npm publish --access public  # For scoped packages
```

**Claude doesn't see tools?**
- Restart Claude Desktop completely
- Check JSON syntax in config file
- Verify file path to config

**401 Error when posting?**
- Token expired - generate new one
- Token missing permissions - add `w_member_social`
- Wrong User URN - verify in LinkedIn app

## Development

Watch mode for active development:
```bash
npm run watch
```

## Next Steps

1. ✅ Test locally with `npm run build && node dist/index.js`
2. ✅ Test with Claude using `npm link`
3. ✅ Publish to npm with your username
4. ✅ Share with clients
5. ✅ Gather feedback and iterate

---

**Need Help?**
- Check the full [README.md](./README.md)
- Review [PUBLISHING.md](./PUBLISHING.md) for detailed publishing steps
- Open an issue on GitHub

