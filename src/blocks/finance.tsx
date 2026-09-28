import { useId, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Button } from "../components/Button";
import { Icon, type IconName } from "../components/Icon";
import { Spinner } from "../components/Spinner";

/* ─── Heading contract ────────────────────────────────────────────────
   The string union settled by Batch B and Batch C. The value is the element
   name, so a block renders `<Heading>` directly instead of composing a tag
   from a number.
   ------------------------------------------------------------------- */
export type FinanceHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** The level one step below `level`, floored at `h6`. */
export function nextFinanceHeadingLevel(level: FinanceHeadingLevel): FinanceHeadingLevel {
  const order: FinanceHeadingLevel[] = ["h1", "h2", "h3", "h4", "h5", "h6"];
  return order[Math.min(order.indexOf(level) + 1, order.length - 1)];
}

/* ─── Money ───────────────────────────────────────────────────────────
   Money is an integer in the currency's minor unit, matching the commerce
   contract established in Batch B (pence for GBP, yen for JPY).

   The three-way value is the whole point of this module. Finance blocks must
   never fabricate a balance, a fee, a rate or an arrival estimate:

     number     — a real, supplied amount. `0` is a real amount ("no fee").
     null       — the amount is genuinely unknown. Rendered as words.
     undefined  — not applicable here. The row is omitted entirely.

   `0` and `null` are therefore different things and are never conflated.
   ------------------------------------------------------------------- */
export type FinanceMoneyValue = number | null | undefined;

export interface FinanceMoneyOptions {
  /** ISO 4217 code. Never inferred from the locale. */
  currency: string;
  /** Explicit locale keeps server and client formatting identical. */
  locale: string;
  /** Words shown for a `null` amount. */
  unknownLabel?: string;
  /** `"exceptZero"` prints a leading `+` on credits. */
  signDisplay?: "auto" | "never" | "always" | "exceptZero";
}

/** Minor units per major unit for a currency under a locale, e.g. 100 for GBP. */
export function financeMinorUnitScale(currency: string, locale: string): number {
  const digits =
    new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions()
      .maximumFractionDigits ?? 2;
  return 10 ** digits;
}

/**
 * Formats a minor-unit integer, or the unknown label when the amount is `null`.
 * Returns `undefined` for `undefined` so a caller can omit the row.
 */
export function formatFinanceMoney(
  value: FinanceMoneyValue,
  { currency, locale, unknownLabel = "Not available", signDisplay }: FinanceMoneyOptions
): string | undefined {
  if (value === undefined) return undefined;
  if (value === null) return unknownLabel;
  const format = new Intl.NumberFormat(locale, { style: "currency", currency, signDisplay });
  return format.format(value / financeMinorUnitScale(currency, locale));
}

/* ─── Dates ───────────────────────────────────────────────────────────
   `Date` and `number` are real instants and are formatted with the supplied
   locale and time zone. A `string` that parses as a date is treated the same
   way; a string that does not parse is returned verbatim, which is how a
   caller supplies an inherently fuzzy label such as "1–2 business days".
   ------------------------------------------------------------------- */
export type FinanceDateValue = Date | string | number | null | undefined;

export interface FinanceDateOptions {
  locale: string;
  /** IANA zone, e.g. `"Europe/Amsterdam"`. Omitted means the runtime's zone. */
  timeZone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
  unknownLabel?: string;
  /** Escape hatch: takes precedence over `dateStyle` / `timeStyle`. */
  format?: (value: Date) => string;
}

export interface FinanceFormattedDate {
  /** What a reader sees. */
  text: string;
  /** ISO 8601 for `<time dateTime>`, absent when the value was not an instant. */
  machine?: string;
}

export function formatFinanceDate(
  value: FinanceDateValue,
  {
    locale,
    timeZone,
    dateStyle = "long",
    timeStyle,
    unknownLabel = "Not available",
    format,
  }: FinanceDateOptions
): FinanceFormattedDate | undefined {
  if (value === undefined) return undefined;
  if (value === null) return { text: unknownLabel };
  const instant = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(instant.getTime())) {
    // Not an instant. A caller-supplied label, passed through unchanged.
    return { text: String(value) };
  }
  if (format) return { text: format(instant), machine: instant.toISOString() };
  return {
    text: new Intl.DateTimeFormat(locale, { dateStyle, timeStyle, timeZone }).format(instant),
    machine: instant.toISOString(),
  };
}

/** Renders a formatted date as `<time>` when it represents a real instant. */
export function FinanceDate({
  value,
  className,
}: {
  value: FinanceFormattedDate | undefined;
  className?: string;
}) {
  if (!value) return null;
  if (!value.machine) return <span className={className}>{value.text}</span>;
  return (
    <time dateTime={value.machine} className={className}>
      {value.text}
    </time>
  );
}

/* ─── Status ──────────────────────────────────────────────────────────
   There is no `info` tone: the palette carries `info-400`/`info-500` only,
   with no ground and no text role that inverts for dark mode, so an info
   badge could not be made readable in both modes without inventing a token.
   This repeats the Batch C finding rather than working around it.
   ------------------------------------------------------------------- */
export type FinanceStatusTone = "neutral" | "success" | "warning" | "danger";

export interface FinanceStatus {
  /** Carries the meaning in words. The tone only tints it. */
  label: string;
  /** @default "neutral" */
  tone?: FinanceStatusTone;
  /** One sentence shown beside the badge. */
  description?: string;
}

const STATUS_TONE: Record<FinanceStatusTone, string> = {
  neutral: "bg-grey-100 text-grey-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-error-50 text-error-700",
};

export function FinanceStatusBadge({
  status,
  descriptionId,
}: {
  status: FinanceStatus;
  descriptionId?: string;
}) {
  return (
    <span
      aria-describedby={status.description ? descriptionId : undefined}
      className={cn(
        "inline-flex max-w-full min-w-0 items-center rounded-full px-2.5 py-1 font-semibold break-words",
        "text-body-xs",
        STATUS_TONE[status.tone ?? "neutral"]
      )}
    >
      {status.label}
    </span>
  );
}

/* ─── Actions ─────────────────────────────────────────────────────────
   A union of destination, action, or explicitly unavailable, so a control
   with no configured behaviour cannot be expressed. Destinations render an
   anchor through `Button as="a"`; the local CTA recipe earlier batches
   carried is retired.
   ------------------------------------------------------------------- */
export type FinanceActionTone = "primary" | "secondary" | "quiet" | "danger";

interface FinanceActionBase {
  id: string;
  label: string;
  icon?: IconName;
  /** @default "secondary" */
  tone?: FinanceActionTone;
  /** Longer spoken name where the visible label is terse. */
  description?: string;
}

export type FinanceAction =
  | (FinanceActionBase & {
      href: string;
      external?: boolean;
      onClick?: () => void;
      unavailableReason?: undefined;
    })
  | (FinanceActionBase & { onClick: () => void; href?: undefined; unavailableReason?: undefined })
  | (FinanceActionBase & {
      /** Why this control cannot be used. Renders disabled with the reason visible. */
      unavailableReason: string;
      href?: undefined;
      onClick?: undefined;
    });

const ACTION_VARIANT: Record<
  FinanceActionTone,
  { variant: "primary" | "secondary" | "grey" | "destructive" | "text"; appearance?: "outlined" }
> = {
  primary: { variant: "primary" },
  secondary: { variant: "grey", appearance: "outlined" },
  quiet: { variant: "text" },
  danger: { variant: "destructive", appearance: "outlined" },
};

export function FinanceActionControl({
  action,
  size = "sm",
  fullWidth = false,
}: {
  action: FinanceAction;
  size?: "sm" | "lg";
  fullWidth?: boolean;
}) {
  const uid = useId();
  const reasonId = `${uid}-reason`;
  const tone = ACTION_VARIANT[action.tone ?? "secondary"];
  // Layout only. No colour or type-size class is appended, because
  // tailwind-merge groups `text-*` size and `text-*` colour together and the
  // later one wins — the Batch C class-merge defect.
  const layout = cn("min-h-11 max-w-full min-w-0", fullWidth && "w-full");

  const label = (
    <span className="min-w-0 break-words">
      {action.label}
      {action.description && <span className="sr-only"> {action.description}</span>}
    </span>
  );

  if (action.unavailableReason) {
    return (
      <span className={cn("flex min-w-0 flex-col gap-1", fullWidth && "w-full")}>
        <Button
          {...tone}
          size={size}
          disabled
          icon={action.icon}
          iconPosition={action.icon ? "leading" : "none"}
          aria-describedby={reasonId}
          className={layout}
        >
          {label}
        </Button>
        <span id={reasonId} className="text-body-xs break-words text-on-surface-muted">
          {action.unavailableReason}
        </span>
      </span>
    );
  }

  if (action.href) {
    return (
      <Button
        {...tone}
        as="a"
        size={size}
        href={action.href}
        onClick={action.onClick}
        icon={action.icon}
        iconPosition={action.icon ? "leading" : "none"}
        className={layout}
        {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      {...tone}
      size={size}
      onClick={action.onClick}
      icon={action.icon}
      iconPosition={action.icon ? "leading" : "none"}
      className={layout}
    >
      {label}
    </Button>
  );
}

export function FinanceActionRow({
  actions,
  label,
  align = "start",
  size = "sm",
}: {
  actions: FinanceAction[];
  /** Accessible name for the group. */
  label: string;
  align?: "start" | "end";
  size?: "sm" | "lg";
}) {
  if (actions.length === 0) return null;
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex min-w-0 flex-wrap items-start gap-2",
        align === "end" && "@min-[560px]:justify-end"
      )}
    >
      {actions.map((action) => (
        <FinanceActionControl key={action.id} action={action} size={size} />
      ))}
    </div>
  );
}

/* ─── Shared panels ──────────────────────────────────────────────────── */

export const FINANCE_FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

/** A titled group of label/value pairs. Numeric values carry tabular figures. */
export interface FinanceFigure {
  id: string;
  label: ReactNode;
  /** Already formatted. `undefined` omits the row. */
  value: ReactNode;
  hint?: ReactNode;
  icon?: IconName;
  /** Right-aligned tabular figures. @default true */
  numeric?: boolean;
  emphasis?: "normal" | "strong";
}

export function FinanceFigureList({
  figures,
  label,
  id,
  className,
}: {
  figures: FinanceFigure[];
  label?: string;
  id?: string;
  className?: string;
}) {
  const visible = figures.filter((figure) => figure.value !== undefined && figure.value !== null);
  if (visible.length === 0) return null;
  return (
    <dl id={id} aria-label={label} className={cn("flex flex-col gap-2", className)}>
      {visible.map((figure) => (
        <div
          key={figure.id}
          className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
        >
          <dt className="flex min-w-0 items-center gap-1.5 text-body-sm break-words text-on-surface-secondary">
            {figure.icon && <Icon name={figure.icon} size="sm" className="shrink-0" />}
            <span className="min-w-0 break-words">{figure.label}</span>
          </dt>
          <dd
            className={cn(
              "min-w-0 break-words",
              figure.numeric !== false && "text-right tabular-nums",
              figure.emphasis === "strong"
                ? "text-body-md font-semibold text-on-surface"
                : "text-body-sm font-medium text-on-surface-body"
            )}
          >
            {figure.value}
            {figure.hint && (
              <span className="block text-body-xs font-normal break-words text-on-surface-muted">
                {figure.hint}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A `role="alert"` recovery panel. The retry control is omitted without a handler. */
export function FinanceErrorPanel({
  title,
  description,
  onRetry,
  retryLabel = "Try again",
}: {
  title: string;
  description?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-lg border border-error-200 bg-error-50 px-4 py-3"
    >
      <p className="text-body-sm font-semibold break-words text-error-700">{title}</p>
      {description && <p className="text-body-sm break-words text-error-700">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "inline-flex min-h-11 w-fit max-w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border-[1.5px] border-current px-4 py-2 font-semibold",
            FINANCE_FOCUS_RING,
            "text-body-sm text-error-700"
          )}
        >
          <Icon name="refresh" size="sm" />
          <span className="min-w-0 break-words">{retryLabel}</span>
        </button>
      )}
    </div>
  );
}

/** An explanation of an absence. Every word is the caller's, so "nothing here"
 *  and "nothing matches this filter" can read differently. */
export function FinanceEmptyPanel({
  title,
  description,
  icon = "info-circle",
  action,
}: {
  title: string;
  description?: ReactNode;
  icon?: IconName;
  action?: FinanceAction;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-surface-border-strong bg-surface-muted px-4 py-6">
      <Icon name={icon} size="md" className="shrink-0 text-on-surface-muted" />
      <p className="text-body-sm font-semibold break-words text-on-surface">{title}</p>
      {description && (
        <p className="max-w-[56ch] text-body-sm break-words text-on-surface-muted">{description}</p>
      )}
      {action && <FinanceActionControl action={action} />}
    </div>
  );
}

export function FinanceLoadingNotice({ message }: { message: string }) {
  return (
    // The Spinner is itself a `role="status"` region. Nesting it inside another
    // one gives two live regions announcing the same thing, so the decoration is
    // hidden and the message keeps the announcement.
    <p role="status" className="flex items-center gap-2 text-body-sm text-on-surface-muted">
      <span aria-hidden="true" className="flex shrink-0 items-center">
        <Spinner size="sm" />
      </span>
      <span className="min-w-0 break-words">{message}</span>
    </p>
  );
}

/** Grey placeholder shapes. Hidden from assistive technology; the announcement
 *  belongs to the accompanying `role="status"` line. */
export function FinanceSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <div className="h-4 w-32 max-w-full rounded bg-grey-100" />
      <div className="h-9 w-48 max-w-full rounded bg-grey-100" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 w-full max-w-[40ch] rounded bg-grey-100" />
      ))}
    </div>
  );
}

/* ─── Block shell ─────────────────────────────────────────────────────
   `@container` sits on the outermost element, OUTSIDE the padded surface, so
   the `@min-[…]` padding inside the surface resolves against the block's real
   width. `className` therefore lands on the container root, which is the
   documented contract every batch relies on.

   A root carrying `container-type: inline-size` cannot shrink to fit its own
   contents, so a finance block must not be dropped into a flex row as a
   shrinkable item — give it a grid track or an explicit width. This is the
   Batch C collapsed-switcher defect, recorded here so it is not rediscovered.
   ------------------------------------------------------------------- */
export interface FinanceShellProps {
  /** Accessible name for the section landmark. */
  labelledBy: string;
  busy?: boolean;
  /** `surface` paints a card; `plain` sits in an existing gutter. @default "surface" */
  variant?: "surface" | "plain";
  className?: string;
  children: ReactNode;
}

export function FinanceShell({
  labelledBy,
  busy,
  variant = "surface",
  className,
  children,
}: FinanceShellProps) {
  return (
    <div className={cn("@container relative w-full", className)}>
      <section
        aria-labelledby={labelledBy}
        aria-busy={busy || undefined}
        className={cn(
          "flex w-full min-w-0 flex-col gap-5",
          variant === "surface" &&
            "rounded-12 border border-surface-border bg-surface p-4 @min-[560px]:p-6"
        )}
      >
        {children}
      </section>
    </div>
  );
}

/** Section heading row with an optional trailing control slot. */
export function FinanceHeader({
  id,
  level: Heading,
  title,
  description,
  eyebrow,
  status,
  statusDescriptionId,
  trailing,
}: {
  id: string;
  level: FinanceHeadingLevel;
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  status?: FinanceStatus;
  statusDescriptionId?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 @min-[560px]:flex-row @min-[560px]:items-start @min-[560px]:justify-between @min-[560px]:gap-6">
      <div className="flex min-w-0 flex-col gap-1.5">
        {eyebrow && (
          <p className="font-semibold break-words uppercase text-caption-sm text-action-primary-text">
            {eyebrow}
          </p>
        )}
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <Heading id={id} className="min-w-0 font-semibold break-words text-h6 text-on-surface">
            {title}
          </Heading>
          {status && <FinanceStatusBadge status={status} descriptionId={statusDescriptionId} />}
        </div>
        {status?.description && (
          <p id={statusDescriptionId} className="text-body-sm break-words text-on-surface-muted">
            {status.description}
          </p>
        )}
        {description && (
          <p className="max-w-[62ch] text-body-sm break-words text-on-surface-muted">
            {description}
          </p>
        )}
      </div>
      {trailing && (
        <div className="flex max-w-full min-w-0 shrink-0 flex-col gap-2">{trailing}</div>
      )}
    </div>
  );
}
