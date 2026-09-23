import { useId, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type CommerceHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export interface CommerceImage {
  src: string;
  alt: string;
}
export interface CommerceProduct {
  id: string;
  name: string;
  description?: string;
  category?: string;
  /** Non-negative integer in the currency's minor unit (pence for GBP, yen for JPY). */
  price: number;
  image?: CommerceImage;
  href?: string;
  badge?: string;
  /** Omit for unlimited availability. Zero means sold out. */
  stock?: number;
}
export interface CommerceCartItem extends CommerceProduct {
  /** A unique cart-line id, including variant when applicable. */
  id: string;
  quantity: number;
  variant?: string;
}
export interface CommerceBaseProps {
  title?: string;
  description?: string;
  headingLevel?: CommerceHeadingLevel;
  className?: string;
  /** ISO 4217 currency shared by every price in this block. @default "GBP" */
  currency?: string;
  /** Explicit default keeps server and client formatting consistent. @default "en-GB" */
  locale?: string;
}
export const commerceControl =
  "cursor-pointer min-h-11 rounded-lg border border-surface-border-strong bg-surface px-3 py-2 text-base text-grey-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary motion-safe:transition-colors motion-safe:duration-150 hover:border-grey-500 disabled:cursor-not-allowed disabled:opacity-50";
export const commerceAction =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-action-primary px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50";

export function formatCommerceMoney(amount: number, currency = "GBP", locale = "en-GB") {
  const format = new Intl.NumberFormat(locale, { style: "currency", currency });
  const digits = format.resolvedOptions().maximumFractionDigits ?? 2;
  return format.format(amount / 10 ** digits);
}
export function CommerceHeading({
  title,
  description,
  headingLevel: Heading = "h2",
  id,
}: CommerceBaseProps & { id?: string }) {
  return (
    <header className="space-y-3">
      <Heading
        id={id}
        className="max-w-[20ch] text-[clamp(1.75rem,4cqi,2.75rem)] leading-[1.12] font-semibold tracking-[-0.035em]"
      >
        {title}
      </Heading>
      {description && (
        <p className="max-w-[56ch] text-base leading-relaxed text-grey-600">{description}</p>
      )}
    </header>
  );
}
export function CommerceFrame({
  title,
  description,
  headingLevel,
  className,
  children,
  busy,
}: CommerceBaseProps & { children: ReactNode; busy?: boolean }) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      aria-busy={busy || undefined}
      className={cn(
        "@container min-w-0 w-full bg-surface text-grey-900 [overflow-wrap:anywhere]",
        className
      )}
    >
      <div className="mb-8 @min-[760px]:mb-10">
        <CommerceHeading
          id={id}
          title={title}
          description={description}
          headingLevel={headingLevel}
        />
      </div>
      {children}
    </section>
  );
}
export function CommercePhoto({
  image,
  className,
  priority = false,
}: {
  image?: CommerceImage;
  className?: string;
  priority?: boolean;
}) {
  return image ? (
    <img
      src={image.src}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      width={640}
      height={640}
      className={cn("aspect-square w-full rounded-lg bg-surface-muted object-cover", className)}
    />
  ) : (
    <div
      role="img"
      aria-label="Product image unavailable"
      className={cn(
        "flex aspect-square items-center justify-center rounded-xl bg-surface-muted p-4 text-center text-sm text-grey-600",
        className
      )}
    >
      Image unavailable
    </div>
  );
}
export function CommerceQuantity({
  name,
  quantity,
  max,
  disabled,
  onChange,
}: {
  name: string;
  quantity: number;
  max?: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Quantity for ${name}`}
      className="inline-flex shrink-0 items-center rounded-lg border border-surface-border-strong bg-surface"
    >
      <button
        type="button"
        aria-label={`Decrease quantity for ${name}`}
        disabled={disabled || quantity <= 1}
        className={cn(commerceControl, "w-11 border-0 bg-transparent px-0 hover:bg-surface-muted")}
        onClick={() => onChange(quantity - 1)}
      >
        −
      </button>
      <output aria-label={`Quantity for ${name}`} className="min-w-7 px-1 text-center tabular-nums">
        {quantity}
      </output>
      <button
        type="button"
        aria-label={`Increase quantity for ${name}`}
        disabled={disabled || quantity >= (max ?? 99)}
        className={cn(commerceControl, "w-11 border-0 bg-transparent px-0 hover:bg-surface-muted")}
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
export interface CommerceTotalsProps {
  /** All amounts use the same minor currency unit as item prices. */
  shipping?: number;
  tax?: number;
  discount?: number;
}
export function CommerceTotals({
  items,
  shipping = 0,
  tax = 0,
  discount = 0,
  currency,
  locale,
}: CommerceTotalsProps &
  Pick<CommerceBaseProps, "currency" | "locale"> & { items: CommerceCartItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shipping + tax - discount);
  const rows = [
    ["Subtotal", subtotal],
    ["Delivery", shipping],
    ["Tax", tax],
    ...(discount ? [["Discount", -discount]] : []),
    ["Total", total],
  ] as [string, number][];
  return (
    <dl className="space-y-3 text-sm">
      {rows.map(([label, amount]) => (
        <div
          key={label}
          className={cn(
            "flex items-baseline justify-between gap-4",
            label === "Total" && "border-t border-surface-border-strong pt-5 text-xl font-semibold"
          )}
        >
          <dt>{label}</dt>
          <dd className="text-right tabular-nums">
            {formatCommerceMoney(amount, currency, locale)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
