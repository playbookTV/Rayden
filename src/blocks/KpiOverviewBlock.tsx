import { useId, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import type { IconName } from "../components/Icon";
import { Spinner } from "../components/Spinner";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type KpiOverviewHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type KpiChangeDirection = "up" | "down" | "flat";

/**
 * Whether the movement is good, bad, or neither *for this metric*. Direction
 * and sentiment are separate: churn falling is a `down` direction with a
 * `positive` sentiment.
 */
export type KpiChangeSentiment = "positive" | "negative" | "neutral";

export interface KpiChange {
  /** Pre-formatted, e.g. "+12.4%" or "−310". */
  label: string;
  direction: KpiChangeDirection;
  /** @default "neutral" */
  sentiment?: KpiChangeSentiment;
}

export interface KpiTrend {
  /** One label per point, used for the chart's text equivalent. */
  labels: string[];
  values: number[];
}

export interface KpiMetric {
  id: string;
  /** What is being counted. */
  label: string;
  /** Pre-formatted by the consuming app, which owns locale and currency. */
  value: string;
  /** The same measure over the comparison period, pre-formatted. */
  comparisonValue?: string;
  change?: KpiChange;
  /** One sentence of plain-language context. */
  description?: string;
  /** Optional sparkline. Rendered with a visually hidden data table. */
  trend?: KpiTrend;
  /**
   * Set when this metric could not be computed. The tile then states why
   * instead of showing a misleading zero.
   */
  unavailableReason?: string;
  icon?: IconName;
}

export interface KpiPeriod {
  /** The period the values cover, e.g. "1–21 September 2026". */
  label: string;
  /** What they are compared with, e.g. "August 2026". */
  comparisonLabel: string;
}

export interface KpiPeriodOption {
  id: string;
  label: string;
}

export type KpiOverviewStatus = "idle" | "loading" | "error";

export interface KpiOverviewBlockProps {
  title?: string;
  description?: string;
  /** Heading element for {@link title}. @default "h2" */
  headingLevel?: KpiOverviewHeadingLevel;
  /** Required: metrics are meaningless without a stated period. */
  period: KpiPeriod;
  metrics: KpiMetric[];
  /**
   * Period choices. The selector renders only when options, a selected id and
   * a change handler are all supplied.
   */
  periodOptions?: KpiPeriodOption[];
  selectedPeriodId?: string;
  onPeriodChange?: (id: string) => void;
  /** Label for the period selector. @default "Reporting period" */
  periodSelectLabel?: string;
  /** @default "idle" */
  status?: KpiOverviewStatus;
  errorMessage?: string;
  /** Retry control renders only when a handler is supplied. */
  onRetry?: () => void;
  /** When supplied, each tile becomes an activating control. */
  onSelectMetric?: (id: string) => void;
  /** Shown when `metrics` is empty. */
  emptyTitle?: string;
  emptyDescription?: string;
  /** Extra content under the grid, e.g. a link to the full report. */
  footer?: ReactNode;
  /** Number of loading placeholders. @default 4 */
  loadingPlaceholderCount?: number;
  className?: string;
}

/* ─── Change badge ───────────────────────────────────────────────────── */

const sentimentStyles: Record<KpiChangeSentiment, string> = {
  positive: "bg-success-50 text-success-700",
  negative: "bg-error-50 text-error-700",
  neutral: "bg-grey-100 text-grey-700",
};

const directionIcon: Record<KpiChangeDirection, IconName> = {
  up: "arrow-up",
  down: "arrow-down",
  flat: "minus",
};

const directionText: Record<KpiChangeDirection, string> = {
  up: "increased by",
  down: "decreased by",
  flat: "unchanged at",
};

function ChangeBadge({ change, comparisonLabel }: { change: KpiChange; comparisonLabel: string }) {
  const sentiment = change.sentiment ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-body-xs font-medium",
        sentimentStyles[sentiment]
      )}
    >
      <Icon name={directionIcon[change.direction]} size="xs" />
      {/* Direction is carried by the arrow, the word, and the sign in the
          label — never by colour alone. */}
      <span className="sr-only">{directionText[change.direction]}</span>
      <span>{change.label}</span>
      <span className="sr-only">compared with {comparisonLabel}</span>
    </span>
  );
}

/* ─── Tile ───────────────────────────────────────────────────────────── */

function MetricTrend({ label, trend }: { label: string; trend: KpiTrend }) {
  if (trend.values.some((value) => !Number.isFinite(value))) return null;
  const low = Math.min(...trend.values);
  const range = Math.max(...trend.values) - low || 1;
  const points = trend.values
    .map(
      (value, index) =>
        `${2 + (index / (trend.values.length - 1)) * 296},${44 - ((value - low) / range) * 40}`
    )
    .join(" ");
  return (
    <div className="relative">
      <svg
        viewBox="0 0 300 48"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="h-12 w-full text-action-primary-text"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <table className="sr-only">
        <caption>{label} trend</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {trend.values.map((value, index) => (
            <tr key={index}>
              <th scope="row">{trend.labels[index] ?? `Point ${index + 1}`}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetricBody({
  metric,
  comparisonLabel,
  labelId,
}: {
  metric: KpiMetric;
  comparisonLabel: string;
  labelId: string;
}) {
  if (metric.unavailableReason) {
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <span id={labelId} className="text-body-sm font-medium text-grey-600">
          {metric.label}
        </span>
        <span className="text-h6 font-semibold text-grey-600">Not available</span>
        <p className="text-body-xs text-grey-600">{metric.unavailableReason}</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span id={labelId} className="min-w-0 text-body-sm font-medium text-grey-600">
          {metric.label}
        </span>
        {metric.icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-surface-border text-grey-600">
            <Icon name={metric.icon} size="sm" />
          </span>
        )}
      </div>

      <p className="text-h5 font-semibold break-words text-grey-900">{metric.value}</p>

      <div className="flex flex-wrap items-center gap-2">
        {metric.change && <ChangeBadge change={metric.change} comparisonLabel={comparisonLabel} />}
        {metric.comparisonValue ? (
          <span className="text-body-xs text-grey-600">
            from {metric.comparisonValue} in {comparisonLabel}
          </span>
        ) : (
          <span className="text-body-xs text-grey-600">
            No comparable figure for {comparisonLabel}
          </span>
        )}
      </div>

      {metric.trend && metric.trend.values.length > 1 && (
        <MetricTrend label={metric.label} trend={metric.trend} />
      )}

      {metric.description && <p className="text-body-sm text-grey-600">{metric.description}</p>}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */

export function KpiOverviewBlock({
  title = "Performance overview",
  description,
  headingLevel = "h2",
  period,
  metrics,
  periodOptions,
  selectedPeriodId,
  onPeriodChange,
  periodSelectLabel = "Reporting period",
  status = "idle",
  errorMessage,
  onRetry,
  onSelectMetric,
  emptyTitle = "No metrics selected",
  emptyDescription = "Choose the measures you want to follow and they will appear here.",
  footer,
  loadingPlaceholderCount = 4,
  className,
}: KpiOverviewBlockProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const periodId = `${uid}-period`;
  const periodSelectId = `${uid}-period-select`;

  const Heading = headingLevel;
  const showPeriodSelector = Boolean(
    periodOptions && periodOptions.length > 0 && selectedPeriodId && onPeriodChange
  );

  // `relative` gives visually hidden, absolutely positioned text inside a tile
  // a containing block, so it can never escape and widen the document.
  const tileClass =
    "relative flex h-full min-w-0 flex-col gap-3 rounded-12 border border-surface-border bg-surface p-4 text-left";

  return (
    <section
      aria-labelledby={titleId}
      className={cn("@container flex w-full flex-col gap-4", className)}
    >
      <header className="flex flex-col gap-3 @min-[620px]:flex-row @min-[620px]:items-end @min-[620px]:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading id={titleId} className="text-h6 font-semibold text-grey-900">
            {title}
          </Heading>
          {/* The period is stated in text, not implied by a chart axis. */}
          <p id={periodId} className="text-body-sm text-grey-600">
            {period.label} · compared with {period.comparisonLabel}
          </p>
          {description && <p className="text-body-sm text-grey-600">{description}</p>}
        </div>

        {showPeriodSelector && (
          <div className="flex min-w-0 flex-col gap-1">
            <label
              htmlFor={periodSelectId}
              className="text-sm font-medium leading-[1.45] text-grey-900"
            >
              {periodSelectLabel}
            </label>
            <select
              id={periodSelectId}
              value={selectedPeriodId}
              onChange={(event) => onPeriodChange?.(event.target.value)}
              className={cn(
                "h-10 w-full rounded-lg border border-grey-300 bg-surface px-3 text-sm text-grey-900 @min-[620px]:w-auto",
                "transition-colors hover:border-primary-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
              )}
            >
              {periodOptions?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {status === "error" ? (
        <div className="flex flex-col gap-3">
          <Alert
            state="error"
            icon="info-triangle"
            role="alert"
            title="These metrics could not be loaded"
            description={
              errorMessage ?? "The reporting service did not respond. Your filters are unchanged."
            }
            className="bg-surface dark:bg-surface"
          />
          {onRetry && (
            <div>
              <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
                Try again
              </Button>
            </div>
          )}
        </div>
      ) : status === "loading" ? (
        <div aria-busy="true" className="flex flex-col gap-3">
          <output className="flex items-center gap-2 pl-1 text-body-sm text-grey-600">
            <Spinner size="xs" />
            Loading metrics for {period.label}…
          </output>
          <div className="grid grid-cols-1 gap-4 @min-[560px]:grid-cols-2 @min-[1000px]:grid-cols-4">
            {Array.from({ length: loadingPlaceholderCount }, (_, index) => (
              <div key={index} aria-hidden="true" className={cn(tileClass, "gap-3")}>
                <span className="h-4 w-2/3 rounded bg-grey-100" />
                <span className="h-7 w-1/2 rounded bg-grey-100" />
                <span className="h-4 w-full rounded bg-grey-100" />
              </div>
            ))}
          </div>
        </div>
      ) : metrics.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-12 border border-dashed border-surface-border-strong bg-surface p-6">
          <p className="text-body-md font-semibold text-grey-900">{emptyTitle}</p>
          <p className="text-body-sm text-grey-600">{emptyDescription}</p>
        </div>
      ) : (
        <ul
          role="list"
          aria-describedby={periodId}
          className="grid list-none grid-cols-1 gap-4 p-0 @min-[560px]:grid-cols-2 @min-[1000px]:grid-cols-4"
        >
          {metrics.map((metric) => {
            const labelId = `${uid}-metric-${metric.id}`;
            return (
              <li key={metric.id} className={cn(tileClass, "min-w-0")}>
                <MetricBody
                  metric={metric}
                  comparisonLabel={period.comparisonLabel}
                  labelId={labelId}
                />
                {/* The action is an explicit control rather than a tile-sized
                    button, so the figures stay readable to assistive
                    technology instead of collapsing into a button name. */}
                {onSelectMetric && !metric.unavailableReason && (
                  <button
                    type="button"
                    onClick={() => onSelectMetric(metric.id)}
                    className="mt-auto inline-flex cursor-pointer items-center gap-1 self-start rounded pt-1 text-body-xs font-semibold text-action-primary-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
                  >
                    View details <span className="sr-only">for {metric.label}</span>
                    <Icon name="chevron-right" size="xs" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {footer && <div className="flex flex-wrap items-center gap-3">{footer}</div>}
    </section>
  );
}
