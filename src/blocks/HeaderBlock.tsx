import {
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";

// ─── Types ───────────────────────────────────────────────────────────
export type HeaderBlockVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface HeaderBlockLink {
  label: string;
  href?: string;
  onClick?: () => void;
  /** Mark the current destination visually and with aria-current="page". */
  active?: boolean;
  hasDropdown?: boolean;
  /** Show a notification dot next to the label */
  dot?: boolean;
}

export interface HeaderBlockAction {
  label: string;
  /** Render a normal link for navigation; omit for a callback-driven button. */
  href?: string;
  /** "primary" = solid primary button, "secondary" = secondary styled, "text" = text-only link */
  variant?: "primary" | "secondary" | "text";
  onClick?: () => void;
}

export interface HeaderBlockAnnouncement {
  text: string;
  linkLabel?: string;
  onLinkClick?: () => void;
}

/**
 * Workspace switcher for variants 10 and 11.
 *
 * Controlled and uncontrolled are both supported, and which one applies is decided
 * by whether `activeIndex` is a number:
 *
 * - **Uncontrolled** (`activeIndex` omitted or `undefined`): the header owns the
 *   selection. `defaultActiveIndex` seeds it on first render only; changing it
 *   afterwards does nothing, as with any React `default*` prop. Clicking a tab moves
 *   the selection and then calls `onChange`.
 * - **Controlled** (`activeIndex` is a number): the consumer owns the selection.
 *   Clicking a tab does **not** move it; it only calls `onChange`, and the header
 *   re-renders when the consumer passes a new `activeIndex`. A controlled switcher
 *   with no `onChange` is therefore inert — supply `onChange` whenever you supply
 *   `activeIndex`.
 *
 * `onChange` fires only when the index actually changes: clicking the already
 * selected tab is not a change and raises nothing.
 *
 * Both indices are clamped into `0 … tabs.length - 1`, so an out-of-range value
 * selects the nearest tab rather than leaving the group with nothing selected. With
 * an empty `tabs` array the switcher renders nothing.
 *
 * Going from a number to `undefined` on `activeIndex` hands ownership back to the
 * header, which resumes from its own last internal value; do not switch modes
 * mid-life.
 */
export interface HeaderBlockSwitcher {
  /** Visible tab labels, in order. Must be unique. */
  tabs: string[];
  /** Controlled selection. Supply `onChange` with it and update it from there. */
  activeIndex?: number;
  /** Initial selection for uncontrolled use. Read once, on mount. Default `0`. */
  defaultActiveIndex?: number;
  /** Raised with the index the user asked for, in both modes. */
  onChange?: (index: number) => void;
  /** Accessible name for the switcher group. Default `"Workspace"`. */
  label?: string;
}

export interface HeaderBlockProps {
  /** Visual variant (1-11) */
  variant?: HeaderBlockVariant;
  /** Logo element */
  logo?: ReactNode;
  /** Navigation links (center or left side for centered-logo variants) */
  links?: HeaderBlockLink[];
  /** Right-side navigation links (for centered-logo variants 7, 8 and variant 9) */
  rightLinks?: HeaderBlockLink[];
  /** Action buttons (far right) */
  actions?: HeaderBlockAction[];
  /** Announcement banner (variant 1) */
  announcement?: HeaderBlockAnnouncement;
  /** Search input placeholder (variant 9) */
  searchPlaceholder?: string;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Switcher tabs (variants 10-11) */
  switcher?: HeaderBlockSwitcher;
  /** Policy / secondary links for variant 11 top row */
  secondaryLinks?: HeaderBlockLink[];
  /** Accessible name for the primary navigation landmark */
  navLabel?: string;
  /** Accessible name for the secondary navigation landmark */
  secondaryNavLabel?: string;
  /** Additional class names */
  className?: string;
}

// ─── Collapse thresholds ─────────────────────────────────────────────
/**
 * The header collapses on the width it actually has, not on the viewport, so a header
 * dropped into a narrow column collapses there too. Each variant carries a different
 * amount of content, so each expands at the width its own desktop row needs: one 600px
 * `md` breakpoint for all eleven variants pushed seven of them off-screen on tablets.
 *
 * Centered-logo variants reserve equal space on both sides of the brand, so their
 * thresholds must fit twice the wider side. Recheck these tiers when content or
 * control sizing changes; long consumer labels may need a wider collapse threshold.
 */
type ExpandTier = "sm" | "md" | "lg" | "xl" | "xxl";

interface TierClasses {
  /** Expanded-only flex row */
  row: string;
  /** Expanded-only block */
  block: string;
  /** Collapsed-only (hidden once expanded) */
  collapsed: string;
}

const TIER: Record<ExpandTier, TierClasses> = {
  sm: {
    row: "hidden @min-[720px]:flex",
    block: "hidden @min-[720px]:block",
    collapsed: "@min-[720px]:hidden",
  },
  md: {
    row: "hidden @min-[880px]:flex",
    block: "hidden @min-[880px]:block",
    collapsed: "@min-[880px]:hidden",
  },
  lg: {
    row: "hidden @min-[960px]:flex",
    block: "hidden @min-[960px]:block",
    collapsed: "@min-[960px]:hidden",
  },
  xl: {
    row: "hidden @min-[1060px]:flex",
    block: "hidden @min-[1060px]:block",
    collapsed: "@min-[1060px]:hidden",
  },
  xxl: {
    row: "hidden @min-[1280px]:flex",
    block: "hidden @min-[1280px]:block",
    collapsed: "@min-[1280px]:hidden",
  },
};

const VARIANT_TIER: Record<HeaderBlockVariant, ExpandTier> = {
  1: "sm",
  2: "lg",
  3: "md",
  4: "md",
  5: "md",
  6: "sm",
  7: "xl",
  8: "xxl",
  9: "sm",
  10: "md",
  11: "sm",
};

/**
 * Shared gutters and a bounded row keep the brand and controls aligned on every variant.
 * Only the surface and announcement stretch on wider screens.
 */
const ROW_PADDING =
  "mx-auto w-full max-w-[1440px] px-4 py-3 @min-[640px]:px-6 @min-[1140px]:px-10 @min-[1140px]:py-4";

/** Nav rows tighten up between the collapse threshold and a comfortable desktop. */
const NAV_GAP = "gap-4 @min-[1140px]:gap-6";
const PILL_GAP = "gap-5 @min-[1140px]:gap-8";

/**
 * A variant that asks for a dark bar has to stay dark in a globally dark document.
 * The grey ramp inverts under `.dark`, so `bg-grey-900` quietly became a near-white
 * bar with unreadable navigation on top of it.
 *
 * `.rayden-dark` is the shared home for that: it is declared next to `.dark` in
 * globals.css, pins the same surface / foreground / ramp values, and is matched by
 * the `dark:` variant, so the same semantic pairs — `bg-surface`/`text-on-surface`
 * for the bar, `text-on-surface-muted` for muted text — resolve to dark values in
 * *both* global modes, and nested components inherit the same roles. It replaces a
 * block-local inline style object, which no nested component could see through.
 */
const DARK_ISLAND = "rayden-dark";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

// ─── Sub-components ──────────────────────────────────────────────────
function NavLink({
  link,
  tone = "default",
  large,
  className,
  onNavigate,
}: {
  link: HeaderBlockLink;
  tone?: "default" | "muted";
  large?: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  // A link with an href must be an anchor, or it is not a link: no middle-click, no
  // open-in-new-tab, and the wrong role. This holds at every viewport — the collapsed
  // menu used to rebuild links as buttons and drop the href on the floor.
  const Tag = link.href ? "a" : "button";
  return (
    <Tag
      {...(link.href ? { href: link.href } : { type: "button" as const })}
      aria-current={link.active ? "page" : undefined}
      onClick={() => {
        link.onClick?.();
        onNavigate?.();
      }}
      className={cn(
        "relative flex min-h-11 items-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none cursor-pointer",
        FOCUS_RING,
        large ? "text-base" : "text-sm",
        link.active
          ? "text-action-primary-text after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-action-primary"
          : tone === "muted"
            ? "text-on-surface-muted hover:text-on-surface"
            : "text-on-surface-secondary hover:text-on-surface",
        className
      )}
    >
      {link.label}
      {link.dot && <span className="size-2 shrink-0 rounded-full bg-primary-400" />}
      {/* Inherits the link colour, so the chevron follows hover instead of staying put. */}
      {link.hasDropdown && <Icon name="chevron-down" size="xs" />}
    </Tag>
  );
}

function NavLinks({
  links,
  large,
  gap = NAV_GAP,
  className,
}: {
  links: HeaderBlockLink[];
  large?: boolean;
  gap?: string;
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className={cn("flex items-center", gap, className)}>
      {links.map((link, i) => (
        <NavLink key={`${link.label}-${i}`} link={link} large={large} />
      ))}
    </div>
  );
}

/** Same link component, stacked — so an href-only destination is still an anchor. */
function StackedNavLinks({
  links,
  tone,
  onNavigate,
}: {
  links: HeaderBlockLink[];
  tone?: "default" | "muted";
  onNavigate: () => void;
}) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      {links.map((link, i) => (
        <NavLink
          key={`${link.label}-${i}`}
          link={link}
          tone={tone}
          onNavigate={onNavigate}
          className={cn(
            "justify-between rounded-lg px-3 py-2.5 text-left after:hidden hover:bg-grey-75",
            link.active && "bg-primary-50 hover:bg-primary-50"
          )}
        />
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────
export function HeaderBlock({
  variant = 1,
  logo,
  links = [],
  rightLinks = [],
  actions = [],
  announcement,
  searchPlaceholder = "Search for components...",
  onSearch,
  switcher,
  secondaryLinks = [],
  navLabel = "Main",
  secondaryNavLabel = "Secondary",
  className,
}: HeaderBlockProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [internalActiveTab, setActiveTab] = useState(switcher?.defaultActiveIndex ?? 0);
  /** An index outside the tab list would leave the group with nothing selected. */
  const clampTab = (index: number) =>
    Math.min(Math.max(index, 0), Math.max((switcher?.tabs.length ?? 1) - 1, 0));
  const isSwitcherControlled = typeof switcher?.activeIndex === "number";
  const activeTab = clampTab(isSwitcherControlled ? switcher!.activeIndex! : internalActiveTab);
  /** One place decides both modes, so they can never drift apart. */
  const selectTab = (index: number) => {
    if (index === activeTab) return; // not a change; raise nothing
    if (!isSwitcherControlled) setActiveTab(index);
    switcher?.onChange?.(index);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isDark = variant === 4 || variant === 8;
  const isLargeLinks = [3, 4, 5, 6, 9, 10, 11].includes(variant);
  const isRoundedButtons = [5, 6, 7, 8, 9, 10].includes(variant);
  const hasSearch = variant === 9;
  const hasSwitcher = (variant === 10 || variant === 11) && !!switcher;
  const tier = TIER[VARIANT_TIER[variant]];
  const rowPadding = ROW_PADDING;

  /** Nothing to collapse means nothing to toggle: do not render an inert control. */
  const hasMenuContent =
    links.length > 0 ||
    rightLinks.length > 0 ||
    secondaryLinks.length > 0 ||
    actions.length > 0 ||
    hasSearch ||
    hasSwitcher;

  const closeMenu = () => setMenuOpen(false);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || !menuOpen) return;
    setMenuOpen(false);
    toggleRef.current?.focus();
  }

  // ─── Render a single action button ─────────────────────────────
  function renderAction(action: HeaderBlockAction, index: number, onNavigate?: () => void) {
    const Tag = action.href ? "a" : "button";
    const actionVariant = action.variant ?? "primary";
    const isLargeButton = [3, 4, 5, 11].includes(variant);
    return (
      <Tag
        key={index}
        {...(action.href ? { href: action.href } : { type: "button" as const })}
        onClick={() => {
          action.onClick?.();
          onNavigate?.();
        }}
        className={cn(
          "inline-flex min-h-11 cursor-pointer items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none",
          FOCUS_RING,
          isRoundedButtons ? "rounded-2xl" : "rounded-lg",
          actionVariant === "text" &&
            "rounded-lg text-on-surface-secondary hover:bg-grey-75 hover:text-on-surface active:bg-grey-100",
          actionVariant === "secondary" &&
            "border border-surface-border-strong bg-surface text-on-surface hover:bg-grey-75 active:bg-grey-100",
          actionVariant === "secondary" &&
            variant === 5 &&
            "border-transparent bg-primary-50 text-action-primary-text hover:bg-primary-75",
          actionVariant === "secondary" &&
            variant === 8 &&
            "border-transparent bg-grey-100 hover:bg-grey-200",
          actionVariant === "primary" &&
            "bg-action-primary text-white hover:bg-action-primary-hover active:bg-action-primary-hover",
          actionVariant !== "text" && isLargeButton && "px-5 text-base",
          actionVariant === "primary" && (variant === 3 || variant === 4) && "rounded-full"
        )}
      >
        {action.label}
      </Tag>
    );
  }

  // ─── Actions section ───────────────────────────────────────────
  const actionsSection = actions.length > 0 && (
    <div className="flex shrink-0 items-center gap-2 @min-[1140px]:gap-3">
      {actions.map((a, i) => renderAction(a, i))}
    </div>
  );

  // ─── Search ────────────────────────────────────────────────────
  function renderSearch(wrapperClassName: string) {
    if (!hasSearch) return null;
    return (
      <Input
        size="sm"
        type="search"
        aria-label={searchPlaceholder}
        placeholder={searchPlaceholder}
        leadingIcon="search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        wrapperClassName={wrapperClassName}
      />
    );
  }

  // ─── Switcher ──────────────────────────────────────────────────
  function renderSwitcher(className?: string) {
    if (!switcher || switcher.tabs.length === 0) return null;
    const switcherLabel = switcher.label ?? "Workspace";

    if (variant === 11) {
      // v11: pill-style tabs
      return (
        <div
          role="group"
          aria-label={switcherLabel}
          className={cn("flex items-center gap-2", className)}
        >
          {switcher.tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              aria-pressed={i === activeTab}
              onClick={() => selectTab(i)}
              className={cn(
                "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap",
                FOCUS_RING,
                i === activeTab
                  ? "bg-primary-50 text-action-primary-text"
                  : "text-grey-500 hover:text-grey-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      );
    }

    // v10: segmented control. The selected chip is a raised surface rather than a
    // hard-coded white one, so it follows the document's mode.
    return (
      <div role="group" aria-label={switcherLabel} className={cn("flex items-center", className)}>
        {switcher.tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            aria-pressed={i === activeTab}
            onClick={() => selectTab(i)}
            className={cn(
              "cursor-pointer px-4 py-2.5 text-sm whitespace-nowrap",
              FOCUS_RING,
              i === 0 && "rounded-l-lg",
              i === switcher.tabs.length - 1 && "rounded-r-lg",
              i === activeTab
                ? "border border-surface-border-strong bg-surface font-semibold text-grey-900"
                : "bg-grey-200 font-medium text-grey-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }

  // ─── Pill nav (variants 3, 4) ──────────────────────────────────
  function renderPillNav() {
    return (
      <div
        className={cn(
          "flex items-center rounded-full px-6 py-1 @min-[1140px]:px-8",
          PILL_GAP,
          isDark ? "bg-[#292424]" : "bg-grey-75"
        )}
      >
        {links.map((link, i) => (
          <NavLink key={`${link.label}-${i}`} link={link} large />
        ))}
      </div>
    );
  }

  // ─── Collapsed menu toggle ─────────────────────────────────────
  function renderMenuToggle() {
    if (!hasMenuContent) return null;
    return (
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        className={cn(
          "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-surface-border-strong text-on-surface-secondary transition-colors hover:bg-grey-75 hover:text-on-surface motion-reduce:transition-none",
          FOCUS_RING,
          tier.collapsed
        )}
      >
        <Icon name={menuOpen ? "multiply" : "list"} size="md" />
      </button>
    );
  }

  // ─── Collapsed menu ────────────────────────────────────────────
  /**
   * Always in the DOM so `aria-controls` resolves to a real element, and carrying the
   * same destinations, search, switcher and actions the expanded row has.
   */
  function renderMenu() {
    if (!hasMenuContent) return null;
    const hasNavContent = links.length > 0 || rightLinks.length > 0 || secondaryLinks.length > 0;
    return (
      <div
        id={menuId}
        className={cn(
          "flex flex-col gap-4 border-t border-surface-border bg-surface px-4 pt-4 pb-5 @min-[640px]:px-6",
          tier.collapsed,
          !menuOpen && "hidden"
        )}
      >
        {renderSearch("w-full")}
        {hasSwitcher && renderSwitcher("w-full flex-wrap")}
        {hasNavContent && (
          <nav aria-label="Menu" className="flex flex-col gap-3">
            <StackedNavLinks links={links} onNavigate={closeMenu} />
            {rightLinks.length > 0 && links.length > 0 && (
              <div className="h-px w-full bg-surface-border" />
            )}
            <StackedNavLinks links={rightLinks} onNavigate={closeMenu} />
            {secondaryLinks.length > 0 && (
              <>
                <div className="h-px w-full bg-surface-border" />
                <StackedNavLinks links={secondaryLinks} tone="muted" onNavigate={closeMenu} />
              </>
            )}
          </nav>
        )}
        {actions.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-surface-border pt-4">
            {actions.map((action, i) => renderAction(action, i, closeMenu))}
          </div>
        )}
      </div>
    );
  }

  const rootProps = {
    className: cn(
      "@container flex w-full flex-col border-b border-surface-border bg-surface",
      isDark && DARK_ISLAND,
      className
    ),
    onKeyDown: handleKeyDown,
  };

  // ═══════════════════════════════════════════════════════════════
  // VARIANT 11: Double-row header
  // ═══════════════════════════════════════════════════════════════
  if (variant === 11) {
    return (
      <header {...rootProps}>
        {/* Top row: switcher + secondary links | collapsed: logo + toggle */}
        <div className={cn("flex items-center justify-between", rowPadding)}>
          <div className={tier.block}>{renderSwitcher()}</div>
          {secondaryLinks.length > 0 && (
            <nav aria-label={secondaryNavLabel} className={cn(tier.row, "items-center", NAV_GAP)}>
              {secondaryLinks.map((link, i) => (
                <NavLink key={`${link.label}-${i}`} link={link} tone="muted" />
              ))}
            </nav>
          )}
          <div className={cn("min-w-0 flex-1", tier.collapsed)}>{logo}</div>
          {renderMenuToggle()}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-surface-border" />

        {/* Bottom row: logo + links | actions */}
        <div className={cn(tier.row, "items-center justify-between", rowPadding)}>
          <div className="flex min-w-0 items-center gap-6 @min-[1140px]:gap-10">
            {logo}
            {links.length > 0 && (
              <nav aria-label={navLabel}>
                <NavLinks links={links} large gap={NAV_GAP} />
              </nav>
            )}
          </div>
          {actionsSection}
        </div>

        {renderMenu()}
      </header>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VARIANTS 7, 8: Centered logo layout
  // Left links | Logo (center) | Right links + Actions
  // ═══════════════════════════════════════════════════════════════
  if (variant === 7 || variant === 8) {
    return (
      <header {...rootProps}>
        <div
          className={cn(
            "flex w-full items-center justify-between gap-4",
            variant === 7
              ? "@min-[1060px]:grid @min-[1060px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
              : "@min-[1280px]:grid @min-[1280px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
            rowPadding
          )}
        >
          {/* Left: nav links */}
          <div className={cn(tier.block, "min-w-0")}>
            {links.length > 0 && (
              <nav aria-label={navLabel}>
                <NavLinks links={links} />
              </nav>
            )}
          </div>

          {/* Center: logo */}
          <div className="min-w-0">{logo}</div>

          {/* Right: rightLinks + action buttons */}
          <div className="flex items-center justify-self-end gap-4 @min-[1140px]:gap-6">
            <div className={cn(tier.row, "items-center gap-4 @min-[1140px]:gap-6")}>
              {rightLinks.length > 0 && (
                <nav aria-label={secondaryNavLabel}>
                  <NavLinks links={rightLinks} />
                </nav>
              )}
              {actionsSection}
            </div>
            {renderMenuToggle()}
          </div>
        </div>

        {renderMenu()}
      </header>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ALL OTHER VARIANTS (1–6, 9, 10)
  // Logo (left) | Links (center) | Actions (right)
  // ═══════════════════════════════════════════════════════════════
  return (
    <header {...rootProps}>
      {/* Announcement banner (v1 only) */}
      {variant === 1 && announcement && (
        <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[#290b00] px-4 py-2.5 text-center">
          <span className="text-xs text-white">{announcement.text}</span>
          {announcement.linkLabel && (
            <button
              type="button"
              onClick={announcement.onLinkClick}
              className={cn(
                "cursor-pointer rounded text-xs font-semibold text-warning-400",
                FOCUS_RING
              )}
            >
              {announcement.linkLabel}
            </button>
          )}
        </div>
      )}

      {/* Main nav row */}
      <div className={cn("flex w-full items-center justify-between gap-4", rowPadding)}>
        {/* Left: logo + optional search/switcher */}
        <div
          className={cn(
            "flex items-center gap-4 @min-[1140px]:gap-10",
            // The search field is the one element allowed to absorb the slack, so it
            // shrinks instead of pinning the row to a 375px minimum.
            hasSearch ? "min-w-0 flex-1" : "shrink-0"
          )}
        >
          {logo}
          {renderSearch(cn(tier.block, "min-w-[200px] max-w-[375px] flex-1"))}
          {hasSwitcher && <div className={tier.block}>{renderSwitcher()}</div>}
        </div>

        {/* Center: links (pill or regular) */}
        {(links.length > 0 || variant === 3 || variant === 4) && (
          <nav aria-label={navLabel} className={tier.block}>
            {variant === 3 || variant === 4 ? (
              renderPillNav()
            ) : (
              <NavLinks links={links} large={isLargeLinks} />
            )}
          </nav>
        )}

        {/* Right: optional rightLinks + actions */}
        <div className="flex shrink-0 items-center gap-4 @min-[1140px]:gap-6">
          {rightLinks.length > 0 && (
            <nav aria-label={secondaryNavLabel} className={tier.block}>
              <NavLinks links={rightLinks} large={isLargeLinks} />
            </nav>
          )}
          <div className={cn(tier.row, "items-center")}>{actionsSection}</div>
          {renderMenuToggle()}
        </div>
      </div>

      {renderMenu()}
    </header>
  );
}
