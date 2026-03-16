import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: "@storybook/react-vite",
  addons: [
    "@storybook/addon-vitest",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
  ],
  viteFinal: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());
    return config;
  },
};

export default config;
