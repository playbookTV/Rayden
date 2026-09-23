// Distribution descriptions describe editable compositions. Component descriptions,
// supported names, exports, versions and prompts come from the canonical AI catalog.
export const pilotItems = [
  {
    name: "setup",
    type: "registry:style",
    title: "Citrionus setup",
    description: "A global stylesheet entry for the complete free Citrionus default.",
    components: [],
    files: [
      {
        path: "registry/citrionus/setup/rayden.css",
        type: "registry:file",
        target: "~/styles/rayden.css",
      },
    ],
    docs: "Import styles/rayden.css once from your app's global stylesheet or entry point. The installed @raydenui/ui package supplies the runtime and compiled styles. This pilot does not replace your theme provider or application configuration.",
  },
  {
    name: "rules",
    type: "registry:file",
    title: "Citrionus agent guidance",
    description: "Versioned component guidance generated from Rayden's canonical catalog.",
    components: [],
    files: [
      {
        path: "registry/citrionus/rules/RAYDEN.md",
        type: "registry:file",
        target: "~/rayden/RAYDEN.md",
      },
    ],
    docs: "Read rayden/RAYDEN.md explicitly in your assistant. It is reference material, not an automatically executed agent configuration.",
  },
  {
    name: "button-actions",
    type: "registry:block",
    title: "Save and cancel actions",
    description: "Editable save/cancel actions with a busy state, using package-managed Button.",
    components: ["Button"],
    registryDependencies: ["@rayden/setup", "@rayden/rules"],
    files: [
      { path: "registry/citrionus/button-actions/button-actions.tsx", type: "registry:component" },
    ],
  },
  {
    name: "workspace-tabs",
    type: "registry:block",
    title: "Workspace tabs",
    description: "Editable workspace navigation and panels using package-managed Tabs and Tab.",
    components: ["Tabs"],
    registryDependencies: ["@rayden/setup", "@rayden/rules"],
    files: [
      { path: "registry/citrionus/workspace-tabs/workspace-tabs.tsx", type: "registry:component" },
    ],
  },
  {
    name: "motion-tabs",
    type: "registry:block",
    title: "Motion tabs",
    description: "Editable segmented tabs with opt-in motion and reduced-motion support.",
    components: ["Tabs"],
    registryDependencies: ["@rayden/setup", "@rayden/rules"],
    files: [{ path: "registry/citrionus/motion-tabs/motion-tabs.tsx", type: "registry:component" }],
  },
];
