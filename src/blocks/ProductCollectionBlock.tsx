import { useId, useState } from "react";
import { Button } from "../components/Button";
import { cn } from "../utils/cn";
import {
  CommerceFrame,
  CommercePhoto,
  commerceControl,
  formatCommerceMoney,
  type CommerceBaseProps,
  type CommerceProduct,
  type CommerceHeadingLevel,
} from "./commerce";

export interface ProductCollectionBlockProps extends CommerceBaseProps {
  products: CommerceProduct[];
  /** Grid is image-led; list is a compact horizontal catalogue. */
  layout?: "grid" | "list";
  onSelectProduct?: (product: CommerceProduct) => void;
  /** Omit to hide quick-add. Products requiring options should open detail first. */
  onAddToCart?: (product: CommerceProduct) => void;
  pendingProductIds?: string[];
  status?: "ready" | "loading" | "error";
  errorMessage?: string;
  onRetry?: () => void;
  emptyMessage?: string;
}
export function ProductCollectionBlock({
  title = "Thoughtful everyday essentials",
  description,
  products,
  layout = "grid",
  onSelectProduct,
  onAddToCart,
  pendingProductIds = [],
  status = "ready",
  errorMessage = "We couldn’t load the collection.",
  onRetry,
  emptyMessage = "No products are available yet.",
  currency,
  locale,
  ...frame
}: ProductCollectionBlockProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("featured");
  const ProductHeading =
    `h${Math.min(Number((frame.headingLevel ?? "h2").slice(1)) + 1, 6)}` as CommerceHeadingLevel;
  const categories = [...new Set(products.flatMap((p) => (p.category ? [p.category] : [])))];
  const currentCategory = categories.includes(category) ? category : "";
  const visible = products.filter(
    (p) =>
      (!currentCategory || p.category === currentCategory) &&
      `${p.name} ${p.description ?? ""}`
        .toLocaleLowerCase(locale ?? "en-GB")
        .includes(query.trim().toLocaleLowerCase(locale ?? "en-GB"))
  );
  if (sort !== "featured")
    visible.sort((a, b) => (sort === "price-low" ? a.price - b.price : b.price - a.price));
  return (
    <CommerceFrame {...frame} title={title} description={description} busy={status === "loading"}>
      {status === "loading" ? (
        <p role="status" className="border-y border-surface-border py-12 text-grey-600">
          Loading collection…
        </p>
      ) : status === "error" ? (
        <div role="alert" className="space-y-4">
          <p>{errorMessage}</p>
          {onRetry && (
            <Button className="h-auto min-h-11" variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-2 items-end gap-3 border-y border-surface-border py-4 @min-[640px]:grid-cols-[minmax(160px,1fr)_minmax(140px,180px)_minmax(140px,180px)]">
            <label
              htmlFor={`${id}-search`}
              className="col-span-2 flex min-w-0 flex-col gap-2 text-sm text-grey-600 @min-[640px]:col-span-1"
            >
              Search products
              <input
                id={`${id}-search`}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find your next favourite"
                className={cn(commerceControl, "w-full cursor-text")}
              />
            </label>
            <label
              htmlFor={`${id}-category`}
              className="flex min-w-0 flex-col gap-2 text-sm text-grey-600"
            >
              Category
              <select
                id={`${id}-category`}
                value={currentCategory}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(commerceControl, "w-full text-sm")}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label
              htmlFor={`${id}-sort`}
              className="flex min-w-0 flex-col gap-2 text-sm text-grey-600"
            >
              Sort by
              <select
                id={`${id}-sort`}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={cn(commerceControl, "w-full text-sm")}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>
          <p role="status" className="mb-5 text-sm text-grey-600">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </p>
          {visible.length ? (
            <ul
              className={cn(
                layout === "grid"
                  ? "grid gap-x-4 gap-y-8 @min-[300px]:grid-cols-2 @min-[880px]:grid-cols-4 @min-[760px]:gap-x-6"
                  : "divide-y divide-surface-border"
              )}
            >
              {visible.map((product) => {
                const productId = `${id}-${product.id}`;
                const visual = (
                  <div className="relative overflow-hidden rounded-lg">
                    <CommercePhoto
                      image={product.image}
                      className={cn(
                        "motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.025]",
                        layout === "grid" && "aspect-[4/5]"
                      )}
                    />
                    {layout === "grid" && product.badge && (
                      <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] rounded bg-surface px-2 py-1 text-left text-sm font-medium text-grey-900">
                        {product.badge}
                      </span>
                    )}
                  </div>
                );
                return (
                  <li
                    key={product.id}
                    className={cn(
                      "min-w-0",
                      layout === "grid"
                        ? "flex flex-col"
                        : "grid grid-cols-[88px_minmax(0,1fr)] items-center gap-4 py-5 @min-[560px]:grid-cols-[112px_minmax(0,1fr)_auto]"
                    )}
                  >
                    {product.href ? (
                      <a
                        href={product.href}
                        aria-labelledby={productId}
                        className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action-primary"
                      >
                        {visual}
                      </a>
                    ) : onSelectProduct ? (
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        aria-labelledby={productId}
                        className="group block w-full cursor-pointer rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action-primary"
                      >
                        {visual}
                      </button>
                    ) : (
                      visual
                    )}
                    <div
                      className={cn("min-w-0", layout === "grid" && "flex flex-1 flex-col pt-4")}
                    >
                      {product.category && (
                        <p className="mb-1.5 text-sm text-grey-600">{product.category}</p>
                      )}
                      <ProductHeading
                        id={productId}
                        className="text-base leading-snug font-semibold tracking-tight"
                      >
                        {product.name}
                      </ProductHeading>
                      {product.description && (
                        <p className="mt-2 text-sm leading-relaxed text-grey-600">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                        <p className="font-medium tabular-nums">
                          {formatCommerceMoney(product.price, currency, locale)}
                        </p>
                        {product.stock === 0 && <p className="text-sm text-grey-600">Sold out</p>}
                      </div>
                    </div>
                    {onAddToCart && (
                      <Button
                        variant="grey"
                        appearance="outlined"
                        className={cn(
                          "h-auto min-h-11 whitespace-normal",
                          layout === "grid"
                            ? "mt-4 w-full"
                            : "col-start-2 justify-self-start @min-[560px]:col-start-3 @min-[560px]:row-start-1"
                        )}
                        disabled={product.stock === 0 || pendingProductIds.includes(product.id)}
                        onClick={() => onAddToCart(product)}
                        aria-label={`Add ${product.name} to bag`}
                      >
                        {pendingProductIds.includes(product.id) ? "Adding…" : "Add to bag"}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="border-b border-surface-border px-4 py-12 text-center">
              <p>{products.length ? "No products match your search." : emptyMessage}</p>
              {products.length > 0 && (
                <Button
                  variant="secondary"
                  className="mt-4 h-auto min-h-11"
                  onClick={() => {
                    setQuery("");
                    setCategory("");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </CommerceFrame>
  );
}
