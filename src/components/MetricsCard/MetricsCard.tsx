import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "../../utils/resolveIcon";
import { Icon, type IconName } from "../Icon";

// ─── Types ───────────────────────────────────────────────────────
export type MetricsCardVariation = "1" | "2" | "3" | "4" | "5" | "6";
export type MetricsCardTrend = "up" | "down";

export interface MetricsCardTrendBadge {
  label: string;
  trend?: MetricsCardTrend;
}

export interface MetricsCardStatusBadge {
  label: string;
  variant?: "success" | "error" | "warning" | "info";
}

export interface MetricsCardCta {
  label: string;
  onClick: () => void;
  icon?: ReactNode | IconName;
}

export interface MetricsCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout variation (1–6), each with a distinct layout */
  variation?: MetricsCardVariation;
  /** Metric label, e.g. "Total Solar Sales" */
  label: string;
  /** Main metric value, e.g. "$45,823" */
  value: string | number;
  /** Optional icon — renders in a bordered square (v2,3,6) or large tinted square (v4) */
  icon?: ReactNode | IconName;
  /** Trend badge with arrow icon, e.g. { label: "10%", trend: "up" } — used in v2–6 */
  trendBadge?: MetricsCardTrendBadge;
  /** Status badge, e.g. { label: "Paid", variant: "success" } — used in v1 */
  statusBadge?: MetricsCardStatusBadge;
  /** Description text, e.g. "Compared to last month" */
  description?: string;
  /** Secondary text shown on the right in v1, e.g. "Jun 12th, 2023" */
  secondaryText?: string;
  /** Call-to-action link */
  cta?: MetricsCardCta;
}

// ─── Sub-components ──────────────────────────────────────────────

const trendStyles: Record<MetricsCardTrend, string> = {
  up: "bg-primary-50 text-primary-700",
  down: "bg-error-50 text-error-700",
};

const statusStyles: Record<string, string> = {
  success: "bg-success-50 text-success-700",
  error: "bg-error-50 text-error-700",
  warning: "bg-warning-50 text-warning-700",
  info: "bg-secondary-50 text-secondary-700",
};

function TrendBadge({ badge }: { badge: MetricsCardTrendBadge }) {
  const trend = badge.trend ?? "up";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xl px-1 text-body-xs font-medium",
        trendStyles[trend]
      )}
    >
      <Icon
        name={trend === "down" ? "arrow-down" : "arrow-up"}
        size="xs"
      />
      {badge.label}
    </span>
  );
}

function StatusBadge({ badge }: { badge: MetricsCardStatusBadge }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl px-3 py-0.5 text-body-sm font-medium",
        statusStyles[badge.variant ?? "success"]
      )}
    >
      {badge.label}
    </span>
  );
}

/** Small bordered icon container (32×32) used in v2, v3, v6 */
function SmallIcon({ icon }: { icon: ReactNode | IconName }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-grey-200 bg-white">
      <span className="size-4">{resolveIcon(icon, "sm")}</span>
    </div>
  );
}

/** Large tinted icon container (48×48) used in v4 */
function LargeIcon({ icon }: { icon: ReactNode | IconName }) {
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-400">
      <span className="size-6">{resolveIcon(icon, "lg")}</span>
    </div>
  );
}

/** CTA footer bar — grey bg strip at bottom with link text */
function CtaFooter({
  cta,
  centered = false,
}: {
  cta: MetricsCardCta;
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center border-t border-grey-100 bg-grey-50 p-4",
        centered ? "justify-center" : "justify-between"
      )}
    >
      <button
        type="button"
        onClick={cta.onClick}
        className="inline-flex items-center gap-1 text-body-xs font-medium text-primary-600 cursor-pointer hover:text-primary-400"
      >
        {cta.label}
        {cta.icon && (
          <span className="size-5">{resolveIcon(cta.icon, "md")}</span>
        )}
      </button>
    </div>
  );
}

/** Inline CTA text link (no footer bar) — used in v1, v5 */
function CtaInline({ cta }: { cta: MetricsCardCta }) {
  return (
    <button
      type="button"
      onClick={cta.onClick}
      className="inline-flex items-center text-body-xs font-medium text-primary-600 cursor-pointer hover:text-primary-400"
    >
      {cta.label}
    </button>
  );
}

// ─── Variation Layouts ───────────────────────────────────────────

/**
 * Variation 1: Horizontal — label+value+CTA left, date+status right
 */
function Variation1({
  label,
  value,
  secondaryText,
  statusBadge,
  cta,
}: MetricsCardProps) {
  return (
    <div className="flex w-full items-start justify-between p-4">
      {/* Left column */}
      <div className="flex flex-col gap-8 items-start">
        <span className="text-body-sm font-medium text-grey-500">{label}</span>
        <div className="flex flex-col gap-2 items-start">
          <span
            className="text-h3 font-semibold text-grey-800"
            style={{ fontFeatureSettings: "'cv01' 1, 'cv03' 1, 'cv04' 1" }}
          >
            {value}
          </span>
          {cta && <CtaInline cta={cta} />}
        </div>
      </div>
      {/* Right column */}
      <div className="flex flex-col items-end justify-between self-stretch">
        {secondaryText && (
          <span className="text-body-sm font-medium text-grey-500">
            {secondaryText}
          </span>
        )}
        {statusBadge && <StatusBadge badge={statusBadge} />}
      </div>
    </div>
  );
}

/**
 * Variation 2: Vertical — icon+label → value → badge+desc → CTA footer
 */
function Variation2({
  label,
  value,
  icon,
  trendBadge,
  description,
  cta,
}: MetricsCardProps) {
  return (
    <>
      <div className="flex w-full flex-col items-start p-4">
        <div className="flex flex-col items-start gap-8 w-full">
          {/* Header: icon + label */}
          <div className="flex items-center gap-3">
            {icon && <SmallIcon icon={icon} />}
            <span className="text-body-sm font-medium text-grey-500">
              {label}
            </span>
          </div>
          {/* Metrics */}
          <div className="flex flex-col items-start gap-3">
            <span
              className="text-h3 font-semibold text-grey-800"
              style={{
                fontFeatureSettings: "'cv01' 1, 'cv03' 1, 'cv04' 1",
              }}
            >
              {value}
            </span>
            {/* Subtext: badge + description */}
            {(trendBadge || description) && (
              <div className="flex items-center gap-1">
                {trendBadge && <TrendBadge badge={trendBadge} />}
                {description && (
                  <span
                    className="text-body-xs font-medium text-grey-400"
                    style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
                  >
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {cta && <CtaFooter cta={cta} />}
    </>
  );
}

/**
 * Variation 3: Vertical reversed — icon+label → badge+desc → value → CTA footer
 */
function Variation3({
  label,
  value,
  icon,
  trendBadge,
  description,
  cta,
}: MetricsCardProps) {
  return (
    <>
      <div className="flex w-full flex-col items-start p-4">
        <div className="flex flex-col items-start gap-3 w-full">
          {/* Header: icon + label */}
          <div className="flex items-center gap-3">
            {icon && <SmallIcon icon={icon} />}
            <span className="text-body-sm font-medium text-grey-500">
              {label}
            </span>
          </div>
          {/* Subtext BEFORE value */}
          {(trendBadge || description) && (
            <div className="flex items-center gap-1">
              {trendBadge && <TrendBadge badge={trendBadge} />}
              {description && (
                <span
                  className="text-body-xs font-medium text-grey-400"
                  style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
                >
                  {description}
                </span>
              )}
            </div>
          )}
          {/* Value AFTER subtext */}
          <span
            className="text-h3 font-semibold text-grey-800"
            style={{
              fontFeatureSettings: "'cv01' 1, 'cv03' 1, 'cv04' 1",
            }}
          >
            {value}
          </span>
        </div>
      </div>
      {cta && <CtaFooter cta={cta} />}
    </>
  );
}

/**
 * Variation 4: Horizontal body with large icon on right — label+value+badge left, big icon right → CTA footer
 */
function Variation4({
  label,
  value,
  icon,
  trendBadge,
  description,
  cta,
}: MetricsCardProps) {
  return (
    <>
      <div className="flex w-full items-start justify-between p-4">
        {/* Left column */}
        <div className="flex flex-col items-start gap-4">
          <span
            className="text-body-xs font-medium text-grey-500"
            style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
          >
            {label}
          </span>
          <div className="flex flex-col items-start gap-2 opacity-80">
            <span
              className="text-h3 font-semibold text-grey-800"
              style={{
                fontFeatureSettings: "'cv01' 1, 'cv03' 1, 'cv04' 1",
              }}
            >
              {value}
            </span>
            {(trendBadge || description) && (
              <div className="flex items-center gap-1">
                {trendBadge && <TrendBadge badge={trendBadge} />}
                {description && (
                  <span
                    className="text-body-xs font-medium text-grey-400"
                    style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
                  >
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Right: large icon */}
        {icon && <LargeIcon icon={icon} />}
      </div>
      {cta && <CtaFooter cta={cta} />}
    </>
  );
}

/**
 * Variation 5: Compact horizontal — label+value+desc left, badge+CTA right
 */
function Variation5({
  label,
  value,
  trendBadge,
  description,
  cta,
}: MetricsCardProps) {
  return (
    <div className="flex w-full items-start justify-between p-4">
      {/* Left column */}
      <div className="flex flex-col items-start gap-1">
        <span
          className="text-body-xs font-medium text-grey-500"
          style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
        >
          {label}
        </span>
        <span
          className="text-h3 font-semibold text-grey-800"
          style={{
            fontFeatureSettings: "'cv01' 1, 'cv03' 1, 'cv04' 1",
          }}
        >
          {value}
        </span>
        {description && (
          <span
            className="text-body-xs font-medium text-grey-500"
            style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
          >
            {description}
          </span>
        )}
      </div>
      {/* Right column */}
      <div className="flex flex-col items-end justify-between self-stretch gap-2">
        {trendBadge && <TrendBadge badge={trendBadge} />}
        {cta && <CtaInline cta={cta} />}
      </div>
    </div>
  );
}

/**
 * Variation 6: Centered vertical — icon → label → value(28px) → badge+desc → CTA footer
 */
function Variation6({
  label,
  value,
  icon,
  trendBadge,
  description,
  cta,
}: MetricsCardProps) {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
        {/* Icon + Label */}
        <div className="flex flex-col items-center gap-2">
          {icon && <SmallIcon icon={icon} />}
          <span
            className="text-body-xs font-medium text-grey-500 text-center"
            style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
          >
            {label}
          </span>
        </div>
        {/* Value + Subtext */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-h4 font-semibold text-grey-800"
            style={{
              fontFeatureSettings: "'cv01' 1, 'cv03' 1, 'cv04' 1",
            }}
          >
            {value}
          </span>
          {(trendBadge || description) && (
            <div className="flex items-center gap-1 justify-center">
              {trendBadge && <TrendBadge badge={trendBadge} />}
              {description && (
                <span
                  className="text-body-xs font-medium text-grey-400"
                  style={{ fontFeatureSettings: "'cv03' 1, 'cv04' 1" }}
                >
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {cta && <CtaFooter cta={cta} centered />}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────

export function MetricsCard({
  variation = "2",
  className,
  ...props
}: MetricsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-clip rounded-xl border border-grey-200 bg-white shadow-soft-xxs",
        className
      )}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {variation === "1" && <Variation1 {...props} />}
      {variation === "2" && <Variation2 {...props} />}
      {variation === "3" && <Variation3 {...props} />}
      {variation === "4" && <Variation4 {...props} />}
      {variation === "5" && <Variation5 {...props} />}
      {variation === "6" && <Variation6 {...props} />}
    </div>
  );
}
