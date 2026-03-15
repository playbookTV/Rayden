import { type ReactNode } from "react";
import { cn } from "../utils/cn";
import { ActivityItem } from "../components/ActivityFeed/ActivityItem";
import { ActivityContent } from "../components/ActivityFeed/ActivityContent";
import { Avatar } from "../components/Avatar";
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
  unreadCount,
  items,
  className,
}: NotificationsBlockProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06),0px_5px_3px_-2px_rgba(0,0,0,0.02)] pt-4 pb-8 overflow-clip",
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-1.5 flex items-center gap-2">
        <h3 className="flex-1 text-lg font-semibold text-grey-700">
          {title}
        </h3>
        {unreadCount != null && unreadCount > 0 && (
          <Badge color="success" type="accent" size="sm">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4 px-6 mt-6">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const hasMultiple = items.length > 1;

          // Determine connector based on position in list
          let connector: "top" | "middle" | "last" | undefined;
          if (hasMultiple && items.length > 2) {
            if (isFirst) connector = undefined;
            else if (isLast) connector = undefined;
            // We can keep items as independent (no connector lines for a simple notification list)
          }

          return (
            <div key={item.id}>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
