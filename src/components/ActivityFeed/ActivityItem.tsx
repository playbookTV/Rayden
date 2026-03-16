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
      <div ref={ref} className={cn("flex gap-3 items-start", className)} {...rest}>
        {/* ─── Side Container (avatar + connectors) ─────────── */}
        <div
          className={cn(
            "flex flex-col items-center shrink-0 gap-1 self-stretch",
            (connector === "last" || !connector) && "justify-start"
          )}
        >
          {/* Connector line above avatar */}
          {hasConnectorAbove && <div className="h-2 w-px bg-grey-100" />}

          {/* Avatar */}
          <div className="shrink-0 size-8">{avatar}</div>

          {/* Connector line below avatar */}
          {hasConnectorBelow && <div className="flex-1 w-px bg-grey-100" />}
        </div>

        {/* ─── Content ──────────────────────────────────────── */}
        <div
          className={cn(
            "flex flex-1 flex-col gap-3 items-start min-w-0",
            !connector && "",
            connector === "top" && "pb-4",
            (connector === "middle" || connector === "last") && "py-4"
          )}
        >
          {/* Feed details */}
          <div className="flex flex-col gap-1 w-full">
            {/* Primary text row */}
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-1 items-start gap-1 min-w-0">
                <span className="text-body-sm leading-5 text-grey-600">{text}</span>
              </div>
              {unread && (
                <span className="shrink-0 size-2 rounded-full bg-[#04802E] border-[1.5px] border-white" />
              )}
            </div>

            {/* Meta row */}
            {(date || time || link || badge) && (
              <div className="flex items-start gap-1 w-full">
                <div className="flex flex-1 items-start min-w-0">
                  {date && <span className="text-xs text-grey-400 whitespace-nowrap">{date}</span>}
                  {link && (
                    <>
                      <span className="text-xs text-grey-400 whitespace-nowrap">・</span>
                      {link.href ? (
                        <a
                          href={link.href}
                          onClick={link.onClick}
                          className="text-xs font-medium text-primary-400 underline whitespace-nowrap"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={link.onClick}
                          className="text-xs font-medium text-primary-400 underline whitespace-nowrap"
                        >
                          {link.label}
                        </button>
                      )}
                    </>
                  )}
                  {badge && (
                    <>
                      <span className="text-xs text-grey-400 whitespace-nowrap">・</span>
                      <span className="inline-flex items-center justify-center rounded-full bg-primary-400 px-2 text-xs font-medium text-white whitespace-nowrap">
                        {badge}
                      </span>
                    </>
                  )}
                </div>
                {time && (
                  <span className="shrink-0 text-xs text-grey-400 whitespace-nowrap">{time}</span>
                )}
              </div>
            )}
          </div>

          {/* Optional content block */}
          {children}
        </div>
      </div>
    );
  }
);

ActivityItem.displayName = "ActivityItem";
