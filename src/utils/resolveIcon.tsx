import { type ReactNode } from "react";
import { Icon, type IconName, type IconSize } from "../components/Icon";

/**
 * Resolve an icon value that can be either a ReactNode or an IconName string.
 * Returns a ReactNode (either the original node or an `<Icon>` element).
 */
export function resolveIcon(
  icon: ReactNode | IconName | undefined,
  size: IconSize = "md"
): ReactNode | undefined {
  if (icon == null) return undefined;
  if (typeof icon === "string") return <Icon name={icon as IconName} size={size} />;
  return icon;
}
