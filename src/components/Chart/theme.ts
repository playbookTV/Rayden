/**
 * Rayna UI chart theme — color palette and defaults for Chart.js components.
 */

export const chartColors = {
  primary: [
    "#F56630", // primary-400
    "#FA9874", // primary-200
    "#FCB59A", // primary-100
    "#FCD2C2", // primary-75
    "#FFECE5", // primary-50
  ],
  semantic: [
    "#F56630", // primary-400 (orange)
    "#0F973D", // success-400 (green)
    "#1671D9", // secondary-400 (blue)
    "#F3A218", // warning-400 (amber)
    "#D42620", // error-400 (red)
    "#0BA5EC", // info-400 (cyan)
  ],
  extended: [
    "#F56630",
    "#0F973D",
    "#1671D9",
    "#F3A218",
    "#D42620",
    "#0BA5EC",
    "#475CCC", // indigo
    "#8D8484", // office-brown
    "#F77A4A", // primary-300
    "#40B869", // success-300
  ],
  grey: {
    50: "#F9FAFB",
    100: "#F0F2F5",
    200: "#E4E7EC",
    300: "#D0D5DD",
    400: "#98A2B3",
    500: "#667185",
    700: "#344054",
    900: "#101928",
  },
} as const;

/** Default font for Chart.js */
export const chartFont = {
  family: "'Inter', ui-sans-serif, system-ui, sans-serif",
  size: 12,
  weight: "normal" as const,
};

/** Create an rgba version of a hex color */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Generate a gradient fill for area charts */
export function createGradientFill(
  ctx: CanvasRenderingContext2D,
  color: string,
  height: number
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, hexToRgba(color, 0.2));
  gradient.addColorStop(1, hexToRgba(color, 0.01));
  return gradient;
}
