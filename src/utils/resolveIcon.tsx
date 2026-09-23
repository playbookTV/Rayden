import { type ReactNode } from "react";
import { Icon, type IconName, type IconSize, type IconSource } from "../components/Icon";

/**
 * All icon slots accept a registry name, static IconRecord, or custom ReactNode.
 * Static data avoids the asynchronous name registry; custom nodes retain their props.
 */
export function resolveIcon(
  icon: IconSource | undefined,
  size: IconSize = "md"
): ReactNode | undefined {
  if (icon == null) return undefined;
  if (typeof icon === "string") return <Icon name={icon as IconName} size={size} />;
  if (typeof icon === "object" && "outline" in icon && "solid" in icon)
    return <Icon icon={icon} size={size} />;
  return icon;
}
