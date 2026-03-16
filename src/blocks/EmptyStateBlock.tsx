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
  /** Custom color palette for the illustration */
  illustrationPalette?: string[];
  /** Illustration size in pixels */
  illustrationSize?: number;
  /** Bold title text */
  title: string;
  /** Description text (supports \n for line breaks) */
  description: string;
  /** Optional primary action button */
  action?: EmptyStateBlockAction;
  /** Visual variant: inline (no wrapper) or card (white bg + shadow) */
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
        <h3 className="text-base font-semibold text-black">{title}</h3>
        <p className="text-xs text-grey-600 whitespace-pre-line">{description}</p>
      </div>

      {action && (
        <Button
          variant="primary"
          size="sm"
          icon={action.icon}
          iconPosition={action.icon ? "leading" : "none"}
          onClick={action.onClick}
          className="w-[135px]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );

  if (variant === "card") {
    return <div className={cn("bg-white rounded-2xl p-8 inline-flex", className)}>{content}</div>;
  }

  return <div className={className}>{content}</div>;
}
