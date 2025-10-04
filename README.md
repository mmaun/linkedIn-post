# LinkedIn Post Claud Add-on

AI connector that enables AI assistants like Claude to generate and publish LinkedIn posts from transcripts or custom text.

## Features

- 🎯 **Generate Multiple Post Options**: Create 3 different LinkedIn post variations from a transcript
- 📝 **Customizable Tone**: Choose from professional, casual, or inspiring tones
- 🚀 **Direct Posting**: Publish posts directly to LinkedIn
- 💾 **State Management**: Review and select from generated options
- 🔧 **Easy Configuration**: Set up via Claude Desktop configuration

## Installation

### Option 1: Use via npx (Recommended)

No installation needed! Just configure Claude Desktop to use:

```bash
npx @yourusername/linkedin-post-mcp
```

### Option 2: Install Globally

```bash
npm install -g @yourusername/linkedin-post-mcp
```

## Prerequisites

Before using this MCP server, you need:

1. **LinkedIn Access Token**: Get your OAuth 2.0 access token from LinkedIn's Developer Portal
   - Create an app at https://www.linkedin.com/developers/apps
   - Request the following permissions: `w_member_social`, `r_liteprofile`
   - Generate an access token

2. **LinkedIn User URN**: Your LinkedIn user identifier (format: `urn:li:person:XXXXXXXXXX`)
   - You can get this from LinkedIn's API or your developer app settings

## Configuration

### Claude Desktop Setup

Add this configuration to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "linkedin-post": {
      "command": "npx",
      "args": [
        "@yourusername/linkedin-post-mcp",
        "--access-token",
        "YOUR_LINKEDIN_ACCESS_TOKEN_HERE",
        "--user-urn",
        "urn:li:person:YOUR_USER_ID_HERE"
      ]
    }
  }
}
```

**Example**:
```json
{
  "mcpServers": {
    "linkedin-post": {
      "command": "npx",
      "args": [
        "@yourusername/linkedin-post-mcp",
        "--access-token",
        "AQVABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop",
        "--user-urn",
        "urn:li:person:gxDS3ZTiss"
      ]
    }
  }
}
```

### Using with Cline or Other MCP Clients

For other MCP clients, use similar configuration with the appropriate format for that client.

## Available Tools

Once configured, Claude can use these tools:

### 1. `generate_linkedin_options_from_transcript`

Generate 3 LinkedIn post options from a transcript.

**Parameters**:
- `transcript` (required): The transcript content to analyze
- `tone` (optional): Tone for posts - "professional" (default), "casual", or "inspiring"
- `focus` (optional): Focus area - "general" (default), "insights", "takeaways", "announcement"

**Example**:
```
Generate LinkedIn post options from this transcript: "Today we discussed the importance of AI in modern business..."
```

### 2. `post_selected_linkedin_option`

Post one of the previously generated options to LinkedIn.

**Parameters**:
- `option_number` (required): Which option to post (1, 2, or 3)

**Example**:
```
Post option 2 to LinkedIn
```

### 3. `create_linkedin_post_directly`

Post custom content directly to LinkedIn without generating options.

**Parameters**:
- `post_text` (required): The text content to publish

**Example**:
```
Post this directly to LinkedIn: "Excited to share my latest project! 🚀"
```

### 4. `view_current_linkedin_options`

View the currently generated LinkedIn post options.

**Example**:
```
Show me the current LinkedIn post options
```

## Usage Examples

### Example 1: Generate and Post from Transcript

1. **Generate options**:
   ```
   Generate LinkedIn post options with a professional tone from this transcript:
   "In today's meeting, we explored how AI is transforming customer service..."
   ```

2. **Review options**:
   ```
   Show me the current options
   ```

3. **Post selected option**:
   ```
   Post option 1 to LinkedIn
   ```

### Example 2: Direct Post

```
Post this to LinkedIn: "Just wrapped up an amazing workshop on leadership! 
Key takeaway: Listen more, speak less. #Leadership #Growth"
```

### Example 3: Custom Tone

```
Generate casual LinkedIn posts from this transcript with focus on insights:
"We had a great discussion about work-life balance..."
```

## Development

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linkedin-post-mcp.git
   cd linkedin-post-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run in development mode:
   ```bash
   npm run dev -- --access-token YOUR_TOKEN --user-urn YOUR_URN
   ```

### Project Structure

```
linkedin-post-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Security Notes

⚠️ **Important Security Considerations**:

- **Never commit** your LinkedIn access token to version control
- Access tokens should be treated as passwords
- Consider token expiration and refresh mechanisms for production use
- The configuration file contains sensitive credentials - protect it accordingly
- Use environment variables or secure credential storage in production

## Troubleshooting

### "Missing required credentials" Error

Make sure you've provided both `--access-token` and `--user-urn` in your Claude Desktop configuration.

### "HTTP error: 401" When Posting

Your access token may be expired or invalid. Generate a new token from LinkedIn Developer Portal.

### Posts Not Appearing

- Verify your LinkedIn app has the correct permissions (`w_member_social`)
- Check that your access token is valid
- Ensure your User URN is correct

### Claude Doesn't See the Tools

- Restart Claude Desktop after updating the configuration
- Check that the JSON configuration is valid (no syntax errors)
- Verify the npx command can run in your terminal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/linkedin-post-mcp/issues
- LinkedIn Developer Docs: https://docs.microsoft.com/en-us/linkedin/

## Changelog

### Version 1.0.0
- Initial release
- Support for transcript-based post generation
- Multiple tone options (professional, casual, inspiring)
- Direct posting capability
- State management for generated options

