import {
  forwardRef,
  useId,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Badge } from "../components/Badge";
import { Icon, type IconName } from "../components/Icon";

/* ─── Heading contract ─────────────────────────────────────────────────── */

export type FeatureOverviewHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const HEADING_ORDER: FeatureOverviewHeadingLevel[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

function nextHeadingLevel(level: FeatureOverviewHeadingLevel): FeatureOverviewHeadingLevel {
  const index = HEADING_ORDER.indexOf(level);
  return HEADING_ORDER[Math.min(index + 1, HEADING_ORDER.length - 1)];
}

/* ─── Follow-on link / action contract ─────────────────────────────────── */

interface FeatureOverviewCtaBase {
  label: string;
  icon?: IconName;
}

export interface FeatureOverviewLinkCta extends FeatureOverviewCtaBase {
  href: string;
  external?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface FeatureOverviewActionCta extends FeatureOverviewCtaBase {
  onClick: () => void;
  href?: never;
  external?: never;
}

export type FeatureOverviewCta = FeatureOverviewLinkCta | FeatureOverviewActionCta;

function isLinkCta(cta: FeatureOverviewCta): cta is FeatureOverviewLinkCta {
  return typeof (cta as FeatureOverviewLinkCta).href === "string";
}

/* ─── Content types ────────────────────────────────────────────────────── */

export interface FeatureOverviewItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Icon rendered in the item's accent tile. */
  icon?: IconName;
  /** Short qualifier, e.g. "Beta" or "Enterprise". */
  badge?: string;
  /**
   * Detail the visitor can follow. Rendered as a native link for a destination
   * and a button for an in-page action. Omitted when not supplied — the block
   * never renders a "Learn more" control that does nothing.
   */
  cta?: FeatureOverviewCta;
}

export type FeatureOverviewState = "default" | "loading" | "empty" | "error";

export type FeatureOverviewColumns = 2 | 3 | 4;

export type FeatureOverviewVariant = "card" | "plain";

export interface FeatureOverviewEmptyState {
  title: ReactNode;
  description?: ReactNode;
  /** Optional recovery step. Omitted when not supplied. */
  cta?: FeatureOverviewCta;
}

export interface FeatureOverviewBlockProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Small label above the section title. Not a heading. */
  eyebrow?: ReactNode;
  /** Section title. */
  title: ReactNode;
  /** Supporting explanation under the title. */
  description?: ReactNode;
  /**
   * Heading element for the section title. Item titles use the next level down.
   * @default "h2"
   */
  headingLevel?: FeatureOverviewHeadingLevel;
  /** Capabilities to scan. */
  features: FeatureOverviewItem[];
  /** Widest column count. Narrow viewports always reduce to one. @default 3 */
  columns?: FeatureOverviewColumns;
  /** `card` draws a bordered surface per item; `plain` is borderless. @default "card" */
  variant?: FeatureOverviewVariant;
  /** Section-level follow-on step rendered under the grid. */
  footerCta?: FeatureOverviewCta;
  /** @default "default" — derived from `features` only when left undefined. */
  state?: FeatureOverviewState;
  /** Number of placeholder items rendered while loading. @default 3 */
  loadingItemCount?: number;
  loadingLabel?: string;
  /** Distinguishes "nothing configured" from "nothing matched" — caller's wording. */
  emptyState?: FeatureOverviewEmptyState;
  errorTitle?: string;
  errorDescription?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/* ─── Appearance ───────────────────────────────────────────────────────── */

const COLUMN_CLASS: Record<FeatureOverviewColumns, string> = {
  2: "@min-[600px]:grid-cols-2",
  3: "@min-[600px]:grid-cols-2 @min-[1136px]:grid-cols-3",
  4: "@min-[600px]:grid-cols-2 @min-[1136px]:grid-cols-4",
};

const INLINE_CTA_CLASS =
  "inline-flex max-w-full items-center gap-1.5 rounded text-sm font-semibold break-words text-action-primary-text no-underline hover:underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

const SECTION_CTA_CLASS =
  "inline-flex max-w-full items-center justify-center gap-2 min-h-11 rounded-lg border-[1.5px] border-current bg-transparent px-5 py-2.5 text-sm font-semibold break-words text-center text-action-primary-text no-underline transition-colors hover:bg-primary-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

interface FeatureCtaProps {
  cta: FeatureOverviewCta;
  className: string;
  trailingIcon?: boolean;
}

function FeatureCta({ cta, className, trailingIcon = false }: FeatureCtaProps) {
  const content = (
    <>
      {cta.icon && <Icon name={cta.icon} size="sm" className="shrink-0" aria-hidden="true" />}
      <span className="min-w-0">{cta.label}</span>
      {trailingIcon && !cta.icon && (
        <Icon name="arrow-right" size="sm" className="shrink-0" aria-hidden="true" />
      )}
    </>
  );

  if (isLinkCta(cta)) {
    const externalAttributes: AnchorHTMLAttributes<HTMLAnchorElement> = cta.external
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    return (
      <a href={cta.href} onClick={cta.onClick} className={className} {...externalAttributes}>
        {content}
        {cta.external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button type="button" onClick={cta.onClick} className={className}>
      {content}
    </button>
  );
}

/* ─── Block ────────────────────────────────────────────────────────────── */

/**
 * Feature Overview — lets a visitor scan differentiated capabilities and follow
 * the details that matter to them.
 *
 * States: `default`, `loading`, `empty`, `error`. There is no success state:
 * the block submits nothing. When `state` is left undefined it resolves to
 * `empty` for an empty `features` array and `default` otherwise, so an empty
 * source is never silently rendered as a blank grid.
 */
export const FeatureOverviewBlock = forwardRef<HTMLElement, FeatureOverviewBlockProps>(
  (
    {
      eyebrow,
      title,
      description,
      headingLevel = "h2",
      features,
      columns = 3,
      variant = "card",
      footerCta,
      state,
      loadingItemCount = 3,
      loadingLabel = "Loading features",
      emptyState,
      errorTitle = "We could not load these features",
      errorDescription,
      onRetry,
      retryLabel = "Try again",
      className,
      ...rest
    },
    ref
  ) => {
    const headingId = useId();
    const Heading = headingLevel;
    const ItemHeading = nextHeadingLevel(headingLevel);

    const resolvedState: FeatureOverviewState =
      state ?? (features.length === 0 ? "empty" : "default");

    const isCard = variant === "card";
    const itemClass = cn(
      "flex min-w-0 flex-col gap-3",
      isCard && "rounded-xl border border-surface-border bg-surface p-5 @min-[600px]:p-6"
    );

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

          {resolvedState === "loading" && (
            <>
              <p role="status" className="sr-only">
                {loadingLabel}
              </p>
              <div
                className={cn("grid grid-cols-1 gap-5 @min-[600px]:gap-6", COLUMN_CLASS[columns])}
                aria-hidden="true"
              >
                {Array.from({ length: Math.max(1, loadingItemCount) }).map((_, index) => (
                  <div
                    key={`feature-skeleton-${index}`}
                    className={cn(itemClass, !isCard && "gap-3")}
                  >
                    <div className="size-11 rounded-lg bg-grey-200" />
                    <div className="h-5 w-3/5 rounded bg-grey-200" />
                    <div className="h-4 w-full rounded bg-grey-100" />
                    <div className="h-4 w-4/5 rounded bg-grey-100" />
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
                <button type="button" onClick={onRetry} className={SECTION_CTA_CLASS}>
                  <Icon name="refresh" size="sm" className="shrink-0" aria-hidden="true" />
                  <span className="min-w-0">{retryLabel}</span>
                </button>
              )}
            </div>
          )}

          {resolvedState === "empty" && (
            <div className="flex min-w-0 flex-col items-start gap-3 rounded-xl border border-dashed border-surface-border-strong bg-surface p-6 @min-[600px]:p-8">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-grey-100 text-grey-600">
                <Icon name="layer" size="lg" aria-hidden="true" />
              </span>
              <p className="text-base font-semibold break-words text-grey-900">
                {emptyState?.title ?? "No features to show yet"}
              </p>
              {emptyState?.description && (
                <p className="max-w-[60ch] text-sm break-words text-grey-600">
                  {emptyState.description}
                </p>
              )}
              {emptyState?.cta && <FeatureCta cta={emptyState.cta} className={SECTION_CTA_CLASS} />}
            </div>
          )}

          {resolvedState === "default" && features.length > 0 && (
            <ul
              className={cn(
                "grid list-none grid-cols-1 gap-5 p-0 @min-[600px]:gap-6",
                COLUMN_CLASS[columns]
              )}
            >
              {features.map((feature) => (
                <li key={feature.id} className={itemClass}>
                  {feature.icon && (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-action-primary-text">
                      <Icon name={feature.icon} size="lg" aria-hidden="true" />
                    </span>
                  )}
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <ItemHeading className="min-w-0 text-base font-semibold break-words text-grey-900 @min-[600px]:text-body-lg">
                      {feature.title}
                    </ItemHeading>
                    {feature.badge && (
                      <Badge color="neutral" type="accent" size="sm">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  {feature.description && (
                    <p className="text-sm break-words text-grey-600 @min-[600px]:text-base">
                      {feature.description}
                    </p>
                  )}
                  {feature.cta && (
                    <FeatureCta cta={feature.cta} className={INLINE_CTA_CLASS} trailingIcon />
                  )}
                </li>
              ))}
            </ul>
          )}

          {footerCta && resolvedState === "default" && (
            <div className="flex min-w-0">
              <FeatureCta cta={footerCta} className={SECTION_CTA_CLASS} />
            </div>
          )}
        </div>
      </section>
    );
  }
);

FeatureOverviewBlock.displayName = "FeatureOverviewBlock";
