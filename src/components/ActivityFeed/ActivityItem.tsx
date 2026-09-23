import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface ActivityItemLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ActivityItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatar element (e.g., <Avatar />) */
  avatar: ReactNode;
  /** Primary text content — mixed inline content with bold names, action text, highlights */
  text: ReactNode;
  /** Whether this item is unread (shows green dot) */
  unread?: boolean;
  /** Date label (e.g., "Thurs 21, 2023") */
  date?: string;
  /** Time label (e.g., "10 mins") — right-aligned */
  time?: string;
  /** Optional link button in meta row */
  link?: ActivityItemLink;
  /** Optional badge text in meta row (e.g., "#Marketing-Design") */
  badge?: string;
  /** Connector line position for timeline layouts */
  connector?: "top" | "middle" | "last";
  /** Optional content block (e.g., ActivityContent) */
  children?: ReactNode;
}

/**
 * Meta row segments wrap as a group so a separator never starts a line on its own,
 * and long labels break instead of overflowing into the timestamp.
 */
const metaSegmentClasses = "inline-flex max-w-full min-w-0 items-baseline gap-1";
const metaSeparatorClasses = "text-xs text-grey-500";
const metaActionClasses =
  "min-w-0 break-words text-left text-xs font-medium text-action-primary-text underline rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

export const ActivityItem = forwardRef<HTMLDivElement, ActivityItemProps>(
  (
    {
      avatar,
      text,
      unread = false,
      date,
      time,
      link,
      badge,
      connector,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const hasConnectorAbove = connector === "middle" || connector === "last";
    const hasConnectorBelow = connector === "top" || connector === "middle";

    return (
      <article ref={ref} className={cn("flex gap-3 items-start", className)} {...rest}>
        {/* ─── Side Container (avatar + connectors) ─────────── */}
        <div
          className={cn(
            "flex flex-col items-center shrink-0 gap-1 self-stretch",
            (connector === "last" || !connector) && "justify-start"
          )}
        >
          {/* Connector line above avatar */}
          {hasConnectorAbove && <div className="h-2 w-px bg-grey-100" aria-hidden="true" />}

          {/* Avatar */}
          <div className="shrink-0 size-8">{avatar}</div>

          {/* Connector line below avatar */}
          {hasConnectorBelow && <div className="flex-1 w-px bg-grey-100" aria-hidden="true" />}
        </div>

        {/* ─── Content ──────────────────────────────────────── */}
        {/* `@container` makes the meta row respond to the space this item actually
            has, not the viewport — the block also has to work inside narrow sidebars. */}
        <div
          className={cn(
            "@container flex flex-1 flex-col gap-3 items-start min-w-0",
            !connector && "",
            connector === "top" && "pb-4",
            (connector === "middle" || connector === "last") && "py-4"
          )}
        >
          {/* Feed details */}
          <div className="flex flex-col gap-1 w-full">
            {/* Primary text row */}
            <div className="flex items-start justify-between gap-2 w-full">
              <div className="flex flex-1 items-start gap-1 min-w-0">
                <span className="text-body-sm leading-5 text-grey-600 break-words">{text}</span>
              </div>
              {unread && (
                <span
                  className="mt-1.5 shrink-0 size-2 rounded-full bg-[#04802E] border-[1.5px] border-white"
                  aria-hidden="true"
                />
              )}
              {unread && <span className="sr-only">Unread</span>}
            </div>

            {/* Meta row — stacks below ~20rem of available width, wraps above it */}
            {(date || time || link || badge) && (
              <div className="flex w-full flex-col gap-0.5 @min-[20rem]:flex-row @min-[20rem]:items-start @min-[20rem]:gap-2">
                <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1 gap-y-0.5">
                  {date && <span className="text-xs text-grey-500 whitespace-nowrap">{date}</span>}
                  {link && (
                    <span className={metaSegmentClasses}>
                      {date && (
                        <span aria-hidden="true" className={metaSeparatorClasses}>
                          ・
                        </span>
                      )}
                      {link.href ? (
                        <a href={link.href} onClick={link.onClick} className={metaActionClasses}>
                          {link.label}
                        </a>
                      ) : (
                        <button type="button" onClick={link.onClick} className={metaActionClasses}>
                          {link.label}
                        </button>
                      )}
                    </span>
                  )}
                  {badge && (
                    <span className={metaSegmentClasses}>
                      {(date || link) && (
                        <span aria-hidden="true" className={metaSeparatorClasses}>
                          ・
                        </span>
                      )}
                      <span className="inline-flex min-w-0 items-center justify-center break-words rounded-full bg-action-primary px-2 text-xs font-medium text-white">
                        {badge}
                      </span>
                    </span>
                  )}
                </div>
                {time && (
                  <span className="shrink-0 text-xs text-grey-500 whitespace-nowrap">{time}</span>
                )}
              </div>
            )}
          </div>

          {/* Optional content block */}
          {children}
        </div>
      </article>
    );
  }
);

ActivityItem.displayName = "ActivityItem";
