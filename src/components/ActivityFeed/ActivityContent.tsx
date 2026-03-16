import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import { Icon } from "../Icon";
import type { IconName } from "../Icon";

export type ActivityContentVariant = "file" | "comment" | "cta";
export type ActivityContentStyle = "plain" | "card" | "container";

export interface ActivityContentAttachment {
  name: string;
  extension: string;
}

export interface ActivityContentAction {
  label: string;
  onClick?: () => void;
}

export interface ActivityContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content variant */
  variant: ActivityContentVariant;
  /** Visual style wrapper */
  contentStyle?: ActivityContentStyle;

  // ─── File variant props ─────────────────────────────────
  /** Leading icon for file variant */
  icon?: ReactNode | IconName;
  /** File name */
  title?: string;
  /** File size (e.g., "13MB") */
  size?: string;
  /** File type label (e.g., "PDF File") */
  fileType?: string;
  /** File date (e.g., "11 Sept 23") */
  date?: string;

  // ─── Comment variant props ──────────────────────────────
  /** Avatar element for comment author */
  avatar?: ReactNode;
  /** Author name */
  author?: string;
  /** Timestamp (e.g., "2 hours ago") */
  timestamp?: string;
  /** Comment body text */
  comment?: string;
  /** File attachments */
  attachments?: ActivityContentAttachment[];
  /** Number of reactions */
  reactions?: number;
  /** Number of replies */
  replies?: number;
  /** Reply button callback */
  onReply?: () => void;

  // ─── CTA variant props ─────────────────────────────────
  /** Primary action (e.g., Accept) */
  primaryAction?: ActivityContentAction;
  /** Secondary action (e.g., Decline) */
  secondaryAction?: ActivityContentAction;
}

// ─── Style wrapper classes ────────────────────────────────
const styleClasses: Record<ActivityContentStyle, string> = {
  plain: "",
  card: "bg-white dark:bg-grey-50 rounded-lg p-2 shadow-[0px_2px_5px_-2px_rgba(16,25,40,0.06),0px_2px_7px_0px_rgba(16,25,40,0.05),0px_0px_0px_1px_rgba(16,25,40,0.05)]",
  container: "bg-grey-50 border border-grey-100 rounded-lg p-3",
};

export const ActivityContent = forwardRef<HTMLDivElement, ActivityContentProps>(
  (
    {
      variant,
      contentStyle = "card",
      // File props
      icon,
      title,
      size,
      fileType,
      date,
      // Comment props
      avatar,
      author,
      timestamp,
      comment,
      attachments,
      reactions,
      replies,
      onReply,
      // CTA props
      primaryAction,
      secondaryAction,
      className,
      ...rest
    },
    ref
  ) => {
    // ─── File variant ─────────────────────────────────────
    if (variant === "file") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", styleClasses[contentStyle], className)}
          {...rest}
        >
          {/* File icon */}
          <div className="flex shrink-0 items-center justify-center size-8 rounded-lg bg-primary-50">
            <span className="size-4">{resolveIcon(icon ?? "file", "sm")}</span>
          </div>

          {/* File details */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-grey-700 whitespace-nowrap">{title}</span>
              {size && (
                <>
                  <span className="size-0.5 rounded-full bg-grey-400" />
                  <span className="text-xs text-grey-400 whitespace-nowrap">{size}</span>
                </>
              )}
            </div>
            {(fileType || date) && (
              <div className="flex items-center gap-1">
                {fileType && (
                  <span className="text-xs text-grey-400 whitespace-nowrap">{fileType}</span>
                )}
                {fileType && date && <span className="size-0.5 rounded-full bg-grey-400" />}
                {date && <span className="text-xs text-grey-400 whitespace-nowrap">{date}</span>}
              </div>
            )}
          </div>
        </div>
      );
    }

    // ─── Comment variant ──────────────────────────────────
    if (variant === "comment") {
      const wrapperStyle =
        contentStyle === "plain"
          ? "flex gap-2 items-start"
          : cn("flex flex-col gap-2", styleClasses[contentStyle]);

      const commentContent = (
        <>
          {/* Author row */}
          {(avatar || author) && (
            <div className="flex items-center gap-2 w-full">
              {avatar && <div className="shrink-0 size-5">{avatar}</div>}
              <div className="flex items-center">
                {author && (
                  <span className="text-body-sm font-medium text-grey-700 whitespace-nowrap">
                    {author}
                  </span>
                )}
                {timestamp && (
                  <span className="text-xs text-grey-400 whitespace-nowrap">・{timestamp}</span>
                )}
              </div>
            </div>
          )}

          {/* Comment body */}
          {comment && <p className="text-body-sm text-grey-600 leading-5">{comment}</p>}

          {/* File attachments */}
          {attachments && attachments.length > 0 && (
            <div className="flex items-start gap-2">
              {attachments.slice(0, 2).map((file) => (
                <div
                  key={`${file.name}.${file.extension}`}
                  className="flex items-center gap-2 rounded-lg border border-grey-100 bg-white dark:bg-grey-50 pl-1 pr-2 py-1"
                >
                  <div className="flex shrink-0 items-center justify-center size-6 rounded bg-primary-50 border border-primary-50">
                    <span className="size-3">
                      <Icon name="file" size="xs" />
                    </span>
                  </div>
                  <span className="text-xs text-grey-700 whitespace-nowrap">
                    <span className="font-semibold">{file.name}</span>
                    <span className="text-grey-500">.{file.extension}</span>
                  </span>
                </div>
              ))}
              {attachments.length > 2 && (
                <div className="flex items-center justify-center size-8 rounded-lg border border-grey-100 bg-white dark:bg-grey-50 px-2 py-1">
                  <span className="text-xs font-semibold text-grey-700">
                    +{attachments.length - 2}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reactions + Replies */}
          {(reactions != null || replies != null) && (
            <div className="flex items-start gap-2">
              {reactions != null && (
                <div className="flex items-center gap-2 rounded-lg border border-grey-100 bg-white dark:bg-grey-50 px-2 py-1">
                  <span className="text-xs text-grey-700">🤝🔥</span>
                  <span className="text-xs text-grey-700">
                    <span className="font-semibold">{reactions} </span>
                    Reactions
                  </span>
                </div>
              )}
              {replies != null && (
                <div className="flex items-center gap-2 rounded-lg border border-grey-100 bg-white dark:bg-grey-50 px-2 py-1 h-8">
                  <Icon name="message" size="sm" className="text-grey-400" />
                  <span className="text-xs text-grey-700">
                    <span className="font-semibold">{replies} </span>
                    Replies
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reply CTA */}
          {onReply && (
            <button
              type="button"
              onClick={onReply}
              className="inline-flex items-center justify-center rounded-lg border border-grey-300 bg-white dark:bg-grey-50 px-3 py-1 text-xs font-semibold text-grey-700"
            >
              Reply
            </button>
          )}
        </>
      );

      if (contentStyle === "plain") {
        return (
          <div ref={ref} className={cn("flex gap-2 items-start", className)} {...rest}>
            {/* Vertical connector line */}
            <div className="shrink-0 w-px self-stretch bg-grey-100" />
            <div className="flex flex-col gap-2 items-start rounded-lg p-3">{commentContent}</div>
          </div>
        );
      }

      return (
        <div
          ref={ref}
          className={cn("flex flex-col gap-2 items-start", styleClasses[contentStyle], className)}
          {...rest}
        >
          {commentContent}
        </div>
      );
    }

    // ─── CTA variant ──────────────────────────────────────
    if (variant === "cta") {
      return (
        <div ref={ref} className={cn("flex items-start gap-3", className)} {...rest}>
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-body-sm font-semibold text-white"
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="inline-flex items-center justify-center rounded-lg border border-grey-300 bg-white dark:bg-grey-50 px-4 py-2 text-body-sm font-semibold text-grey-700"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      );
    }

    return null;
  }
);

ActivityContent.displayName = "ActivityContent";
