import { type ReactNode } from "react";
import { cn } from "../utils/cn";
import { EmptyStateIllustration } from "../components/EmptyStateIllustration";
import type { IllustrationName } from "../components/EmptyStateIllustration";
import { Button } from "../components/Button";
import type { IconName } from "../components/Icon";

// ─── Types ───────────────────────────────────────────────────────────
export type EmptyStateBlockVariant = "inline" | "card";

export interface EmptyStateBlockAction {
  label: string;
  icon?: ReactNode | IconName;
  onClick?: () => void;
}

export interface EmptyStateBlockProps {
  /** Which illustration to show */
  illustration: IllustrationName;
  /** Colored or grey/monochrome illustration */
  illustrationColored?: boolean;
  /**
   * Custom color palette for the illustration. This is a customisation surface,
   * not a theme role: values are literal colors and do not follow light/dark
   * mode. Supply mode-appropriate colors yourself, or omit to inherit the
   * flavor's illustration palette.
   */
  illustrationPalette?: string[];
  /** Illustration size in pixels */
  illustrationSize?: number;
  /** Bold title text */
  title: string;
  /** Description text (supports \n for line breaks) */
  description: string;
  /** Optional primary action button */
  action?: EmptyStateBlockAction;
  /** Visual variant: inline (no wrapper) or card (`--color-surface` panel) */
  variant?: EmptyStateBlockVariant;
  /** Additional class names */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────
export function EmptyStateBlock({
  illustration,
  illustrationColored = true,
  illustrationPalette,
  illustrationSize = 130,
  title,
  description,
  action,
  variant = "inline",
  className,
}: EmptyStateBlockProps) {
  const content = (
    <div className="flex flex-col items-center text-center gap-4">
      <EmptyStateIllustration
        name={illustration}
        colored={illustrationColored}
        palette={illustrationPalette}
        size={illustrationSize}
      />

      <div className="flex flex-col items-center gap-0.5">
        <h3 className="text-base font-semibold text-grey-900">{title}</h3>
        <p className="text-xs text-grey-600 whitespace-pre-line">{description}</p>
      </div>

      {action && (
        <Button
          variant="primary"
          size="sm"
          icon={action.icon}
          iconPosition={action.icon ? "leading" : "none"}
          onClick={action.onClick}
          /* Content-driven width: fits the supplied label on one line, wraps
             intentionally past a safe maximum, and keeps the one-line height
             as a floor so a wrapped label grows instead of being clipped. */
          className="h-auto min-h-9 w-auto max-w-64 whitespace-normal text-balance"
        >
          {action.label}
        </Button>
      )}
    </div>
  );

  if (variant === "card") {
    return (
      <div className={cn("bg-surface rounded-16 p-8 inline-flex max-w-full", className)}>
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
}
