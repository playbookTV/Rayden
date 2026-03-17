/**
 * Transform icons.ts to tree-shakeable individual exports.
 * Run with: npx tsx scripts/transform-icons.ts
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const iconsPath = path.join(__dirname, "../src/components/Icon/icons.ts");
const content = fs.readFileSync(iconsPath, "utf-8");

// Extract the icons object content
const iconsMatch = content.match(
  /export const icons: Record<IconName, Record<IconVariant, IconData>> = \{([\s\S]*)\};?\s*$/
);
if (!iconsMatch) {
  console.error("Could not find icons object");
  process.exit(1);
}

// Parse icon entries
const iconsContent = iconsMatch[1];
const iconRegex =
  /"([^"]+)":\s*\{[\s\S]*?outline:\s*\{[\s\S]*?\},[\s\S]*?solid:\s*\{[\s\S]*?\},?\s*\}/g;

const icons: { name: string; content: string }[] = [];
let match;

// Split by top-level icon entries
const lines = iconsContent.split("\n");
let currentIcon = "";
let currentName = "";
let braceCount = 0;
let inIcon = false;

for (const line of lines) {
  // Match both quoted keys ("icon-name":) and unquoted keys (iconName:)
  // Skip "outline" and "solid" which are variant keys, not icon names
  const nameMatch = line.match(/^\s*"?([^":\s]+)"?:\s*\{/);
  if (nameMatch && !inIcon && nameMatch[1] !== "outline" && nameMatch[1] !== "solid") {
    currentName = nameMatch[1];
    currentIcon = line;
    braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    inIcon = braceCount > 0;
  } else if (inIcon) {
    currentIcon += "\n" + line;
    braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    if (braceCount === 0) {
      icons.push({ name: currentName, content: currentIcon.trim().replace(/,\s*$/, "") });
      inIcon = false;
      currentIcon = "";
      currentName = "";
    }
  }
}

// Convert kebab-case to camelCase for variable names
function toCamelCase(str: string): string {
  // Handle hyphens - capitalize the character after each hyphen
  let result = str.replace(/-([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
  // Handle names starting with numbers (e.g., "3d" -> "threeD")
  if (/^[0-9]/.test(result)) {
    const numWords: Record<string, string> = { "3": "three" };
    const firstChar = result.charAt(0);
    const replacement = numWords[firstChar] || `num${firstChar}`;
    result = replacement + result.charAt(1).toUpperCase() + result.slice(2);
  }
  return result;
}

// Generate new file content
let output = `/**
 * Auto-generated icon registry with tree-shakeable exports.
 * ${icons.length} icons, each with outline + solid variants.
 */

export interface IconData {
  viewBox: string;
  paths: string;
}

export type IconVariant = "outline" | "solid";

export type IconRecord = Record<IconVariant, IconData>;

// ============================================
// Individual icon exports (tree-shakeable)
// ============================================

`;

// Generate individual exports
for (const icon of icons) {
  const varName = toCamelCase(icon.name) + "Icon";
  // Extract just the object part (without the key) - handles both quoted and unquoted keys
  const objContent = icon.content.replace(/^\s*"?[^":\s]+"?\s*:\s*/, "");
  output += `export const ${varName}: IconRecord = ${objContent};\n\n`;
}

// Generate IconName type from actual names
output += `// ============================================
// Type definitions
// ============================================

export type IconName =
${icons.map((i) => `  | "${i.name}"`).join("\n")};

// ============================================
// Combined registry for dynamic lookup
// ============================================

export const icons: Record<IconName, IconRecord> = {
${icons.map((i) => `  "${i.name}": ${toCamelCase(i.name)}Icon,`).join("\n")}
};
`;

// Write the new file
fs.writeFileSync(iconsPath, output);
console.log(`Transformed ${icons.length} icons to tree-shakeable exports`);
