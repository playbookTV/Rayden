import { type ReactNode } from "react";
import { Icon, type IconName, type IconSize } from "../components/Icon";
import { icons } from "../components/Icon/icons";

/** Check if a value is a registered IconName string. */
function isIconName(value: unknown): value is IconName {
  return typeof value === "string" && value in icons;
}

/**
 * Resolve an icon value that can be either a ReactNode or an IconName string.
 * Returns a ReactNode (either the original node or an `<Icon>` element).
 */
export function resolveIcon(
  icon: ReactNode | IconName | undefined,
  size: IconSize = "md",
): ReactNode | undefined {
  if (icon == null) return undefined;
  if (isIconName(icon)) return <Icon name={icon} size={size} />;
  return icon;
}
