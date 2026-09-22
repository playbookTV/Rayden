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

export type SiteFooterHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

/* ─── Content types ────────────────────────────────────────────────────── */

export interface SiteFooterLink {
  id: string;
  label: string;
  /** Destination. Footer entries are destinations, so they are always links. */
  href: string;
  /** Opens in a new tab and adds rel="noreferrer" plus a visually hidden note. */
  external?: boolean;
  /** Short qualifier, e.g. "New". */
  badge?: string;
  /** Optional analytics hook. Navigation still belongs to the anchor. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface SiteFooterLinkGroup {
  id: string;
  /** Group heading, e.g. "Product". */
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterSocialLink {
  id: string;
  /** Accessible name, e.g. "Citrionus on LinkedIn". */
  label: string;
  href: string;
  /** Library icon. Ignored when `artwork` is supplied. */
  icon?: IconName;
  /**
   * Authentic platform artwork. Brand marks are deliberately exempt from theme
   * roles, so they are supplied by the consumer rather than recoloured here.
   */
  artwork?: ReactNode;
  /** @default true */
  external?: boolean;
}

export interface SiteFooterLocaleOption {
  value: string;
  label: string;
}

export interface SiteFooterLocaleControl {
  id: string;
  /** Visible label, e.g. "Language". */
  label: string;
  /** Current value. The consuming application owns persistence. */
  value: string;
  options: SiteFooterLocaleOption[];
  /** Required: a control with no configured handler is never rendered. */
  onChange: (value: string) => void;
  /** Small print under the control. */
  hint?: string;
}

export interface SiteFooterBrand {
  /** Logo element. Supplied by the consumer so brand artwork stays authentic. */
  logo?: ReactNode;
  /** Wordmark text. Rendered when `logo` is absent. */
  name?: ReactNode;
  description?: ReactNode;
  /** Makes the logo/wordmark a link to the site root. */
  href?: string;
}

export interface SiteFooterBlockProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Accessible name for the `contentinfo` landmark. Distinguishes this footer
   * from any other on the page. @default "Site footer"
   */
  label?: string;
  brand?: SiteFooterBrand;
  /** Grouped destinations. Each group becomes a named navigation landmark. */
  groups?: SiteFooterLinkGroup[];
  /** @default "h2" — used for every group heading. */
  groupHeadingLevel?: SiteFooterHeadingLevel;
  social?: SiteFooterSocialLink[];
  /** Accessible name for the social link list. @default "Social media" */
  socialLabel?: string;
  /** Copyright or company registration text. */
  copyright?: ReactNode;
  /** Privacy, terms, and similar destinations. */
  legalLinks?: SiteFooterLink[];
  /** Accessible name for the legal link list. @default "Legal" */
  legalLabel?: string;
  /** Language, region, or currency switchers. */
  localeControls?: SiteFooterLocaleControl[];
  /** Extra content above the bottom bar, e.g. a compliance statement. */
  children?: ReactNode;
  className?: string;
}

/* ─── Appearance ───────────────────────────────────────────────────────── */

const LINK_CLASS =
  "inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded text-sm break-words text-grey-600 no-underline hover:text-grey-900 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text";

/* Two columns below about 420px leaves roughly 130px per link, which forces long
   compound words to break mid-word. Start at one column and add the second only
   once the container can hold a full word. */
const GROUP_COLUMN_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 @min-[420px]:grid-cols-2",
  3: "grid-cols-1 @min-[420px]:grid-cols-2 @min-[600px]:grid-cols-3",
  4: "grid-cols-1 @min-[420px]:grid-cols-2 @min-[600px]:grid-cols-3 @min-[1136px]:grid-cols-4",
  5: "grid-cols-1 @min-[420px]:grid-cols-2 @min-[600px]:grid-cols-3 @min-[1136px]:grid-cols-5",
};

function FooterLinkAnchor({ link, className }: { link: SiteFooterLink; className?: string }) {
  const externalAttributes: AnchorHTMLAttributes<HTMLAnchorElement> = link.external
    ? { target: "_blank", rel: "noreferrer" }
    : {};
  return (
    <a
      href={link.href}
      onClick={link.onClick}
      className={cn(LINK_CLASS, className)}
      {...externalAttributes}
    >
      <span className="min-w-0">{link.label}</span>
      {link.badge && (
        <Badge color="orange" type="accent" size="sm">
          {link.badge}
        </Badge>
      )}
      {link.external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}

/**
 * A native select is used deliberately. It keeps the control usable at 320px,
 * gives the platform picker on touch devices, and follows the semantic
 * `--color-surface` role so a consumer theme reaches it.
 */
function LocaleSelect({ control }: { control: SiteFooterLocaleControl }) {
  const selectId = useId();
  const hintId = useId();

  return (
    <div className="flex w-full min-w-0 max-w-[240px] flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium break-words text-grey-700">
        {control.label}
      </label>
      <div className="relative w-full min-w-0">
        <select
          id={selectId}
          value={control.value}
          aria-describedby={control.hint ? hintId : undefined}
          onChange={(event) => control.onChange(event.target.value)}
          className="h-11 w-full min-w-0 cursor-pointer appearance-none truncate rounded-md border border-grey-500 bg-surface py-2 pr-10 pl-3 text-sm text-grey-900 transition-colors hover:border-grey-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
        >
          {control.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size="md"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-grey-500"
        />
      </div>
      {control.hint && (
        <p id={hintId} className="text-xs break-words text-grey-500">
          {control.hint}
        </p>
      )}
    </div>
  );
}

/* ─── Block ────────────────────────────────────────────────────────────── */

/**
 * Site Footer — browse grouped site links, legal information, social
 * destinations, and locale controls.
 *
 * Only a default state is meaningful: the footer presents destinations the
 * consuming application already knows. There is nothing to load, submit, or
 * confirm, so no loading, error, or success state is offered. Every section is
 * optional; omitting one removes it rather than rendering an empty shell. A
 * locale control requires an `onChange` handler, so the footer can never render
 * a switcher that does nothing.
 */
export const SiteFooterBlock = forwardRef<HTMLElement, SiteFooterBlockProps>(
  (
    {
      label = "Site footer",
      brand,
      groups,
      groupHeadingLevel = "h2",
      social,
      socialLabel = "Social media",
      copyright,
      legalLinks,
      legalLabel = "Legal",
      localeControls,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const groupIdPrefix = useId();
    const GroupHeading = groupHeadingLevel;

    const groupList = groups ?? [];
    const socialList = social ?? [];
    const localeList = localeControls ?? [];
    const legalList = legalLinks ?? [];

    const hasTop = Boolean(brand) || groupList.length > 0;
    const hasBottom =
      Boolean(copyright) || legalList.length > 0 || socialList.length > 0 || localeList.length > 0;

    const brandBody = brand && (
      <>
        {brand.logo ??
          (brand.name && (
            <span className="text-body-lg font-semibold break-words text-grey-900">
              {brand.name}
            </span>
          ))}
      </>
    );

    return (
      <footer
        ref={ref}
        aria-label={label}
        className={cn(
          "@container relative w-full border-t border-surface-border-strong bg-surface-muted",
          className
        )}
        {...rest}
      >
        <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-10 px-4 py-10 @min-[600px]:px-8 @min-[600px]:py-14">
          {hasTop && (
            <div className="flex min-w-0 flex-col gap-10 @min-[1136px]:flex-row @min-[1136px]:gap-16">
              {brand && (
                <div className="flex min-w-0 flex-col gap-3 @min-[1136px]:max-w-[300px] @min-[1136px]:shrink-0">
                  {brand.href ? (
                    <a
                      href={brand.href}
                      className="inline-flex max-w-full items-center gap-2 rounded no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text"
                    >
                      {brandBody}
                    </a>
                  ) : (
                    <div className="inline-flex max-w-full items-center gap-2">{brandBody}</div>
                  )}
                  {brand.description && (
                    <p className="max-w-[46ch] text-sm break-words text-grey-600">
                      {brand.description}
                    </p>
                  )}
                </div>
              )}

              {groupList.length > 0 && (
                <div
                  className={cn(
                    "grid min-w-0 gap-x-6 gap-y-8 @min-[1136px]:flex-1",
                    GROUP_COLUMN_CLASS[Math.min(Math.max(groupList.length, 1), 5)]
                  )}
                >
                  {groupList.map((group) => {
                    const headingId = `${groupIdPrefix}-${group.id}`;
                    return (
                      <nav
                        key={group.id}
                        aria-labelledby={headingId}
                        className="flex min-w-0 flex-col gap-3"
                      >
                        <GroupHeading
                          id={headingId}
                          className="text-sm font-semibold break-words text-grey-900"
                        >
                          {group.title}
                        </GroupHeading>
                        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                          {group.links.map((link) => (
                            <li key={link.id} className="min-w-0">
                              <FooterLinkAnchor link={link} />
                            </li>
                          ))}
                        </ul>
                      </nav>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {localeList.length > 0 && (
            <div className="flex min-w-0 flex-col gap-4 border-t border-surface-border pt-8 @min-[600px]:flex-row @min-[600px]:flex-wrap @min-[600px]:gap-6">
              {localeList.map((control) => (
                <LocaleSelect key={control.id} control={control} />
              ))}
            </div>
          )}

          {children && <div className="min-w-0">{children}</div>}

          {hasBottom && (
            <div className="flex min-w-0 flex-col gap-5 border-t border-surface-border pt-8 @min-[600px]:flex-row @min-[600px]:flex-wrap @min-[600px]:items-center @min-[600px]:justify-between">
              <div className="flex min-w-0 flex-col gap-3">
                {copyright && <p className="text-sm break-words text-grey-600">{copyright}</p>}
                {legalList.length > 0 && (
                  <nav aria-label={legalLabel} className="min-w-0">
                    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
                      {legalList.map((link) => (
                        <li key={link.id} className="min-w-0">
                          <FooterLinkAnchor link={link} />
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>

              {socialList.length > 0 && (
                <nav aria-label={socialLabel} className="min-w-0">
                  <ul className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                    {socialList.map((entry) => {
                      const isExternal = entry.external !== false;
                      const visual =
                        entry.artwork ??
                        (entry.icon && <Icon name={entry.icon} size="md" aria-hidden="true" />);
                      return (
                        <li key={entry.id} className="min-w-0">
                          <a
                            href={entry.href}
                            aria-label={visual ? entry.label : undefined}
                            className={cn(
                              "inline-flex min-h-11 min-w-11 max-w-full items-center justify-center gap-2 rounded-lg border border-transparent px-2 text-grey-600 no-underline transition-colors hover:border-surface-border-strong hover:bg-surface hover:text-grey-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary-text",
                              !visual && "text-sm font-medium break-words"
                            )}
                            {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                          >
                            {visual ?? <span className="min-w-0">{entry.label}</span>}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </footer>
    );
  }
);

SiteFooterBlock.displayName = "SiteFooterBlock";
