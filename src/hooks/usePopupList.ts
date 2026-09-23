import { useCallback, useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { useDismissableLayer } from "./useDismissableLayer";

/** Shared focus, dismissal and navigation for Select and DropdownMenu. */
export function usePopupList({
  open,
  setOpen,
  containerRef,
  triggerRef,
  listRef,
  role,
  selected = false,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  containerRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  role: "option" | "menuitem";
  selected?: boolean;
}) {
  const initial = useRef<"first" | "last" | "selected">("selected");
  const search = useRef({ value: "", time: 0 });
  const items = useCallback(() => {
    const list = listRef.current;
    if (!list) return [];
    return Array.from(list.querySelectorAll<HTMLElement>(`[role="${role}"]`)).filter(
      (item) =>
        item.closest('[role="menu"], [role="listbox"]') === list &&
        !item.matches(':disabled, [aria-disabled="true"]') &&
        !item.closest("[hidden], [inert]") &&
        item.getClientRects().length > 0 &&
        item.ownerDocument.defaultView?.getComputedStyle(item).visibility !== "hidden"
    );
  }, [listRef, role]);
  const focusInitial = useCallback(() => {
    const enabled = items();
    const target =
      initial.current === "last"
        ? enabled[enabled.length - 1]
        : initial.current === "selected" && selected
          ? (enabled.find((item) => item.getAttribute("aria-selected") === "true") ?? enabled[0])
          : enabled[0];
    target?.focus();
  }, [items, selected]);
  useEffect(() => {
    if (!open) {
      search.current = { value: "", time: 0 };
      return;
    }
    const timer = setTimeout(focusInitial, 0);
    return () => clearTimeout(timer);
  }, [open, focusInitial]);

  const close = useCallback(
    (restoreFocus = false) => {
      const list = listRef.current;
      // Restore before consumer callbacks can open another dialog. No delayed focus theft.
      if (restoreFocus && list?.contains(list.ownerDocument.activeElement))
        triggerRef.current?.focus({ preventScroll: true });
      setOpen(false);
      initial.current = "selected";
    },
    [listRef, triggerRef, setOpen]
  );
  useDismissableLayer({ open, containerRef, onDismiss: (reason) => close(reason === "escape") });

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.defaultPrevented ||
      event.currentTarget.disabled ||
      (event.key !== "ArrowDown" && event.key !== "ArrowUp")
    )
      return;
    event.preventDefault();
    initial.current = event.key === "ArrowUp" ? "last" : selected ? "selected" : "first";
    if (open) focusInitial();
    else setOpen(true);
  };
  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.isPropagationStopped() ||
      event.nativeEvent.isComposing ||
      (event.target as HTMLElement).closest('[role="menu"], [role="listbox"]') !== listRef.current
    )
      return;
    const enabled = items();
    if (!enabled.length) return;
    const current = enabled.findIndex(
      (item) => item === event.currentTarget.ownerDocument.activeElement
    );
    let next: number | undefined;
    if (event.key === "ArrowDown") next = (current + 1) % enabled.length;
    else if (event.key === "ArrowUp") next = current <= 0 ? enabled.length - 1 : current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = enabled.length - 1;
    else if (
      event.key.length === 1 &&
      event.key !== " " &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const now = Date.now();
      const value =
        (now - search.current.time < 500 ? search.current.value : "") + event.key.toLowerCase();
      search.current = { value, time: now };
      const query = [...value].every((char) => char === value[0]) ? value[0] : value;
      const start = query.length === 1 ? current + 1 : Math.max(current, 0);
      for (let offset = 0; offset < enabled.length; offset++) {
        const index = (start + offset + enabled.length) % enabled.length;
        if (enabled[index].textContent?.trim().toLowerCase().startsWith(query)) {
          next = index;
          break;
        }
      }
    }
    if (next !== undefined) {
      event.preventDefault();
      enabled[next]?.focus();
    }
  };
  return { close, onTriggerKeyDown, onListKeyDown };
}
