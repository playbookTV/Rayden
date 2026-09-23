import { Button } from "../components/Button";
import { type ReactNode } from "react";
import {
  CommerceFrame,
  CommerceTotals,
  CommercePhoto,
  commerceControl,
  formatCommerceMoney,
  type CommerceBaseProps,
  type CommerceCartItem,
  type CommerceTotalsProps,
} from "./commerce";

export interface CheckoutReviewBlockProps extends CommerceBaseProps, CommerceTotalsProps {
  items: CommerceCartItem[];
  /** Display only. Collect and validate the address in the host application. */
  deliveryAddress: string[];
  deliveryMethod: string;
  /** Display only, e.g. "Visa ending in 4242". Never pass full payment credentials. */
  paymentSummary: string;
  onEditDelivery?: () => void;
  onEditPayment?: () => void;
  onEditCart?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  pending?: boolean;
  errorMessage?: string;
  /** Render only after the host application confirms a successful order. */
  confirmation?: { title: string; description?: string; reference?: string };
  terms?: ReactNode;
  totalsNote?: string;
}
export function CheckoutReviewBlock({
  title = "Review your order",
  description = "Check the details before placing your order.",
  items,
  deliveryAddress,
  deliveryMethod,
  paymentSummary,
  onEditDelivery,
  onEditPayment,
  onEditCart,
  onConfirm,
  confirmLabel = "Place order",
  pending = false,
  errorMessage,
  confirmation,
  terms,
  totalsNote,
  shipping,
  tax,
  discount,
  currency,
  locale,
  ...frame
}: CheckoutReviewBlockProps) {
  const canConfirm =
    items.length > 0 &&
    deliveryAddress.some((line) => line.trim()) &&
    deliveryMethod.trim() &&
    paymentSummary.trim() &&
    items.every(
      (item) =>
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= (item.stock ?? Infinity)
    );
  return (
    <CommerceFrame
      {...frame}
      title={confirmation?.title ?? title}
      description={confirmation ? confirmation.description : description}
      busy={pending}
    >
      {confirmation ? (
        <div role="status" className="rounded-2xl bg-surface-muted p-6">
          <p className="font-medium">{confirmation.title}</p>
          {confirmation.reference && (
            <p className="mt-2 text-sm text-grey-600">Order reference: {confirmation.reference}</p>
          )}
        </div>
      ) : (
        <div className="grid items-start gap-8 @min-[760px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] @min-[960px]:gap-14">
          <div className="min-w-0 space-y-6">
            <div className="border-b border-surface-border pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-semibold tracking-tight">Delivery details</p>
                {onEditDelivery && (
                  <button
                    type="button"
                    disabled={pending}
                    className={`${commerceControl} border-transparent bg-transparent px-2 text-sm underline underline-offset-4 hover:border-transparent`}
                    onClick={onEditDelivery}
                  >
                    Edit delivery
                  </button>
                )}
              </div>
              <address className="mt-3 text-sm leading-relaxed not-italic text-grey-600">
                {deliveryAddress.map((line, i) => (
                  <span className="block" key={i}>
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-3 text-sm">{deliveryMethod}</p>
            </div>
            <div className="border-b border-surface-border pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-semibold tracking-tight">Payment method</p>
                {onEditPayment && (
                  <button
                    type="button"
                    disabled={pending}
                    className={`${commerceControl} border-transparent bg-transparent px-2 text-sm underline underline-offset-4 hover:border-transparent`}
                    onClick={onEditPayment}
                  >
                    Edit payment
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm text-grey-600">{paymentSummary}</p>
            </div>
            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">Items in your order</p>
                {onEditCart && (
                  <button
                    type="button"
                    disabled={pending}
                    className={`${commerceControl} border-transparent bg-transparent px-2 text-sm underline underline-offset-4 hover:border-transparent`}
                    onClick={onEditCart}
                  >
                    Edit bag
                  </button>
                )}
              </div>
              <ul className="divide-y divide-surface-border">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 py-4 text-sm"
                  >
                    <CommercePhoto image={item.image} className="rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="mt-1 text-grey-600">
                        {item.variant ? `${item.variant} · ` : ""}Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-right tabular-nums">
                      {formatCommerceMoney(item.price * item.quantity, currency, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface-muted p-5 @min-[440px]:p-6">
            <p className="mb-6 text-lg font-semibold tracking-tight">Order total</p>
            <CommerceTotals
              items={items}
              shipping={shipping}
              tax={tax}
              discount={discount}
              currency={currency}
              locale={locale}
            />
            {totalsNote && <p className="mt-4 text-sm text-grey-600">{totalsNote}</p>}
            {terms && <div className="mt-5 text-sm leading-relaxed text-grey-600">{terms}</div>}
            {errorMessage && (
              <p role="alert" className="mt-4 text-sm text-error-700">
                {errorMessage}
              </p>
            )}
            {!canConfirm && (
              <p role="status" className="mt-4 text-sm text-error-700">
                Add available items and complete the delivery and payment details to continue.
              </p>
            )}
            {onConfirm && (
              <Button
                disabled={pending || !canConfirm}
                className="mt-6 h-auto min-h-12 w-full whitespace-normal"
                onClick={onConfirm}
              >
                {pending ? "Placing order…" : confirmLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </CommerceFrame>
  );
}
