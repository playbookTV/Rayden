import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import { Icon } from "../Icon";
import type { IconName } from "../Icon";

/* ─── Types ─── */

export type AvatarType = "image" | "icon" | "initials";
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "none" | "online" | "offline" | "verified";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual type of the avatar. @default "image" */
  type?: AvatarType;
  /** Size preset. @default "md" */
  size?: AvatarSize;
  /** Status indicator shown at bottom-right. @default "none" */
  status?: AvatarStatus;
  /** Image URL (for type="image"). */
  src?: string;
  /** Alt text (for type="image"). */
  alt?: string;
  /** Initials text (for type="initials"). */
  initials?: string;
  /** Custom icon (for type="icon"). Accepts ReactNode or IconName. @default "user" */
  icon?: ReactNode | IconName;
}

/* ─── Size Tokens ─── */

const containerSize: Record<AvatarSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
  "2xl": "size-16",
};

const initialsFontSize: Record<AvatarSize, string> = {
  xs: "text-[10px] leading-[18px]",
  sm: "text-[14px] leading-[1.45]",
  md: "text-[16px] leading-[1.45]",
  lg: "text-[18px] leading-[1.45]",
  xl: "text-[18px] leading-[1.45]",
  "2xl": "text-[20px] leading-[1.2] tracking-[-0.4px]",
};

const iconSize: Record<AvatarSize, "xs" | "sm" | "md" | "lg" | "xl"> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "md",
  xl: "lg",
  "2xl": "lg",
};

const statusDotSize: Record<AvatarSize, string> = {
  xs: "size-1.5",
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
  xl: "size-3.5",
  "2xl": "size-4",
};

const verifiedBadgeSize: Record<AvatarSize, string> = {
  xs: "size-2.5",
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
  xl: "size-[18px]",
  "2xl": "size-5",
};

/* ─── Verified Badge (SVG checkmark in blue circle) ─── */

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="10" cy="10" r="10" fill="#1671D9" />
      <path
        d="M6 10l3 3 5-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Status Indicator ─── */

function StatusIndicator({
  status,
  size,
}: {
  status: AvatarStatus;
  size: AvatarSize;
}) {
  if (status === "none") return null;

  if (status === "verified") {
    return (
      <div className="absolute bottom-0 right-0">
        <VerifiedBadge className={verifiedBadgeSize[size]} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 rounded-full border-[1.5px] border-white",
        statusDotSize[size],
        status === "online" ? "bg-success-600" : "bg-grey-300",
      )}
    />
  );
}

/* ─── Avatar Component ─── */

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      type = "image",
      size = "md",
      status = "none",
      src,
      alt = "",
      initials,
      icon,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative inline-flex shrink-0", containerSize[size], className)}
        {...rest}
      >
        {/* Circle background */}
        {type === "image" ? (
          <div className="absolute inset-0 rounded-full border-[1.5px] border-white overflow-hidden">
            {src ? (
              <img
                src={src}
                alt={alt}
                className="size-full object-cover rounded-full"
              />
            ) : (
              <div className="size-full bg-grey-200 rounded-full" />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 rounded-full bg-primary-50" />
        )}

        {/* Icon content */}
        {type === "icon" && (
          <div className="absolute inset-0 flex items-center justify-center text-grey-900">
            {icon ? (
              resolveIcon(icon, iconSize[size])
            ) : (
              <Icon name="user" size={iconSize[size]} />
            )}
          </div>
        )}

        {/* Initials content */}
        {type === "initials" && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center font-semibold text-grey-900",
              initialsFontSize[size],
            )}
          >
            {initials}
          </div>
        )}

        {/* Status indicator */}
        <StatusIndicator status={status} size={size} />
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

/* ─── AvatarGroup Types ─── */

export type AvatarGroupSize = "sm" | "md" | "lg";

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Controls the size of avatars in the group. @default "md" */
  size?: AvatarGroupSize;
  /** Maximum visible avatars. Overflow shows a "+N" counter. */
  max?: number;
}

const groupAvatarSize: Record<AvatarGroupSize, AvatarSize> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

const groupOverlap: Record<AvatarGroupSize, string> = {
  sm: "-ml-1.5",
  md: "-ml-1.5",
  lg: "-ml-[11px]",
};

const groupCounterText: Record<AvatarGroupSize, string> = {
  sm: "text-[10px]",
  md: "text-[14px]",
  lg: "text-[16px]",
};

/* ─── AvatarGroup Component ─── */

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ size = "md", max, className, children, ...rest }, ref) => {
    const childArray = Children.toArray(children).filter(isValidElement);
    const avatarSize = groupAvatarSize[size];
    const overlap = groupOverlap[size];

    const visible = max ? childArray.slice(0, max) : childArray;
    const overflowCount = max ? childArray.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center", className)}
        {...rest}
      >
        {visible.map((child, i) => (
          <div key={i} className={cn(i > 0 && overlap, "relative")}>
            {isValidElement<AvatarProps>(child)
              ? cloneElement(child, { size: avatarSize, status: "none" })
              : child}
          </div>
        ))}
        {overflowCount > 0 && (
          <div className={cn(overlap, "relative")}>
            <Avatar type="initials" size={avatarSize} initials={`+${overflowCount}`} />
          </div>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
