import type { Decorator, Preview } from "@storybook/react";
import "../src/styles/globals.css";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || "light";

  // Apply theme to document for CSS variable switching
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  return Story();
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#101928" },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [withTheme],
};

export default preview;
