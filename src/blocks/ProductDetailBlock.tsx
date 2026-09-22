import { useId, useState } from "react";
import { Button } from "../components/Button";
import { cn } from "../utils/cn";
import {
  CommerceHeading,
  CommercePhoto,
  CommerceQuantity,
  commerceControl,
  formatCommerceMoney,
  type CommerceBaseProps,
  type CommerceProduct,
  type CommerceImage,
} from "./commerce";

export interface ProductDetailOption {
  id: string;
  label: string;
  /** Additional stock limit for this option. */ stock?: number;
}
export interface ProductDetailSelection {
  product: CommerceProduct;
  option?: ProductDetailOption;
  quantity: number;
}
export interface ProductDetailBlockProps extends CommerceBaseProps {
  product: CommerceProduct;
  /** Ordered gallery; falls back to the product image. */
  images?: CommerceImage[];
  /** Stacked is useful for a quick-view panel or a narrow product page. */
  layout?: "split" | "stacked";
  options?: ProductDetailOption[];
  optionLabel?: string;
  details?: { label: string; value: string }[];
  onAddToCart?: (selection: ProductDetailSelection) => void;
  pending?: boolean;
  errorMessage?: string;
  /** Supplied after the host app confirms the cart update. */
  successMessage?: string;
  deliveryNote?: string;
}
/** Reset the selection when switching products. */
export function ProductDetailBlock(props: ProductDetailBlockProps) {
  return <ProductDetailView key={props.product.id} {...props} />;
}
function ProductDetailView({
  product,
  title = product.name,
  description = product.description,
  images,
  layout = "split",
  options = [],
  optionLabel = "Finish",
  details = [],
  onAddToCart,
  pending = false,
  errorMessage,
  successMessage,
  deliveryNote,
  currency,
  locale,
  headingLevel,
  className,
}: ProductDetailBlockProps) {
  const id = useId();
  const [optionId, setOptionId] = useState(
    options.find((o) => o.stock !== 0)?.id ?? options[0]?.id
  );
  const [requestedQuantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const gallery = images?.length ? images : product.image ? [product.image] : [];
  const activeImage = Math.min(imageIndex, Math.max(0, gallery.length - 1));
  const option =
    options.find((o) => o.id === optionId) ?? options.find((o) => o.stock !== 0) ?? options[0];
  const stock = Math.min(product.stock ?? 99, option?.stock ?? 99);
  const quantity = Math.max(1, Math.min(requestedQuantity, stock));
  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-busy={pending || undefined}
      className={cn(
        "@container w-full min-w-0 bg-surface text-grey-900 [overflow-wrap:anywhere]",
        className
      )}
    >
      <div
        className={cn(
          "grid items-start gap-8",
          layout === "split" &&
            "@min-[700px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @min-[900px]:gap-14"
        )}
      >
        <div className="min-w-0 space-y-3">
          <CommercePhoto image={gallery[activeImage]} priority className="aspect-[4/5]" />
          {gallery.length > 1 && (
            <div
              role="group"
              aria-label={`Images of ${product.name}`}
              className="flex flex-wrap gap-3"
            >
              {gallery.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  aria-label={`View image ${index + 1}: ${image.alt}`}
                  aria-pressed={index === activeImage}
                  onClick={() => setImageIndex(index)}
                  className={cn(
                    "w-16 cursor-pointer rounded-lg border-2 p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary",
                    index === activeImage
                      ? "border-action-primary"
                      : "border-transparent hover:border-surface-border-strong"
                  )}
                >
                  <CommercePhoto image={{ ...image, alt: "" }} className="rounded" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="min-w-0 @min-[700px]:py-2">
          {product.category && (
            <p className="mb-4 text-sm font-medium text-grey-600">{product.category}</p>
          )}
          <CommerceHeading
            id={`${id}-title`}
            title={title}
            description={description}
            headingLevel={headingLevel}
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-6">
            <p className="text-2xl font-medium tracking-tight tabular-nums">
              {formatCommerceMoney(product.price, currency, locale)}
            </p>
            <p className="flex items-center gap-2 text-sm text-grey-600">
              <span
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", stock ? "bg-success-700" : "bg-grey-500")}
              />
              {stock === 0 ? "Currently sold out" : "Available to order"}
            </p>
          </div>
          {options.length > 0 && (
            <fieldset disabled={pending} className="mt-6 space-y-3">
              <legend className="text-sm font-semibold">
                {optionLabel}
                {option && (
                  <span aria-hidden="true" className="font-normal text-grey-600">
                    {" "}
                    · {option.label}
                  </span>
                )}
              </legend>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                  <label
                    key={o.id}
                    className={`${commerceControl} inline-flex items-center gap-2 has-[:checked]:border-action-primary has-[:checked]:bg-surface-muted has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50`}
                  >
                    <input
                      type="radio"
                      name={`${id}-option`}
                      value={o.id}
                      checked={option?.id === o.id}
                      disabled={o.stock === 0}
                      onChange={() => {
                        setOptionId(o.id);
                        setQuantity(1);
                      }}
                      className="accent-action-primary"
                    />
                    {o.label}
                    {o.stock === 0 && " · Sold out"}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {onAddToCart && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold">Quantity</p>
              <div className="flex flex-wrap gap-3">
                <CommerceQuantity
                  name={product.name}
                  quantity={quantity}
                  max={stock}
                  disabled={pending || stock === 0}
                  onChange={setQuantity}
                />
                <Button
                  disabled={pending || stock === 0}
                  className="h-auto min-h-12 min-w-[140px] flex-1 whitespace-normal"
                  onClick={() => onAddToCart({ product, option, quantity })}
                >
                  {pending ? "Adding…" : stock === 0 ? "Sold out" : "Add to bag"}
                </Button>
              </div>
            </div>
          )}
          {errorMessage && (
            <p role="alert" className="mt-4 text-sm text-error-700">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p role="status" className="mt-4 text-sm text-success-700">
              {successMessage}
            </p>
          )}
          {deliveryNote && (
            <p className="mt-6 border-y border-surface-border py-5 text-sm leading-relaxed text-grey-600">
              {deliveryNote}
            </p>
          )}
          {details.length > 0 && (
            <details className="mt-4" open>
              <summary className="flex min-h-11 cursor-pointer items-center justify-between rounded text-sm font-semibold focus-visible:outline-2 focus-visible:outline-action-primary">
                Product details <span aria-hidden="true">↕</span>
              </summary>
              <dl className="space-y-3 py-3 text-sm">
                {details.map((detail) => (
                  <div key={detail.label} className="grid grid-cols-2 gap-4">
                    <dt className="text-grey-600">{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
