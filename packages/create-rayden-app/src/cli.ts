import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "path";
import { scaffold } from "./scaffold.js";
import { detectPackageManager, getRunCommand } from "./utils/package-manager.js";
import type { ProjectConfig, Framework, Template, PackageManager } from "./types.js";

interface CliFlags {
  name?: string;
  framework?: Framework;
  template?: Template;
  typescript?: boolean;
  packageManager?: PackageManager;
  git?: boolean;
  install?: boolean;
}

function parseArgs(args: string[]): CliFlags {
  const flags: CliFlags = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg.startsWith("-")) {
      if (!flags.name) flags.name = arg;
      continue;
    }

    if (arg === "--framework" || arg === "-f") {
      const value = args[++i] as Framework;
      if (value === "vite" || value === "nextjs") flags.framework = value;
    } else if (arg === "--template" || arg === "-t") {
      const value = args[++i] as Template;
      if (value === "minimal" || value === "dashboard") flags.template = value;
    } else if (arg === "--typescript" || arg === "--ts") {
      flags.typescript = true;
    } else if (arg === "--javascript" || arg === "--js") {
      flags.typescript = false;
    } else if (arg === "--pm") {
      const value = args[++i] as PackageManager;
      if (value === "npm" || value === "pnpm" || value === "yarn") flags.packageManager = value;
    } else if (arg === "--git") {
      flags.git = true;
    } else if (arg === "--no-git") {
      flags.git = false;
    } else if (arg === "--install") {
      flags.install = true;
    } else if (arg === "--no-install") {
      flags.install = false;
    }
  }

  return flags;
}

function isNonInteractive(flags: CliFlags): boolean {
  return !!(flags.name && flags.framework && flags.template && flags.typescript !== undefined);
}

export async function cli(): Promise<void> {
  const args = process.argv.slice(2);

  // Handle help flag
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  const flags = parseArgs(args);

  // Non-interactive mode if all required flags are provided
  if (isNonInteractive(flags)) {
    console.log();
    console.log(pc.bgCyan(pc.black(" create-rayden-app ")));
    console.log();

    const config: ProjectConfig = {
      name: flags.name!,
      framework: flags.framework!,
      template: flags.template!,
      typescript: flags.typescript!,
      packageManager: flags.packageManager ?? detectPackageManager(),
      git: flags.git ?? true,
      install: flags.install ?? false,
      targetDir: path.resolve(process.cwd(), flags.name!),
    };

    await scaffold(config);

    console.log();
    console.log(pc.green("Your Rayden app is ready!"));
    printNextSteps(config);
    return;
  }

  // Interactive mode
  console.log();
  p.intro(pc.bgCyan(pc.black(" create-rayden-app ")));

  const project = await p.group(
    {
      name: () =>
        p.text({
          message: "What is your project named?",
          placeholder: "my-rayden-app",
          initialValue: flags.name,
          validate: (value) => {
            if (!value) return "Project name is required";
            if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
              return "Project name can only contain letters, numbers, hyphens, and underscores";
            }
          },
        }),

      framework: () =>
        p.select<{ value: Framework; label: string; hint?: string }[], Framework>({
          message: "Which framework would you like to use?",
          initialValue: flags.framework,
          options: [
            { value: "vite", label: "Vite", hint: "recommended" },
            { value: "nextjs", label: "Next.js" },
          ],
        }),

      template: () =>
        p.select<{ value: Template; label: string; hint?: string }[], Template>({
          message: "Which template would you like to use?",
          initialValue: flags.template,
          options: [
            { value: "minimal", label: "Minimal", hint: "Clean starting point" },
            {
              value: "dashboard",
              label: "Dashboard",
              hint: "With sidebar, tables, metrics",
            },
          ],
        }),

      typescript: () =>
        p.confirm({
          message: "Would you like to use TypeScript?",
          initialValue: flags.typescript ?? true,
        }),

      packageManager: () =>
        p.select<{ value: PackageManager; label: string; hint?: string }[], PackageManager>({
          message: "Which package manager do you use?",
          initialValue: flags.packageManager ?? detectPackageManager(),
          options: [
            { value: "pnpm", label: "pnpm", hint: "recommended" },
            { value: "npm", label: "npm" },
            { value: "yarn", label: "yarn" },
          ],
        }),

      git: () =>
        p.confirm({
          message: "Initialize a git repository?",
          initialValue: flags.git ?? true,
        }),

      install: () =>
        p.confirm({
          message: "Install dependencies?",
          initialValue: flags.install ?? true,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  const config: ProjectConfig = {
    name: project.name as string,
    framework: project.framework as Framework,
    template: project.template as Template,
    typescript: project.typescript as boolean,
    packageManager: project.packageManager as PackageManager,
    git: project.git as boolean,
    install: project.install as boolean,
    targetDir: path.resolve(process.cwd(), project.name as string),
  };

  await scaffold(config);

  p.outro(pc.green("Your Rayden app is ready!"));
  printNextSteps(config);
}

function printNextSteps(config: ProjectConfig): void {
  console.log();
  console.log(pc.bold("Next steps:"));
  console.log(pc.dim("  1."), `cd ${config.name}`);
  if (!config.install) {
    console.log(
      pc.dim("  2."),
      config.packageManager === "yarn" ? "yarn" : `${config.packageManager} install`
    );
    console.log(pc.dim("  3."), getRunCommand(config.packageManager, "dev"));
  } else {
    console.log(pc.dim("  2."), getRunCommand(config.packageManager, "dev"));
  }
  console.log();
  console.log(pc.dim("  Documentation:"), pc.cyan("https://raydenui.com/docs"));
  console.log();
}

function printHelp(): void {
  console.log(`
${pc.bold("create-rayden-app")} - Create Rayden UI applications with one command

${pc.bold("Usage:")}
  npx create-rayden-app [project-name] [options]

${pc.bold("Options:")}
  -h, --help              Show this help message
  -f, --framework <name>  Framework: vite or nextjs
  -t, --template <name>   Template: minimal or dashboard
  --ts, --typescript      Use TypeScript (default)
  --js, --javascript      Use JavaScript
  --pm <manager>          Package manager: npm, pnpm, or yarn
  --git / --no-git        Initialize git repository (default: true)
  --install / --no-install  Install dependencies (default: false in non-interactive)

${pc.bold("Examples:")}
  ${pc.dim("# Interactive mode")}
  npx create-rayden-app my-app

  ${pc.dim("# Non-interactive mode")}
  npx create-rayden-app my-app -f vite -t minimal --ts --pm pnpm --no-git

${pc.bold("Learn more:")}
  https://raydenui.com/docs/getting-started
`);
}
