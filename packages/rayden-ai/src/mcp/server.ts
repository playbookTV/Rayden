#!/usr/bin/env node
/**
 * Rayden AI MCP Server
 *
 * Model Context Protocol server providing AI agents with
 * Rayden UI component information, design tokens, and layout recipes.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { tools } from './tools.js';
import { handleGetComponents } from './handlers/getComponents.js';
import { handleGetComponentProps } from './handlers/getComponentProps.js';
import { handleGetTokens } from './handlers/getTokens.js';
import { handleGetLayoutRecipes } from './handlers/getLayoutRecipes.js';

// Create server instance
const server = new Server(
  {
    name: 'rayden-ai',
    version: '0.1.0',
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

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  switch (name) {
    case 'get_components':
      return handleGetComponents({ category: args.category as string | undefined });

    case 'get_component_props':
      return handleGetComponentProps({ component: args.component as string });

    case 'get_tokens':
      return handleGetTokens({
        category: args.category as
          | 'colors'
          | 'spacing'
          | 'typography'
          | 'shadows'
          | 'borderRadius'
          | 'breakpoints'
          | undefined,
      });

    case 'get_layout_recipes':
      return handleGetLayoutRecipes({
        category: args.category as
          | 'marketing'
          | 'dashboard'
          | 'forms'
          | 'content'
          | undefined,
      });

    default:
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ error: `Unknown tool: ${name}` }),
          },
        ],
      };
  }
});

// Run the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Rayden AI MCP Server running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
