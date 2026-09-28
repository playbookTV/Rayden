import { useId, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Icon, type IconName } from "../components/Icon";
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
  type FinanceAction,
  type FinanceDateValue,
  type FinanceHeadingLevel,
  type FinanceMoneyValue,
  type FinanceStatus,
} from "./finance";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type AccountBalanceState = "default" | "loading" | "empty" | "error";

/** An extra balance line beyond available / pending / total. */
export interface AccountBalanceEntry {
  id: string;
  label: string;
  /**
   * Minor-unit integer, or `null` when the figure is genuinely unknown.
   * `0` is a real balance and is never used to stand in for "unknown".
   */
  amount: FinanceMoneyValue;
  /** One short line under the figure, e.g. "Held until 26 September". */
  hint?: ReactNode;
  icon?: IconName;
}

export interface AccountBalanceBlockProps {
  /** @default "Account balance" */
  title?: ReactNode;
  /** @default "h2" */
  headingLevel?: FinanceHeadingLevel;
  description?: ReactNode;
  /** Small label above the title, e.g. the product name. Not a heading. */
  eyebrow?: ReactNode;
  /** Account identity shown beside the figures. Display only. */
  account?: {
    name: ReactNode;
    /** Already masked by the caller, e.g. "•••• 4417". Never a full number. */
    reference?: ReactNode;
    icon?: IconName;
  };
  status?: FinanceStatus;

  /** ISO 4217 code shared by every figure in this block. @default "GBP" */
  currency?: string;
  /** Explicit locale keeps server and client formatting identical. @default "en-GB" */
  locale?: string;
  /** Words shown wherever an amount is `null`. @default "Not available" */
  unknownLabel?: string;

  /**
   * Spendable balance. `null` renders {@link unknownLabel}; `undefined` omits
   * the figure entirely.
   */
  available?: FinanceMoneyValue;
  /** Cleared soon, not yet spendable. */
  pending?: FinanceMoneyValue;
  /**
   * Total held. Supplied, never derived: available + pending is wrong whenever
   * a hold, an overdraft or a reserve is involved, and the block does not know.
   */
  total?: FinanceMoneyValue;
  /** Further lines, e.g. reserved, overdraft, incoming. */
  extraBalances?: AccountBalanceEntry[];
  /** Which figure is the headline. @default "available" */
  primary?: "available" | "pending" | "total";

  availableLabel?: string;
  pendingLabel?: string;
  totalLabel?: string;

  /** When the figures were last known to be correct. `null` renders as unknown. */
  asOf?: FinanceDateValue;
  /** @default "Updated" */
  asOfLabel?: string;
  /** IANA zone for {@link asOf}, e.g. `"Europe/Amsterdam"`. */
  timeZone?: string;
  /** Takes precedence over the locale/zone formatting for {@link asOf}. */
  formatAsOf?: (value: Date) => string;
  /** One line under the timestamp, e.g. "Balances refresh every 15 minutes." */
  asOfNote?: ReactNode;

  /** The refresh control is omitted entirely without this handler. */
  onRefresh?: () => void;
  /** @default "Refresh balances" */
  refreshLabel?: string;

  /**
   * Controlled. When `true` every figure is masked. The block never decides to
   * hide a balance on its own, and never stores the preference.
   */
  balancesHidden?: boolean;
  /** The toggle is omitted entirely without this handler. */
  onToggleBalanceVisibility?: () => void;
  /** @default "Show balances" */
  showBalancesLabel?: string;
  /** @default "Hide balances" */
  hideBalancesLabel?: string;
  /** @default "Hidden" */
  hiddenValueLabel?: string;

  actions?: AccountBalanceAction[];
  /** @default "Account actions" */
  actionsLabel?: string;

  /** @default "default" */
  state?: AccountBalanceState;
  /** @default "Loading balances" */
  loadingMessage?: string;
  /** @default "Balances could not be loaded" */
  errorTitle?: string;
  errorDescription?: ReactNode;
  /** The retry control is omitted entirely without this handler. */
  onRetry?: () => void;
  /** @default "No account selected" */
  emptyTitle?: string;
  emptyDescription?: ReactNode;
  emptyAction?: FinanceAction;

  /** Lands on the container root, outside the card padding. */
  className?: string;
}

export type AccountBalanceAction = FinanceAction;

/* ─── Component ──────────────────────────────────────────────────────── */

export function AccountBalanceBlock({
  title = "Account balance",
  headingLevel = "h2",
  description,
  eyebrow,
  account,
  status,
  currency = "GBP",
  locale = "en-GB",
  unknownLabel = "Not available",
  available,
  pending,
  total,
  extraBalances = [],
  primary = "available",
  availableLabel = "Available",
  pendingLabel = "Pending",
  totalLabel = "Total balance",
  asOf,
  asOfLabel = "Updated",
  timeZone,
  formatAsOf,
  asOfNote,
  onRefresh,
  refreshLabel = "Refresh balances",
  balancesHidden = false,
  onToggleBalanceVisibility,
  showBalancesLabel = "Show balances",
  hideBalancesLabel = "Hide balances",
  hiddenValueLabel = "Hidden",
  actions = [],
  actionsLabel = "Account actions",
  state = "default",
  loadingMessage = "Loading balances",
  errorTitle = "Balances could not be loaded",
  errorDescription,
  onRetry,
  emptyTitle = "No account selected",
  emptyDescription,
  emptyAction,
  className,
}: AccountBalanceBlockProps) {
  const uid = useId();
  const headingId = `${uid}-title`;
  const statusDescriptionId = `${uid}-status`;
  const figuresId = `${uid}-figures`;

  const money = (value: FinanceMoneyValue) =>
    formatFinanceMoney(value, { currency, locale, unknownLabel });

  /** A hidden balance shows the mask, not a fabricated figure. */
  const display = (value: FinanceMoneyValue) => {
    const formatted = money(value);
    if (formatted === undefined) return undefined;
    return balancesHidden ? hiddenValueLabel : formatted;
  };

  const named: Record<
    "available" | "pending" | "total",
    { label: string; amount: FinanceMoneyValue }
  > = {
    available: { label: availableLabel, amount: available },
    pending: { label: pendingLabel, amount: pending },
    total: { label: totalLabel, amount: total },
  };

  // The headline is whichever named figure the caller nominated, falling back to
  // the first one that was actually supplied. If none was supplied there is no
  // headline: the block does not invent a zero.
  const primaryOrder: Array<"available" | "pending" | "total"> = [
    primary,
    ...(["available", "total", "pending"] as const).filter((key) => key !== primary),
  ];
  const primaryKey = primaryOrder.find((key) => named[key].amount !== undefined);
  const primaryFigure = primaryKey ? named[primaryKey] : undefined;

  const secondaryFigures: AccountBalanceEntry[] = [
    ...(["available", "pending", "total"] as const)
      .filter((key) => key !== primaryKey && named[key].amount !== undefined)
      .map((key) => ({ id: key, label: named[key].label, amount: named[key].amount })),
    ...extraBalances,
  ];

  const asOfValue = formatFinanceDate(asOf, {
    locale,
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
    unknownLabel,
    format: formatAsOf,
  });

  const trailing = (onRefresh || onToggleBalanceVisibility) && (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      {onToggleBalanceVisibility && (
        <button
          type="button"
          onClick={onToggleBalanceVisibility}
          aria-pressed={balancesHidden}
          className={cn(
            "inline-flex min-h-11 max-w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-lg border border-control-border px-3 py-2 font-medium hover:bg-surface-muted",
            FINANCE_FOCUS_RING,
            "text-body-sm text-on-surface-body"
          )}
        >
          <Icon name={balancesHidden ? "eye" : "eye-slash"} size="sm" className="shrink-0" />
          <span className="min-w-0 break-words">
            {balancesHidden ? showBalancesLabel : hideBalancesLabel}
          </span>
        </button>
      )}
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className={cn(
            "inline-flex min-h-11 max-w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-lg border border-control-border px-3 py-2 font-medium hover:bg-surface-muted",
            FINANCE_FOCUS_RING,
            "text-body-sm text-on-surface-body"
          )}
        >
          <Icon name="refresh" size="sm" className="shrink-0" />
          <span className="min-w-0 break-words">{refreshLabel}</span>
        </button>
      )}
    </div>
  );

  const header = (
    <FinanceHeader
      id={headingId}
      level={headingLevel}
      title={title}
      description={description}
      eyebrow={eyebrow}
      status={status}
      statusDescriptionId={statusDescriptionId}
      trailing={state === "default" ? trailing : undefined}
    />
  );

  if (state === "loading") {
    return (
      <FinanceShell labelledBy={headingId} busy className={className}>
        {header}
        <FinanceSkeleton rows={2} />
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
          icon="wallet"
          action={emptyAction}
        />
      </FinanceShell>
    );
  }

  return (
    <FinanceShell labelledBy={headingId} className={className}>
      {header}

      {account && (
        <p className="flex min-w-0 flex-wrap items-center gap-2 text-body-sm text-on-surface-secondary">
          {account.icon && <Icon name={account.icon} size="sm" className="shrink-0" />}
          <span className="min-w-0 font-medium break-words text-on-surface-body">
            {account.name}
          </span>
          {account.reference && (
            <span className="min-w-0 break-words tabular-nums">{account.reference}</span>
          )}
        </p>
      )}

      {/* Headline figure. Rendered only when a figure was actually supplied. */}
      {primaryFigure ? (
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-body-sm font-medium break-words text-on-surface-secondary">
            {primaryFigure.label}
          </p>
          <p
            className={cn(
              "min-w-0 font-semibold break-words tabular-nums text-on-surface",
              "text-h5 @min-[420px]:text-h4"
            )}
          >
            {display(primaryFigure.amount)}
          </p>
          {primaryFigure.amount === null && (
            <p className="text-body-xs break-words text-on-surface-muted">
              This figure is not currently available from the provider.
            </p>
          )}
        </div>
      ) : (
        <FinanceEmptyPanel
          title={emptyTitle}
          description={emptyDescription}
          icon="wallet"
          action={emptyAction}
        />
      )}

      {secondaryFigures.length > 0 && (
        <dl
          id={figuresId}
          className="grid min-w-0 gap-4 border-t border-surface-border pt-4 @min-[420px]:grid-cols-2 @min-[720px]:grid-cols-3"
        >
          {secondaryFigures.map((figure) => {
            const value = display(figure.amount);
            if (value === undefined) return null;
            return (
              <div key={figure.id} className="flex min-w-0 flex-col gap-0.5">
                <dt className="flex min-w-0 items-center gap-1.5 text-body-xs font-medium break-words text-on-surface-muted">
                  {figure.icon && <Icon name={figure.icon} size="sm" className="shrink-0" />}
                  <span className="min-w-0 break-words">{figure.label}</span>
                </dt>
                <dd className="min-w-0 text-body-md font-semibold break-words tabular-nums text-on-surface">
                  {value}
                  {figure.hint && (
                    <span className="block text-body-xs font-normal break-words text-on-surface-muted">
                      {figure.hint}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      {(asOfValue || asOfNote) && (
        <div className="flex min-w-0 flex-col gap-1 border-t border-surface-border pt-4">
          {asOfValue && (
            <p className="flex min-w-0 flex-wrap items-center gap-1.5 text-body-xs text-on-surface-muted">
              <Icon name="clock" size="sm" className="shrink-0" />
              <span className="min-w-0 break-words">{asOfLabel}</span>
              <FinanceDate value={asOfValue} className="min-w-0 break-words tabular-nums" />
            </p>
          )}
          {asOfNote && (
            <p className="max-w-[62ch] text-body-xs break-words text-on-surface-muted">
              {asOfNote}
            </p>
          )}
        </div>
      )}

      {actions.length > 0 && <FinanceActionRow actions={actions} label={actionsLabel} />}
    </FinanceShell>
  );
}
