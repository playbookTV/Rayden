import { Button } from "../components/Button";
import { cn } from "../utils/cn";
import {
  CommerceFrame,
  CommercePhoto,
  CommerceQuantity,
  CommerceTotals,
  commerceControl,
  formatCommerceMoney,
  type CommerceBaseProps,
  type CommerceCartItem,
  type CommerceTotalsProps,
} from "./commerce";

export interface ShoppingCartBlockProps extends CommerceBaseProps, CommerceTotalsProps {
  items: CommerceCartItem[];
  /** Stacked keeps the summary below the items, including in a drawer. */
  layout?: "split" | "stacked";
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  pending?: boolean;
  errorMessage?: string;
  /** Clarifies whether shipping and tax are estimates or final. */
  totalsNote?: string;
}
export function ShoppingCartBlock({
  title = "Your bag",
  description,
  items,
  layout = "split",
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
  pending = false,
  errorMessage,
  totalsNote,
  shipping,
  tax,
  discount,
  currency,
  locale,
  ...frame
}: ShoppingCartBlockProps) {
  const unavailable = items.some(
    (item) =>
      item.quantity < 1 ||
      !Number.isInteger(item.quantity) ||
      item.quantity > (item.stock ?? Infinity)
  );
  return (
    <CommerceFrame {...frame} title={title} description={description} busy={pending}>
      {errorMessage && (
        <p role="alert" className="mb-4 text-sm text-error-700">
          {errorMessage}
        </p>
      )}
      {items.length === 0 ? (
        <div className="border-y border-surface-border px-4 py-12">
          <p className="text-lg font-medium">Your bag is empty</p>
          <p className="mt-2 text-sm text-grey-600">Find something you’ll enjoy every day.</p>
          {onContinueShopping && (
            <Button className="mt-6 h-auto min-h-11" onClick={onContinueShopping}>
              Explore the collection
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "grid items-start gap-8",
            layout === "split" &&
              "@min-[760px]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] @min-[960px]:gap-14"
          )}
        >
          <ul className="divide-y divide-surface-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 py-6 first:pt-0 @min-[460px]:grid-cols-[120px_minmax(0,1fr)]"
              >
                <CommercePhoto image={item.image} />
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.variant && <p className="mt-1 text-sm text-grey-600">{item.variant}</p>}
                      <p className="mt-1 text-sm text-grey-600">
                        {formatCommerceMoney(item.price, currency, locale)} each
                      </p>
                    </div>
                    <p className="font-semibold tabular-nums">
                      {formatCommerceMoney(item.price * item.quantity, currency, locale)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {onQuantityChange ? (
                      <CommerceQuantity
                        name={item.name + (item.variant ? `, ${item.variant}` : "")}
                        quantity={item.quantity}
                        max={item.stock}
                        disabled={pending}
                        onChange={(quantity) => onQuantityChange(item.id, quantity)}
                      />
                    ) : (
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    )}
                    {onRemoveItem && (
                      <button
                        type="button"
                        disabled={pending}
                        className={`${commerceControl} border-transparent bg-transparent px-2 text-sm text-grey-600 underline underline-offset-4 hover:border-transparent hover:text-grey-900`}
                        aria-label={`Remove ${item.name}${item.variant ? `, ${item.variant}` : ""}`}
                        onClick={() => onRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {item.quantity > (item.stock ?? Infinity) && (
                    <p className="text-sm text-error-700">
                      {item.stock === 0
                        ? "This item is no longer available. Remove it to continue."
                        : `Only ${item.stock} available. Please reduce the quantity.`}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-surface-border bg-surface-muted p-5 @min-[440px]:p-6">
            <p className="mb-6 text-lg font-semibold tracking-tight">Order summary</p>
            <CommerceTotals
              items={items}
              shipping={shipping}
              tax={tax}
              discount={discount}
              currency={currency}
              locale={locale}
            />
            {totalsNote && (
              <p className="mt-4 text-sm leading-relaxed text-grey-600">{totalsNote}</p>
            )}
            {onCheckout && (
              <Button
                className="mt-6 h-auto min-h-12 w-full whitespace-normal"
                disabled={pending || unavailable}
                onClick={onCheckout}
              >
                {pending ? "Updating bag…" : "Review checkout"}
              </Button>
            )}
            {unavailable && (
              <p role="status" className="mt-3 text-sm text-error-700">
                Update the unavailable quantities before checkout.
              </p>
            )}
            {onContinueShopping && (
              <button
                type="button"
                disabled={pending}
                className={`${commerceControl} mt-3 w-full border-transparent bg-transparent text-sm hover:border-transparent hover:underline`}
                onClick={onContinueShopping}
              >
                Continue shopping
              </button>
            )}
          </div>
        </div>
      )}
    </CommerceFrame>
  );
}
