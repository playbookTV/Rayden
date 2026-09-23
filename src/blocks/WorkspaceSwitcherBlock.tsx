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

export type WorkspaceSwitcherStatus = "idle" | "loading" | "error";

interface WorkspaceBase {
  id: string;
  name: string;
  /** Plan, role, or member count — one short supporting line. */
  detail?: string;
  /** Square logo. Falls back to {@link initials}, then to the first character. */
  logoSrc?: string;
  initials?: string;
  icon?: IconName;
}

/**
 * Switching workspace is normally an application action, so `onSelect` is the
 * default path. A workspace that is genuinely a separate address may supply an
 * `href`; it is then rendered as a real anchor, which keeps middle-click and
 * open-in-new-tab working.
 */
export type WorkspaceSwitcherItem =
  | (WorkspaceBase & { href?: string; unavailableReason?: undefined })
  | (WorkspaceBase & {
      /** Why the viewer cannot open this workspace. Shown next to the entry. */
      unavailableReason: string;
      href?: undefined;
    });

export interface WorkspaceSwitcherFooterAction {
  id: string;
  label: string;
  icon?: IconName;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

export interface WorkspaceSwitcherBlockProps {
  /** The workspace the application is currently showing. */
  current?: WorkspaceSwitcherItem;
  /** Everything the viewer may switch to, including {@link current}. */
  workspaces?: WorkspaceSwitcherItem[];
  /**
   * Required whenever a workspace without an `href` can be chosen: a switcher
   * that cannot switch is an inert control.
   */
  onSelect?: (id: string) => void;
  /** Explanation for entries with neither a destination nor a selection handler. */
  unavailableMessage?: string;

  /** @default "idle" */
  status?: WorkspaceSwitcherStatus;
  errorMessage?: string;
  /** The retry control is omitted entirely when no handler is supplied. */
  onRetry?: () => void;
  loadingMessage?: string;

  /** Accessible name for the trigger. @default "Switch workspace" */
  triggerLabel?: string;
  /** Small label above the current name on the trigger, e.g. "Workspace". */
  triggerHint?: string;
  /** Shown on the trigger when no workspace is selected. @default "Choose a workspace" */
  placeholder?: string;

  /** Accessible name for the popover. @default "Workspaces" */
  panelLabel?: string;
  /** @default "Filter workspaces" */
  filterLabel?: string;
  filterPlaceholder?: string;
  /**
   * Below this many workspaces the filter field is not rendered, because a
   * filter over three entries is noise. @default 6
   */
  filterThreshold?: number;

  /** Shown when the viewer belongs to no workspace at all. */
  emptyTitle?: string;
  emptyDescription?: string;
  /** Shown when the filter matches nothing — a different situation from empty. */
  noMatchesTitle?: string;
  noMatchesDescription?: string;

  /** "Create workspace" / "Join workspace". Rendered only when supplied. */
  footerActions?: WorkspaceSwitcherFooterAction[];

  /** Announced result count. Receives the number of matching workspaces. */
  resultCountLabel?: (count: number) => string;

  /** Uncontrolled default. @default false */
  defaultOpen?: boolean;
  /** Controlled open state. Pair with {@link onOpenChange}. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Lands on the container root, outside the popover surface. */
  className?: string;
}

/* ─── Recipes ────────────────────────────────────────────────────────── */

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

/* ─── Logo ───────────────────────────────────────────────────────────── */

function WorkspaceMark({
  item,
  size = "md",
}: Readonly<{ item: WorkspaceBase; size?: "sm" | "md" }>) {
  const box = size === "sm" ? "size-7 text-body-xs" : "size-9 text-body-sm";
  if (item.logoSrc) {
    return (
      <img
        src={item.logoSrc}
        alt=""
        className={cn("shrink-0 rounded-lg border border-surface-border object-cover", box)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      // The colour comes last: `box` carries a `text-body-*` size utility, and
      // class merging treats it as the same group, so a colour written first is
      // dropped and the initials fall back to the inherited foreground.
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-primary-50 font-semibold",
        box,
        "text-action-primary-text"
      )}
    >
      {item.icon ? (
        <Icon name={item.icon} size={size === "sm" ? "sm" : "md"} />
      ) : (
        (item.initials ?? item.name.slice(0, 2).toUpperCase())
      )}
    </span>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function WorkspaceSwitcherBlock({
  current,
  workspaces = [],
  onSelect,
  unavailableMessage = "Switching to this workspace is not available.",
  status = "idle",
  errorMessage = "Your workspaces could not be loaded.",
  onRetry,
  loadingMessage = "Loading workspaces",
  triggerLabel = "Switch workspace",
  triggerHint,
  placeholder = "Choose a workspace",
  panelLabel = "Workspaces",
  filterLabel = "Filter workspaces",
  filterPlaceholder = "Type to filter",
  filterThreshold = 6,
  emptyTitle = "You are not in any workspace yet",
  emptyDescription = "Create a workspace or ask an administrator for an invitation.",
  noMatchesTitle = "No workspace matches that filter",
  noMatchesDescription = "Check the spelling, or clear the filter to see every workspace.",
  footerActions = [],
  resultCountLabel = (count) => (count === 1 ? "1 workspace matches" : `${count} workspaces match`),
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className,
}: WorkspaceSwitcherBlockProps) {
  const uid = useId();
  const panelId = `${uid}-panel`;
  const listId = `${uid}-list`;
  const filterId = `${uid}-filter`;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;

  const [query, setQuery] = useState("");
  /** Roving tabindex: exactly one option is in the tab order at a time. */
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /**
   * The popover is wider than its trigger, so a trigger sitting near the right
   * edge would push the popover past it and widen the document. The offset is
   * measured from the trigger when the popover opens: start-aligned when it
   * fits, end-aligned when it does not, and pinned to the viewport when neither
   * side fits. Nothing is positioned until it is measured.
   */
  const [panelBox, setPanelBox] = useState<{ left: number; width: number } | null>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  const close = useCallback(
    (restoreFocus: boolean) => {
      setOpen(false);
      if (restoreFocus) triggerRef.current?.focus();
    },
    [setOpen]
  );

  /* Closing when the pointer lands outside keeps the popover from shadowing the
     page; it is deliberately not a modal, so focus is never trapped here. */
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) {
      setPanelBox(null);
      return;
    }
    function place() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const viewport = document.documentElement.clientWidth;
      const width = Math.min(320, Math.max(rect.width, viewport - 24));
      let left = 0;
      if (rect.left + width > viewport - 12) {
        left = rect.width - width;
        if (rect.left + left < 12) left = 12 - rect.left;
      }
      setPanelBox({ left, width });
    }
    place();
    window.addEventListener("resize", place);
    // A window resize is not the only thing that moves the trigger: a root text
    // size change, a sidebar collapsing, or a container query flipping all do it
    // without firing `resize`.
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => place());
    if (observer && triggerRef.current) observer.observe(triggerRef.current);
    if (observer) observer.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", place);
      observer?.disconnect();
    };
  }, [open]);

  /* The filter is where a keyboard user expects to land, and it is where typing
     already works, so it takes focus as the popover opens. */
  useEffect(() => {
    if (!open) return;
    const target =
      filterRef.current ?? listRef.current?.querySelector<HTMLElement>("[data-option]");
    target?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return workspaces;
    return workspaces.filter((item) =>
      `${item.name} ${item.detail ?? ""}`.toLocaleLowerCase().includes(needle)
    );
  }, [query, workspaces]);

  const showFilter = workspaces.length >= filterThreshold;
  const hasSource = workspaces.length > 0;

  /* ── Roving focus across the options ─────────────────────────────── */
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

  function handleFilterKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOptionAt(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOptionAt(-1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
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
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      default:
        break;
    }
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function choose(item: WorkspaceSwitcherItem) {
    if ("unavailableReason" in item && item.unavailableReason) return;
    if (!onSelect) return;
    onSelect(item.id);
    close(true);
  }

  /* ── Option ──────────────────────────────────────────────────────── */
  function renderOption(item: WorkspaceSwitcherItem, index: number) {
    const unavailable =
      ("unavailableReason" in item ? item.unavailableReason : undefined) ||
      (!item.href && !onSelect ? unavailableMessage : undefined);
    const isCurrent = current?.id === item.id;
    const reasonId = `${uid}-${item.id}-reason`;

    const body = (
      <>
        <WorkspaceMark item={item} size="sm" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
          <span className="text-body-sm font-medium break-words">{item.name}</span>
          {item.detail && (
            <span className="text-body-xs break-words text-grey-500">{item.detail}</span>
          )}
          {unavailable && (
            <span id={reasonId} className="text-body-xs break-words text-grey-500">
              {unavailable}
            </span>
          )}
        </span>
        {isCurrent && (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-body-xs font-semibold text-action-primary-text">
            <Icon name="check" size="sm" />
            <span>Current</span>
          </span>
        )}
      </>
    );

    /**
     * The current entry is marked by the "Current" chip, not by a tint. An
     * earlier draft tinted the row `bg-primary-50`; the muted detail line then
     * measured 4.28:1 on it, below AA, which is the same mistake the Batch A
     * pricing cards made with `opacity-90`. `surface-muted` is a ground the
     * muted foreground role is already paired with in both modes.
     */
    const classes = cn(
      "flex min-h-11 w-full min-w-0 items-start gap-3 rounded-lg px-2 py-2 transition-colors",
      FOCUS_RING,
      unavailable
        ? "cursor-not-allowed text-grey-500"
        : "cursor-pointer text-grey-900 hover:bg-surface-muted",
      isCurrent && !unavailable && "bg-surface-muted"
    );

    const shared = {
      "data-option": "true",
      role: "option" as const,
      tabIndex: index === activeIndex ? 0 : -1,
      "aria-selected": isCurrent,
      onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => handleOptionKeyDown(event, index),
      onFocus: () => setActiveIndex(index),
      className: classes,
    };

    if (unavailable) {
      return (
        <div key={item.id} {...shared} aria-disabled="true" aria-describedby={reasonId}>
          {body}
        </div>
      );
    }

    if (item.href) {
      // A workspace that is its own address stays a real anchor; the listbox
      // role does not remove the href, so middle-click still opens a new tab.
      return (
        <a
          key={item.id}
          {...shared}
          href={item.href}
          onClick={() => {
            onSelect?.(item.id);
            close(false);
          }}
        >
          {body}
        </a>
      );
    }

    return (
      <div
        key={item.id}
        {...shared}
        onClick={() => choose(item)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            choose(item);
            return;
          }
          handleOptionKeyDown(event, index);
        }}
      >
        {body}
      </div>
    );
  }

  /* ── Panel body ──────────────────────────────────────────────────── */
  function renderBody(): ReactNode {
    if (status === "loading") {
      return (
        <p role="status" className="flex items-center gap-2 px-2 py-6 text-body-sm text-grey-500">
          <Spinner size="sm" />
          <span>{loadingMessage}</span>
        </p>
      );
    }

    if (status === "error") {
      return (
        <div
          role="alert"
          className="m-1 flex flex-col gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-3 text-body-sm text-error-700"
        >
          <p className="break-words">{errorMessage}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={cn(
                "inline-flex min-h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-current px-3 py-1.5 font-semibold",
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
        <div className="flex flex-col gap-1 px-2 py-6">
          <p className="text-body-sm font-semibold break-words text-grey-900">{emptyTitle}</p>
          <p className="text-body-sm break-words text-grey-500">{emptyDescription}</p>
        </div>
      );
    }

    if (matches.length === 0) {
      return (
        <div className="flex flex-col gap-1 px-2 py-6">
          <p className="text-body-sm font-semibold break-words text-grey-900">{noMatchesTitle}</p>
          <p className="text-body-sm break-words text-grey-500">{noMatchesDescription}</p>
        </div>
      );
    }

    return (
      <div
        ref={listRef}
        role="listbox"
        aria-label={panelLabel}
        className="flex flex-col gap-0.5 p-1"
      >
        {matches.map((item, index) => renderOption(item, index))}
      </div>
    );
  }

  /* ── Trigger ─────────────────────────────────────────────────────── */
  /**
   * The spoken name repeats every visible word in the order it is drawn, so a
   * voice-control user can say what they can see (WCAG 2.5.3), and then adds
   * the purpose the icon alone would not carry.
   */
  const triggerName = current
    ? `${triggerHint ? `${triggerHint}, ` : ""}${current.name}. ${triggerLabel}`
    : `${placeholder}. ${triggerLabel}`;

  return (
    <div
      ref={rootRef}
      /**
       * Deliberately NOT an `@container`. `container-type: inline-size` makes an
       * element's inline size independent of its own contents, so this root —
       * a shrinkable flex item inside the shell's top bar — resolved to 0px at
       * every width and the switcher disappeared. The block has no internal
       * container query to justify the cost: the popover is placed from a
       * measurement instead.
       */
      className={cn("relative w-full min-w-0", className)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={triggerName}
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex min-h-11 w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-surface-border bg-surface px-2 py-1.5 text-left text-grey-700 transition-colors hover:bg-surface-muted",
          FOCUS_RING
        )}
      >
        {current ? (
          <>
            <WorkspaceMark item={current} size="sm" />
            <span className="flex min-w-0 flex-col">
              {triggerHint && <span className="text-body-xs text-grey-500">{triggerHint}</span>}
              <span className="line-clamp-1 text-body-sm font-semibold break-all text-grey-900">
                {current.name}
              </span>
            </span>
          </>
        ) : (
          <span className="line-clamp-1 text-body-sm font-medium break-words text-grey-500">
            {placeholder}
          </span>
        )}
        <Icon name="chevron-down" size="sm" className="ml-auto shrink-0 text-grey-500" />
      </button>

      {/* Always mounted so the trigger's `aria-controls` resolves to a real
          element; `hidden` keeps the closed popover out of the a11y tree. */}
      <div
        id={panelId}
        role="dialog"
        aria-label={panelLabel}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close(true);
          }
        }}
        style={panelBox ? { left: panelBox.left, width: panelBox.width } : undefined}
        className={cn(
          "absolute top-[calc(100%+4px)] left-0 z-30 flex w-full min-w-0 flex-col rounded-xl border border-surface-border bg-surface shadow-soft-md",
          !open && "hidden"
        )}
      >
        {showFilter && status === "idle" && hasSource && (
          <div className="border-b border-surface-border p-2">
            <label htmlFor={filterId} className="sr-only">
              {filterLabel}
            </label>
            <input
              ref={filterRef}
              id={filterId}
              type="search"
              value={query}
              placeholder={filterPlaceholder}
              aria-controls={listId}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleFilterKeyDown}
              className={cn(
                "w-full min-w-0 rounded-lg border border-surface-border-strong bg-surface px-3 py-2 text-body-sm text-grey-900 placeholder:text-grey-500",
                FOCUS_RING
              )}
            />
          </div>
        )}

        {/* The results region keeps its id in every state, so the filter's
            `aria-controls` resolves even while nothing matches. */}
        <div id={listId} className="flex max-h-[320px] min-h-0 flex-col overflow-y-auto">
          {renderBody()}
        </div>

        {/* The count is announced rather than only drawn, so a filter that
            empties the list is not a silent change. */}
        <p role="status" aria-live="polite" className="sr-only">
          {open && status === "idle" && hasSource ? resultCountLabel(matches.length) : ""}
        </p>

        {footerActions.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-surface-border p-1">
            {footerActions.map((action) => {
              const inner = (
                <>
                  {action.icon && <Icon name={action.icon} size="sm" className="shrink-0" />}
                  <span className="break-words">{action.label}</span>
                </>
              );
              const classes = cn(
                "flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-body-sm font-medium text-grey-700 hover:bg-surface-muted hover:text-grey-900",
                FOCUS_RING
              );
              return action.href ? (
                <a
                  key={action.id}
                  href={action.href}
                  onClick={() => {
                    action.onClick?.();
                    close(false);
                  }}
                  {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className={classes}
                >
                  {inner}
                </a>
              ) : (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    action.onClick?.();
                    close(true);
                  }}
                  className={classes}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
