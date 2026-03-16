import { type SVGAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";
import { icons, type IconName, type IconVariant } from "./icons";

export type { IconName, IconVariant } from "./icons";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  /** Icon name from the registry. */
  name: IconName;
  /** Preset size or pixel value. @default "md" */
  size?: IconSize | number;
  /** SVG color — applied via CSS `color`. @default "currentColor" */
  color?: string;
  /** Outline (stroke) or solid (filled) variant. @default "outline" */
  variant?: IconVariant;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    { name, size = "md", color = "currentColor", variant = "outline", className, style, ...rest },
    ref
  ) => {
    const iconData = icons[name]?.[variant];

    if (!iconData) {
      return null;
    }

    const px = typeof size === "number" ? size : sizeMap[size];

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={iconData.viewBox}
        width={px}
        height={px}
        fill="none"
        className={cn("shrink-0", className)}
        style={{ color, ...style }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: iconData.paths }}
        {...rest}
      />
    );
  }
);

Icon.displayName = "Icon";
