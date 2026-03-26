import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type CardVariant = "default" | "outlined" | "elevated" | "ghost";
export type CardSize = "sm" | "md" | "lg";
export type CardRounded = "sm" | "md" | "lg" | "xl" | "full";
export type CardShadow = "none" | "sm" | "md" | "lg";
export type CardImagePosition = "top" | "bottom" | "full";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant;
  /** Padding scale for sub-components */
  size?: CardSize;
  /** Corner radius */
  rounded?: CardRounded;
  /** Shadow intensity */
  shadow?: CardShadow;
  /** Enable hover shadow effect */
  hoverable?: boolean;
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Header title */
  title?: ReactNode;
  /** Header subtitle */
  subtitle?: ReactNode;
  /** Actions slot (right side) */
  actions?: ReactNode;
  /** Show bottom border */
  bordered?: boolean;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Remove default padding */
  noPadding?: boolean;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Footer content alignment */
  align?: "left" | "center" | "right" | "between";
  /** Show top border */
  bordered?: boolean;
}

export interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Image position relative to card content */
  position?: CardImagePosition;
  /** Aspect ratio */
  aspectRatio?: "auto" | "video" | "square" | "portrait";
  /** Object fit behavior */
  objectFit?: "cover" | "contain" | "fill";
  /** Alt text (required for accessibility) */
  alt: string;
}

/* ─── Context ──────────────────────────────────────────────────────────── */

interface CardContextValue {
  size: CardSize;
}

const CardContext = createContext<CardContextValue | null>(null);

function useCardContext(): CardContextValue {
  const ctx = useContext(CardContext);
  // Return defaults if used outside Card (allows standalone usage)
  return ctx ?? { size: "md" };
}

/* ─── Style Lookups ────────────────────────────────────────────────────── */

const variantStyles: Record<CardVariant, string> = {
  default: "border border-grey-200 bg-white dark:bg-grey-50",
  outlined: "border-2 border-grey-300 bg-transparent",
  elevated: "border border-grey-100 bg-white dark:bg-grey-50 shadow-soft-md",
  ghost: "border-none bg-transparent",
};

const sizeStyles: Record<CardSize, { header: string; body: string; footer: string }> = {
  sm: {
    header: "px-4 py-3",
    body: "px-4 py-3",
    footer: "px-4 py-3",
  },
  md: {
    header: "px-5 py-4",
    body: "px-5 py-4",
    footer: "px-5 py-4",
  },
  lg: {
    header: "px-6 py-5",
    body: "px-6 py-5",
    footer: "px-6 py-5",
  },
};

const roundedStyles: Record<CardRounded, string> = {
  sm: "rounded-lg",
  md: "rounded-[10px]",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-3xl",
};

const shadowStyles: Record<CardShadow, string> = {
  none: "",
  sm: "shadow-soft-xxs",
  md: "shadow-soft-xs",
  lg: "shadow-soft-sm",
};

const footerAlignStyles: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  between: "justify-between",
};

const aspectRatioStyles: Record<string, string> = {
  auto: "",
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

/* ─── Card ─────────────────────────────────────────────────────────────── */

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      size = "md",
      rounded = "lg",
      shadow = "sm",
      hoverable = false,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <CardContext.Provider value={{ size }}>
        <div
          ref={ref}
          className={cn(
            "flex flex-col overflow-hidden",
            variantStyles[variant],
            roundedStyles[rounded],
            variant !== "elevated" && shadowStyles[shadow],
            hoverable && "transition-shadow duration-200 hover:shadow-soft-md",
            className
          )}
          {...rest}
        >
          {children}
        </div>
      </CardContext.Provider>
    );
  }
);
Card.displayName = "Card";

/* ─── CardHeader ───────────────────────────────────────────────────────── */

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, actions, bordered = false, className, children, ...rest }, ref) => {
    const { size } = useCardContext();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between gap-4",
          sizeStyles[size].header,
          bordered && "border-b border-grey-200",
          className
        )}
        {...rest}
      >
        {(title || subtitle || children) && (
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <h3 className="text-lg font-semibold leading-[1.45] text-grey-900">{title}</h3>
            )}
            {subtitle && <p className="text-sm leading-[1.45] text-grey-500">{subtitle}</p>}
            {children}
          </div>
        )}
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    );
  }
);
CardHeader.displayName = "CardHeader";

/* ─── CardBody ─────────────────────────────────────────────────────────── */

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ noPadding = false, className, children, ...rest }, ref) => {
    const { size } = useCardContext();

    return (
      <div
        ref={ref}
        className={cn("flex-1", !noPadding && sizeStyles[size].body, className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
CardBody.displayName = "CardBody";

/* ─── CardFooter ───────────────────────────────────────────────────────── */

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = "right", bordered = false, className, children, ...rest }, ref) => {
    const { size } = useCardContext();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3",
          sizeStyles[size].footer,
          footerAlignStyles[align],
          bordered && "border-t border-grey-200",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = "CardFooter";

/* ─── CardImage ────────────────────────────────────────────────────────── */

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  (
    { position = "top", aspectRatio = "auto", objectFit = "cover", alt, className, ...rest },
    ref
  ) => {
    const objectFitClasses: Record<string, string> = {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
    };

    return (
      <div
        className={cn(
          "w-full overflow-hidden",
          position === "top" && "first:rounded-t-[inherit]",
          position === "bottom" && "last:rounded-b-[inherit]",
          position === "full" && "first:rounded-t-[inherit] last:rounded-b-[inherit]"
        )}
      >
        <img
          ref={ref}
          alt={alt}
          className={cn(
            "w-full",
            aspectRatioStyles[aspectRatio],
            objectFitClasses[objectFit],
            className
          )}
          {...rest}
        />
      </div>
    );
  }
);
CardImage.displayName = "CardImage";
