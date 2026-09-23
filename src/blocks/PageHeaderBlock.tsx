import {
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Icon, type IconName } from "../components/Icon";
import { Spinner } from "../components/Spinner";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type PageHeaderHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * There is no `info` tone: the library's info ramp has only `info-400`/`info-500`
 * and no ground or text role that inverts for dark mode, so an info badge could
 * not be made readable in both modes without inventing a token.
 */
export type PageHeaderStatusTone = "neutral" | "success" | "warning" | "danger";

export interface PageHeaderStatus {
  /** Carries the meaning in words; the tone only tints it. */
  label: string;
  /** @default "neutral" */
  tone?: PageHeaderStatusTone;
  /** One sentence explaining the status, shown beside it. */
  description?: string;
}

interface PageHeaderCrumbBase {
  id: string;
  label: string;
  icon?: IconName;
}

/**
 * A crumb is a destination or an action. The last crumb is the current page and
 * is rendered as plain text with `aria-current="page"`, so it needs neither.
 */
export type PageHeaderBreadcrumb =
  | (PageHeaderCrumbBase & { href: string; onClick?: () => void })
  | (PageHeaderCrumbBase & { onClick: () => void; href?: undefined })
  | (PageHeaderCrumbBase & { href?: undefined; onClick?: undefined });

export type PageHeaderActionPriority = "primary" | "secondary" | "overflow";

interface PageHeaderActionBase {
  id: string;
  label: string;
  icon?: IconName;
  /** @default "secondary" */
  priority?: PageHeaderActionPriority;
  /** Longer spoken name where the visible label is terse. */
  description?: string;
}

export type PageHeaderAction =
  | (PageHeaderActionBase & { href: string; external?: boolean; onClick?: () => void })
  | (PageHeaderActionBase & { onClick: () => void; href?: undefined })
  | (PageHeaderActionBase & {
      /** Why the viewer cannot use this action. Rendered next to a disabled control. */
      unavailableReason: string;
      href?: undefined;
      onClick?: undefined;
    });

export interface PageHeaderMetaItem {
  id: string;
  label: string;
  value: ReactNode;
  icon?: IconName;
}

export interface PageHeaderBackAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export type PageHeaderState = "default" | "loading" | "error";

export interface PageHeaderBlockProps {
  /** Required: a page header without a title is not a page header. */
  title: ReactNode;
  /**
   * Heading element for {@link title}. A page header usually owns the page's
   * only `h1`; drop it to `h2` when the shell already provides one.
   * @default "h1"
   */
  headingLevel?: PageHeaderHeadingLevel;
  /** Small label above the title. Not a heading. */
  eyebrow?: ReactNode;
  description?: ReactNode;

  breadcrumbs?: PageHeaderBreadcrumb[];
  /** Accessible name for the breadcrumb landmark. @default "Breadcrumb" */
  breadcrumbLabel?: string;
  /**
   * Trail length before the middle collapses behind a disclosure. The first and
   * the last two crumbs always stay visible. @default 4
   */
  maxVisibleBreadcrumbs?: number;
  /** Spoken label for the expand toggle. Receives the number of hidden levels. */
  breadcrumbExpandLabel?: (hiddenCount: number) => string;
  /** Spoken label for the same toggle once the trail is expanded. */
  breadcrumbCollapseLabel?: (hiddenCount: number) => string;

  status?: PageHeaderStatus;
  meta?: PageHeaderMetaItem[];
  /** Accessible name for the meta list. @default "Page details" */
  metaLabel?: string;
  /** Reveal metadata on demand below 640px of container width. @default true */
  collapseMetaOnSmallScreens?: boolean;
  /** Surface includes padding and a background; plain fits an existing page gutter. */
  variant?: "surface" | "plain";

  backAction?: PageHeaderBackAction;

  actions?: PageHeaderAction[];
  /** Accessible name for the action group. @default "Page actions" */
  actionsLabel?: string;
  /**
   * How many actions stay inline before the remaining secondary ones move into
   * the overflow disclosure. Primary actions are never moved. @default 3
   */
  maxInlineActions?: number;
  /** @default "More actions" */
  overflowLabel?: string;

  /** @default "default" */
  state?: PageHeaderState;
  errorTitle?: string;
  errorDescription?: string;
  /** The retry control is omitted entirely when no handler is supplied. */
  onRetry?: () => void;
  loadingMessage?: string;

  /** Content under the header row, e.g. a tab bar or a filter row. */
  children?: ReactNode;

  /** Lands on the container root, outside the padded surface. */
  className?: string;
}

/* ─── Recipes ────────────────────────────────────────────────────────── */

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

/** Minimum height, never a fixed width: a translated label must be able to grow (audit B13). */
const ACTION_BASE = cn(
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-body-sm font-semibold break-words transition-colors",
  FOCUS_RING
);

const ACTION_PRIMARY = "bg-action-primary text-white hover:bg-action-primary-hover";
const ACTION_SECONDARY =
  "border border-surface-border bg-surface text-grey-700 hover:bg-surface-muted hover:text-grey-900";

const STATUS_TONE: Record<PageHeaderStatusTone, string> = {
  neutral: "bg-grey-100 text-grey-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-error-50 text-error-700",
};

/* ─── Component ──────────────────────────────────────────────────────── */

export function PageHeaderBlock({
  title,
  headingLevel = "h1",
  eyebrow,
  description,
  breadcrumbs = [],
  breadcrumbLabel = "Breadcrumb",
  maxVisibleBreadcrumbs = 4,
  breadcrumbExpandLabel = (count) =>
    count === 1 ? "Show 1 hidden level" : `Show ${count} hidden levels`,
  breadcrumbCollapseLabel = (count) => (count === 1 ? "Hide 1 level" : `Hide ${count} levels`),
  status,
  meta = [],
  metaLabel = "Page details",
  collapseMetaOnSmallScreens = true,
  variant = "surface",
  backAction,
  actions = [],
  actionsLabel = "Page actions",
  maxInlineActions = 3,
  overflowLabel = "More actions",
  state = "default",
  errorTitle = "This page could not be loaded",
  errorDescription,
  onRetry,
  loadingMessage = "Loading page details",
  children,
  className,
}: PageHeaderBlockProps) {
  const uid = useId();
  const Heading = headingLevel;
  const overflowId = `${uid}-overflow`;
  const statusDescriptionId = `${uid}-status-description`;

  const [metaExpanded, setMetaExpanded] = useState(false);
  const metaId = `${uid}-meta`;
  const surfaceClass = cn(
    "flex w-full flex-col gap-4 border-b border-surface-border py-5",
    variant === "surface" && "bg-surface px-4 @min-[640px]:px-6"
  );
  const [crumbsExpanded, setCrumbsExpanded] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowToggleRef = useRef<HTMLButtonElement>(null);

  /* ── Action partitioning ─────────────────────────────────────────── */
  const primaryActions = actions.filter((action) => action.priority === "primary");
  const explicitOverflow = actions.filter((action) => action.priority === "overflow");
  const secondaryActions = actions.filter(
    (action) => action.priority !== "primary" && action.priority !== "overflow"
  );
  const inlineSecondaryBudget = Math.max(0, maxInlineActions - primaryActions.length);
  const inlineSecondary = secondaryActions.slice(0, inlineSecondaryBudget);
  const overflowActions = [...secondaryActions.slice(inlineSecondaryBudget), ...explicitOverflow];

  function closeOverflow() {
    setOverflowOpen(false);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || !overflowOpen) return;
    setOverflowOpen(false);
    overflowToggleRef.current?.focus();
  }

  /* ── Action rendering ────────────────────────────────────────────── */
  function renderAction(action: PageHeaderAction, tone: "primary" | "secondary" | "stacked") {
    const unavailable = "unavailableReason" in action ? action.unavailableReason : undefined;
    const reasonId = `${uid}-${action.id}-reason`;
    const classes = cn(
      ACTION_BASE,
      tone === "primary" && ACTION_PRIMARY,
      tone === "secondary" && ACTION_SECONDARY,
      tone === "stacked" && "w-full justify-start text-grey-700 hover:bg-surface-muted"
    );

    const inner = (
      <>
        {action.icon && <Icon name={action.icon} size="sm" className="shrink-0" />}
        <span className="break-words">{action.label}</span>
        {action.description && <span className="sr-only">{action.description}</span>}
      </>
    );

    if (unavailable) {
      return (
        <div key={action.id} className="flex min-w-0 flex-col gap-1">
          <button
            type="button"
            disabled
            aria-describedby={reasonId}
            className={cn(
              classes,
              "cursor-not-allowed border-surface-border bg-grey-100 text-grey-500"
            )}
          >
            {inner}
          </button>
          <p id={reasonId} className="max-w-[28ch] text-body-xs break-words text-grey-500">
            {unavailable}
          </p>
        </div>
      );
    }

    if (action.href) {
      return (
        <a
          key={action.id}
          href={action.href}
          onClick={() => {
            action.onClick?.();
            if (tone === "stacked") closeOverflow();
          }}
          {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
          className={classes}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        key={action.id}
        type="button"
        onClick={() => {
          action.onClick?.();
          if (tone === "stacked") closeOverflow();
        }}
        className={classes}
      >
        {inner}
      </button>
    );
  }

  /* ── Breadcrumbs ─────────────────────────────────────────────────── */
  function renderCrumbContent(crumb: PageHeaderBreadcrumb, isLast: boolean): ReactNode {
    const label = (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        {crumb.icon && <Icon name={crumb.icon} size="sm" className="shrink-0" />}
        <span className="break-words">{crumb.label}</span>
      </span>
    );

    if (isLast) {
      return (
        <span aria-current="page" className="font-semibold text-grey-900">
          {label}
        </span>
      );
    }
    if (crumb.href) {
      return (
        <a
          href={crumb.href}
          onClick={crumb.onClick}
          className={cn(
            "rounded text-grey-500 underline-offset-4 hover:text-grey-900 hover:underline",
            FOCUS_RING
          )}
        >
          {label}
        </a>
      );
    }
    if (crumb.onClick) {
      return (
        <button
          type="button"
          onClick={crumb.onClick}
          className={cn(
            "cursor-pointer rounded text-grey-500 underline-offset-4 hover:text-grey-900 hover:underline",
            FOCUS_RING
          )}
        >
          {label}
        </button>
      );
    }
    return <span className="text-grey-500">{label}</span>;
  }

  function renderBreadcrumbs() {
    if (breadcrumbs.length === 0) return null;

    const lastIndex = breadcrumbs.length - 1;
    // A long trail keeps its root and its final two levels. Everything between
    // stays mounted and hidden, so the toggle's `aria-controls` always resolves
    // to real elements and the trail can be collapsed again after expanding.
    const collapses = maxVisibleBreadcrumbs >= 3 && breadcrumbs.length > maxVisibleBreadcrumbs;
    const hiddenFrom = 1;
    const hiddenTo = collapses ? lastIndex - 1 : 1;
    const hiddenCount = Math.max(0, hiddenTo - hiddenFrom);
    const hiddenIds = collapses
      ? breadcrumbs.slice(hiddenFrom, hiddenTo).map((crumb) => `${uid}-crumb-${crumb.id}`)
      : [];

    const rows: ReactNode[] = [];
    breadcrumbs.forEach((crumb, index) => {
      const isLast = index === lastIndex;
      const isCollapsible = collapses && index >= hiddenFrom && index < hiddenTo;

      if (collapses && index === hiddenFrom) {
        rows.push(
          <li key="__collapse" className="flex min-w-0 items-center gap-1">
            <Icon name="chevron-right" size="sm" className="shrink-0 text-grey-400" />
            <button
              type="button"
              aria-expanded={crumbsExpanded}
              aria-controls={hiddenIds.join(" ")}
              onClick={() => setCrumbsExpanded((open) => !open)}
              className={cn(
                "inline-flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded px-1.5 text-grey-500 hover:bg-surface-muted hover:text-grey-900",
                FOCUS_RING
              )}
            >
              <span aria-hidden="true">…</span>
              <span className="sr-only">
                {crumbsExpanded
                  ? breadcrumbCollapseLabel(hiddenCount)
                  : breadcrumbExpandLabel(hiddenCount)}
              </span>
            </button>
          </li>
        );
      }

      rows.push(
        <li
          key={crumb.id}
          id={`${uid}-crumb-${crumb.id}`}
          className={cn(
            "flex min-w-0 items-center gap-1",
            isCollapsible && !crumbsExpanded && "hidden"
          )}
        >
          {index > 0 && <Icon name="chevron-right" size="sm" className="shrink-0 text-grey-400" />}
          {renderCrumbContent(crumb, isLast)}
        </li>
      );
    });

    return (
      <nav aria-label={breadcrumbLabel} className="min-w-0">
        <ol className="flex list-none flex-wrap items-center gap-x-1 gap-y-1 text-body-sm">
          {rows}
        </ol>
      </nav>
    );
  }

  /* ── States ──────────────────────────────────────────────────────── */
  if (state === "loading") {
    return (
      <div className={cn("@container relative w-full", className)}>
        <div aria-busy="true" className={surfaceClass}>
          <div aria-hidden="true" className="flex flex-col gap-3">
            <div className="h-4 w-40 max-w-full rounded bg-grey-100" />
            <div className="h-8 w-72 max-w-full rounded bg-grey-100" />
            <div className="h-4 w-full max-w-[52ch] rounded bg-grey-100" />
          </div>
          <p role="status" className="flex items-center gap-2 text-body-sm text-grey-500">
            <Spinner size="sm" />
            <span>{loadingMessage}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      // `@container` on the outer element, outside the padded surface, so the
      // `@min-[…]` padding inside resolves against the header's real width.
      className={cn("@container relative w-full", className)}
    >
      <div className={surfaceClass}>
        {backAction &&
          (backAction.href ? (
            <a
              href={backAction.href}
              onClick={backAction.onClick}
              className={cn(
                "inline-flex min-h-8 w-fit items-center gap-1.5 rounded text-body-sm font-medium text-grey-500 hover:text-grey-900",
                FOCUS_RING
              )}
            >
              <Icon name="arrow-left" size="sm" />
              <span className="break-words">{backAction.label}</span>
            </a>
          ) : backAction.onClick ? (
            <button
              type="button"
              onClick={backAction.onClick}
              className={cn(
                "inline-flex min-h-8 w-fit cursor-pointer items-center gap-1.5 rounded text-body-sm font-medium text-grey-500 hover:text-grey-900",
                FOCUS_RING
              )}
            >
              <Icon name="arrow-left" size="sm" />
              <span className="break-words">{backAction.label}</span>
            </button>
          ) : null)}

        {renderBreadcrumbs()}

        <div className="flex flex-col gap-4 @min-[720px]:flex-row @min-[720px]:items-start @min-[720px]:justify-between @min-[720px]:gap-6">
          <div className="flex min-w-0 flex-col gap-2">
            {eyebrow && (
              <p className="text-caption-sm font-semibold break-words text-action-primary-text uppercase">
                {eyebrow}
              </p>
            )}
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
              <Heading className="min-w-0 text-h6 font-semibold break-words text-grey-900 @min-[640px]:text-h5">
                {title}
              </Heading>
              {status && (
                <span
                  aria-describedby={status.description ? statusDescriptionId : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-body-xs font-semibold break-words",
                    STATUS_TONE[status.tone ?? "neutral"]
                  )}
                >
                  {status.label}
                </span>
              )}
            </div>
            {status?.description && (
              <p id={statusDescriptionId} className="text-body-sm break-words text-grey-500">
                {status.description}
              </p>
            )}
            {description && (
              <p className="max-w-[68ch] text-body-sm break-words text-grey-500">{description}</p>
            )}
          </div>

          {actions.length > 0 && (
            <div className="flex min-w-0 shrink-0 flex-col gap-2">
              <div
                role="group"
                aria-label={actionsLabel}
                className="flex flex-wrap items-start gap-2 @min-[720px]:justify-end"
              >
                {inlineSecondary.map((action) => renderAction(action, "secondary"))}
                {primaryActions.map((action) => renderAction(action, "primary"))}
                {overflowActions.length > 0 && (
                  <button
                    ref={overflowToggleRef}
                    type="button"
                    aria-expanded={overflowOpen}
                    aria-controls={overflowId}
                    onClick={() => setOverflowOpen((open) => !open)}
                    className={cn(ACTION_BASE, ACTION_SECONDARY)}
                  >
                    <Icon name="dots-h" size="sm" />
                    <span className="break-words">{overflowLabel}</span>
                  </button>
                )}
              </div>
              {/* Always mounted, so `aria-controls` resolves to a real element
                  even while the group is closed (audit B01). */}
              <div
                id={overflowId}
                className={cn(
                  "flex w-full flex-col gap-1 rounded-lg border border-surface-border bg-surface p-1 @min-[720px]:min-w-[220px]",
                  !overflowOpen && "hidden"
                )}
              >
                {overflowActions.map((action) => renderAction(action, "stacked"))}
              </div>
            </div>
          )}
        </div>

        {meta.length > 0 && (
          <div>
            {collapseMetaOnSmallScreens && (
              <button
                type="button"
                aria-expanded={metaExpanded}
                aria-controls={metaId}
                onClick={() => setMetaExpanded((value) => !value)}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded text-body-sm font-medium text-grey-600 @min-[640px]:hidden",
                  FOCUS_RING
                )}
              >
                {metaLabel}
                <Icon name={metaExpanded ? "chevron-up" : "chevron-down"} size="sm" />
              </button>
            )}
            <dl
              id={metaId}
              aria-label={metaLabel}
              className={cn(
                "flex flex-wrap gap-x-6 gap-y-3 border-t border-surface-border pt-4",
                collapseMetaOnSmallScreens && !metaExpanded && "hidden @min-[640px]:flex"
              )}
            >
              {meta.map((item) => (
                <div key={item.id} className="flex min-w-0 flex-col gap-0.5">
                  <dt className="text-body-xs font-medium break-words text-grey-500">
                    {item.label}
                  </dt>
                  <dd className="flex min-w-0 items-center gap-1.5 text-body-sm font-medium break-words text-grey-900">
                    {item.icon && (
                      <Icon name={item.icon} size="sm" className="shrink-0 text-grey-500" />
                    )}
                    <span className="min-w-0 break-words">{item.value}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {state === "error" && (
          <div
            role="alert"
            className="flex flex-col gap-2 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-error-700"
          >
            <p className="text-body-sm font-semibold break-words">{errorTitle}</p>
            {errorDescription && <p className="text-body-sm break-words">{errorDescription}</p>}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className={cn(
                  "inline-flex min-h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-current px-4 py-2 text-body-sm font-semibold",
                  FOCUS_RING
                )}
              >
                <Icon name="refresh" size="sm" />
                Try again
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
