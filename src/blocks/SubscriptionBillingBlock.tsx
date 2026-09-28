import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Button } from "../components/Button";
import { Icon, type IconName } from "../components/Icon";
import { ProgressBar } from "../components/ProgressBar";
import { Spinner } from "../components/Spinner";
import {
  FINANCE_FOCUS_RING,
  FinanceActionRow,
  FinanceDate,
  FinanceEmptyPanel,
  FinanceErrorPanel,
  FinanceHeader,
  FinanceLoadingNotice,
  FinanceShell,
  FinanceSkeleton,
  formatFinanceDate,
  formatFinanceMoney,
  nextFinanceHeadingLevel,
  type FinanceAction,
  type FinanceDateValue,
  type FinanceHeadingLevel,
  type FinanceMoneyValue,
  type FinanceStatus,
} from "./finance";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type SubscriptionBillingState = "default" | "loading" | "empty" | "error";

/**
 * `pending` means the caller's provider call is in flight. It is not a
 * cancelled subscription: the plan and its status only change when the caller
 * changes them.
 */
export type SubscriptionCancellationState = "idle" | "pending" | "error";

export interface SubscriptionPlan {
  name: ReactNode;
  description?: ReactNode;
  /** Minor-unit integer, or `null` when unknown. `undefined` omits the price. */
  amount?: FinanceMoneyValue;
  /** How often {@link amount} recurs, e.g. "per month". Words, not a duration. */
  interval?: ReactNode;
  /** Seat or licence summary, already pluralised by the caller. */
  seats?: ReactNode;
  badge?: string;
}

export interface SubscriptionUsageMetric {
  id: string;
  label: string;
  /** Consumed so far. `null` when unknown — never shown as zero. */
  used: number | null;
  /** Entitlement. `null` when unknown; `undefined` means unmetered. */
  limit?: number | null;
  /** Unit shown after the figures, e.g. "GB", "seats". */
  unit?: string;
  /** Replaces the default number formatting for this metric. */
  formatValue?: (value: number) => string;
  /** One short line under the bar. */
  note?: ReactNode;
  /** @default "Unlimited" — shown when `limit` is `undefined`. */
  unlimitedLabel?: string;
}

/** An alternative plan the reader can move to. Each carries its own control. */
export interface SubscriptionPlanOption {
  id: string;
  name: string;
  description?: ReactNode;
  /** Minor-unit integer, or `null` when unknown. */
  amount?: FinanceMoneyValue;
  interval?: ReactNode;
  /** Short list of what changes on this plan. */
  highlights?: string[];
  /** Marked as the suggested option. Visual only; the words carry the meaning. */
  recommended?: boolean;
  /** The control is omitted entirely without a handler or a reason. */
  onSelect?: () => void;
  /** @default "Choose plan" */
  selectLabel?: string;
  /** Renders the control disabled with the reason visible. */
  unavailableReason?: string;
}

export interface SubscriptionCancellationReason {
  id: string;
  label: string;
}

export interface SubscriptionBillingBlockProps {
  /** @default "Subscription" */
  title?: ReactNode;
  /** @default "h2" */
  headingLevel?: FinanceHeadingLevel;
  description?: ReactNode;
  eyebrow?: ReactNode;
  /** e.g. "Active", "Trialling", "Past due", "Cancels 1 November". */
  status?: FinanceStatus;

  /** ISO 4217 code shared by every amount in this block. @default "GBP" */
  currency?: string;
  /** Explicit locale keeps server and client formatting identical. @default "en-GB" */
  locale?: string;
  /** Words shown wherever an amount or date is `null`. @default "Not available" */
  unknownLabel?: string;
  /** IANA zone for the renewal date. */
  timeZone?: string;
  formatRenewal?: (value: Date) => string;

  plan: SubscriptionPlan;
  /** @default "Current plan" */
  planLabel?: string;

  /** Next renewal or next charge. `null` renders as unknown. */
  renewsOn?: FinanceDateValue;
  /** @default "Renews" */
  renewsOnLabel?: string;
  /** One line under the date, e.g. what happens on that date. */
  renewalNote?: ReactNode;
  /** Amount of the next charge. Supplied, never derived from the plan price. */
  nextChargeAmount?: FinanceMoneyValue;
  /** @default "Next charge" */
  nextChargeLabel?: string;
  /** Display-only summary, e.g. "Visa ending 4242". Never full credentials. */
  paymentMethodSummary?: ReactNode;
  /** @default "Payment method" */
  paymentMethodLabel?: string;
  /** The payment-method control is omitted entirely without a handler. */
  onManagePaymentMethod?: () => void;
  /** @default "Update payment method" */
  managePaymentMethodLabel?: string;

  usage?: SubscriptionUsageMetric[];
  /** @default "Usage this period" */
  usageLabel?: string;
  /** Period the usage covers, e.g. "1–30 September". */
  usagePeriod?: ReactNode;
  /** Wording when there is nothing metered yet. */
  usageEmptyTitle?: string;
  usageEmptyDescription?: ReactNode;

  upgradeOptions?: SubscriptionPlanOption[];
  /** @default "Change plan" */
  upgradeLabel?: string;
  /** One line above the options. */
  upgradeDescription?: ReactNode;

  /** Supporting actions, e.g. billing history, invoices, tax details. */
  actions?: FinanceAction[];
  /** @default "Subscription actions" */
  actionsLabel?: string;

  /* ── Cancellation ─────────────────────────────────────────────────────
     Two steps, and no fabricated outcome. Opening the panel calls
     `onCancelRequest`; confirming calls `onCancelConfirm`. Neither changes the
     plan, the status or anything else the reader sees as settled — only the
     caller can do that, by changing `status` once its provider has acted.
     ------------------------------------------------------------------- */
  /** The cancellation affordance is omitted entirely without this handler. */
  onCancelConfirm?: (reasonId?: string) => void;
  /** Called when the panel opens. Useful for analytics or a fetch. */
  onCancelRequest?: () => void;
  /** Called when the reader backs out. */
  onCancelDismiss?: () => void;
  /** @default "Cancel subscription" */
  cancelLabel?: string;
  /** @default "Yes, cancel subscription" */
  cancelConfirmLabel?: string;
  /** @default "Keep subscription" */
  cancelDismissLabel?: string;
  /** @default "Cancel this subscription?" */
  cancelHeading?: string;
  /** What actually happens on cancellation. Supplied — never assumed. */
  cancelExplanation?: ReactNode;
  cancelReasons?: SubscriptionCancellationReason[];
  /** @default "Reason for cancelling" */
  cancelReasonLabel?: string;
  /** Requires a reason before confirmation is possible. @default false */
  requireCancelReason?: boolean;
  /** @default "idle" */
  cancellationState?: SubscriptionCancellationState;
  /** @default "Cancelling your subscription" */
  cancellationPendingMessage?: string;
  /** @default "This subscription could not be cancelled" */
  cancellationErrorTitle?: string;
  cancellationErrorDescription?: ReactNode;
  /**
   * The cancellation outcome, supplied by the caller once its provider has
   * reported one. The block never sets this itself.
   */
  cancellationResult?: { title: string; description?: ReactNode; reference?: string };

  /** Hides every management control and states why. */
  readOnly?: boolean;
  /** Shown in place of the management controls when {@link readOnly}. */
  readOnlyReason?: ReactNode;

  /** @default "default" */
  state?: SubscriptionBillingState;
  /** @default "Loading subscription" */
  loadingMessage?: string;
  /** @default "This subscription could not be loaded" */
  errorTitle?: string;
  errorDescription?: ReactNode;
  /** The retry control is omitted entirely without this handler. */
  onRetry?: () => void;
  /** @default "No active subscription" */
  emptyTitle?: string;
  emptyDescription?: ReactNode;
  emptyAction?: FinanceAction;

  /** Lands on the container root, outside the card padding. */
  className?: string;
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function SubscriptionBillingBlock({
  title = "Subscription",
  headingLevel = "h2",
  description,
  eyebrow,
  status,
  currency = "GBP",
  locale = "en-GB",
  unknownLabel = "Not available",
  timeZone,
  formatRenewal,
  plan,
  planLabel = "Current plan",
  renewsOn,
  renewsOnLabel = "Renews",
  renewalNote,
  nextChargeAmount,
  nextChargeLabel = "Next charge",
  paymentMethodSummary,
  paymentMethodLabel = "Payment method",
  onManagePaymentMethod,
  managePaymentMethodLabel = "Update payment method",
  usage = [],
  usageLabel = "Usage this period",
  usagePeriod,
  usageEmptyTitle = "Nothing metered yet",
  usageEmptyDescription,
  upgradeOptions = [],
  upgradeLabel = "Change plan",
  upgradeDescription,
  actions = [],
  actionsLabel = "Subscription actions",
  onCancelConfirm,
  onCancelRequest,
  onCancelDismiss,
  cancelLabel = "Cancel subscription",
  cancelConfirmLabel = "Yes, cancel subscription",
  cancelDismissLabel = "Keep subscription",
  cancelHeading = "Cancel this subscription?",
  cancelExplanation,
  cancelReasons = [],
  cancelReasonLabel = "Reason for cancelling",
  requireCancelReason = false,
  cancellationState = "idle",
  cancellationPendingMessage = "Cancelling your subscription",
  cancellationErrorTitle = "This subscription could not be cancelled",
  cancellationErrorDescription,
  cancellationResult,
  readOnly = false,
  readOnlyReason,
  state = "default",
  loadingMessage = "Loading subscription",
  errorTitle = "This subscription could not be loaded",
  errorDescription,
  onRetry,
  emptyTitle = "No active subscription",
  emptyDescription,
  emptyAction,
  className,
}: SubscriptionBillingBlockProps) {
  const uid = useId();
  const headingId = `${uid}-title`;
  const statusDescriptionId = `${uid}-status`;
  const usageHeadingId = `${uid}-usage`;
  const optionsHeadingId = `${uid}-options`;
  const cancelPanelId = `${uid}-cancel-panel`;
  const cancelHeadingId = `${uid}-cancel-heading`;
  const cancelReasonId = `${uid}-cancel-reason`;
  const SubHeading = nextFinanceHeadingLevel(headingLevel);

  const [cancelOpen, setCancelOpen] = useState(cancellationState === "error");
  const [reason, setReason] = useState("");
  const cancelToggleRef = useRef<HTMLButtonElement>(null);

  /** One activation per provider signal, so a cancellation cannot be sent twice. */
  const [latched, setLatched] = useState(false);
  const lastSignal = useRef<string>(
    `${cancellationState}|${cancellationResult ? "result" : "none"}`
  );
  useEffect(() => {
    const signal = `${cancellationState}|${cancellationResult ? "result" : "none"}`;
    if (signal !== lastSignal.current) {
      lastSignal.current = signal;
      setLatched(false);
      if (cancellationState === "error") setCancelOpen(true);
    }
  }, [cancellationState, cancellationResult]);

  const money = (value: FinanceMoneyValue) =>
    formatFinanceMoney(value, { currency, locale, unknownLabel });
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });

  const renewal = formatFinanceDate(renewsOn, {
    locale,
    timeZone,
    dateStyle: "long",
    unknownLabel,
    format: formatRenewal,
  });

  const canManage = !readOnly && state === "default";
  const cancellationBusy = cancellationState === "pending";
  // Provider feedback must remain visible even when pending/error arrives
  // before the reader opens the disclosure (for example, after a reload).
  const cancellationPanelOpen = cancelOpen || cancellationBusy;
  const confirmBlocked =
    cancellationBusy || latched || Boolean(cancellationResult) || (requireCancelReason && !reason);

  function openCancel() {
    setCancelOpen(true);
    onCancelRequest?.();
  }

  function dismissCancel() {
    if (cancellationBusy) return;
    setCancelOpen(false);
    setReason("");
    onCancelDismiss?.();
    // Focus returns to the control that opened the panel.
    cancelToggleRef.current?.focus();
  }

  function confirmCancel() {
    if (confirmBlocked) return;
    setLatched(true);
    onCancelConfirm?.(reason || undefined);
  }

  const header = (
    <FinanceHeader
      id={headingId}
      level={headingLevel}
      title={title}
      description={description}
      eyebrow={eyebrow}
      status={status}
      statusDescriptionId={statusDescriptionId}
    />
  );

  if (state === "loading") {
    return (
      <FinanceShell labelledBy={headingId} busy className={className}>
        {header}
        <FinanceSkeleton rows={4} />
        <FinanceLoadingNotice message={loadingMessage} />
      </FinanceShell>
    );
  }

  if (state === "error") {
    return (
      <FinanceShell labelledBy={headingId} className={className}>
        {header}
        <FinanceErrorPanel title={errorTitle} description={errorDescription} onRetry={onRetry} />
      </FinanceShell>
    );
  }

  if (state === "empty") {
    return (
      <FinanceShell labelledBy={headingId} className={className}>
        {header}
        <FinanceEmptyPanel
          title={emptyTitle}
          description={emptyDescription}
          icon="card"
          action={emptyAction}
        />
      </FinanceShell>
    );
  }

  const planPrice = money(plan.amount);

  const facts: Array<{
    id: string;
    label: string;
    node: ReactNode;
    icon?: IconName;
    unknown?: boolean;
  }> = [];
  if (renewal) {
    facts.push({
      id: "renews",
      label: renewsOnLabel,
      node: <FinanceDate value={renewal} />,
      icon: "calendar-tick",
      unknown: renewsOn === null,
    });
  }
  const nextCharge = money(nextChargeAmount);
  if (nextCharge !== undefined) {
    facts.push({
      id: "charge",
      label: nextChargeLabel,
      node: nextCharge,
      icon: "card",
      unknown: nextChargeAmount === null,
    });
  }
  if (paymentMethodSummary) {
    facts.push({
      id: "method",
      label: paymentMethodLabel,
      node: paymentMethodSummary,
      icon: "wallet",
    });
  }

  return (
    <FinanceShell labelledBy={headingId} busy={cancellationBusy} className={className}>
      {header}

      {/* The cancellation outcome, only ever the caller's. */}
      {cancellationResult && (
        <div
          role="status"
          className="flex min-w-0 flex-col gap-1 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3"
        >
          <p className="flex min-w-0 items-center gap-2 text-body-sm font-semibold break-words text-warning-700">
            <Icon name="info-circle" size="sm" className="shrink-0" />
            {cancellationResult.title}
          </p>
          {cancellationResult.description && (
            <p className="text-body-sm break-words text-warning-700">
              {cancellationResult.description}
            </p>
          )}
          {cancellationResult.reference && (
            <p className="text-body-xs break-words tabular-nums text-warning-700">
              {cancellationResult.reference}
            </p>
          )}
        </div>
      )}

      {/* Current plan */}
      <div className="flex min-w-0 flex-col gap-2 rounded-lg bg-surface-muted px-4 py-4">
        <p className="font-medium break-words uppercase text-caption-sm text-on-surface-muted">
          {planLabel}
        </p>
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="min-w-0 text-h6 font-semibold break-words text-on-surface">{plan.name}</p>
          {plan.badge && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary-50 px-2.5 py-1 text-body-xs font-semibold text-action-primary-text">
              {plan.badge}
            </span>
          )}
        </div>
        {planPrice !== undefined && (
          <p className="flex min-w-0 flex-wrap items-baseline gap-1.5">
            <span
              className={cn(
                "min-w-0 text-h6 font-semibold break-words tabular-nums",
                plan.amount === null ? "text-on-surface-muted" : "text-on-surface"
              )}
            >
              {planPrice}
            </span>
            {plan.interval && (
              <span className="min-w-0 text-body-sm break-words text-on-surface-secondary">
                {plan.interval}
              </span>
            )}
          </p>
        )}
        {plan.seats && (
          <p className="min-w-0 text-body-sm break-words text-on-surface-secondary">{plan.seats}</p>
        )}
        {plan.description && (
          <p className="max-w-[62ch] min-w-0 text-body-sm break-words text-on-surface-muted">
            {plan.description}
          </p>
        )}
      </div>

      {facts.length > 0 && (
        <dl className="grid min-w-0 gap-4 @min-[420px]:grid-cols-2 @min-[720px]:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.id} className="flex min-w-0 flex-col gap-0.5">
              <dt className="flex min-w-0 items-center gap-1.5 text-body-xs font-medium break-words text-on-surface-muted">
                {fact.icon && <Icon name={fact.icon} size="sm" className="shrink-0" />}
                <span className="min-w-0 break-words">{fact.label}</span>
              </dt>
              <dd
                className={cn(
                  "min-w-0 text-body-sm font-semibold break-words tabular-nums",
                  fact.unknown ? "text-on-surface-muted" : "text-on-surface"
                )}
              >
                {fact.node}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {renewalNote && (
        <p className="max-w-[62ch] text-body-xs break-words text-on-surface-muted">{renewalNote}</p>
      )}

      {canManage && onManagePaymentMethod && (
        <button
          type="button"
          onClick={onManagePaymentMethod}
          className={cn(
            "inline-flex min-h-11 w-fit max-w-full min-w-0 cursor-pointer items-center gap-1.5 rounded px-0.5 font-semibold underline-offset-4 hover:underline",
            FINANCE_FOCUS_RING,
            "text-body-sm text-action-primary-text"
          )}
        >
          <Icon name="card" size="sm" className="shrink-0" />
          <span className="min-w-0 break-words">{managePaymentMethodLabel}</span>
        </button>
      )}

      {/* Usage */}
      <div className="flex min-w-0 flex-col gap-3 border-t border-surface-border pt-4">
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
          <SubHeading
            id={usageHeadingId}
            className="min-w-0 text-body-md font-semibold break-words text-on-surface"
          >
            {usageLabel}
          </SubHeading>
          {usagePeriod && (
            <p className="text-body-xs break-words text-on-surface-muted">{usagePeriod}</p>
          )}
        </div>

        {usage.length === 0 ? (
          <FinanceEmptyPanel
            title={usageEmptyTitle}
            description={usageEmptyDescription}
            icon="chart"
          />
        ) : (
          <ul aria-labelledby={usageHeadingId} className="flex min-w-0 list-none flex-col gap-4">
            {usage.map((metric) => {
              const format = metric.formatValue ?? ((value: number) => numberFormat.format(value));
              const unit = metric.unit ? ` ${metric.unit}` : "";
              const usedText =
                metric.used === null ? unknownLabel : `${format(metric.used)}${unit}`;
              const limitText =
                metric.limit === undefined
                  ? (metric.unlimitedLabel ?? "Unlimited")
                  : metric.limit === null
                    ? unknownLabel
                    : `${format(metric.limit)}${unit}`;
              // A bar is drawn only when both figures are real. An unknown
              // figure is never rendered as an empty bar, which would read as
              // zero use.
              const measurable =
                metric.used !== null &&
                metric.limit !== null &&
                metric.limit !== undefined &&
                metric.limit > 0;
              const percentage = measurable
                ? Math.min(
                    100,
                    Math.round(((metric.used as number) / (metric.limit as number)) * 100)
                  )
                : undefined;
              return (
                <li key={metric.id} className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                    <p className="min-w-0 text-body-sm font-medium break-words text-on-surface-body">
                      {metric.label}
                    </p>
                    <p
                      className={cn(
                        "min-w-0 text-right text-body-sm break-words tabular-nums",
                        metric.used === null || metric.limit === null
                          ? "text-on-surface-muted"
                          : "text-on-surface-secondary"
                      )}
                    >
                      {usedText} of {limitText}
                    </p>
                  </div>
                  {measurable && percentage !== undefined ? (
                    <ProgressBar
                      value={percentage}
                      size="sm"
                      showPercentage={false}
                      aria-label={`${metric.label}: ${usedText} of ${limitText}`}
                    />
                  ) : (
                    <p className="text-body-xs break-words text-on-surface-muted">
                      {metric.limit === undefined
                        ? "No limit applies, so there is no proportion to show."
                        : metric.limit === 0 && metric.used !== null
                          ? "This plan has no allowance for this usage."
                          : "A figure is missing, so no proportion is shown."}
                    </p>
                  )}
                  {metric.note && (
                    <p className="text-body-xs break-words text-on-surface-muted">{metric.note}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Plan options */}
      {canManage && upgradeOptions.length > 0 && (
        <div className="flex min-w-0 flex-col gap-3 border-t border-surface-border pt-4">
          <SubHeading
            id={optionsHeadingId}
            className="min-w-0 text-body-md font-semibold break-words text-on-surface"
          >
            {upgradeLabel}
          </SubHeading>
          {upgradeDescription && (
            <p className="max-w-[62ch] text-body-sm break-words text-on-surface-muted">
              {upgradeDescription}
            </p>
          )}
          <ul
            aria-labelledby={optionsHeadingId}
            className="grid min-w-0 list-none gap-3 @min-[620px]:grid-cols-2"
          >
            {upgradeOptions.map((option) => {
              const price = money(option.amount);
              return (
                <li
                  key={option.id}
                  className="flex min-w-0 flex-col gap-2 rounded-lg border border-surface-border-strong bg-surface p-4"
                >
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                    <p className="min-w-0 text-body-md font-semibold break-words text-on-surface">
                      {option.name}
                    </p>
                    {option.recommended && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-primary-50 px-2 py-0.5 text-body-xs font-semibold text-action-primary-text">
                        Recommended
                      </span>
                    )}
                  </div>
                  {price !== undefined && (
                    <p className="flex min-w-0 flex-wrap items-baseline gap-1.5">
                      <span
                        className={cn(
                          "min-w-0 text-body-lg font-semibold break-words tabular-nums",
                          option.amount === null ? "text-on-surface-muted" : "text-on-surface"
                        )}
                      >
                        {price}
                      </span>
                      {option.interval && (
                        <span className="min-w-0 text-body-xs break-words text-on-surface-secondary">
                          {option.interval}
                        </span>
                      )}
                    </p>
                  )}
                  {option.description && (
                    <p className="min-w-0 text-body-sm break-words text-on-surface-muted">
                      {option.description}
                    </p>
                  )}
                  {option.highlights && option.highlights.length > 0 && (
                    <ul className="flex min-w-0 list-none flex-col gap-1">
                      {option.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex min-w-0 items-start gap-1.5 text-body-xs break-words text-on-surface-secondary"
                        >
                          <Icon
                            name="check"
                            size="sm"
                            className="mt-0.5 shrink-0 text-success-600"
                          />
                          <span className="min-w-0 break-words">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex min-w-0 flex-col gap-1 pt-1">
                    {option.unavailableReason ? (
                      <>
                        <Button
                          variant="grey"
                          appearance="outlined"
                          disabled
                          aria-describedby={`${uid}-${option.id}-reason`}
                          className="min-h-11 w-full min-w-0"
                        >
                          <span className="min-w-0 break-words">
                            {option.selectLabel ?? "Choose plan"}
                          </span>
                        </Button>
                        <span
                          id={`${uid}-${option.id}-reason`}
                          className="text-body-xs break-words text-on-surface-muted"
                        >
                          {option.unavailableReason}
                        </span>
                      </>
                    ) : option.onSelect ? (
                      <Button
                        variant={option.recommended ? "primary" : "grey"}
                        appearance={option.recommended ? "solid" : "outlined"}
                        onClick={option.onSelect}
                        className="min-h-11 w-full min-w-0"
                      >
                        <span className="min-w-0 break-words">
                          {option.selectLabel ?? "Choose plan"}
                        </span>
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {actions.length > 0 && (
        <div className="border-t border-surface-border pt-4">
          <FinanceActionRow actions={actions} label={actionsLabel} />
        </div>
      )}

      {/* Read-only */}
      {readOnly && readOnlyReason && (
        <p className="flex min-w-0 items-start gap-2 rounded-lg border border-surface-border bg-surface-muted px-3 py-2 text-body-sm break-words text-on-surface-secondary">
          <Icon name="lock" size="sm" className="mt-0.5 shrink-0" />
          <span className="min-w-0 break-words">{readOnlyReason}</span>
        </p>
      )}

      {/* Cancellation. Two steps; the panel stays mounted so `aria-controls`
          always resolves to a real element (audit B01). */}
      {canManage && onCancelConfirm && !cancellationResult && (
        <div className="flex min-w-0 flex-col gap-3 border-t border-surface-border pt-4">
          <button
            ref={cancelToggleRef}
            type="button"
            aria-expanded={cancellationPanelOpen}
            aria-controls={cancelPanelId}
            disabled={cancellationBusy}
            onClick={() => (cancellationPanelOpen ? dismissCancel() : openCancel())}
            className={cn(
              "inline-flex min-h-11 w-fit max-w-full min-w-0 cursor-pointer items-center gap-1.5 rounded px-0.5 font-semibold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50",
              FINANCE_FOCUS_RING,
              "text-body-sm text-action-danger-text"
            )}
          >
            <Icon name="minus-circle" size="sm" className="shrink-0" />
            <span className="min-w-0 break-words">{cancelLabel}</span>
          </button>

          <div
            id={cancelPanelId}
            aria-labelledby={cancelHeadingId}
            role="group"
            className={cn(
              "flex min-w-0 flex-col gap-3 rounded-lg border border-error-200 bg-error-50 px-4 py-4",
              !cancellationPanelOpen && "hidden"
            )}
          >
            <p
              id={cancelHeadingId}
              className="text-body-sm font-semibold break-words text-error-700"
            >
              {cancelHeading}
            </p>
            {cancelExplanation && (
              <div className="max-w-[62ch] text-body-sm break-words text-error-700">
                {cancelExplanation}
              </div>
            )}

            {cancelReasons.length > 0 && (
              <div className="flex min-w-0 flex-col gap-1.5">
                <label
                  htmlFor={cancelReasonId}
                  className="text-body-sm font-medium break-words text-error-700"
                >
                  {cancelReasonLabel}
                  {requireCancelReason && <span aria-hidden="true"> *</span>}
                </label>
                <select
                  id={cancelReasonId}
                  value={reason}
                  required={requireCancelReason}
                  disabled={cancellationBusy}
                  onChange={(event) => setReason(event.currentTarget.value)}
                  className={cn(
                    "min-h-11 w-full min-w-0 max-w-[32rem] cursor-pointer rounded-lg border border-control-border bg-surface px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50",
                    FINANCE_FOCUS_RING,
                    "text-body-sm text-on-surface"
                  )}
                >
                  <option value="">
                    {requireCancelReason ? "Choose a reason" : "Prefer not to say"}
                  </option>
                  {cancelReasons.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {cancellationState === "error" && (
              <FinanceErrorPanel
                title={cancellationErrorTitle}
                description={cancellationErrorDescription}
              />
            )}

            <div className="flex min-w-0 flex-col-reverse gap-2 @min-[480px]:flex-row @min-[480px]:items-center">
              <Button
                variant="grey"
                appearance="outlined"
                onClick={dismissCancel}
                disabled={cancellationBusy}
                className="min-h-11 w-full min-w-0 @min-[480px]:w-auto"
              >
                <span className="min-w-0 break-words">{cancelDismissLabel}</span>
              </Button>
              <Button
                variant="destructive"
                onClick={confirmCancel}
                disabled={confirmBlocked}
                className="min-h-11 w-full min-w-0 @min-[480px]:w-auto"
              >
                <span className="flex min-w-0 items-center gap-2 break-words">
                  {cancellationBusy && (
                    <span aria-hidden="true" className="flex shrink-0 items-center">
                      <Spinner size="sm" />
                    </span>
                  )}
                  <span className="min-w-0 break-words">{cancelConfirmLabel}</span>
                </span>
              </Button>
            </div>

            {cancellationBusy && (
              <p
                role="status"
                className="flex min-w-0 items-center gap-2 text-body-sm break-words text-error-700"
              >
                <span aria-hidden="true" className="flex shrink-0 items-center">
                  <Spinner size="sm" />
                </span>
                <span className="min-w-0 break-words">{cancellationPendingMessage}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </FinanceShell>
  );
}
