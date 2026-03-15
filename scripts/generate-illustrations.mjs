/**
 * Reads all empty-state SVGs from icon-assets/empty-state/
 * and generates src/components/EmptyStateIllustration/illustrations.ts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SVG_DIR = join(import.meta.dirname, "../icon-assets/empty-state");
const OUT_FILE = join(
  import.meta.dirname,
  "../src/components/EmptyStateIllustration/illustrations.ts"
);

// Map Figma names → clean keys
const nameMap = {
  Calendar: "calendar",
  "Empty Calendar": "calendar", // grey variant of Calendar
  "Chat or Messaging History": "chat",
  "Contacts or Address Book": "contacts",
  "Contacts or Address Book no color": "contacts",
  Dashboard: "dashboard",
  "Favorites or Bookmarks color": "favorites",
  "Favorites or Bookmarks": "favorites",
  "File Manager": "file-manager",
  Forms: "forms",
  Inbox: "inbox",
  "Invoice or Payment History": "invoice",
  "Media Library or Gallery": "gallery",
  "Library or Gallery": "gallery",
  Notifications: "notifications",
  "Product Catalog or Inventory": "product-catalog",
  "Project or Task Listrd": "project-list",
  "Search Results": "search",
  "Shopping Cart": "shopping-cart",
  "Subscriptions or Billing History": "subscriptions",
  "Survey or Feedback Results": "survey",
  "Task or Workflow Templates": "task-templates",
  "Team or Collaboration Space": "team",
};

const colored = {};
const grey = {};

for (const file of readdirSync(SVG_DIR).filter((f) => f.endsWith(".svg"))) {
  // Parse filename: "Property 1=<Name>, Color=<True|False>.svg"
  const match = file.match(/^Property 1=(.+?),\s*Color=(True|False)\.svg$/);
  if (!match) {
    console.warn(`Skipping unrecognized file: ${file}`);
    continue;
  }

  const [, rawName, isColored] = match;
  const key = nameMap[rawName];
  if (!key) {
    console.warn(`No name mapping for: "${rawName}"`);
    continue;
  }

  const svg = readFileSync(join(SVG_DIR, file), "utf-8");
  // Extract inner content (everything between <svg ...> and </svg>)
  const inner = svg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();

  if (isColored === "True") {
    colored[key] = inner;
  } else {
    grey[key] = inner;
  }
}

// Sort keys alphabetically
const sortedKeys = [...new Set([...Object.keys(colored), ...Object.keys(grey)])].sort();

// Generate TS file
let output = `// Auto-generated from icon-assets/empty-state/ — do not edit manually\n// Run: node scripts/generate-illustrations.mjs\n\n`;

output += `export const illustrationNames = [\n`;
for (const key of sortedKeys) {
  output += `  "${key}",\n`;
}
output += `] as const;\n\n`;

output += `export type IllustrationName = (typeof illustrationNames)[number];\n\n`;

output += `export const coloredIllustrations: Record<IllustrationName, string> = {\n`;
for (const key of sortedKeys) {
  output += `  "${key}": \`${(colored[key] || "").replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`,\n`;
}
output += `};\n\n`;

output += `export const greyIllustrations: Record<IllustrationName, string> = {\n`;
for (const key of sortedKeys) {
  output += `  "${key}": \`${(grey[key] || "").replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`,\n`;
}
output += `};\n`;

writeFileSync(OUT_FILE, output, "utf-8");
console.log(`Generated ${OUT_FILE}`);
console.log(`  ${sortedKeys.length} illustrations: ${sortedKeys.join(", ")}`);
console.log(`  Colored: ${Object.keys(colored).length}, Grey: ${Object.keys(grey).length}`);
