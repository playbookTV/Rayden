import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Icon, type IconName } from "../components/Icon";
import { Spinner } from "../components/Spinner";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type CommandPaletteStatus = "idle" | "loading" | "error";

interface CommandPaletteItemBase {
  id: string;
  label: string;
  /** One supporting line, e.g. the path a destination leads to. */
  description?: string;
  icon?: IconName;
  /** Extra words the local filter should match, e.g. synonyms or an old name. */
  keywords?: string[];
  /** Rendered on the right, e.g. "⌘ N". Presentational only. */
  shortcut?: string;
  /** Groups items under a heading. Resolved against {@link CommandPaletteBlockProps.groups}. */
  groupId?: string;
}

/**
 * A destination is an anchor and keeps its `href` at every width, an action is
 * an activatable option, and an entry the viewer may not use is disabled with a
 * visible reason. There is no arm with nothing to do.
 */
export type CommandPaletteItem =
  | (CommandPaletteItemBase & { href: string; external?: boolean; onSelect?: () => void })
  | (CommandPaletteItemBase & { onSelect: () => void; href?: undefined })
  | (CommandPaletteItemBase & {
      /** Why this entry is unavailable to the current viewer. */
      unavailableReason: string;
      href?: undefined;
      onSelect?: undefined;
    });

export interface CommandPaletteGroup {
  id: string;
  label: string;
}

export interface CommandPaletteShortcut {
  /** Single character, compared case-insensitively. */
  key: string;
  /** `"mod"` is Command on Apple platforms and Control elsewhere. @default "mod" */
  modifier?: "mod" | "none";
  /** Visible hint on the trigger, e.g. "⌘K". */
  hint?: string;
}

export type CommandPaletteFilterMode = "local" | "external";

export interface CommandPaletteBlockProps {
  /** Everything the palette can offer for the current query. */
  items?: CommandPaletteItem[];
  groups?: CommandPaletteGroup[];

  /** Shown while the query is empty, e.g. recent destinations. */
  suggestions?: CommandPaletteItem[];
  /** Heading above {@link suggestions}. @default "Suggestions" */
  suggestionsLabel?: string;
  /**
   * With no suggestions and an empty query the palette prompts for a query
   * rather than listing everything. Set this to list {@link items} instead.
   * @default false
   */
  showAllWhenEmpty?: boolean;

  /**
   * `"local"` filters {@link items} in the browser. `"external"` renders
   * {@link items} untouched, for an application that searches remotely.
   * @default "local"
   */
  filterMode?: CommandPaletteFilterMode;
  onQueryChange?: (query: string) => void;
  /** Fires for every activation, including a destination followed by its href. */
  onSelect?: (item: CommandPaletteItem) => void;

  /** @default "idle" */
  status?: CommandPaletteStatus;
  errorTitle?: string;
  errorDescription?: string;
  /** The retry control is omitted entirely when no handler is supplied. */
  onRetry?: () => void;
  loadingMessage?: string;

  /** Accessible name for the dialog. @default "Command palette" */
  dialogLabel?: string;
  /** @default "Search destinations and actions" */
  searchLabel?: string;
  searchPlaceholder?: string;
  /** Hint under the field, associated with it. */
  searchHint?: string;

  /** Shown before anything has been typed and nothing else can be offered. */
  promptTitle?: string;
  promptDescription?: string;
  /** Shown when the query matches nothing. Distinct from the prompt. */
  noResultsTitle?: (query: string) => string;
  noResultsDescription?: string;
  /** Shown when the palette has no entries configured at all. */
  emptySourceTitle?: string;
  emptySourceDescription?: string;

  /** Announced and displayed result count. */
  resultCountLabel?: (count: number) => string;

  /** Renders the block's own opening control. @default true */
  showTrigger?: boolean;
  /** @default "Search" */
  triggerLabel?: string;
  /** Extra classes for the built-in trigger. */
  triggerClassName?: string;

  /** Keyboard opener. `null` registers no document listener. @default null */
  shortcut?: CommandPaletteShortcut | null;

  /** Uncontrolled default. @default false */
  defaultOpen?: boolean;
  /** Controlled open state. Pair with {@link onOpenChange}. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** @default "Close" */
  closeLabel?: string;

  /**
   * Freezes the page behind the overlay so the shell's workspace and the
   * palette do not both scroll. @default true
   */
  lockScroll?: boolean;

  /** Extra content along the bottom of the dialog, e.g. keyboard legends. */
  footer?: ReactNode;

  /** Lands on the container root that holds the trigger. */
  className?: string;
}

/* ─── Recipes ────────────────────────────────────────────────────────── */

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

/**
 * Only elements Tab can actually reach. A roving-tabindex option is an
 * `a[href]` parked at `tabindex="-1"`: focusable in code, skipped by Tab. Left
 * in this list it became the computed final stop and focus escaped the dialog.
 */
const FOCUSABLE = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function itemMatches(item: CommandPaletteItem, needle: string): boolean {
  const haystack = [item.label, item.description ?? "", ...(item.keywords ?? [])]
    .join(" ")
    .toLocaleLowerCase();
  return haystack.includes(needle);
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function CommandPaletteBlock({
  items = [],
  groups = [],
  suggestions,
  suggestionsLabel = "Suggestions",
  showAllWhenEmpty = false,
  filterMode = "local",
  onQueryChange,
  onSelect,
  status = "idle",
  errorTitle = "Search is unavailable",
  errorDescription = "The search service did not respond. Nothing has been changed.",
  onRetry,
  loadingMessage = "Searching",
  dialogLabel = "Command palette",
  searchLabel = "Search destinations and actions",
  searchPlaceholder = "Search or jump to…",
  searchHint = "Use the up and down arrow keys to move through results, then Enter to open one.",
  promptTitle = "Type to search",
  promptDescription = "Start typing to find a page, a record, or an action.",
  noResultsTitle = (query) => `No results for “${query}”`,
  noResultsDescription = "Check the spelling, or try a shorter search term.",
  emptySourceTitle = "Nothing is available to search yet",
  emptySourceDescription = "This workspace has no destinations or actions configured.",
  resultCountLabel = (count) => (count === 1 ? "1 result" : `${count} results`),
  showTrigger = true,
  triggerLabel = "Search",
  triggerClassName,
  shortcut = null,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  closeLabel = "Close",
  lockScroll = true,
  footer,
  className,
}: CommandPaletteBlockProps) {
  const uid = useId();
  const dialogId = `${uid}-dialog`;
  const listId = `${uid}-list`;
  const inputId = `${uid}-input`;
  const hintId = `${uid}-hint`;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  /** Whatever had focus before the overlay opened, restored on close. */
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  /* ── Result set ──────────────────────────────────────────────────── */
  const trimmed = query.trim();
  const needle = trimmed.toLocaleLowerCase();

  const results = useMemo(() => {
    if (!trimmed) {
      if (suggestions && suggestions.length > 0) return suggestions;
      return showAllWhenEmpty ? items : [];
    }
    if (filterMode === "external") return items;
    return items.filter((item) => itemMatches(item, needle));
  }, [trimmed, needle, items, suggestions, showAllWhenEmpty, filterMode]);

  const showingSuggestions = !trimmed && Boolean(suggestions && suggestions.length > 0);
  const hasSource = items.length > 0 || (suggestions?.length ?? 0) > 0;
  const promptState = !trimmed && results.length === 0 && hasSource;
  const noResultsState = Boolean(trimmed) && results.length === 0 && status === "idle";

  /** Grouped for display, ordered by `groups`, with anything ungrouped first. */
  const sections = useMemo(() => {
    if (showingSuggestions) {
      return [{ id: "__suggestions", label: suggestionsLabel, items: results }];
    }
    const ungrouped = results.filter((item) => !item.groupId);
    const known = groups
      .map((group) => ({
        id: group.id,
        label: group.label,
        items: results.filter((item) => item.groupId === group.id),
      }))
      .filter((section) => section.items.length > 0);
    const knownIds = new Set(groups.map((group) => group.id));
    const orphans = results.filter((item) => item.groupId && !knownIds.has(item.groupId));
    const head =
      ungrouped.length > 0 || orphans.length > 0
        ? [
            {
              id: "__ungrouped",
              label: undefined as string | undefined,
              items: [...ungrouped, ...orphans],
            },
          ]
        : [];
    return [...head, ...known];
  }, [results, groups, showingSuggestions, suggestionsLabel]);

  /** Flat order, so arrow keys cross group boundaries the way the eye does. */
  const flatItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  /* ── Open / close side effects ───────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    // Focused in the same commit that removes `hidden`, so the field has focus
    // by the time the click that opened the dialog has settled.
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) return;
    setQuery("");
  }, [open]);

  /**
   * Focus goes back to whatever opened the palette, which is the trigger when
   * the block renders its own. A dialog that drops focus on the document body
   * strands a keyboard user at the top of the page.
   */
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) {
      const target = triggerRef.current ?? returnFocusRef.current;
      target?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open || !lockScroll || typeof document === "undefined") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!shortcut || typeof document === "undefined") return;
    const wanted = shortcut.key.toLowerCase();
    const modifier = shortcut.modifier ?? "mod";
    function handle(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.repeat) return;
      if (event.key.toLowerCase() !== wanted) return;
      const target = event.target;
      // Single-letter shortcuts must never consume text entry, including our search field.
      if (
        modifier === "none" &&
        (event.altKey ||
          event.shiftKey ||
          (target instanceof HTMLElement &&
            (target.isContentEditable ||
              target.closest("input, textarea, select, [role='textbox']"))))
      )
        return;
      const mod = event.metaKey || event.ctrlKey;
      if (modifier === "mod" && !mod) return;
      if (modifier === "none" && mod) return;
      event.preventDefault();
      setOpen(true);
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [shortcut, setOpen]);

  /* ── Roving focus ────────────────────────────────────────────────── */
  function optionNodes(): HTMLElement[] {
    if (!listRef.current) return [];
    return Array.from(listRef.current.querySelectorAll<HTMLElement>("[data-option]"));
  }

  function focusOptionAt(index: number) {
    const nodes = optionNodes();
    if (nodes.length === 0) return;
    const wrapped = ((index % nodes.length) + nodes.length) % nodes.length;
    setActiveIndex(wrapped);
    nodes[wrapped]?.focus();
  }

  function activateAt(index: number) {
    const nodes = optionNodes();
    nodes[index]?.click();
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOptionAt(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOptionAt(-1);
    } else if (event.key === "Enter" && flatItems.length > 0) {
      event.preventDefault();
      activateAt(activeIndex);
    }
  }

  function handleOptionKeyDown(event: ReactKeyboardEvent<HTMLElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOptionAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOptionAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOptionAt(0);
        break;
      case "End":
        event.preventDefault();
        focusOptionAt(-1);
        break;
      default:
        break;
    }
  }

  /** Tab stays inside the overlay; Escape leaves it. */
  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (node) => node.offsetParent !== null || node === document.activeElement
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ── Option ──────────────────────────────────────────────────────── */
  function renderOption(item: CommandPaletteItem, index: number) {
    const unavailable = "unavailableReason" in item ? item.unavailableReason : undefined;
    const reasonId = `${uid}-${item.id}-reason`;
    const isActive = index === activeIndex;

    const body = (
      <>
        {item.icon && (
          <Icon
            name={item.icon}
            size="md"
            className={cn("mt-0.5 shrink-0", unavailable ? "text-grey-400" : "text-grey-500")}
          />
        )}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
          <span className="text-body-sm font-medium break-words">{item.label}</span>
          {item.description && (
            <span className="text-body-xs break-words text-grey-500">{item.description}</span>
          )}
          {unavailable && (
            <span id={reasonId} className="text-body-xs break-words text-grey-500">
              {unavailable}
            </span>
          )}
        </span>
        {item.shortcut && (
          <span
            aria-hidden="true"
            className="ml-auto shrink-0 rounded border border-surface-border px-1.5 py-0.5 text-body-xs font-medium text-grey-500"
          >
            {item.shortcut}
          </span>
        )}
      </>
    );

    const classes = cn(
      "flex w-full min-w-0 items-start gap-3 rounded-lg px-3 py-2 transition-colors",
      FOCUS_RING,
      unavailable
        ? "cursor-not-allowed text-grey-500"
        : "cursor-pointer text-grey-900 hover:bg-surface-muted"
    );

    const shared = {
      "data-option": "true",
      role: "option" as const,
      "aria-selected": isActive,
      tabIndex: isActive ? 0 : -1,
      className: classes,
    };

    if (unavailable) {
      return (
        <div
          key={item.id}
          {...shared}
          aria-disabled="true"
          aria-describedby={reasonId}
          onKeyDown={(event) => handleOptionKeyDown(event, index)}
          onFocus={() => setActiveIndex(index)}
        >
          {body}
        </div>
      );
    }

    if (item.href) {
      // Destinations stay anchors: Enter activates them natively, middle-click
      // opens a new tab, and the href is never rebuilt into a dead button.
      return (
        <a
          key={item.id}
          {...shared}
          href={item.href}
          {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
          onClick={() => {
            item.onSelect?.();
            onSelect?.(item);
            close();
          }}
          onKeyDown={(event) => handleOptionKeyDown(event, index)}
          onFocus={() => setActiveIndex(index)}
        >
          {body}
        </a>
      );
    }

    return (
      <div
        key={item.id}
        {...shared}
        onClick={() => {
          item.onSelect?.();
          onSelect?.(item);
          close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            item.onSelect?.();
            onSelect?.(item);
            close();
            return;
          }
          handleOptionKeyDown(event, index);
        }}
        onFocus={() => setActiveIndex(index)}
      >
        {body}
      </div>
    );
  }

  /* ── Body ────────────────────────────────────────────────────────── */
  function renderBody(): ReactNode {
    if (status === "loading") {
      return (
        <p role="status" className="flex items-center gap-2 px-4 py-10 text-body-sm text-grey-500">
          <Spinner size="sm" />
          <span>{loadingMessage}</span>
        </p>
      );
    }

    if (status === "error") {
      return (
        <div
          role="alert"
          className="m-3 flex flex-col gap-2 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-error-700"
        >
          <p className="text-body-sm font-semibold break-words">{errorTitle}</p>
          <p className="text-body-sm break-words">{errorDescription}</p>
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
      );
    }

    if (!hasSource) {
      return (
        <div className="flex flex-col gap-1 px-4 py-10 text-center">
          <p className="text-body-sm font-semibold break-words text-grey-900">{emptySourceTitle}</p>
          <p className="text-body-sm break-words text-grey-500">{emptySourceDescription}</p>
        </div>
      );
    }

    if (promptState) {
      return (
        <div className="flex flex-col gap-1 px-4 py-10 text-center">
          <p className="text-body-sm font-semibold break-words text-grey-900">{promptTitle}</p>
          <p className="text-body-sm break-words text-grey-500">{promptDescription}</p>
        </div>
      );
    }

    if (noResultsState) {
      return (
        <div className="flex flex-col gap-1 px-4 py-10 text-center">
          <p className="text-body-sm font-semibold break-words text-grey-900">
            {noResultsTitle(trimmed)}
          </p>
          <p className="text-body-sm break-words text-grey-500">{noResultsDescription}</p>
        </div>
      );
    }

    let cursor = -1;
    return (
      <div
        ref={listRef}
        role="listbox"
        aria-label={dialogLabel}
        className="flex flex-col gap-3 p-2"
      >
        {sections.map((section) => {
          const sectionHeadingId = `${uid}-${section.id}-label`;
          return (
            <div
              key={section.id}
              role="group"
              {...(section.label ? { "aria-labelledby": sectionHeadingId } : {})}
              className="flex flex-col gap-0.5"
            >
              {section.label && (
                <p
                  id={sectionHeadingId}
                  className="px-3 pt-1 pb-1 text-caption-sm font-semibold break-words text-grey-500 uppercase"
                >
                  {section.label}
                </p>
              )}
              {section.items.map((item) => {
                cursor += 1;
                return renderOption(item, cursor);
              })}
            </div>
          );
        })}
      </div>
    );
  }

  const countText =
    status === "idle" && hasSource && !promptState ? resultCountLabel(flatItems.length) : "";

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    // Not an `@container`: the trigger is a flex item in the shell's top bar,
    // and inline-size containment would stop it sizing from its own contents.
    // The overlay is viewport-anchored, so nothing here needs a container query.
    <div className={cn("relative w-full min-w-0", className)}>
      {showTrigger && (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={dialogId}
          onClick={() => setOpen(true)}
          className={cn(
            "flex min-h-11 w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-surface-border bg-surface px-3 py-2 text-left text-body-sm text-grey-500 transition-colors hover:bg-surface-muted",
            FOCUS_RING,
            triggerClassName
          )}
        >
          <Icon name="search" size="sm" className="shrink-0" />
          <span className="min-w-0 truncate">{triggerLabel}</span>
          {shortcut?.hint && (
            <span
              aria-hidden="true"
              className="ml-auto hidden shrink-0 rounded border border-surface-border px-1.5 py-0.5 text-body-xs font-medium sm:inline"
            >
              {shortcut.hint}
            </span>
          )}
        </button>
      )}

      {/* Always mounted so the trigger's `aria-controls` resolves to a real
          element; `hidden` removes the closed overlay from the a11y tree and
          from the layout, so it can never widen the document. */}
      <div
        id={dialogId}
        className={cn(
          // The overlay is anchored to the viewport, not to the container the
          // trigger sits in, so this is the one place in the batch where a
          // viewport breakpoint is the correct signal. A `@min-[…]` here would
          // read the trigger's width, which has nothing to do with the space
          // the overlay actually has.
          "fixed inset-0 z-50 flex items-start justify-center px-3 py-12 md:px-8 md:py-[12vh]",
          !open && "hidden"
        )}
      >
        <div
          aria-hidden="true"
          onClick={close}
          className="absolute inset-0 bg-[var(--color-overlay,rgba(16,25,40,0.56))]"
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          onKeyDown={handleDialogKeyDown}
          className="relative flex max-h-full w-full max-w-[640px] flex-col overflow-hidden rounded-xl border border-surface-border bg-surface shadow-soft-xl"
        >
          <div className="flex items-center gap-2 border-b border-surface-border px-3 py-2 text-on-surface-muted">
            <Icon name="search" size="md" className="shrink-0 text-grey-500" />
            <label htmlFor={inputId} className="sr-only">
              {searchLabel}
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              value={query}
              placeholder={searchPlaceholder}
              autoComplete="off"
              aria-controls={listId}
              aria-describedby={hintId}
              onChange={(event) => {
                setQuery(event.target.value);
                onQueryChange?.(event.target.value);
              }}
              onKeyDown={handleInputKeyDown}
              className={cn(
                // No `focus:outline-none` here: it wins over the focus-visible
                // ring below and leaves the field with no visible indicator at
                // all, which a tab walk measured before this comment existed.
                "min-h-10 w-full min-w-0 rounded-lg bg-surface px-1 py-2 text-body-md text-grey-900 placeholder:text-grey-500",
                FOCUS_RING
              )}
            />
            <button
              type="button"
              onClick={close}
              className={cn(
                "inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-grey-500 hover:bg-surface-muted hover:text-grey-900",
                FOCUS_RING
              )}
            >
              <Icon name="multiply" size="md" />
              <span className="sr-only">{closeLabel}</span>
            </button>
          </div>

          <p id={hintId} className="sr-only">
            {searchHint}
          </p>

          {/* The results region keeps its id in every state, including the
              prompt and the empty ones, so `aria-controls` on the field never
              points at an element that is not there. */}
          <div
            id={listId}
            className="flex min-h-0 max-h-[min(60vh,420px)] flex-col overflow-y-auto"
          >
            {renderBody()}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-surface-border px-4 py-2 text-body-xs text-grey-500">
            {/* Announced as well as drawn, so filtering to nothing is not a
                silent change for a screen-reader user. */}
            <p role="status" aria-live="polite" className="min-w-0 break-words">
              {countText}
            </p>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
