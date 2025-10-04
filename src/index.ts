#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosError } from "axios";
import { z } from "zod";

// ─── Types ──────────────────────────────────────────────────────

interface PostOptions {
  option_1: string;
  option_2: string;
  option_3: string;
}

interface LinkedInPayload {
  author: string;
  lifecycleState: string;
  specificContent: {
    "com.linkedin.ugc.ShareContent": {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: string;
    };
  };
  visibility: {
    "com.linkedin.ugc.MemberNetworkVisibility": string;
  };
}

// ─── Configuration ──────────────────────────────────────────────

let LINKEDIN_ACCESS_TOKEN = "";
let LINKEDIN_USER_URN = "";

// ─── API Constants ──────────────────────────────────────────────

const LINKEDIN_API_URL = "https://api.linkedin.com/v2/ugcPosts";

// ─── Global State ───────────────────────────────────────────────

let currentPostOptions: string[] = [];

// ─── Input Schemas ──────────────────────────────────────────────

const TranscriptInputSchema = z.object({
  transcript: z.string().describe("The transcript content to analyze and create LinkedIn posts from"),
  tone: z.string().default("professional").describe("Tone for the posts (professional, casual, inspiring, etc.)"),
  focus: z.string().default("general").describe("Focus area (insights, takeaways, announcement, etc.)"),
});

const PostSelectionInputSchema = z.object({
  option_number: z.number().min(1).max(3).describe("The option number to post (1, 2, or 3)"),
});

const DirectPostInputSchema = z.object({
  post_text: z.string().describe("The text content to publish as a LinkedIn post"),
});

// ─── Helper Functions ───────────────────────────────────────────

function generatePostOptions(transcript: string, tone: string = "professional", focus: string = "general"): string[] {
  // Extract key content (simplified - in production you might use AI/LLM)
  const baseContent = transcript.length > 500 ? transcript.substring(0, 500) + "..." : transcript;
  
  let option1: string, option2: string, option3: string;
  
  if (tone === "professional") {
    option1 = `📊 Key insights from today's discussion:\n\n${baseContent}\n\n#Leadership #Business #Innovation`;
    option2 = `Reflecting on an important conversation about ${focus}:\n\n${baseContent}\n\nWhat are your thoughts on this topic?`;
    option3 = `🎯 Takeaways worth sharing:\n\n${baseContent}\n\n#ProfessionalDevelopment #Insights`;
  } else if (tone === "casual") {
    option1 = `Had a great chat today! 💭\n\n${baseContent}\n\nLove hearing different perspectives!`;
    option2 = `Sharing some thoughts from a recent conversation:\n\n${baseContent}\n\nWhat do you think?`;
    option3 = `Quick share from today 🌟\n\n${baseContent}\n\n#Thoughts #Discussion`;
  } else if (tone === "inspiring") {
    option1 = `🌟 Inspiring conversation today:\n\n${baseContent}\n\n#Motivation #Growth #Success`;
    option2 = `✨ Sometimes the best insights come from great conversations:\n\n${baseContent}\n\nKeep growing! 🚀`;
    option3 = `💡 Wisdom shared is wisdom multiplied:\n\n${baseContent}\n\n#Inspiration #Learning #Community`;
  } else {
    // Default professional tone
    option1 = `Sharing insights from a recent discussion:\n\n${baseContent}\n\n#Professional #Insights`;
    option2 = `Key points from today's conversation:\n\n${baseContent}\n\nThoughts?`;
    option3 = `Worth sharing:\n\n${baseContent}\n\n#Discussion #Ideas`;
  }
  
  return [option1, option2, option3];
}

async function postToLinkedIn(text: string): Promise<any> {
  const payload: LinkedInPayload = {
    author: LINKEDIN_USER_URN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text: text,
        },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  try {
    const response = await axios.post(LINKEDIN_API_URL, payload, {
      headers: {
        "Authorization": `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data,
      message: "Post published successfully",
      linkedin_post_id: response.headers["x-restli-id"] || "",
      linkedin_payload: payload,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: `HTTP error: ${axiosError.message}`,
        status_code: axiosError.response?.status || "unknown",
        details: axiosError.response?.data || null,
      };
    }
    return {
      success: false,
      error: `Request error: ${error}`,
      status_code: 500,
    };
  }
}

// ─── MCP Server Setup ───────────────────────────────────────────

const server = new Server(
  {
    name: "linkedin-post-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ─── Tool Definitions ───────────────────────────────────────────

const tools: Tool[] = [
  {
    name: "generate_linkedin_options_from_transcript",
    description: "Analyze a transcript and generate 3 LinkedIn post options with different styles",
    inputSchema: {
      type: "object",
      properties: {
        transcript: {
          type: "string",
          description: "The transcript content to analyze and create LinkedIn posts from",
        },
        tone: {
          type: "string",
          description: "Tone for the posts (professional, casual, inspiring, etc.)",
          default: "professional",
        },
        focus: {
          type: "string",
          description: "Focus area (insights, takeaways, announcement, etc.)",
          default: "general",
        },
      },
      required: ["transcript"],
    },
  },
  {
    name: "post_selected_linkedin_option",
    description: "Post a selected option (1, 2, or 3) from the previously generated options to LinkedIn",
    inputSchema: {
      type: "object",
      properties: {
        option_number: {
          type: "number",
          description: "The option number to post (1, 2, or 3)",
          minimum: 1,
          maximum: 3,
        },
      },
      required: ["option_number"],
    },
  },
  {
    name: "create_linkedin_post_directly",
    description: "Post custom content directly to LinkedIn (bypass the transcript/options flow)",
    inputSchema: {
      type: "object",
      properties: {
        post_text: {
          type: "string",
          description: "The text content to publish as a LinkedIn post",
        },
      },
      required: ["post_text"],
    },
  },
  {
    name: "view_current_linkedin_options",
    description: "View the currently generated LinkedIn post options",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// ─── Request Handlers ───────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "generate_linkedin_options_from_transcript": {
        const input = TranscriptInputSchema.parse(args);
        const options = generatePostOptions(input.transcript, input.tone, input.focus);
        currentPostOptions = options;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: "Generated 3 LinkedIn post options from transcript",
                  options: {
                    option_1: options[0],
                    option_2: options[1],
                    option_3: options[2],
                  },
                  instructions: "Use 'post_selected_linkedin_option' with option_number (1, 2, or 3) to post your chosen option",
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "post_selected_linkedin_option": {
        const input = PostSelectionInputSchema.parse(args);

        if (currentPostOptions.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success: false,
                    error: "No options available. Please generate options first using 'generate_linkedin_options_from_transcript'",
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        const selectedPost = currentPostOptions[input.option_number - 1];
        const result = await postToLinkedIn(selectedPost);

        if (result.success) {
          result.selected_option = input.option_number;
          result.posted_content = selectedPost;
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_linkedin_post_directly": {
        const input = DirectPostInputSchema.parse(args);
        const result = await postToLinkedIn(input.post_text);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "view_current_linkedin_options": {
        if (currentPostOptions.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    success: false,
                    message: "No options currently available",
                    instructions: "Use 'generate_linkedin_options_from_transcript' first",
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  current_options: {
                    option_1: currentPostOptions[0],
                    option_2: currentPostOptions[1],
                    option_3: currentPostOptions[2],
                  },
                  instructions: "Use 'post_selected_linkedin_option' with option_number (1, 2, or 3) to post",
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid input: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
    }
    throw error;
  }
});

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  // Get credentials from command line arguments
  const args = process.argv.slice(2);
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--access-token" && i + 1 < args.length) {
      LINKEDIN_ACCESS_TOKEN = args[i + 1];
      i++;
    } else if (args[i] === "--user-urn" && i + 1 < args.length) {
      LINKEDIN_USER_URN = args[i + 1];
      i++;
    }
  }

  // Validate credentials
  if (!LINKEDIN_ACCESS_TOKEN || !LINKEDIN_USER_URN) {
    console.error("Error: Missing required credentials.");
    console.error("Please provide --access-token and --user-urn arguments.");
    console.error("\nExample configuration for Claude Desktop:");
    console.error(JSON.stringify({
      "mcpServers": {
        "linkedin-post": {
          "command": "npx",
          "args": [
            "@yourusername/linkedin-post-mcp",
            "--access-token",
            "YOUR_LINKEDIN_ACCESS_TOKEN",
            "--user-urn",
            "urn:li:person:YOUR_USER_ID"
          ]
        }
      }
    }, null, 2));
    process.exit(1);
  }

  console.error("LinkedIn Post MCP Server starting...");
  console.error(`User URN: ${LINKEDIN_USER_URN}`);
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("LinkedIn Post MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

