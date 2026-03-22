/**
 * Rayden UI design tokens.
 * Colors extracted from the Rayna UI Figma design system.
 */
export const colors = {
  primary: {
    50: "#FFECE5",
    75: "#FCD2C2",
    100: "#FCB59A",
    200: "#FA9874",
    300: "#F77A4A",
    400: "#F56630",
    500: "#EB5017",
    600: "#CC400C",
    700: "#AD3307",
    800: "#8F2802",
    900: "#711E00",
  },
  secondary: {
    50: "#E3EFFC",
    75: "#C6DDF7",
    100: "#B6D8FF",
    200: "#80BBFF",
    300: "#3D89DF",
    400: "#1671D9",
    500: "#0D5EBA",
    600: "#034592",
    700: "#04326B",
    800: "#012657",
    900: "#001633",
  },
  grey: {
    50: "#F9FAFB",
    75: "#F7F9FC",
    100: "#F0F2F5",
    200: "#E4E7EC",
    300: "#D0D5DD",
    400: "#98A2B3",
    500: "#667185",
    600: "#475367",
    700: "#344054",
    800: "#1D2739",
    900: "#101928",
  },
  success: {
    50: "#E7F6EC",
    75: "#B5E3C4",
    100: "#91D6A8",
    200: "#5FC381",
    300: "#40B869",
    400: "#0F973D",
    500: "#099137",
    600: "#04802E",
    700: "#036B26",
    800: "#015B20",
    900: "#004617",
  },
  error: {
    50: "#FBEAE9",
    75: "#F2BCBA",
    100: "#EB9B98",
    200: "#E26E6A",
    300: "#DD524D",
    400: "#D42620",
    500: "#CB1A14",
    600: "#BA110B",
    700: "#9E0A05",
    800: "#800501",
  },
  warning: {
    50: "#FEF6E7",
    75: "#FBE2B7",
    100: "#F7D394",
    200: "#F7C164",
    300: "#F5B546",
    400: "#F3A218",
    500: "#DD900D",
    600: "#AD6F07",
    700: "#865503",
    800: "#664101",
  },
  info: {
    400: "#0BA5EC",
    500: "#0086C9",
  },
  officeBrown: {
    100: "#E4DBDB",
    200: "#CDC4C4",
    300: "#B7AFAF",
    400: "#A29999",
    500: "#8D8484",
    600: "#787070",
    700: "#645D5D",
    800: "#514A4A",
    900: "#3E3838",
  },
} as const;

export type RaydenColors = typeof colors;

/**
 * Shadow tokens from Rayna UI Figma design system.
 */
export const shadows = {
  soft: {
    xxs: "0px 1.5px 4px -1px rgba(16, 25, 40, 0.07)",
    xs: "0px 2px 4px -1px rgba(16, 25, 40, 0.02), 0px 5px 13px -5px rgba(16, 25, 40, 0.05)",
    sm: "0px 10px 18px -2px rgba(16, 25, 40, 0.07)",
    md: "0px 0px 3px -1px rgba(16, 25, 40, 0.04), 0px 14px 22px -9px rgba(16, 25, 40, 0.14)",
    lg: "0px 4px 6px -2px rgba(16, 25, 40, 0.03), 0px 16px 24px -4px rgba(16, 25, 40, 0.08)",
    xl: "0px 8px 8px -4px rgba(16, 25, 40, 0.03), 0px 24px 32px -4px rgba(16, 25, 40, 0.08)",
    "2xl": "0px 32px 54px -12px rgba(16, 25, 40, 0.18)",
    "3xl": "0px 40px 72px -12px rgba(16, 25, 40, 0.14)",
  },
  hard: {
    xxs: "0px 2px 5px -2px rgba(16, 25, 40, 0.06), 0px 2px 7px 0px rgba(16, 25, 40, 0.05), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)",
    xs: "0px 2px 12px -1px rgba(16, 25, 40, 0.1), 0px 2px 2px -1px rgba(16, 25, 40, 0.04), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)",
    sm: "0px 6px 16px 0px rgba(16, 25, 40, 0.08), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)",
    md: "0px 0px 3px -1px rgba(16, 25, 40, 0.04), 0px 16px 24px -6px rgba(16, 25, 40, 0.08), 0px 0px 0px 1px rgba(16, 25, 40, 0.05)",
  },
} as const;

/**
 * Blur tokens (backdrop-blur / filter blur).
 */
export const blurs = {
  xs: "2px",
  sm: "4px",
  md: "12px",
  lg: "16px",
  xl: "20px",
} as const;

/**
 * Spacing scale (17-step).
 * Based on a 4pt system with micro (2–12px), base (16–32px), and macro (40–256px) ranges.
 */
export const spacing = {
  0.5: "2px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  40: "160px",
  48: "192px",
  64: "256px",
} as const;

/**
 * Corner radius tokens.
 * Sharp (2–6px) for functional elements, Soft (8–16px) for interactive components,
 * Bold (20–32px) for brand accents, Full for circular elements.
 */
export const radius = {
  2: "2px",
  4: "4px",
  6: "6px",
  8: "8px",
  10: "10px",
  12: "12px",
  14: "14px",
  16: "16px",
  18: "18px",
  20: "20px",
  24: "24px",
  28: "28px",
  32: "32px",
  full: "999999px",
} as const;

/**
 * Grid breakpoints and layout tokens.
 */
export const grid = {
  breakpoints: {
    sm: "320px",
    md: "600px",
    lg: "1136px",
  },
  columns: {
    sm: { 4: { margin: "16px", gutter: "12px" }, 6: { margin: "16px", gutter: "12px" } },
    md: { 6: { margin: "32px", gutter: "20px" }, 8: { margin: "32px", gutter: "20px" } },
    lg: { 12: { margin: "112px", gutter: "32px" } },
  },
  fluid: { columns: 12, margin: "24px", gutter: "24px" },
} as const;

/**
 * Typography tokens.
 */
export const typography = {
  display: {
    lg: { size: "56px", lineHeight: 1, letterSpacing: "-0.04em" },
    sm: { size: "48px", lineHeight: 1, letterSpacing: "-0.04em" },
  },
  heading: {
    h1: { size: "40px", lineHeight: 1.2, letterSpacing: "-0.04em" },
    h2: { size: "36px", lineHeight: 1.2, letterSpacing: "-0.04em" },
    h3: { size: "32px", lineHeight: 1.2, letterSpacing: "-0.02em" },
    h4: { size: "28px", lineHeight: 1.2, letterSpacing: "-0.02em" },
    h5: { size: "24px", lineHeight: 1.2, letterSpacing: "-0.02em" },
    h6: { size: "20px", lineHeight: 1.2, letterSpacing: "-0.02em" },
  },
  body: {
    lg: { size: "18px", lineHeight: 1.45, letterSpacing: "0" },
    md: { size: "16px", lineHeight: 1.45, letterSpacing: "0" },
    sm: { size: "14px", lineHeight: 1.45, letterSpacing: "0" },
    xs: { size: "12px", lineHeight: 1.45, letterSpacing: "0" },
  },
  caption: {
    lg: { size: "14px", lineHeight: 1.2, letterSpacing: "0.12em" },
    sm: { size: "12px", lineHeight: 1.2, letterSpacing: "0.12em" },
    xs: { size: "10px", lineHeight: 1.2, letterSpacing: "0.16em" },
  },
} as const;
