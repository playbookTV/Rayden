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

export type AppShellHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * How wide the shell's own container must be before the sidebar is shown
 * beside the workspace instead of inside the collapsed navigation panel.
 *
 * The values are container widths, not viewport widths: a shell dropped into
 * a 400px column collapses there even on a 1440px screen. Tailwind needs the
 * whole `@min-[…]` class to exist as a literal string, so the tiers are a
 * fixed set rather than a free number.
 */
export type AppShellExpandTier = "sm" | "md" | "lg";

interface TierClasses {
  /** Visible only once the shell has expanded. */
  expandedFlex: string;
  /** Visible only while the shell is collapsed. */
  collapsed: string;
  /** Row direction switch for the sidebar/workspace split. */
  row: string;
  /** Sidebar column width, applied at the same threshold. */
  sidebarWidth: string;
  /** Roomier workspace and top-bar padding once the shell has the width for it. */
  pad: string;
}

const TIER: Record<AppShellExpandTier, TierClasses> = {
  sm: {
    expandedFlex: "hidden @min-[720px]:flex",
    collapsed: "@min-[720px]:hidden",
    row: "@min-[720px]:flex-row",
    sidebarWidth: "@min-[720px]:w-[248px]",
    pad: "@min-[720px]:px-6",
  },
  md: {
    expandedFlex: "hidden @min-[900px]:flex",
    collapsed: "@min-[900px]:hidden",
    row: "@min-[900px]:flex-row",
    sidebarWidth: "@min-[900px]:w-[264px]",
    pad: "@min-[900px]:px-6",
  },
  lg: {
    expandedFlex: "hidden @min-[1080px]:flex",
    collapsed: "@min-[1080px]:hidden",
    row: "@min-[1080px]:flex-row",
    sidebarWidth: "@min-[1080px]:w-[280px]",
    pad: "@min-[1080px]:px-6",
  },
};

interface AppShellNavItemBase {
  id: string;
  label: string;
  icon?: IconName;
  /** Short supporting line under the label. Omitted in the compact sidebar. */
  description?: string;
  /** Short visible count or tag, e.g. "12". */
  badge?: string;
  /** Spoken replacement for {@link badge}, e.g. "12 unread messages". */
  badgeDescription?: string;
  /** Marks the destination the workspace is currently showing. */
  current?: boolean;
}

/**
 * A destination is an anchor, an action is a button, and an item the viewer may
 * not open is a disabled button with a visible reason. There is no fourth arm,
 * so a navigation item with nothing to do cannot be expressed.
 */
export type AppShellNavItem =
  | (AppShellNavItemBase & { href: string; external?: boolean; onClick?: () => void })
  | (AppShellNavItemBase & { onClick: () => void; href?: undefined })
  | (AppShellNavItemBase & {
      /** Why this destination is unavailable to the current viewer. */
      unavailableReason: string;
      href?: undefined;
      onClick?: undefined;
    });

export interface AppShellNavSection {
  id: string;
  /** Rendered as a heading at {@link ApplicationShellBlockProps.sectionHeadingLevel}. */
  label?: string;
  items: AppShellNavItem[];
}

interface AppShellActionBase {
  id: string;
  label: string;
  /** With an icon the control is icon-only and named by {@link label}. */
  icon?: IconName;
  badge?: string;
  badgeDescription?: string;
}

export type AppShellAction =
  | (AppShellActionBase & { href: string; external?: boolean; onClick?: () => void })
  | (AppShellActionBase & { onClick: () => void; href?: undefined });

export type AppShellNavStatus = "idle" | "loading" | "error";

/** Who owns the vertical scrollbar. See {@link ApplicationShellBlockProps.mainScroll}. */
export type AppShellMainScroll = "page" | "region";

export interface ApplicationShellBlockProps {
  /** Wordmark or logo. Rendered in the sidebar when expanded, in the top bar when collapsed. */
  brand?: ReactNode;
  /** Destination behind the brand. Without it the brand is not a control. */
  brandHref?: string;
  onBrandClick?: () => void;

  navSections?: AppShellNavSection[];
  /** Accessible name for the primary navigation landmark. @default "Main" */
  navLabel?: string;
  /** Heading element for section labels. @default "h2" */
  sectionHeadingLevel?: AppShellHeadingLevel;
  /** @default "idle" */
  navStatus?: AppShellNavStatus;
  navErrorMessage?: string;
  /** The retry control is omitted entirely when no handler is supplied. */
  onRetryNav?: () => void;
  navLoadingMessage?: string;
  /**
   * Shown when `navSections` carries no items and the status is idle. It has
   * no default: without it a shell with no destinations renders no navigation
   * rail at all, rather than an empty one. Supply it to state why the rail is
   * empty instead of leaving the reader to guess.
   */
  navEmptyMessage?: string;

  /**
   * Search field. A single instance lives in the top bar at every width; on a
   * narrow shell it wraps onto its own row rather than disappearing.
   */
  search?: ReactNode;
  /**
   * Workspace switcher. A single instance, in the top bar at every width, so it
   * is never dropped from the collapsed arrangement.
   */
  switcher?: ReactNode;
  /** Trailing top-bar controls, e.g. notifications or help. */
  actions?: AppShellAction[];
  /** Accessible name for the trailing control group. @default "Account and tools" */
  actionsLabel?: string;

  /**
   * Content under the navigation. Rendered in both the sidebar and the
   * collapsed panel, so keep it stateless or controlled by the consumer.
   */
  sidebarFooter?: ReactNode;

  /** Label for the collapsed navigation toggle when closed. @default "Open navigation" */
  openMenuLabel?: string;
  /** Label for the collapsed navigation toggle when open. @default "Close navigation" */
  closeMenuLabel?: string;
  /** @default "Skip to main content" */
  skipLinkLabel?: string;
  /** Accessible name for the landmark holding the skip link. @default "Skip links" */
  skipNavLabel?: string;

  /**
   * Which container width the sidebar appears at. Read from the shell's own
   * width, never the viewport. @default "md"
   */
  expandAt?: AppShellExpandTier;

  /**
   * `"page"` (default) lets the document scroll, so the shell has exactly one
   * scroll region and an overlay above it cannot fight a second one. `"region"`
   * gives the workspace its own scrollbar and needs a bounded height on the
   * shell — pass it through `className`, e.g. `h-[100dvh]`.
   * @default "page"
   */
  mainScroll?: AppShellMainScroll;
  /** Keeps the top bar in view while the workspace scrolls. @default true */
  stickyTopBar?: boolean;

  /** Accessible name for the workspace landmark. @default "Workspace" */
  mainLabel?: string;
  /** Workspace content. */
  children?: ReactNode;

  /** Lands on the container root, outside the top bar and workspace padding. */
  className?: string;
}

/* ─── Shared recipes ─────────────────────────────────────────────────── */

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

const NAV_ITEM_BASE = cn(
  "group flex min-h-11 w-full min-w-0 items-start gap-3 rounded-lg px-3 py-2 text-left text-body-sm font-medium transition-colors",
  FOCUS_RING
);

/* ─── Navigation item ────────────────────────────────────────────────── */

function NavBadge({
  badge,
  badgeDescription,
}: Readonly<{ badge: string; badgeDescription?: string }>) {
  return (
    <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-grey-100 px-2 py-0.5 text-body-xs font-semibold text-grey-700">
      <span aria-hidden={badgeDescription ? true : undefined}>{badge}</span>
      {badgeDescription && <span className="sr-only">{badgeDescription}</span>}
    </span>
  );
}

/**
 * One element for both arrangements. The collapsed panel used to rebuild
 * destinations as buttons, which dropped the href and sent them nowhere
 * (audit B01); rendering an anchor whenever there is an href makes that
 * impossible to reintroduce.
 */
function ShellNavItem({
  item,
  showDescription,
  onNavigate,
  reasonIdPrefix,
}: Readonly<{
  item: AppShellNavItem;
  showDescription?: boolean;
  onNavigate?: () => void;
  reasonIdPrefix: string;
}>) {
  const unavailable = "unavailableReason" in item ? item.unavailableReason : undefined;
  const reasonId = `${reasonIdPrefix}-${item.id}-reason`;

  const body = (
    <>
      {item.icon && (
        <Icon
          name={item.icon}
          size="md"
          className={cn(
            "mt-0.5 shrink-0",
            item.current ? "text-action-primary-text" : "text-grey-500"
          )}
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="break-words">{item.label}</span>
        {showDescription && item.description && (
          <span className="text-body-xs font-normal break-words text-grey-500">
            {item.description}
          </span>
        )}
      </span>
      {item.badge && <NavBadge badge={item.badge} badgeDescription={item.badgeDescription} />}
    </>
  );

  if (unavailable) {
    return (
      <li>
        <button
          type="button"
          disabled
          aria-describedby={reasonId}
          className={cn(NAV_ITEM_BASE, "cursor-not-allowed text-grey-500")}
        >
          <Icon
            name="lock"
            size="md"
            className="mt-0.5 shrink-0 text-grey-500"
            aria-hidden="true"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="break-words">{item.label}</span>
          </span>
        </button>
        <p id={reasonId} className="px-3 pb-1 text-body-xs break-words text-grey-500">
          {unavailable}
        </p>
      </li>
    );
  }

  const tone = item.current
    ? "bg-primary-50 text-grey-900"
    : "text-grey-700 hover:bg-surface-muted hover:text-grey-900";

  if (item.href) {
    return (
      <li>
        <a
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          onClick={() => {
            item.onClick?.();
            onNavigate?.();
          }}
          {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          className={cn(NAV_ITEM_BASE, tone)}
        >
          {body}
        </a>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        aria-current={item.current ? "page" : undefined}
        onClick={() => {
          item.onClick?.();
          onNavigate?.();
        }}
        className={cn(NAV_ITEM_BASE, "cursor-pointer", tone)}
      >
        {body}
      </button>
    </li>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function ApplicationShellBlock({
  brand,
  brandHref,
  onBrandClick,
  navSections = [],
  navLabel = "Main",
  sectionHeadingLevel = "h2",
  navStatus = "idle",
  navErrorMessage = "Navigation could not be loaded.",
  onRetryNav,
  navLoadingMessage = "Loading navigation",
  navEmptyMessage,
  search,
  switcher,
  actions = [],
  actionsLabel = "Account and tools",
  sidebarFooter,
  openMenuLabel = "Open navigation",
  closeMenuLabel = "Close navigation",
  skipLinkLabel = "Skip to main content",
  skipNavLabel = "Skip links",
  expandAt = "md",
  mainScroll = "page",
  stickyTopBar = true,
  mainLabel = "Workspace",
  children,
  className,
}: ApplicationShellBlockProps) {
  const uid = useId();
  const mainId = `${uid}-main`;
  const panelId = `${uid}-nav-panel`;
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const tier = TIER[expandAt];
  const SectionHeading = sectionHeadingLevel;
  const itemCount = navSections.reduce((total, section) => total + section.items.length, 0);
  /**
   * A shell with nothing to navigate to renders no rail and no toggle, rather
   * than an empty rail and a control that opens nothing. Supplying
   * `navEmptyMessage` is how a consumer asks for the empty rail instead.
   */
  const hasNav = navStatus !== "idle" || itemCount > 0 || Boolean(navEmptyMessage);
  const regionScroll = mainScroll === "region";

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.key !== "Escape" || !menuOpen) return;
    setMenuOpen(false);
    toggleRef.current?.focus();
  }

  /* ── Navigation body, rendered in the sidebar and in the collapsed panel ── */
  function renderNav(placement: "sidebar" | "panel") {
    if (navStatus === "loading") {
      return (
        <div role="status" className="flex items-center gap-2 px-3 py-4 text-body-sm text-grey-500">
          <Spinner size="sm" />
          <span>{navLoadingMessage}</span>
        </div>
      );
    }

    if (navStatus === "error") {
      return (
        <div
          role="alert"
          className="mx-1 rounded-lg border border-error-200 bg-error-50 px-3 py-3 text-body-sm text-error-700"
        >
          <p className="break-words">{navErrorMessage}</p>
          {onRetryNav && (
            <button
              type="button"
              onClick={onRetryNav}
              className={cn(
                "mt-2 inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-current px-3 py-1.5 font-semibold",
                FOCUS_RING
              )}
            >
              <Icon name="refresh" size="sm" aria-hidden="true" />
              Try again
            </button>
          )}
        </div>
      );
    }

    if (itemCount === 0) {
      return navEmptyMessage ? (
        <p className="px-3 py-4 text-body-sm break-words text-grey-500">{navEmptyMessage}</p>
      ) : null;
    }

    return (
      <div className="flex flex-col gap-5">
        {navSections.map((section) => {
          const headingId = `${uid}-${placement}-${section.id}`;
          return (
            <div key={section.id} className="flex flex-col gap-1">
              {section.label && (
                <SectionHeading
                  id={headingId}
                  className="px-3 pb-1 text-caption-sm font-semibold break-words text-grey-500 uppercase"
                >
                  {section.label}
                </SectionHeading>
              )}
              <ul
                className="flex list-none flex-col gap-0.5"
                {...(section.label ? { "aria-labelledby": headingId } : {})}
              >
                {section.items.map((item) => (
                  <ShellNavItem
                    key={item.id}
                    item={item}
                    showDescription={placement === "panel"}
                    onNavigate={placement === "panel" ? closeMenu : undefined}
                    reasonIdPrefix={`${uid}-${placement}`}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }

  /* ── Brand ── */
  function renderBrand(extraClassName?: string) {
    if (!brand) return null;
    const content = <span className="flex min-w-0 items-center gap-2 break-words">{brand}</span>;
    if (brandHref) {
      return (
        <a
          href={brandHref}
          onClick={onBrandClick}
          className={cn("rounded", FOCUS_RING, extraClassName)}
        >
          {content}
        </a>
      );
    }
    if (onBrandClick) {
      return (
        <button
          type="button"
          onClick={onBrandClick}
          className={cn("cursor-pointer rounded text-left", FOCUS_RING, extraClassName)}
        >
          {content}
        </button>
      );
    }
    return <div className={cn("min-w-0", extraClassName)}>{content}</div>;
  }

  /* ── Top-bar actions ── */
  function renderAction(action: AppShellAction) {
    const iconOnly = Boolean(action.icon);
    const inner = (
      <>
        {action.icon ? (
          <Icon name={action.icon} size="md" aria-hidden="true" />
        ) : (
          <span className="break-words">{action.label}</span>
        )}
        {iconOnly && <span className="sr-only">{action.label}</span>}
        {action.badge && (
          <span className="absolute top-0.5 right-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-action-primary px-1 text-[10px] leading-4 font-semibold text-white">
            <span aria-hidden={action.badgeDescription ? true : undefined}>{action.badge}</span>
            {action.badgeDescription && <span className="sr-only">{action.badgeDescription}</span>}
          </span>
        )}
      </>
    );
    const classes = cn(
      "relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 text-body-sm font-medium text-grey-700 transition-colors hover:bg-surface-muted hover:text-grey-900",
      FOCUS_RING
    );
    if (action.href) {
      return (
        <a
          key={action.id}
          href={action.href}
          onClick={action.onClick}
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
        onClick={action.onClick}
        className={cn(classes, "cursor-pointer")}
      >
        {inner}
      </button>
    );
  }

  const sidebarInner = (
    <>
      {brand && <div className="px-3 pb-4">{renderBrand("inline-flex min-h-10 items-center")}</div>}
      <div className={cn("flex-1", regionScroll && "min-h-0 overflow-y-auto")}>
        {renderNav("sidebar")}
      </div>
      {sidebarFooter && (
        <div className="mt-4 border-t border-surface-border px-3 pt-4">{sidebarFooter}</div>
      )}
    </>
  );

  return (
    <div
      onKeyDown={handleKeyDown}
      className={cn(
        // `@container` sits on the outermost element, outside the padded
        // surfaces, so `@min-[…]` padding inside resolves against the shell's
        // real width. `relative` keeps the skip link's positioned box inside
        // the shell instead of widening the document (audit B03).
        "@container relative flex w-full flex-col bg-surface-muted",
        regionScroll && "h-full max-h-full overflow-hidden",
        className
      )}
    >
      {/* Wrapped in its own landmark: a skip link is the one control that sits
          before every other landmark, and axe's `region` rule correctly counts
          an unwrapped one as page content outside any landmark. */}
      <nav aria-label={skipNavLabel}>
        <a
          href={`#${mainId}`}
          className={cn(
            "sr-only rounded-lg bg-surface px-4 py-2 text-body-sm font-semibold text-action-primary-text shadow-soft-sm",
            "focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-40",
            FOCUS_RING
          )}
        >
          {skipLinkLabel}
        </a>
      </nav>

      <div className={cn("flex min-h-0 w-full flex-1 flex-col", tier.row)}>
        {/* Sidebar — expanded arrangement only. */}
        {hasNav && (
          // The landmark wraps the brand, the destinations, and the sidebar
          // footer. With the landmark on an inner element the brand and footer
          // were page content outside every landmark, which axe's `region` rule
          // reported and a screen-reader user would meet as stray text.
          <nav
            aria-label={navLabel}
            className={cn(
              "w-full shrink-0 flex-col border-r border-surface-border bg-surface px-3 py-5",
              tier.sidebarWidth,
              regionScroll && "min-h-0",
              tier.expandedFlex
            )}
          >
            {sidebarInner}
          </nav>
        )}

        <div className={cn("flex min-w-0 min-h-0 flex-1 flex-col")}>
          {/* Top bar — one instance at every width. */}
          <header
            className={cn(
              "flex w-full flex-wrap items-center gap-2 border-b border-surface-border bg-surface px-4 py-2",
              tier.pad,
              stickyTopBar && !regionScroll && "sticky top-0 z-20"
            )}
          >
            {hasNav && (
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls={panelId}
                className={cn(
                  "inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-grey-700 hover:bg-surface-muted hover:text-grey-900",
                  FOCUS_RING,
                  tier.collapsed
                )}
              >
                <Icon name={menuOpen ? "multiply" : "list"} size="md" aria-hidden="true" />
                <span className="sr-only">{menuOpen ? closeMenuLabel : openMenuLabel}</span>
              </button>
            )}

            {brand && !(hasNav && switcher) && (
              <div className={cn("min-w-0", hasNav ? tier.collapsed : undefined)}>
                {renderBrand("inline-flex min-h-10 items-center")}
              </div>
            )}

            {switcher && (
              // A floor, not a fixed width: the switcher is a feature, and a
              // feature squeezed to nothing has been dropped. It wraps onto the
              // next row before it shrinks below this.
              <div className="flex min-w-0 flex-1 @min-[640px]:min-w-[168px] @min-[640px]:flex-none">
                {switcher}
              </div>
            )}

            {search && (
              <div
                className={cn(
                  // Wraps onto its own row while the shell is narrow rather
                  // than being removed. One instance, so its state is stable.
                  "order-last w-full min-w-0 basis-full",
                  "@min-[640px]:order-none @min-[640px]:w-auto @min-[640px]:max-w-[420px] @min-[640px]:flex-1 @min-[640px]:basis-auto"
                )}
              >
                {search}
              </div>
            )}

            {actions.length > 0 && (
              <div
                role="group"
                aria-label={actionsLabel}
                className="ml-auto flex shrink-0 items-center gap-1"
              >
                {actions.map((action) => renderAction(action))}
              </div>
            )}
          </header>

          {/* Collapsed navigation panel.
              Always mounted so the toggle's `aria-controls` resolves to a real
              element — the old header pointed at an id that never existed
              (audit B01). `hidden` keeps it out of the accessibility tree while
              it is closed or while the sidebar is showing the same content. */}
          {hasNav && (
            <nav
              id={panelId}
              aria-label={navLabel}
              className={cn(
                "border-b border-surface-border bg-surface px-3 py-4",
                tier.collapsed,
                !menuOpen && "hidden"
              )}
            >
              {brand && switcher && (
                <div className="px-3 pb-4">{renderBrand("inline-flex min-h-11 items-center")}</div>
              )}
              {renderNav("panel")}
              {sidebarFooter && (
                <div className="mt-4 border-t border-surface-border px-3 pt-4">{sidebarFooter}</div>
              )}
            </nav>
          )}

          <main
            id={mainId}
            /**
             * In `region` mode the workspace is its own scroll container, so it
             * has to be reachable from the keyboard even when the content it
             * holds is not focusable (WCAG 2.1.1). In `page` mode it is only a
             * skip-link target and should not be a tab stop.
             */
            tabIndex={regionScroll ? 0 : -1}
            aria-label={mainLabel}
            className={cn(
              "min-w-0 flex-1 px-4 py-6",
              tier.pad,
              regionScroll && "min-h-0 overflow-y-auto"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
