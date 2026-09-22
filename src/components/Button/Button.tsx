import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconSource } from "../Icon";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "grey"
  | "destructive"
  | "text"
  | "success"
  | "warning"
  | "info";

export type ButtonAppearance = "solid" | "outlined";
export type ButtonSize = "sm" | "lg";

/** Elements Button can render directly. `button` stays the default. */
export type ButtonElement = "button" | "a";

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "href" | "target" | "rel" | "download" | "hrefLang" | "ping" | "referrerPolicy"
    > {
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  icon?: IconSource;
  iconPosition?: "none" | "leading" | "trailing" | "icon-only";
  /**
   * Element to render. `"button"` (default) is unchanged. `"a"` renders an anchor
   * with the same styling, focus treatment and icon composition, so a destination
   * that should look like a button no longer has to be hand-rolled.
   *
   * Ignored when `asChild` is set.
   */
  as?: ButtonElement;
  /**
   * Render the single child element instead of Button's own element, merging
   * Button's className onto it. Use it for a router `Link` or any component that
   * already renders the element you need. The child's own children become the
   * label, so `icon` / `iconPosition` still apply around them.
   */
  asChild?: boolean;
}

const solidVariants: Record<ButtonVariant, string> = {
  primary: "bg-action-primary text-white hover:bg-action-primary-hover",
  secondary:
    "bg-transparent text-action-primary-text border-[1.5px] border-current hover:bg-primary-50",
  grey: "bg-action-grey text-white hover:bg-action-grey-hover",
  destructive: "bg-action-danger text-white hover:bg-action-danger-hover",
  text: "bg-transparent text-action-primary-text hover:underline underline-offset-4",
  success: "bg-action-success text-white hover:bg-action-success-hover",
  warning: "bg-action-warning text-white hover:bg-action-warning-hover",
  info: "bg-action-info text-white hover:bg-action-info-hover",
};

const outlinedVariants: Record<ButtonVariant, string> = {
  primary: solidVariants.secondary,
  secondary: solidVariants.secondary,
  grey: "bg-transparent text-grey-700 border-[1.5px] border-grey-500 hover:bg-grey-100",
  destructive:
    "bg-transparent text-action-danger-text border-[1.5px] border-current hover:bg-error-50",
  text: solidVariants.text,
  success: solidVariants.success,
  warning: solidVariants.warning,
  info: solidVariants.info,
};

const sizeClasses: Record<ButtonSize, Record<string, string>> = {
  sm: {
    base: "h-9 text-sm rounded-lg",
    none: "px-4 py-2",
    icon: "px-3 py-2",
    "icon-only": "p-2",
  },
  lg: {
    base: "h-14 text-base rounded-lg",
    none: "px-6 py-4",
    icon: "p-4",
    "icon-only": "p-4",
  },
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      appearance = "solid",
      size = "sm",
      icon,
      iconPosition = "none",
      className,
      children,
      disabled,
      type = "button",
      as,
      asChild = false,
      href,
      onClick,
      ...rest
    },
    ref
  ) => {
    const variantClasses =
      appearance === "outlined" ? outlinedVariants[variant] : solidVariants[variant];

    const sizeConfig = sizeClasses[size];
    const paddingKey =
      iconPosition === "icon-only" ? "icon-only" : iconPosition !== "none" ? "icon" : "none";

    const iconSizeClass = size === "sm" ? "size-5" : "size-6";
    const resolvedIcon = resolveIcon(icon, size === "sm" ? "md" : "lg");

    const rootClassName = cn(
      "inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text cursor-pointer",
      // `disabled:` only matches a form control. An anchor or a slotted child carries
      // aria-disabled instead, so both spellings are present and the visual treatment
      // is identical either way.
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
      sizeConfig.base,
      sizeConfig[paddingKey],
      variantClasses,
      className
    );

    const decorate = (label: ReactNode) => (
      <>
        {iconPosition === "leading" && resolvedIcon && (
          <span className={cn("shrink-0", iconSizeClass)}>{resolvedIcon}</span>
        )}
        {iconPosition === "icon-only" && resolvedIcon ? (
          <span className={cn("shrink-0", iconSizeClass)}>{resolvedIcon}</span>
        ) : (
          iconPosition !== "icon-only" && label
        )}
        {iconPosition === "trailing" && resolvedIcon && (
          <span className={cn("shrink-0", iconSizeClass)}>{resolvedIcon}</span>
        )}
      </>
    );

    /**
     * A disabled anchor does not exist in HTML: `disabled` is a form-control
     * attribute and an anchor keeps navigating with it. Rather than render a link
     * that still works, Button drops `href` (so nothing can navigate, including
     * middle-click and "open in new tab"), keeps the element discoverable and
     * focusable with `role="link"` + `aria-disabled="true"` + `tabIndex={0}`, and
     * swallows activation. This is the aria-disabled pattern: still perceivable,
     * not actionable. The visual treatment matches a disabled `<button>`.
     */
    const swallow = (event: ReactMouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    if (asChild) {
      const child = Children.only(children) as ReactElement<Record<string, unknown>>;
      if (!isValidElement(child)) return null;
      const childProps = child.props as Record<string, unknown>;
      return cloneElement(
        child,
        {
          ...rest,
          ...(href !== undefined && !disabled ? { href } : {}),
          ...(disabled ? { "aria-disabled": true, onClick: swallow, tabIndex: 0 } : { onClick }),
          ref,
          className: cn(rootClassName, childProps.className as string | undefined),
        } as Record<string, unknown>,
        decorate(childProps.children as ReactNode)
      );
    }

    if (as === "a") {
      const anchorState = (
        disabled
          ? { role: "link", "aria-disabled": true, tabIndex: 0, onClick: swallow }
          : { href, onClick }
      ) as AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          {...anchorState}
          className={rootClassName}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {decorate(children)}
        </a>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={rootClassName}
        {...rest}
      >
        {decorate(children)}
      </button>
    );
  }
);

Button.displayName = "Button";
