# LinkedIn Post MCP Server - Client Instructions

## 🚀 Quick Setup (5 minutes)

Your LinkedIn Post MCP server is now live on npm! Share these instructions with your clients.

---

## Step 1: Get LinkedIn Credentials

### Access Token
1. Go to https://www.linkedin.com/developers/apps
2. Create a new app or select an existing one
3. Request these permissions:
   - `w_member_social` (required for posting)
   - `r_liteprofile` (required for user info)
4. Generate an **Access Token** (copy and save it)

### User URN
Your User URN format is: `urn:li:person:XXXXXXXXXX`

To find it:
- Check your LinkedIn Developer App settings
- Or use LinkedIn API: `https://api.linkedin.com/v2/me`
- It will look like: `urn:li:person:gxDS3ZTiss`

---

## Step 2: Configure Claude Desktop

### Find Your Config File

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

### Add This Configuration

Open the config file and add:

```json
{
  "mcpServers": {
    "linkedin-post": {
      "command": "npx",
      "args": [
        "@biznezstack/linkedin-post-mcp",
        "--access-token",
        "YOUR_LINKEDIN_ACCESS_TOKEN_HERE",
        "--user-urn",
        "urn:li:person:YOUR_USER_ID_HERE"
      ]
    }
  }
}
```

### Example (with fake credentials):

```json
{
  "mcpServers": {
    "linkedin-post": {
      "command": "npx",
      "args": [
        "@biznezstack/linkedin-post-mcp",
        "--access-token",
        "AQVABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh",
        "--user-urn",
        "urn:li:person:abc123XYZ"
      ]
    }
  }
}
```

---

## Step 3: Restart Claude Desktop

**Important:** Completely quit and restart Claude Desktop for changes to take effect.

---

## Step 4: Test It!

Open Claude and try:

```
"Generate 3 LinkedIn post options from this transcript: 
Today I learned about the power of AI in transforming business operations..."
```

Claude will:
1. ✅ Generate 3 different post variations
2. ✅ Show you all options
3. ✅ Let you choose which to post
4. ✅ Post directly to your LinkedIn

---

## Usage Examples

### Example 1: Generate Posts from Transcript

```
Generate professional LinkedIn posts from this meeting transcript:
"We discussed the importance of continuous learning in tech..."
```

### Example 2: View Options

```
Show me the current LinkedIn post options
```

### Example 3: Post Selected Option

```
Post option 2 to LinkedIn
```

### Example 4: Direct Post

```
Post this directly to LinkedIn:
"Excited to announce our new product launch! 🚀 #Innovation #Tech"
```

---

## Available Tools

Claude has access to these tools:

1. **generate_linkedin_options_from_transcript**
   - Creates 3 post variations from your transcript
   - Options: tone (professional/casual/inspiring), focus area

2. **post_selected_linkedin_option**
   - Posts one of the 3 generated options
   - Just say "post option 1" (or 2, or 3)

3. **create_linkedin_post_directly**
   - Skip generation and post custom content immediately

4. **view_current_linkedin_options**
   - Review previously generated options

---

## Troubleshooting

### "Missing required credentials" Error
- Check your config file has both `--access-token` and `--user-urn`
- Verify no typos in the JSON syntax
- Restart Claude Desktop

### "401 Unauthorized" When Posting
- Your access token may be expired
- Generate a new token from LinkedIn Developer Portal
- Update your config file and restart Claude

### Posts Don't Appear on LinkedIn
- Verify your app has `w_member_social` permission
- Check you're using the correct User URN
- Try posting directly from LinkedIn API to test credentials

### Claude Doesn't See the Tools
- Completely quit Claude Desktop (not just close window)
- Reopen Claude Desktop
- Check config file for JSON syntax errors
- Try: `npx @biznezstack/linkedin-post-mcp --access-token test --user-urn test` in terminal to verify installation

---

## Security Notes

⚠️ **Important:**
- Treat your Access Token like a password
- Never share it publicly
- Store config file securely
- Access tokens expire - you may need to regenerate periodically

---

## Package Info

**Package Name:** `@biznezstack/linkedin-post-mcp`
**npm Page:** https://www.npmjs.com/package/@biznezstack/linkedin-post-mcp
**Run via npx:** No installation needed!

---

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify LinkedIn credentials are valid
3. Test with terminal: `npx @biznezstack/linkedin-post-mcp --access-token YOUR_TOKEN --user-urn YOUR_URN`
4. Contact your MCP server provider

---

## Tips for Best Results

✅ **Do:**
- Keep transcripts focused and relevant
- Choose appropriate tone for your audience
- Review options before posting
- Test with a short post first

❌ **Don't:**
- Share your access token with anyone
- Post extremely long content (LinkedIn has limits)
- Forget to review generated options

---

**Happy posting! 🚀**

