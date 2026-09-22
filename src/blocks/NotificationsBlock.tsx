import { useId, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { ActivityItem } from "../components/ActivityFeed/ActivityItem";
import { ActivityContent } from "../components/ActivityFeed/ActivityContent";
import { Badge } from "../components/Badge";

// ─── Types ───────────────────────────────────────────────────────────
export interface NotificationItem {
  id: string;
  avatar: ReactNode;
  text: ReactNode;
  date: string;
  time: string;
  unread?: boolean;
  link?: { label: string; href?: string; onClick?: () => void };
  badge?: string;
  content?:
    | {
        type: "file";
        title: string;
        size?: string;
        fileType?: string;
        date?: string;
      }
    | {
        type: "comment";
        avatar: ReactNode;
        author: string;
        timestamp: string;
        comment: string;
        reactions?: number;
        replies?: number;
      }
    | {
        type: "cta";
        primaryAction: { label: string; onClick?: () => void };
        secondaryAction?: { label: string; onClick?: () => void };
      };
}

export interface NotificationsBlockProps {
  /** Block title */
  title?: string;
  /** Heading level for the block title, so the block fits a page's outline */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Unread notification count */
  unreadCount?: number;
  /** Notification items */
  items: NotificationItem[];
  /** Additional class names */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────
export function NotificationsBlock({
  title = "Notifications",
  headingLevel = 3,
  unreadCount,
  items,
  className,
}: NotificationsBlockProps) {
  const headingId = useId();
  const Heading = `h${headingLevel}` as const;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "bg-white dark:bg-grey-50 rounded-xl shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06),0px_5px_3px_-2px_rgba(0,0,0,0.02)] pt-4 pb-8",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-1.5 flex items-center gap-2">
        <Heading id={headingId} className="flex-1 text-lg font-semibold text-grey-700">
          {title}
        </Heading>
        {unreadCount != null && unreadCount > 0 && (
          <Badge color="success" type="accent" size="sm">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Items — a static notification list is a list, not an ARIA feed. The feed
          pattern additionally requires per-article accessible names, aria-posinset /
          aria-setsize, and a focus-driven loading model that this block does not
          implement, so native list semantics are the honest contract here. The
          explicit role keeps the list exposed when list markers are removed. */}
      <ul role="list" className="flex flex-col gap-4 px-6 mt-6 list-none">
        {items.map((item) => {
          return (
            <li key={item.id} className="min-w-0">
              <ActivityItem
                avatar={item.avatar}
                text={item.text}
                date={item.date}
                time={item.time}
                unread={item.unread}
                link={item.link}
                badge={item.badge}
              >
                {item.content?.type === "file" && (
                  <ActivityContent
                    variant="file"
                    contentStyle="container"
                    title={item.content.title}
                    size={item.content.size}
                    fileType={item.content.fileType}
                    date={item.content.date}
                  />
                )}
                {item.content?.type === "comment" && (
                  <ActivityContent
                    variant="comment"
                    contentStyle="container"
                    avatar={item.content.avatar}
                    author={item.content.author}
                    timestamp={item.content.timestamp}
                    comment={item.content.comment}
                    reactions={item.content.reactions}
                    replies={item.content.replies}
                  />
                )}
                {item.content?.type === "cta" && (
                  <ActivityContent
                    variant="cta"
                    primaryAction={item.content.primaryAction}
                    secondaryAction={item.content.secondaryAction}
                  />
                )}
              </ActivityItem>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
