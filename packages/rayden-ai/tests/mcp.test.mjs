import process from "node:process";
import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { readFileSync } from "node:fs";

test("real stdio MCP session exposes seven tools, errors recover, all original tools succeed", async () => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["dist/mcp/server.js"],
    stderr: "pipe",
  });
  const client = new Client({ name: "rayden-ai-smoke", version: "1.0.0" });
  try {
    await client.connect(transport);
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    assert.equal(client.getServerVersion().version, pkg.version);
    const listed = await client.listTools();
    assert.ok(listed.tools.some((t) => t.name === "get_catalog"));
    for (const [name, args] of [
      ["get_components", {}],
      ["get_component_props", { component: "Modal" }],
      ["get_tokens", { category: "colors" }],
      ["get_layout_recipes", {}],
      ["get_component_guidance", { component: "ActivityItem" }],
      ["get_catalog", {}],
      ["validate_component_usage", { component: "Button", props: { size: "sm" } }],
    ]) {
      const result = await client.callTool({ name, arguments: args });
      assert.ok(!result.isError, `${name}: ${JSON.stringify(result)}`);
      const data = JSON.parse(result.content[0].text);
      if (name === "get_layout_recipes") assert.ok(data.recipes.length > 0);
    }
    for (const [name, args] of [
      ["get_component_props", {}],
      ["get_tokens", { category: "garbage" }],
      ["get_component_props", { component: "ImaginaryWidget" }],
      ["unknown_tool", {}],
    ]) {
      const result = await client.callTool({ name, arguments: args });
      assert.equal(result.isError, true);
      assert.ok(JSON.parse(result.content[0].text).error);
    }
    const recovered = await client.callTool({
      name: "get_component_props",
      arguments: { component: "Spinner" },
    });
    assert.equal(JSON.parse(recovered.content[0].text).name, "Spinner");
  } finally {
    await client.close();
  }
});
