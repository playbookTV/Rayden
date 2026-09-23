import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Badge } from "../components/Badge";
import { Icon, type IconName } from "../components/Icon";

/* ─── Heading contract ─────────────────────────────────────────────────── */

export type PricingPlansHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const HEADING_ORDER: PricingPlansHeadingLevel[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

function nextHeadingLevel(level: PricingPlansHeadingLevel): PricingPlansHeadingLevel {
  const index = HEADING_ORDER.indexOf(level);
  return HEADING_ORDER[Math.min(index + 1, HEADING_ORDER.length - 1)];
}

/* ─── Link / action contract ───────────────────────────────────────────── */

interface PricingCtaBase {
  label: string;
  icon?: IconName;
}

export interface PricingLinkCta extends PricingCtaBase {
  href: string;
  external?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface PricingActionCta extends PricingCtaBase {
  onClick: () => void;
  href?: never;
  external?: never;
}

export type PricingCta = PricingLinkCta | PricingActionCta;

function isLinkCta(cta: PricingCta): cta is PricingLinkCta {
  return typeof (cta as PricingLinkCta).href === "string";
}

/* ─── Content types ────────────────────────────────────────────────────── */

export interface PricingBillingPeriod {
  id: string;
  /** Visible label, e.g. "Monthly". Supplied in the caller's language. */
  label: string;
  /** Optional qualifier shown beside the label, e.g. "Save 20%". */
  badge?: string;
}

export interface PricingPrice {
  /** Amount in the currency's major unit. Formatted with `locale`. */
  amount?: number;
  /** ISO 4217 code, e.g. "USD". Required alongside `amount`. */
  currency?: string;
  /** Rendered after the amount, e.g. "per editor / month". */
  unit?: ReactNode;
  /** Replaces the amount entirely, e.g. "Custom pricing". Takes precedence. */
  custom?: ReactNode;
  /** Reference amount shown struck through, e.g. the undiscounted price. */
  originalAmount?: number;
  /** Small print under the price, e.g. "billed annually". */
  note?: ReactNode;
}

export interface PricingFeature {
  id: string;
  label: ReactNode;
  /**
   * Whether the plan includes this feature. Excluded features keep a visible
   * text status as well as an icon, so meaning never rests on colour alone.
   * @default true
   */
  included?: boolean;
  /** Short qualifier, e.g. "add-on". */
  note?: string;
}

export interface PricingLimit {
  id: string;
  /** e.g. "Included events". */
  label: ReactNode;
  /** e.g. "250,000 / month". Pre-formatted by the caller. */
  value: ReactNode;
}

export type PricingPlanAvailability = "available" | "current" | "unavailable";

export interface PricingPlan {
  id: string;
  name: ReactNode;
  description?: ReactNode;
  /** Qualifier such as "Most popular". Carries the meaning of `highlighted`. */
  badge?: string;
  /** Adds visual emphasis. Always pair with `badge` so it is not colour-only. */
  highlighted?: boolean;
  /** Price per billing period, keyed by `PricingBillingPeriod.id`. */
  prices: Record<string, PricingPrice>;
  /** Included usage and limits. */
  limits?: PricingLimit[];
  features?: PricingFeature[];
  /**
   * The plan's next step. Required for an `available` plan; omit it for a
   * `current` plan. Without it no control is rendered at all.
   */
  cta?: PricingCta;
  /** @default "available" */
  availability?: PricingPlanAvailability;
  /** Why the plan cannot be chosen. Announced through aria-describedby. */
  unavailableReason?: string;
  /** Replaces the default "Current plan" marker text. */
  currentLabel?: string;
}

export type PricingPlansState = "default" | "loading" | "empty" | "error";

export interface PricingPlansNotice {
  tone: "success" | "info" | "warning" | "error";
  title: ReactNode;
  description?: ReactNode;
}

export interface PricingPlansBlockProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** @default "h2" — plan names use the next level down. */
  headingLevel?: PricingPlansHeadingLevel;
  /** Billing periods. Omit or supply one to hide the switcher. */
  periods?: PricingBillingPeriod[];
  /** Controlled selected period id. Pair with `onPeriodChange`. */
  period?: string;
  /** Uncontrolled initial period id. Defaults to the first period. */
  defaultPeriod?: string;
  onPeriodChange?: (periodId: string) => void;
  /** Accessible name for the period switcher. @default "Billing period" */
  periodLegend?: string;
  plans: PricingPlan[];
  /** BCP 47 tag used for currency formatting. @default "en-US" */
  locale?: string;
  /** Merged into the Intl.NumberFormat options used for every price. */
  priceFormatOptions?: Intl.NumberFormatOptions;
  /** Full override of price rendering. */
  formatPrice?: (price: PricingPrice, context: { locale: string; periodId: string }) => ReactNode;
  /** Heading above each plan's limits list. @default "Included usage" */
  limitsLabel?: string;
  /** Collapse a plan's feature list beyond this count behind a disclosure. */
  featuresVisibleLimit?: number;
  /** Shown when a plan is unavailable and supplies no reason of its own. */
  defaultUnavailableReason?: string;
  /**
   * A consumer-confirmed outcome, e.g. "Your plan change is confirmed". The
   * block never manufactures one: selecting a plan only calls the callback.
   */
  notice?: PricingPlansNotice;
  /** Small print under the grid, e.g. tax treatment. */
  footnote?: ReactNode;
  /** @default "default" — resolves to `empty` for an empty `plans` array. */
  state?: PricingPlansState;
  loadingPlanCount?: number;
  loadingLabel?: string;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  errorTitle?: string;
  errorDescription?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/* ─── Formatting ───────────────────────────────────────────────────────── */

function formatCurrency(
  amount: number,
  currency: string | undefined,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  const whole = Number.isInteger(amount);
  const base: Intl.NumberFormatOptions = currency
    ? {
        style: "currency",
        currency,
        minimumFractionDigits: whole ? 0 : 2,
        maximumFractionDigits: whole ? 0 : 2,
      }
    : { maximumFractionDigits: whole ? 0 : 2 };
  try {
    return new Intl.NumberFormat(locale, { ...base, ...options }).format(amount);
  } catch {
    // An unknown locale or currency code must not break the page.
    return currency ? `${currency} ${amount}` : String(amount);
  }
}

/* ─── Appearance ───────────────────────────────────────────────────────── */

const PLAN_COLUMN_CLASS: Record<number, string> = {
  1: "@min-[600px]:grid-cols-1 @min-[1136px]:grid-cols-1",
  2: "@min-[600px]:grid-cols-2 @min-[1136px]:grid-cols-2",
  3: "@min-[600px]:grid-cols-2 @min-[1136px]:grid-cols-3",
  4: "@min-[600px]:grid-cols-2 @min-[1136px]:grid-cols-4",
};

const CTA_BASE =
  "inline-flex w-full max-w-full items-center justify-center gap-2 min-h-11 rounded-lg px-4 py-2.5 text-sm font-semibold leading-[1.45] text-center break-words no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

const CTA_TONE = {
  primary: "bg-action-primary text-white hover:bg-action-primary-hover cursor-pointer",
  secondary:
    "bg-transparent text-action-primary-text border-[1.5px] border-current hover:bg-primary-50 cursor-pointer",
} as const;

const NOTICE_TONE: Record<
  PricingPlansNotice["tone"],
  { border: string; icon: IconName; text: string }
> = {
  success: {
    border: "border-success-300",
    icon: "check-circle",
    text: "text-action-success",
  },
  info: { border: "border-secondary-300", icon: "info-circle", text: "text-action-info" },
  warning: { border: "border-warning-300", icon: "info-triangle", text: "text-action-warning" },
  error: { border: "border-error-300", icon: "info-triangle", text: "text-action-danger-text" },
};

interface PlanCtaProps {
  cta: PricingCta;
  tone: keyof typeof CTA_TONE;
  disabled?: boolean;
  describedBy?: string;
}

function PlanCta({ cta, tone, disabled = false, describedBy }: PlanCtaProps) {
  const content = (
    <>
      {cta.icon && <Icon name={cta.icon} size="sm" className="shrink-0" aria-hidden="true" />}
      <span className="min-w-0">{cta.label}</span>
    </>
  );

  // A control that cannot be used is rendered as an explicitly disabled button,
  // never as an active link that goes nowhere.
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        aria-describedby={describedBy}
        className={cn(
          CTA_BASE,
          "cursor-not-allowed border-[1.5px] border-surface-border-strong bg-grey-100 text-grey-600"
        )}
      >
        {content}
      </button>
    );
  }

  if (isLinkCta(cta)) {
    const externalAttributes: AnchorHTMLAttributes<HTMLAnchorElement> = cta.external
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    return (
      <a
        href={cta.href}
        onClick={cta.onClick}
        aria-describedby={describedBy}
        className={cn(CTA_BASE, CTA_TONE[tone])}
        {...externalAttributes}
      >
        {content}
        {cta.external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={cta.onClick}
      aria-describedby={describedBy}
      className={cn(CTA_BASE, CTA_TONE[tone])}
    >
      {content}
    </button>
  );
}

/* ─── Plan card ────────────────────────────────────────────────────────── */

interface PlanCardProps {
  plan: PricingPlan;
  periodId: string;
  locale: string;
  priceFormatOptions?: Intl.NumberFormatOptions;
  formatPrice?: PricingPlansBlockProps["formatPrice"];
  limitsLabel: string;
  featuresVisibleLimit?: number;
  defaultUnavailableReason: string;
  headingElement: PricingPlansHeadingLevel;
}

function PlanCard({
  plan,
  periodId,
  locale,
  priceFormatOptions,
  formatPrice,
  limitsLabel,
  featuresVisibleLimit,
  defaultUnavailableReason,
  headingElement,
}: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const reasonId = useId();
  const PlanHeading = headingElement;

  // Unavailability is conveyed by the disabled control and its associated reason,
  // never by dimming the card: reducing opacity drops every label below AA.
  const availability = plan.availability ?? "available";
  const unavailable = availability === "unavailable";
  const isCurrent = availability === "current";
  const price = plan.prices[periodId];
  const features = plan.features ?? [];

  const limit = featuresVisibleLimit && featuresVisibleLimit > 0 ? featuresVisibleLimit : undefined;
  const collapsible = limit !== undefined && features.length > limit;
  const visibleFeatures = collapsible && !expanded ? features.slice(0, limit) : features;

  const planNameText = typeof plan.name === "string" ? plan.name : undefined;
  const reason = unavailable ? (plan.unavailableReason ?? defaultUnavailableReason) : undefined;

  // The if/else chain below is exhaustive, so an initialiser here is dead.
  let priceBody: ReactNode;
  if (!price) {
    priceBody = <span className="text-base text-grey-600">Price unavailable</span>;
  } else if (formatPrice) {
    priceBody = formatPrice(price, { locale, periodId });
  } else if (price.custom !== undefined) {
    priceBody = (
      <span className="text-h5 font-semibold break-words text-grey-900 @min-[600px]:text-h4">
        {price.custom}
      </span>
    );
  } else if (price.amount !== undefined) {
    priceBody = (
      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
        {price.originalAmount !== undefined && (
          <span className="text-base text-grey-600 line-through tabular-nums">
            <span className="sr-only">Was </span>
            {formatCurrency(price.originalAmount, price.currency, locale, priceFormatOptions)}
          </span>
        )}
        <span className="text-h4 font-semibold break-words tabular-nums text-grey-900 @min-[600px]:text-h3">
          {formatCurrency(price.amount, price.currency, locale, priceFormatOptions)}
        </span>
        {price.unit && (
          <span className="min-w-0 text-sm break-words text-grey-600">{price.unit}</span>
        )}
      </span>
    );
  } else {
    priceBody = <span className="text-base text-grey-600">Price unavailable</span>;
  }

  return (
    <li
      className={cn(
        "flex min-w-0 flex-col gap-5 rounded-xl border bg-surface p-5 @min-[600px]:p-6",
        plan.highlighted
          ? "border-primary-400 shadow-soft-sm @min-[600px]:border-2"
          : "border-surface-border"
      )}
    >
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <PlanHeading className="min-w-0 text-body-lg font-semibold break-words text-grey-900">
            {plan.name}
          </PlanHeading>
          {plan.badge && (
            <Badge color="orange" type="accent" size="md">
              {plan.badge}
            </Badge>
          )}
          {isCurrent && (
            <Badge color="success" type="accent" size="md">
              {plan.currentLabel ?? "Current plan"}
            </Badge>
          )}
        </div>
        {plan.description && (
          <p className="text-sm break-words text-grey-600">{plan.description}</p>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        {priceBody}
        {price?.note && <p className="text-sm break-words text-grey-600">{price.note}</p>}
      </div>

      {/* Availability, then the control. A disabled control always carries a
          visible, programmatically associated reason. */}
      {reason && (
        <p id={reasonId} className="text-sm break-words text-grey-600">
          {reason}
        </p>
      )}

      {plan.cta ? (
        <PlanCta
          cta={plan.cta}
          tone={plan.highlighted ? "primary" : "secondary"}
          disabled={unavailable}
          describedBy={reason ? reasonId : undefined}
        />
      ) : (
        isCurrent && (
          <p className="rounded-lg border border-surface-border bg-surface-muted px-4 py-2.5 text-center text-sm font-semibold break-words text-grey-700">
            {plan.currentLabel ?? "Current plan"}
          </p>
        )
      )}

      {plan.limits && plan.limits.length > 0 && (
        <div className="flex min-w-0 flex-col gap-2 border-t border-surface-border pt-4">
          <p className="text-caption-sm font-semibold tracking-[0.08em] text-grey-600 uppercase">
            {limitsLabel}
          </p>
          <dl className="m-0 flex min-w-0 flex-col gap-1.5">
            {plan.limits.map((entry) => (
              <div
                key={entry.id}
                className="flex min-w-0 flex-wrap justify-between gap-x-3 gap-y-0.5"
              >
                <dt className="min-w-0 text-sm break-words text-grey-600">{entry.label}</dt>
                <dd className="m-0 min-w-0 text-sm font-semibold break-words tabular-nums text-grey-900">
                  {entry.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {features.length > 0 && (
        <div className="flex min-w-0 flex-col gap-3 border-t border-surface-border pt-4">
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {visibleFeatures.map((feature) => {
              const included = feature.included !== false;
              return (
                <li key={feature.id} className="flex min-w-0 items-start gap-2 text-sm">
                  <Icon
                    name={included ? "check-circle" : "minus-circle"}
                    size="sm"
                    className={cn(
                      "mt-0.5 shrink-0",
                      included ? "text-action-success" : "text-grey-400"
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "min-w-0 break-words",
                      included ? "text-grey-700" : "text-grey-600"
                    )}
                  >
                    <span className="sr-only">{included ? "Included: " : "Not included: "}</span>
                    {feature.label}
                    {feature.note && <span className="text-grey-600"> ({feature.note})</span>}
                  </span>
                </li>
              );
            })}
          </ul>
          {collapsible && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((open) => !open)}
              className="inline-flex max-w-full items-center gap-1.5 self-start rounded text-sm font-semibold break-words text-action-primary-text cursor-pointer hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
            >
              <span className="min-w-0">
                {expanded
                  ? `Show fewer features${planNameText ? ` in ${planNameText}` : ""}`
                  : `Show all ${features.length} features${planNameText ? ` in ${planNameText}` : ""}`}
              </span>
              <Icon
                name={expanded ? "chevron-up" : "chevron-down"}
                size="sm"
                className="shrink-0"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/* ─── Block ────────────────────────────────────────────────────────────── */

/**
 * Pricing Plans — compare plans, switch billing period, and understand included
 * usage and limits.
 *
 * States: `default`, `loading`, `empty`, `error`, plus per-plan `available`,
 * `current`, and `unavailable`. Choosing a plan calls `cta.onClick` or follows
 * `cta.href`; the block performs no purchase and never claims one succeeded.
 * Pass `notice` to show an outcome the consuming application has confirmed.
 */
export const PricingPlansBlock = forwardRef<HTMLElement, PricingPlansBlockProps>(
  (
    {
      eyebrow,
      title,
      description,
      headingLevel = "h2",
      periods,
      period: controlledPeriod,
      defaultPeriod,
      onPeriodChange,
      periodLegend = "Billing period",
      plans,
      locale = "en-US",
      priceFormatOptions,
      formatPrice,
      limitsLabel = "Included usage",
      featuresVisibleLimit,
      defaultUnavailableReason = "This plan is not available for your account.",
      notice,
      footnote,
      state,
      loadingPlanCount = 3,
      loadingLabel = "Loading pricing plans",
      emptyTitle = "No plans are available right now",
      emptyDescription,
      errorTitle = "We could not load pricing",
      errorDescription,
      onRetry,
      retryLabel = "Try again",
      className,
      ...rest
    },
    ref
  ) => {
    const headingId = useId();
    const radioName = useId();
    const Heading = headingLevel;
    const PlanHeading = nextHeadingLevel(headingLevel);

    const periodList = useMemo(() => periods ?? [], [periods]);
    const fallbackPeriodId = periodList[0]?.id ?? "default";
    const [internalPeriod, setInternalPeriod] = useState(defaultPeriod ?? fallbackPeriodId);
    const activePeriod = controlledPeriod ?? internalPeriod;

    const selectPeriod = useCallback(
      (id: string) => {
        if (controlledPeriod === undefined) setInternalPeriod(id);
        onPeriodChange?.(id);
      },
      [controlledPeriod, onPeriodChange]
    );

    const resolvedState: PricingPlansState = state ?? (plans.length === 0 ? "empty" : "default");
    const showSwitcher = resolvedState === "default" && periodList.length > 1;
    const columnClass = PLAN_COLUMN_CLASS[Math.min(Math.max(plans.length, 1), 4)];

    return (
      <section
        ref={ref}
        aria-labelledby={headingId}
        aria-busy={resolvedState === "loading" || undefined}
        className={cn("@container relative w-full", className)}
        {...rest}
      >
        <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-8 px-4 py-12 @min-[600px]:gap-10 @min-[600px]:px-8 @min-[600px]:py-16">
          {/* Section header */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex min-w-0 max-w-[68ch] flex-col gap-3">
              {eyebrow && (
                <p className="text-sm font-semibold break-words text-action-primary-text">
                  {eyebrow}
                </p>
              )}
              <Heading
                id={headingId}
                className="text-h5 font-semibold break-words text-balance text-grey-900 @min-[600px]:text-h3"
              >
                {title}
              </Heading>
              {description && (
                <p className="text-base break-words text-grey-600 @min-[600px]:text-body-lg">
                  {description}
                </p>
              )}
            </div>

            {showSwitcher && (
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="sr-only">{periodLegend}</legend>
                <div className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-surface-border bg-surface-muted p-1">
                  {periodList.map((entry) => {
                    const checked = entry.id === activePeriod;
                    return (
                      <label
                        key={entry.id}
                        className={cn(
                          "relative inline-flex max-w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold break-words transition-colors",
                          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-action-primary-text",
                          checked
                            ? "bg-surface text-grey-900 shadow-soft-xxs"
                            : "text-grey-600 hover:text-grey-900"
                        )}
                      >
                        <input
                          type="radio"
                          name={radioName}
                          value={entry.id}
                          checked={checked}
                          onChange={() => selectPeriod(entry.id)}
                          className="sr-only"
                        />
                        <span className="min-w-0">{entry.label}</span>
                        {entry.badge && (
                          <Badge color="success" type="accent" size="sm">
                            {entry.badge}
                          </Badge>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>

          {notice && (
            <div
              role="status"
              className={cn(
                "flex min-w-0 items-start gap-3 rounded-xl border bg-surface p-4",
                NOTICE_TONE[notice.tone].border
              )}
            >
              <Icon
                name={NOTICE_TONE[notice.tone].icon}
                size="md"
                className={cn("mt-0.5 shrink-0", NOTICE_TONE[notice.tone].text)}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-sm font-semibold break-words text-grey-900">{notice.title}</p>
                {notice.description && (
                  <p className="text-sm break-words text-grey-600">{notice.description}</p>
                )}
              </div>
            </div>
          )}

          {resolvedState === "loading" && (
            <>
              <p role="status" className="sr-only">
                {loadingLabel}
              </p>
              <div
                className={cn("grid grid-cols-1 gap-5 @min-[600px]:gap-6", PLAN_COLUMN_CLASS[3])}
                aria-hidden="true"
              >
                {Array.from({ length: Math.max(1, loadingPlanCount) }).map((_, index) => (
                  <div
                    key={`plan-skeleton-${index}`}
                    className="flex min-w-0 flex-col gap-4 rounded-xl border border-surface-border bg-surface p-6"
                  >
                    <div className="h-5 w-28 rounded bg-grey-200" />
                    <div className="h-9 w-40 max-w-full rounded bg-grey-200" />
                    <div className="h-11 w-full rounded-lg bg-grey-100" />
                    <div className="h-4 w-full rounded bg-grey-100" />
                    <div className="h-4 w-5/6 rounded bg-grey-100" />
                    <div className="h-4 w-4/6 rounded bg-grey-100" />
                  </div>
                ))}
              </div>
            </>
          )}

          {resolvedState === "error" && (
            <div
              role="alert"
              className="flex min-w-0 flex-col items-start gap-3 rounded-xl border border-surface-border bg-surface p-5 @min-[600px]:p-6"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-action-danger-text">
                <Icon name="info-triangle" size="lg" aria-hidden="true" />
              </span>
              <p className="text-base font-semibold break-words text-grey-900">{errorTitle}</p>
              {errorDescription && (
                <p className="max-w-[60ch] text-sm break-words text-grey-600">{errorDescription}</p>
              )}
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={cn(CTA_BASE, CTA_TONE.secondary, "w-auto")}
                >
                  <Icon name="refresh" size="sm" className="shrink-0" aria-hidden="true" />
                  <span className="min-w-0">{retryLabel}</span>
                </button>
              )}
            </div>
          )}

          {resolvedState === "empty" && (
            <div className="flex min-w-0 flex-col items-start gap-3 rounded-xl border border-dashed border-surface-border-strong bg-surface p-6 @min-[600px]:p-8">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-grey-100 text-grey-600">
                <Icon name="receipt" size="lg" aria-hidden="true" />
              </span>
              <p className="text-base font-semibold break-words text-grey-900">{emptyTitle}</p>
              {emptyDescription && (
                <p className="max-w-[60ch] text-sm break-words text-grey-600">{emptyDescription}</p>
              )}
            </div>
          )}

          {resolvedState === "default" && plans.length > 0 && (
            <ul
              className={cn(
                "grid list-none grid-cols-1 items-start gap-5 p-0 @min-[600px]:gap-6",
                columnClass
              )}
            >
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  periodId={activePeriod}
                  locale={locale}
                  priceFormatOptions={priceFormatOptions}
                  formatPrice={formatPrice}
                  limitsLabel={limitsLabel}
                  featuresVisibleLimit={featuresVisibleLimit}
                  defaultUnavailableReason={defaultUnavailableReason}
                  headingElement={PlanHeading}
                />
              ))}
            </ul>
          )}

          {footnote && <p className="text-sm break-words text-grey-600">{footnote}</p>}
        </div>
      </section>
    );
  }
);

PricingPlansBlock.displayName = "PricingPlansBlock";
