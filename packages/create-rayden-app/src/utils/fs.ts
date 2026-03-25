import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import type { TemplateContext } from "../types.js";

const SPECIAL_FILES: Record<string, string> = {
  _gitignore: ".gitignore",
  _npmrc: ".npmrc",
  _env: ".env",
  "_env.local": ".env.local",
  "_eslint.config.js": "eslint.config.js",
  "_eslint.config.mjs": "eslint.config.mjs",
};

export async function copyTemplateDir(
  srcDir: string,
  destDir: string,
  context: TemplateContext
): Promise<void> {
  if (!fs.existsSync(srcDir)) return;

  const files = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.join(srcDir, file.name);
    let destName = file.name;

    // Handle special file names (dotfiles)
    if (SPECIAL_FILES[destName]) {
      destName = SPECIAL_FILES[destName];
    }

    // Handle .ejs templates
    if (destName.endsWith(".ejs")) {
      destName = destName.slice(0, -4);
    }

    const destPath = path.join(destDir, destName);

    if (file.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      await copyTemplateDir(srcPath, destPath, context);
    } else if (file.name.endsWith(".ejs")) {
      // Process EJS template
      const content = fs.readFileSync(srcPath, "utf-8");
      const rendered = ejs.render(content, context);
      fs.writeFileSync(destPath, rendered);
    } else {
      // Copy file as-is
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export async function getLatestRaydenVersion(): Promise<string> {
  try {
    const response = await fetch("https://registry.npmjs.org/@raydenui/ui/latest");
    const data = (await response.json()) as { version: string };
    return data.version;
  } catch {
    // Fallback to known version
    return "0.9.3";
  }
}
