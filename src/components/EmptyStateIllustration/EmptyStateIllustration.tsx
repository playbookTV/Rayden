import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import {
  coloredIllustrations,
  greyIllustrations,
  type IllustrationName,
} from "./illustrations";

// ─── Default primary palette used in colored SVGs ──────────────────
const DEFAULT_PALETTE = [
  "#FFECE5", // primary-50
  "#FCD2C2", // primary-75
  "#FCB59A", // primary-100
  "#FA9874", // primary-150
  "#F77A4A", // primary-200
  "#F56630", // primary-400
  "#EB5017", // primary-500
  "#CC400C", // primary-600
  "#AD3307", // primary-700
  "#8F2802", // primary-800
  "#711E00", // primary-900
] as const;

// ─── Types ─────────────────────────────────────────────────────────
export type { IllustrationName };

export interface EmptyStateIllustrationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Which illustration to display */
  name: IllustrationName;
  /** Show the colored or grey/monochrome variant (default: true) */
  colored?: boolean;
  /**
   * Custom color palette for theming colored illustrations.
   * Provide 11 hex colors (lightest → darkest) to replace the default
   * primary orange palette. Ignored when `colored` is false.
   */
  palette?: string[];
  /** Width/height in pixels (default: 150, the native SVG size) */
  size?: number;
}

// ─── Component ─────────────────────────────────────────────────────
export const EmptyStateIllustration = forwardRef<
  HTMLDivElement,
  EmptyStateIllustrationProps
>(({ name, colored = true, palette, size = 150, className, ...rest }, ref) => {
  const rawSvg = colored
    ? coloredIllustrations[name]
    : greyIllustrations[name];

  // Apply custom palette via string replacement
  const svgContent = useMemo(() => {
    if (!colored || !palette || palette.length === 0) return rawSvg;

    let result = rawSvg;
    const len = Math.min(palette.length, DEFAULT_PALETTE.length);
    for (let i = 0; i < len; i++) {
      const from = DEFAULT_PALETTE[i];
      const to = palette[i];
      if (from !== to) {
        result = result.split(from).join(to.toUpperCase());
      }
    }
    return result;
  }, [rawSvg, colored, palette]);

  return (
    <div
      ref={ref}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
});

EmptyStateIllustration.displayName = "EmptyStateIllustration";
