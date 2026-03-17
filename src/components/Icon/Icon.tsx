import { type SVGAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";
import { icons, type IconName, type IconVariant, type IconRecord } from "./icons";

export type { IconName, IconVariant, IconRecord } from "./icons";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

interface BaseIconProps extends Omit<SVGAttributes<SVGSVGElement>, "children"> {
  /** Preset size or pixel value. @default "md" */
  size?: IconSize | number;
  /** SVG color — applied via CSS `color`. @default "currentColor" */
  color?: string;
  /** Outline (stroke) or solid (filled) variant. @default "outline" */
  variant?: IconVariant;
}

interface IconByNameProps extends BaseIconProps {
  /** Icon name from the registry (dynamic lookup, not tree-shakeable). */
  name: IconName;
  icon?: never;
}

interface IconByDataProps extends BaseIconProps {
  /** Icon data object (tree-shakeable when imported directly). */
  icon: IconRecord;
  name?: never;
}

export type IconProps = IconByNameProps | IconByDataProps;

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    { size = "md", color = "currentColor", variant = "outline", className, style, ...rest },
    ref
  ) => {
    // Remove name/icon from rest props before spreading to SVG
    const { name, icon, ...svgProps } = rest as {
      name?: IconName;
      icon?: IconRecord;
    } & typeof rest;

    // Support both name-based (dynamic) and icon-based (tree-shakeable) usage
    const iconRecord = icon ?? (name ? icons[name] : null);
    const iconData = iconRecord?.[variant];

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
        {...svgProps}
      />
    );
  }
);

Icon.displayName = "Icon";
