export type Framework = "vite" | "nextjs";
export type Template = "minimal" | "dashboard";
export type PackageManager = "npm" | "pnpm" | "yarn";

export interface ProjectConfig {
  name: string;
  framework: Framework;
  template: Template;
  typescript: boolean;
  packageManager: PackageManager;
  git: boolean;
  install: boolean;
  targetDir: string;
}

export interface TemplateContext {
  projectName: string;
  packageName: string;
  framework: Framework;
  template: Template;
  typescript: boolean;
  packageManager: PackageManager;
  raydenVersion: string;
}
