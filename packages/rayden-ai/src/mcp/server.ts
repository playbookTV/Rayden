#!/usr/bin/env node
/**
 * Rayden AI MCP Server
 *
 * Model Context Protocol server providing AI agents with
 * Rayden UI component information, design tokens, and layout recipes.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools.js";
import { callTool } from "./dispatch";
import { referenceContext } from "../manifests";
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(
    `Rayden AI MCP Server v${referenceContext.aiVersion}\nCitrionus UI reference ${referenceContext.uiVersion}\nUsage: npx @raydenui/ai (stdio)\nTools: ${tools.map((t) => t.name).join(", ")}`
  );
  process.exit(0);
}
if (process.argv.includes("--version")) {
  console.log(referenceContext.aiVersion);
  process.exit(0);
}

// Create server instance
const server = new Server(
  {
    name: "rayden-ai",
    version: referenceContext.aiVersion,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Invalid calls produce tool errors and keep the session available.
server.setRequestHandler(CallToolRequestSchema, async (request) =>
  callTool(request.params.name, request.params.arguments ?? {})
);

// Run the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Rayden AI MCP Server running");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
