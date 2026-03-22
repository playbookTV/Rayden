import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";

/* ─── Types ────────────────────────────────────────────────────────────── */

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
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
  /** Leading icon element */
  icon?: ReactNode;
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
  sm: "w-[400px]",
  md: "w-[500px]",
  lg: "w-[640px]",
};

/* ─── Modal ────────────────────────────────────────────────────────────── */

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      size = "sm",
      title,
      description,
      icon,
      showClose = true,
      primaryLabel = "Save",
      onPrimaryClick,
      secondaryLabel,
      onSecondaryClick,
      footerOrientation = "horizontal",
      closeOnOverlay = true,
      closeOnEscape = true,
      blur = true,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Escape key handler
    useEffect(() => {
      if (!open || !closeOnEscape) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, closeOnEscape, onClose]);

    // Lock body scroll
    useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnOverlay && e.target === overlayRef.current) onClose();
      },
      [closeOnOverlay, onClose]
    );

    if (!open) return null;

    const isVertical = footerOrientation === "vertical";

    const modal = (
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          blur && "backdrop-blur-md"
        )}
        onClick={handleOverlayClick}
        role="presentation"
      >
        {/* Overlay background */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Modal panel */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-desc" : undefined}
          className={cn(
            "relative flex flex-col bg-white dark:bg-grey-50 rounded-xl shadow-soft-xl overflow-hidden",
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
                    <span className="size-4">{icon}</span>
                  </span>
                ) : title ? (
                  <span className="shrink-0 flex items-center justify-center p-2.5 bg-primary-50 rounded-[20px]">
                    <BoxIcon className="size-4 text-primary-400" />
                  </span>
                ) : null}
                <div className="flex flex-col flex-1 min-w-0">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-xl font-semibold text-grey-700 leading-[1.2] tracking-[-0.4px]"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-desc" className="text-sm text-grey-500 leading-[1.45]">
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
                  className="shrink-0 flex items-center justify-center p-1.5 bg-grey-75 rounded-xl hover:bg-grey-200 transition-colors cursor-pointer"
                >
                  <CloseIcon className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* ── Body ── */}
          {children && <div className="flex-1 px-4 py-4 overflow-y-auto">{children}</div>}

          {/* ── Footer ── */}
          {(primaryLabel || secondaryLabel) && (
            <div
              className={cn(
                "py-5",
                isVertical
                  ? "flex flex-col gap-5 items-center px-4"
                  : "flex items-center justify-end gap-3 px-4"
              )}
            >
              {isVertical ? (
                <>
                  <button
                    type="button"
                    onClick={onPrimaryClick}
                    className="w-full bg-primary-400 text-white text-sm font-semibold p-2 rounded-xl hover:bg-primary-500 transition-colors cursor-pointer"
                  >
                    {primaryLabel}
                  </button>
                  {secondaryLabel && (
                    <button
                      type="button"
                      onClick={onSecondaryClick ?? onClose}
                      className="w-full border-[1.5px] border-primary-400 text-primary-400 text-sm font-semibold p-2 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer"
                    >
                      {secondaryLabel}
                    </button>
                  )}
                </>
              ) : (
                <>
                  {secondaryLabel && (
                    <button
                      type="button"
                      onClick={onSecondaryClick ?? onClose}
                      className="flex-1 border-[1.5px] border-primary-400 text-primary-400 text-sm font-semibold p-2 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer"
                    >
                      {secondaryLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onPrimaryClick}
                    className="flex-1 bg-primary-400 text-white text-sm font-semibold p-2 rounded-xl hover:bg-primary-500 transition-colors cursor-pointer"
                  >
                    {primaryLabel}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(modal, document.body);
  }
);

Modal.displayName = "Modal";
