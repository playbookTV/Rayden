import {
  forwardRef,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Badge } from "../components/Badge";
import { Icon, type IconName } from "../components/Icon";

/* ─── Heading contract ─────────────────────────────────────────────────────
   Embedding context varies, so the caller chooses the heading level instead of
   inheriting a hard-coded one. Sub-headings derive from it.
   ------------------------------------------------------------------------ */

export type ProductHeroHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const HEADING_ORDER: ProductHeroHeadingLevel[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

function nextHeadingLevel(level: ProductHeroHeadingLevel): ProductHeroHeadingLevel {
  const index = HEADING_ORDER.indexOf(level);
  return HEADING_ORDER[Math.min(index + 1, HEADING_ORDER.length - 1)];
}

/* ─── Call to action contract ──────────────────────────────────────────────
   A destination renders a native link; an action renders a button. The union
   makes it impossible to configure a control with neither, which is the
   "inert control" defect the block audit recorded.
   ------------------------------------------------------------------------ */

interface ProductHeroCtaBase {
  label: string;
  /** Optional leading icon. */
  icon?: IconName;
}

export interface ProductHeroLinkCta extends ProductHeroCtaBase {
  /** Destination. Renders a native anchor. */
  href: string;
  /** Opens in a new tab and adds rel="noreferrer". */
  external?: boolean;
  /** Optional analytics hook. Navigation still belongs to the anchor. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface ProductHeroActionCta extends ProductHeroCtaBase {
  /** In-page action. Renders a native button. */
  onClick: () => void;
  href?: never;
  external?: never;
}

export type ProductHeroCta = ProductHeroLinkCta | ProductHeroActionCta;

function isLinkCta(cta: ProductHeroCta): cta is ProductHeroLinkCta {
  return typeof (cta as ProductHeroLinkCta).href === "string";
}

/* ─── Content types ────────────────────────────────────────────────────── */

export interface ProductHeroHighlight {
  id: string;
  /** Short label, e.g. "Uptime" or "Teams onboarded". */
  label: string;
  /** Optional emphasised value, e.g. "99.98%". Pre-formatted by the caller. */
  value?: ReactNode;
  icon?: IconName;
}

export type ProductHeroMediaRatio = "auto" | "video" | "wide" | "square";

export interface ProductHeroMedia {
  src: string;
  /** Required. Describes the example being shown, not the product. */
  alt: string;
  /**
   * `auto` keeps the image's own proportions so a product screenshot is never
   * cropped. The fixed ratios crop to fill, for art-directed imagery.
   * @default "auto"
   */
  aspectRatio?: ProductHeroMediaRatio;
  width?: number;
  height?: number;
  /** Caption rendered under the media. */
  caption?: ReactNode;
}

export type ProductHeroState = "default" | "loading" | "error";

export type ProductHeroAlign = "start" | "center";

export interface ProductHeroBlockProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Small label above the headline. Not a heading. */
  eyebrow?: ReactNode;
  /** Optional badge rendered beside the eyebrow, e.g. a release tag. */
  eyebrowBadge?: string;
  /** The product statement. Required in the default state. */
  headline: ReactNode;
  /** Supporting explanation. */
  description?: ReactNode;
  /**
   * Heading element for the headline. Choose h1 for a page hero and h2 when the
   * page already has an h1. @default "h1"
   */
  headingLevel?: ProductHeroHeadingLevel;
  /** Primary next step. A destination or an action; never both. */
  primaryCta?: ProductHeroCta;
  /** Optional alternative step. */
  secondaryCta?: ProductHeroCta;
  /** Small print under the actions, e.g. "No credit card required". */
  note?: ReactNode;
  /** Scannable proof points rendered as a list. */
  highlights?: ProductHeroHighlight[];
  /** A relevant example image. */
  media?: ProductHeroMedia;
  /**
   * Arbitrary example content (a live demo, a video embed). Takes precedence
   * over `media`.
   */
  mediaSlot?: ReactNode;
  /**
   * Replaces the media when the image fails or `media.src` is empty. A neutral
   * labelled placeholder is used when this is omitted.
   */
  mediaFallback?: ReactNode;
  /** Text-only alignment when there is no media. @default "start" */
  align?: ProductHeroAlign;
  /** @default "default" */
  state?: ProductHeroState;
  /** Announced while `state="loading"`. */
  loadingLabel?: string;
  /** Shown while `state="error"`. */
  errorTitle?: string;
  errorDescription?: ReactNode;
  /** Retry control. Omitted entirely when no handler is supplied. */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/* ─── Shared call-to-action appearance ─────────────────────────────────────
   One recipe drives both the anchor and the button so a destination and an
   action can sit side by side without looking different. Heights are minimums,
   not fixed values, so a long translated label grows instead of clipping.
   ------------------------------------------------------------------------ */

const CTA_BASE =
  "inline-flex max-w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-base font-semibold leading-[1.45] min-h-14 text-center break-words no-underline transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

const CTA_TONE = {
  primary: "bg-action-primary text-white hover:bg-action-primary-hover",
  secondary:
    "bg-transparent text-action-primary-text border-[1.5px] border-current hover:bg-primary-50",
} as const;

interface HeroCtaProps {
  cta: ProductHeroCta;
  tone: keyof typeof CTA_TONE;
}

function HeroCta({ cta, tone }: HeroCtaProps) {
  const content = (
    <>
      {cta.icon && <Icon name={cta.icon} size="md" className="shrink-0" />}
      <span className="min-w-0">{cta.label}</span>
    </>
  );

  if (isLinkCta(cta)) {
    const externalAttributes: AnchorHTMLAttributes<HTMLAnchorElement> = cta.external
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    return (
      <a
        href={cta.href}
        onClick={cta.onClick}
        className={cn(CTA_BASE, CTA_TONE[tone])}
        {...externalAttributes}
      >
        {content}
        {cta.external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button type="button" onClick={cta.onClick} className={cn(CTA_BASE, CTA_TONE[tone])}>
      {content}
    </button>
  );
}

/* ─── Media ────────────────────────────────────────────────────────────── */

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-surface-border-strong bg-surface-muted px-6 py-10 text-center"
      role="img"
      aria-label={label}
    >
      <Icon name="image" size="xl" className="text-grey-400" aria-hidden="true" />
      <p className="max-w-full text-sm break-words text-grey-600">{label}</p>
    </div>
  );
}

const MEDIA_RATIO_CLASS: Record<ProductHeroMediaRatio, string> = {
  auto: "h-auto",
  video: "aspect-video object-cover",
  wide: "aspect-[16/10] object-cover",
  square: "aspect-square object-cover",
};

interface HeroMediaProps {
  media?: ProductHeroMedia;
  slot?: ReactNode;
  fallback?: ReactNode;
}

function HeroMedia({ media, slot, fallback }: HeroMediaProps) {
  const [failed, setFailed] = useState(false);

  if (slot) {
    return <div className="w-full min-w-0">{slot}</div>;
  }
  if (!media) return null;

  const missing = !media.src || failed;
  const placeholderLabel = media.alt || "Product example unavailable";

  return (
    <figure className="m-0 w-full min-w-0">
      {missing ? (
        (fallback ?? <MediaPlaceholder label={placeholderLabel} />)
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn(
            "w-full rounded-xl border border-surface-border bg-surface",
            MEDIA_RATIO_CLASS[media.aspectRatio ?? "auto"]
          )}
        />
      )}
      {media.caption && (
        <figcaption className="mt-3 text-sm break-words text-grey-600">{media.caption}</figcaption>
      )}
    </figure>
  );
}

/* ─── Loading skeleton ─────────────────────────────────────────────────── */

function HeroSkeleton({ withMedia }: { withMedia: boolean }) {
  return (
    <div
      className={cn(
        "grid w-full gap-10",
        withMedia && "@min-[1136px]:grid-cols-2 @min-[1136px]:items-center @min-[1136px]:gap-16"
      )}
      aria-hidden="true"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="h-5 w-32 max-w-full rounded-full bg-grey-200" />
        <div className="h-10 w-full rounded-lg bg-grey-200" />
        <div className="h-10 w-4/5 rounded-lg bg-grey-200" />
        <div className="mt-2 h-4 w-full rounded bg-grey-100" />
        <div className="h-4 w-11/12 rounded bg-grey-100" />
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="h-14 w-40 max-w-full rounded-lg bg-grey-200" />
          <div className="h-14 w-36 max-w-full rounded-lg bg-grey-100" />
        </div>
      </div>
      {withMedia && <div className="aspect-[16/10] w-full min-w-0 rounded-xl bg-grey-100" />}
    </div>
  );
}

/* ─── Block ────────────────────────────────────────────────────────────── */

/**
 * Product Hero — explains the product, shows a relevant example, and leads to a
 * primary next step.
 *
 * States: `default`, `loading`, `error`. An "empty" state is not meaningful (a
 * hero without a headline is not a hero); missing media degrades to a labelled
 * placeholder instead. No success state is manufactured — the block performs no
 * submission.
 */
export const ProductHeroBlock = forwardRef<HTMLElement, ProductHeroBlockProps>(
  (
    {
      eyebrow,
      eyebrowBadge,
      headline,
      description,
      headingLevel = "h1",
      primaryCta,
      secondaryCta,
      note,
      highlights,
      media,
      mediaSlot,
      mediaFallback,
      align = "start",
      state = "default",
      loadingLabel = "Loading product introduction",
      errorTitle = "We could not load this introduction",
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
    const HighlightHeading = nextHeadingLevel(headingLevel);
    const hasMedia = Boolean(mediaSlot || media);
    const centred = align === "center" && !hasMedia;

    const headingSize =
      headingLevel === "h1"
        ? "text-h3 @min-[600px]:text-h1 @min-[1136px]:text-display-sm"
        : "text-h4 @min-[600px]:text-h3 @min-[1136px]:text-h2";

    return (
      <section
        ref={ref}
        aria-labelledby={state === "loading" ? undefined : headingId}
        aria-label={state === "loading" ? loadingLabel : undefined}
        aria-busy={state === "loading" || undefined}
        className={cn("@container relative w-full", className)}
        {...rest}
      >
        <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-10 px-4 py-12 @min-[600px]:px-8 @min-[600px]:py-16 @min-[1136px]:py-20">
          {state === "loading" && (
            <>
              <p role="status" className="sr-only">
                {loadingLabel}
              </p>
              <HeroSkeleton withMedia={hasMedia} />
            </>
          )}

          {state === "error" && (
            <div
              role="alert"
              className="flex w-full min-w-0 flex-col items-start gap-4 rounded-xl border border-surface-border bg-surface px-5 py-6 @min-[600px]:px-8 @min-[600px]:py-10"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-action-danger-text">
                <Icon name="info-triangle" size="lg" aria-hidden="true" />
              </span>
              <Heading id={headingId} className="text-h5 font-semibold break-words text-grey-900">
                {errorTitle}
              </Heading>
              {errorDescription && (
                <p className="max-w-[60ch] text-base break-words text-grey-600">
                  {errorDescription}
                </p>
              )}
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={cn(CTA_BASE, CTA_TONE.secondary, "min-h-9 px-4 py-2 text-sm")}
                >
                  <Icon name="refresh" size="sm" className="shrink-0" aria-hidden="true" />
                  <span className="min-w-0">{retryLabel}</span>
                </button>
              )}
            </div>
          )}

          {state === "default" && (
            <div
              className={cn(
                "grid w-full gap-10",
                hasMedia &&
                  "@min-[1136px]:grid-cols-2 @min-[1136px]:items-center @min-[1136px]:gap-16"
              )}
            >
              <div
                className={cn(
                  "flex min-w-0 flex-col gap-5",
                  centred && "mx-auto max-w-[68ch] items-center text-center"
                )}
              >
                {(eyebrow || eyebrowBadge) && (
                  <p
                    className={cn(
                      "flex flex-wrap items-center gap-2 text-sm font-semibold break-words text-action-primary-text",
                      centred && "justify-center"
                    )}
                  >
                    {eyebrowBadge && (
                      <Badge color="orange" type="accent" size="md">
                        {eyebrowBadge}
                      </Badge>
                    )}
                    {eyebrow}
                  </p>
                )}

                <Heading
                  id={headingId}
                  className={cn(
                    "font-semibold break-words text-balance text-grey-900",
                    headingSize
                  )}
                >
                  {headline}
                </Heading>

                {description && (
                  <p
                    className={cn(
                      "max-w-[60ch] text-base break-words text-grey-600 @min-[600px]:text-body-lg",
                      centred && "mx-auto"
                    )}
                  >
                    {description}
                  </p>
                )}

                {(primaryCta || secondaryCta) && (
                  <div
                    className={cn(
                      "mt-1 flex w-full min-w-0 flex-col gap-3 @min-[600px]:flex-row @min-[600px]:flex-wrap @min-[600px]:items-center",
                      centred && "@min-[600px]:justify-center"
                    )}
                  >
                    {primaryCta && <HeroCta cta={primaryCta} tone="primary" />}
                    {secondaryCta && <HeroCta cta={secondaryCta} tone="secondary" />}
                  </div>
                )}

                {note && <p className="text-sm break-words text-grey-500">{note}</p>}

                {highlights && highlights.length > 0 && (
                  <ul
                    className={cn(
                      "mt-3 flex list-none flex-col gap-4 p-0 @min-[600px]:flex-row @min-[600px]:flex-wrap @min-[600px]:gap-8",
                      centred && "@min-[600px]:justify-center"
                    )}
                  >
                    {highlights.map((highlight) => (
                      <li key={highlight.id} className="flex min-w-0 items-start gap-2">
                        {highlight.icon && (
                          <Icon
                            name={highlight.icon}
                            size="md"
                            className="mt-0.5 shrink-0 text-action-primary-text"
                            aria-hidden="true"
                          />
                        )}
                        <span className="flex min-w-0 flex-col">
                          {highlight.value !== undefined && (
                            <HighlightHeading className="text-h6 font-semibold break-words text-grey-900">
                              {highlight.value}
                            </HighlightHeading>
                          )}
                          <span className="text-sm break-words text-grey-600">
                            {highlight.label}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {hasMedia && <HeroMedia media={media} slot={mediaSlot} fallback={mediaFallback} />}
            </div>
          )}
        </div>
      </section>
    );
  }
);

ProductHeroBlock.displayName = "ProductHeroBlock";
