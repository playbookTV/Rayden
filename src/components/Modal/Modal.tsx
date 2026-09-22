import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import type { IconSource } from "../Icon";
import { Button } from "../Button";
import { useMotionPresence } from "../../motion/presence";
import type { MotionOption } from "../../motion/presets";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ─── Types ────────────────────────────────────────────────────────────── */

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Opt into semantic panel motion; false preserves immediate open/close. */
  motion?: MotionOption;
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Modal width: sm (400px), md (500px), lg (640px) */
  size?: ModalSize;
  /** Title text */
  title?: string;
  /** Description text below the title */
  description?: string;
  /** Leading icon: registry name, static IconRecord, or ReactNode. */
  icon?: IconSource;
  /** Show close button in header */
  showClose?: boolean;
  /** Primary action button label */
  primaryLabel?: string;
  /** Called when primary button is clicked */
  onPrimaryClick?: () => void;
  /** Secondary action button label */
  secondaryLabel?: string;
  /** Called when secondary button is clicked */
  onSecondaryClick?: () => void;
  /** Footer button layout */
  footerOrientation?: "horizontal" | "vertical";
  /** Close on overlay click */
  closeOnOverlay?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  /** Show backdrop blur on overlay */
  blur?: boolean;
  /** Modal body content */
  children?: ReactNode;
}

/* ─── Icons ────────────────────────────────────────────────────────────── */

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3L3 9M3 3l6 6" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.67 4.67L8 7.33l5.33-2.66M8 14V7.33" />
      <path d="M13.33 10.67V5.33a1.33 1.33 0 00-.66-1.15L8.67 2a1.33 1.33 0 00-1.34 0L3.33 4.18A1.33 1.33 0 002.67 5.33v5.34a1.33 1.33 0 00.66 1.15L7.33 14a1.33 1.33 0 001.34 0l4-2.18a1.33 1.33 0 00.66-1.15z" />
    </svg>
  );
}

/* ─── Size Config ──────────────────────────────────────────────────────── */

const sizeClasses: Record<ModalSize, string> = {
  sm: "w-full max-w-[400px]",
  md: "w-full max-w-[500px]",
  lg: "w-full max-w-[640px]",
};

/* ─── Modal ────────────────────────────────────────────────────────────── */

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      motion = false,
      onClose,
      size = "sm",
      title,
      description,
      icon,
      showClose = true,
      // Defaulted only when there is something for it to do; an inert "Save"
      // used to render whenever the footer appeared.
      primaryLabel: primaryLabelProp,
      onPrimaryClick,
      secondaryLabel,
      onSecondaryClick,
      footerOrientation = "horizontal",
      closeOnOverlay = true,
      closeOnEscape = true,
      blur = true,
      children,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const overlayRef = useRef<HTMLDialogElement>(null);
    const anchorRef = useRef<HTMLSpanElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descriptionId = useId();
    // The portal target only exists in a browser; defer it so an initially
    // open modal can be server-rendered without touching document.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const { present, preset } = useMotionPresence(open, panelRef, motion, "overlay.pop", mounted);

    // Native modal dialogs contain focus and make the background inert.
    useBrowserLayoutEffect(() => {
      const dialog = overlayRef.current;
      if (!present || !dialog) return;
      const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      return () => {
        dialog.close();
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      };
    }, [present, mounted]);

    // ── #30: the portal escapes the provider, so its theme class is copied in.
    // Copying once on open left an open dialog stuck in the old theme when the
    // app switched; observe the source element and re-sync on every change.
    useBrowserLayoutEffect(() => {
      const dialog = overlayRef.current;
      if (!present || !dialog) return;
      const source = anchorRef.current?.closest(".rayden-light, .dark");
      if (!source) return;
      const sync = () => {
        const isLight = source.classList.contains("rayden-light");
        dialog.classList.toggle("rayden-light", isLight);
        dialog.classList.toggle("dark", !isLight);
      };
      sync();
      const observer = new MutationObserver(sync);
      observer.observe(source, { attributes: true, attributeFilter: ["class"] });
      // The theme may also move to a different ancestor, e.g. the documentElement.
      if (source !== document.documentElement)
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
      return () => observer.disconnect();
    }, [present, mounted]);

    useBodyScrollLock(present && mounted);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (open && closeOnOverlay && e.target === overlayRef.current) onClose();
      },
      [open, closeOnOverlay, onClose]
    );

    if (!present || !mounted) return null;

    const primaryLabel = primaryLabelProp ?? (onPrimaryClick ? "Save" : undefined);
    const showPrimary = !!primaryLabel;
    const showSecondary = !!secondaryLabel;
    const isVertical = footerOrientation === "vertical";

    const modal = (
      <dialog
        ref={overlayRef}
        data-rayden-motion={motion ? preset : undefined}
        data-state={open ? "open" : "closed"}
        aria-label={ariaLabel ?? (!title && !ariaLabelledBy ? "Dialog" : undefined)}
        aria-labelledby={ariaLabelledBy ?? (title ? titleId : undefined)}
        aria-describedby={ariaDescribedBy ?? (description ? descriptionId : undefined)}
        className={cn(
          "fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none border-0 bg-transparent p-4 open:flex items-center justify-center backdrop:bg-black/60",
          blur && "backdrop:backdrop-blur-md"
        )}
        onCancel={(event) => {
          event.preventDefault();
          if (open && closeOnEscape) onClose();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const dialog = event.currentTarget;
          const focusable = Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]'
            )
          ).filter(
            (element) =>
              element.tabIndex >= 0 &&
              !element.matches(":disabled") &&
              !element.closest("[inert]") &&
              element.getClientRects().length > 0 &&
              getComputedStyle(element).visibility !== "hidden"
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!first || !last) {
            event.preventDefault();
            (dialog.firstElementChild as HTMLElement)?.focus();
          } else if (
            !focusable.includes(document.activeElement as HTMLElement) ||
            (event.shiftKey ? document.activeElement === first : document.activeElement === last)
          ) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
          }
        }}
        onClick={handleOverlayClick}
      >
        {/* Modal panel */}
        <div
          ref={(element) => {
            panelRef.current = element;
            if (typeof ref === "function") ref(element);
            else if (ref) ref.current = element;
          }}
          tabIndex={-1}
          className={cn(
            "relative flex max-h-[calc(100dvh-2rem)] flex-col bg-surface rounded-xl shadow-soft-xl overflow-hidden",
            sizeClasses[size],
            className
          )}
          {...rest}
        >
          {/* ── Header ── */}
          {(title || showClose) && (
            <div className="flex items-start gap-2 pt-5 pb-2 px-4">
              <div className="flex flex-1 gap-4 items-start min-w-0">
                {icon !== undefined ? (
                  <span className="shrink-0 flex items-center justify-center p-2.5 bg-primary-50 rounded-[20px]">
                    <span className="size-4">{resolveIcon(icon, "sm")}</span>
                  </span>
                ) : title ? (
                  <span className="shrink-0 flex items-center justify-center p-2.5 bg-primary-50 rounded-[20px]">
                    <BoxIcon className="size-4 text-primary-400" />
                  </span>
                ) : null}
                <div className="flex flex-col flex-1 min-w-0">
                  {title && (
                    <h2
                      id={titleId}
                      className="text-xl font-semibold text-on-surface-body leading-[1.2] tracking-[-0.4px]"
                    >
                      {title}
                    </h2>
                  )}
                  {description && !!(title || showClose) && (
                    <p id={descriptionId} className="text-sm text-on-surface-muted leading-[1.45]">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="shrink-0 flex items-center justify-center p-2 bg-grey-75 text-grey-700 rounded-xl hover:bg-grey-200 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
                >
                  <CloseIcon className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* Rendered here when there is no header to hold it, so the description is
              never dropped while aria-describedby still references it. */}
          {description && !title && !showClose && (
            <p
              id={descriptionId}
              className="px-4 pt-5 text-sm text-on-surface-muted leading-[1.45]"
            >
              {description}
            </p>
          )}

          {/* ── Body ── */}
          {children && <div className="min-h-0 flex-1 px-4 py-4 overflow-y-auto">{children}</div>}

          {/* ── Footer ── */}
          {(showPrimary || showSecondary) && (
            <div
              className={cn(
                "py-5",
                isVertical
                  ? "flex flex-col gap-5 items-center px-4"
                  : "flex items-center justify-end gap-3 px-4"
              )}
            >
              {showSecondary && !isVertical && (
                <Button variant="secondary" onClick={onSecondaryClick ?? onClose} type="button">
                  {secondaryLabel}
                </Button>
              )}
              {showPrimary && (
                <Button
                  type="button"
                  onClick={onPrimaryClick}
                  className={isVertical ? "w-full" : undefined}
                >
                  {primaryLabel}
                </Button>
              )}
              {showSecondary && isVertical && (
                <Button
                  variant="secondary"
                  onClick={onSecondaryClick ?? onClose}
                  type="button"
                  className="w-full"
                >
                  {secondaryLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </dialog>
    );

    return (
      <>
        <span ref={anchorRef} hidden />
        {createPortal(modal, document.body)}
      </>
    );
  }
);

Modal.displayName = "Modal";
