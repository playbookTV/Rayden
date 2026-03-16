import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

const raydenTheme = create({
  base: "light",
  brandTitle: "Rayden UI",
  brandUrl: "https://github.com/raydenui/rayden",
  brandTarget: "_blank",

  // Colors
  colorPrimary: "#F56630",
  colorSecondary: "#EB5017",

  // UI
  appBg: "#F9FAFB",
  appContentBg: "#FFFFFF",
  appBorderColor: "#E4E7EC",
  appBorderRadius: 8,

  // Text
  textColor: "#101928",
  textInverseColor: "#FFFFFF",
  textMutedColor: "#667185",

  // Toolbar
  barTextColor: "#667185",
  barSelectedColor: "#F56630",
  barHoverColor: "#EB5017",
  barBg: "#FFFFFF",

  // Form
  inputBg: "#FFFFFF",
  inputBorder: "#D0D5DD",
  inputTextColor: "#101928",
  inputBorderRadius: 6,
});

addons.setConfig({
  theme: raydenTheme,
});
