import { useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";

// ─── Types ───────────────────────────────────────────────────────────
export type HeaderBlockVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface HeaderBlockLink {
  label: string;
  href?: string;
  onClick?: () => void;
  hasDropdown?: boolean;
  /** Show a notification dot next to the label */
  dot?: boolean;
}

export interface HeaderBlockAction {
  label: string;
  /** "primary" = solid primary button, "secondary" = secondary styled, "text" = text-only link */
  variant?: "primary" | "secondary" | "text";
  onClick?: () => void;
}

export interface HeaderBlockAnnouncement {
  text: string;
  linkLabel?: string;
  onLinkClick?: () => void;
}

export interface HeaderBlockSwitcher {
  tabs: string[];
  activeIndex?: number;
  onChange?: (index: number) => void;
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
  /** Additional class names */
  className?: string;
}

// ─── Sub-components ──────────────────────────────────────────────────
function NavLink({
  link,
  dark,
  large,
}: {
  link: HeaderBlockLink;
  dark?: boolean;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={link.onClick}
      className={cn(
        "flex items-center gap-2 font-semibold whitespace-nowrap transition-colors",
        large ? "text-base" : "text-sm",
        dark ? "text-grey-400 hover:text-grey-50" : "text-grey-900 hover:text-grey-700"
      )}
    >
      {link.label}
      {link.dot && <span className="size-2 rounded-full bg-primary-400 shrink-0" />}
      {link.hasDropdown && (
        <Icon name="chevron-down" size="xs" className={dark ? "text-grey-400" : "text-grey-900"} />
      )}
    </button>
  );
}

function NavLinks({
  links,
  dark,
  large,
  gap = "gap-6",
  className,
}: {
  links: HeaderBlockLink[];
  dark?: boolean;
  large?: boolean;
  gap?: string;
  className?: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className={cn("flex items-center", gap, className)}>
      {links.map((link) => (
        <NavLink key={link.label} link={link} dark={dark} large={large} />
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
  className,
}: HeaderBlockProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(switcher?.activeIndex ?? 0);

  const isDark = variant === 4 || variant === 8;
  const isLargeLinks = [3, 4, 5, 6, 9, 10, 11].includes(variant);
  const isRoundedButtons = [5, 6, 7, 8, 9, 10].includes(variant);

  // ─── Render a single action button ─────────────────────────────
  function renderAction(action: HeaderBlockAction, index: number) {
    const rounded = isRoundedButtons ? "rounded-2xl" : "rounded-lg";

    // Text-only link
    if (action.variant === "text") {
      return (
        <button
          key={index}
          type="button"
          onClick={action.onClick}
          className={cn(
            "text-sm font-semibold whitespace-nowrap",
            isDark ? "text-grey-50" : "text-primary-400"
          )}
        >
          {action.label}
        </button>
      );
    }

    // Secondary button — varies by variant
    if (action.variant === "secondary") {
      if (variant === 5) {
        // v5: large pill with primary-50 bg
        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className="px-6 py-4 font-semibold text-base text-primary-400 bg-primary-50 rounded-2xl whitespace-nowrap"
          >
            {action.label}
          </button>
        );
      }
      if (variant === 8) {
        // v8: dark grey pill
        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className="px-4 py-2 font-semibold text-sm text-grey-50 bg-grey-700 rounded-2xl whitespace-nowrap"
          >
            {action.label}
          </button>
        );
      }
      if (variant === 11) {
        // v11: outlined with primary-600 border, large
        return (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            className="px-6 py-4 font-semibold text-base text-primary-600 bg-white border-[1.5px] border-primary-600 rounded-lg whitespace-nowrap"
          >
            {action.label}
          </button>
        );
      }
      // Default secondary: outlined primary
      return (
        <button
          key={index}
          type="button"
          onClick={action.onClick}
          className={cn(
            "px-4 py-2 font-semibold text-sm text-primary-500 border-[1.5px] border-primary-500 bg-white whitespace-nowrap",
            rounded
          )}
        >
          {action.label}
        </button>
      );
    }

    // Primary button
    const isLargeButton = [3, 4, 5, 11].includes(variant);
    return (
      <button
        key={index}
        type="button"
        onClick={action.onClick}
        className={cn(
          "font-semibold text-white bg-primary-500 whitespace-nowrap",
          isLargeButton ? "px-6 py-4 text-base" : "px-4 py-2 text-sm",
          variant === 3 || variant === 4 ? "rounded-full" : rounded
        )}
      >
        {action.label}
      </button>
    );
  }

  // ─── Actions section ───────────────────────────────────────────
  const actionsSection = actions.length > 0 && (
    <div className="flex items-center gap-6 shrink-0">
      {actions.map((a, i) => renderAction(a, i))}
    </div>
  );

  // ─── Switcher ──────────────────────────────────────────────────
  function renderSwitcher() {
    if (!switcher) return null;

    if (variant === 11) {
      // v11: pill-style tabs with primary-50 active bg
      return (
        <div className="flex items-center gap-6">
          {switcher.tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(i);
                switcher.onChange?.(i);
              }}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap",
                i === activeTab ? "bg-primary-50 text-primary-400" : "text-grey-400"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      );
    }

    // v10: segmented control
    return (
      <div className="flex items-center">
        {switcher.tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(i);
              switcher.onChange?.(i);
            }}
            className={cn(
              "px-4 py-2.5 text-sm whitespace-nowrap",
              i === 0 && "rounded-l-lg",
              i === switcher.tabs.length - 1 && "rounded-r-lg",
              i === activeTab
                ? "bg-white border border-grey-200 font-semibold text-info-500"
                : "bg-grey-200 font-medium text-grey-400"
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
          "flex items-center gap-8 rounded-full px-10 py-4",
          isDark ? "bg-[#292424]" : "bg-grey-75"
        )}
      >
        {links.map((link) => (
          <NavLink key={link.label} link={link} dark={isDark} large />
        ))}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VARIANT 11: Double-row header
  // ═══════════════════════════════════════════════════════════════
  if (variant === 11) {
    return (
      <div className={cn("flex flex-col bg-white w-full", className)}>
        {/* Top row: switcher + secondary links */}
        <div className="flex items-center justify-between px-[72px] py-6">
          {renderSwitcher()}
          <div className="flex items-center gap-6">
            {secondaryLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="text-sm font-semibold text-grey-400 hover:text-grey-600 whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-grey-200" />

        {/* Bottom row: logo + links | actions */}
        <div className="flex items-center justify-between px-[72px] py-6">
          <div className="flex items-center gap-10">
            {logo}
            <NavLinks links={links} large gap="gap-8" />
          </div>
          {actionsSection}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VARIANTS 7, 8: Centered logo layout
  // Left links | Logo (center) | Right links + Actions
  // ═══════════════════════════════════════════════════════════════
  if (variant === 7 || variant === 8) {
    return (
      <div className={cn("flex flex-col w-full", isDark ? "bg-grey-900" : "bg-white", className)}>
        <div className="flex items-center justify-between px-[72px] py-6 w-full">
          {/* Left: nav links */}
          <NavLinks links={links} dark={isDark} />

          {/* Center: logo */}
          {logo}

          {/* Right: rightLinks + action buttons */}
          <div className="flex items-center gap-6">
            <NavLinks links={rightLinks} dark={isDark} />
            {actionsSection}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ALL OTHER VARIANTS (1–6, 9, 10)
  // Logo (left) | Links (center) | Actions (right)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className={cn("flex flex-col w-full", isDark ? "bg-grey-900" : "bg-white", className)}>
      {/* Announcement banner (v1 only) */}
      {variant === 1 && announcement && (
        <div className="flex items-center justify-center gap-2 bg-[#290b00] px-4 py-4 w-full">
          <span className="text-xs text-white">{announcement.text}</span>
          {announcement.linkLabel && (
            <button
              type="button"
              onClick={announcement.onLinkClick}
              className="text-xs font-semibold text-warning-400"
            >
              {announcement.linkLabel}
            </button>
          )}
        </div>
      )}

      {/* Main nav row */}
      <div
        className={cn(
          "flex items-center justify-between py-6 w-full",
          variant === 3 || variant === 4 ? "px-[112px]" : "px-[72px]"
        )}
      >
        {/* Left: logo + optional search/switcher */}
        <div className="flex items-center gap-10 shrink-0">
          {logo}

          {variant === 9 && (
            <Input
              size="sm"
              placeholder={searchPlaceholder}
              leadingIcon="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              wrapperClassName="w-[375px]"
            />
          )}

          {variant === 10 && renderSwitcher()}
        </div>

        {/* Center: links (pill or regular) */}
        {variant === 3 || variant === 4 ? (
          renderPillNav()
        ) : (
          <NavLinks links={links} dark={isDark} large={isLargeLinks} />
        )}

        {/* Right: optional rightLinks + actions */}
        <div className="flex items-center gap-6 shrink-0">
          <NavLinks links={rightLinks} dark={isDark} large={isLargeLinks} />
          {actionsSection}
        </div>
      </div>
    </div>
  );
}
