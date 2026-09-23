import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within, waitFor } from "storybook/test";
import { ProductCollectionBlock } from "./ProductCollectionBlock";
import { ProductDetailBlock, type ProductDetailSelection } from "./ProductDetailBlock";
import { ShoppingCartBlock } from "./ShoppingCartBlock";
import { CheckoutReviewBlock } from "./CheckoutReviewBlock";
import { commerceControl, type CommerceProduct, type CommerceCartItem } from "./commerce";

const meta = {
  title: "Blocks/Commerce",
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// Original vector product illustrations: self-contained, no remote image requests.
function illustration(background: string, shape: string) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><rect width="640" height="640" fill="${background}"/><ellipse cx="320" cy="500" rx="160" ry="16" fill="#000" opacity=".07"/>${shape}</svg>`)}`;
}
const products: CommerceProduct[] = [
  {
    id: "lamp",
    name: "Arc table lamp",
    category: "Lighting",
    price: 8900,
    stock: 8,
    badge: "Small batch",
    description: "A softer light for slower evenings.",
    image: {
      alt: "Sage green dome lamp with a slender stem and round base",
      src: illustration(
        "#e9ebe4",
        '<path d="M315 245h18v231h-18z" fill="#687766"/><ellipse cx="324" cy="478" rx="92" ry="15" fill="#768570"/><path d="M163 267a161 151 0 0 1 322 0z" fill="#8e9e82"/><ellipse cx="324" cy="267" rx="161" ry="15" fill="#596d53"/><path d="M432 278v88" stroke="#56694f" stroke-width="4"/><circle cx="432" cy="370" r="7" fill="#56694f"/>'
      ),
    },
  },
  {
    id: "cup",
    name: "Everyday ceramic cup",
    category: "Objects",
    price: 2400,
    stock: 12,
    description: "Made for the first coffee of the day.",
    image: {
      alt: "Warm terracotta ceramic cup with a round handle",
      src: illustration(
        "#f0e8df",
        '<path d="M418 295c116-24 128 145 6 132" fill="none" stroke="#a9664c" stroke-width="33"/><path d="M197 268h236l-17 179q-99 76-200 0z" fill="#bc8063"/><ellipse cx="315" cy="268" rx="118" ry="28" fill="#d39b7b"/><ellipse cx="315" cy="270" rx="98" ry="19" fill="#764834"/>'
      ),
    },
  },
  {
    id: "journal",
    name: "Open day journal",
    category: "Stationery",
    price: 1800,
    stock: 20,
    badge: "New colour",
    description: "A little space to put your thoughts.",
    image: {
      alt: "Rust-coloured cloth journal with cream pages and an elastic closure",
      src: illustration(
        "#ede9e3",
        '<path d="M208 154h222v326H208z" fill="#d4c9b6"/><rect x="195" y="141" width="236" height="328" rx="10" fill="#aa5d43"/><path d="M208 145v320" stroke="#8c4937" stroke-width="4"/><path d="M398 141v330" stroke="#6e4638" stroke-width="10"/><path d="M255 268h112m-90 18h67" stroke="#e5b794" stroke-width="3"/>'
      ),
    },
  },
  {
    id: "tote",
    name: "Weekend canvas tote",
    category: "Everyday carry",
    price: 3600,
    stock: 0,
    description: "Room for the things you take along.",
    image: {
      alt: "Natural cotton canvas tote with olive green handles",
      src: illustration(
        "#e7e7df",
        '<path d="M266 261v-66a55 55 0 0 1 110 0v66" fill="none" stroke="#727761" stroke-width="22"/><path d="M203 245h236l21 240H183z" fill="#c9bd9e"/><path d="M263 245v92m113-92v92" stroke="#727761" stroke-width="20"/><path d="M283 378h79" stroke="#817d65" stroke-width="3"/>'
      ),
    },
  },
];
const lampGallery = [
  products[0].image!,
  {
    alt: "Detail of the sage lamp’s curved shade and pull cord",
    src: illustration(
      "#e9ebe4",
      '<path d="M315 150h18v500h-18z" fill="#687766"/><path d="M10 282a310 275 0 0 1 620 0z" fill="#8e9e82"/><ellipse cx="320" cy="282" rx="310" ry="24" fill="#596d53"/><path d="M530 306v186" stroke="#56694f" stroke-width="7"/><circle cx="530" cy="500" r="12" fill="#56694f"/>'
    ),
  },
];
const seedItems: CommerceCartItem[] = [
  { ...products[0], id: "lamp-sage", variant: "Sage", quantity: 1 },
  { ...products[1], quantity: 2 },
];
const options = [
  { id: "sage", label: "Sage", stock: 8 },
  { id: "chalk", label: "Chalk", stock: 3 },
  { id: "ink", label: "Ink", stock: 0 },
];
const delivery = {
  deliveryAddress: ["Alex Morgan", "24 Willow Lane", "London, N1 4AB", "United Kingdom"],
  deliveryMethod: "Standard delivery · 3–5 working days",
  paymentSummary: "Visa ending in 4242",
};
function Frame({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <main className="min-h-screen bg-surface p-5 text-grey-900 md:p-10">
      <div className={`mx-auto ${narrow ? "max-w-[320px]" : "max-w-[1120px]"}`}>{children}</div>
    </main>
  );
}
function CartDemo({ stacked = false }: { stacked?: boolean } = {}) {
  const [items, setItems] = useState(seedItems);
  return (
    <ShoppingCartBlock
      items={items}
      layout={stacked ? "stacked" : "split"}
      shipping={500}
      totalsNote="Delivery and tax shown for the example address."
      onRemoveItem={(id) => setItems(items.filter((item) => item.id !== id))}
      onQuantityChange={(id, quantity) =>
        setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
      }
    />
  );
}
function DetailDemo({ stacked = false }: { stacked?: boolean } = {}) {
  const [message, setMessage] = useState("");
  return (
    <ProductDetailBlock
      product={products[0]}
      images={lampGallery}
      layout={stacked ? "stacked" : "split"}
      options={options}
      details={[
        { label: "Material", value: "Powder-coated steel" },
        { label: "Dimensions", value: "38 × 25 cm" },
      ]}
      deliveryNote="Free delivery on orders over £100. Returns within 30 days."
      onAddToCart={({ quantity, option }) =>
        setMessage(
          `${quantity} ${option?.label} lamp${quantity > 1 ? "s" : ""} added to the demo bag.`
        )
      }
      successMessage={message}
    />
  );
}
export const ProductCollection: Story = {
  render: () => (
    <Frame>
      <ProductCollectionBlock products={products} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByRole("searchbox"), "cup");
    await expect(c.getByRole("status")).toHaveTextContent("1 product");
    await expect(c.queryByText("Arc table lamp")).not.toBeInTheDocument();
    await userEvent.clear(c.getByRole("searchbox"));
    await userEvent.selectOptions(c.getByLabelText("Category"), "Stationery");
    await expect(c.getByText("Open day journal")).toBeVisible();
    await userEvent.selectOptions(c.getByLabelText("Category"), "");
    await userEvent.selectOptions(c.getByLabelText("Sort by"), "price-low");
    await expect(c.getAllByRole("listitem")[0]).toHaveTextContent("Open day journal");
  },
};
export const ProductDetail: Story = {
  render: () => (
    <Frame>
      <DetailDemo />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByLabelText("Ink · Sold out")).toBeDisabled();
    await userEvent.click(c.getByLabelText("Chalk"));
    await userEvent.click(c.getByRole("button", { name: "Increase quantity for Arc table lamp" }));
    await userEvent.click(c.getByRole("button", { name: "Add to bag" }));
    await expect(c.getByText("2 Chalk lamps added to the demo bag.")).toBeVisible();
  },
};
export const ShoppingCart: Story = {
  render: () => (
    <Frame>
      <CartDemo />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText("£142.00")).toBeVisible();
    await userEvent.click(
      c.getByRole("button", { name: "Increase quantity for Everyday ceramic cup" })
    );
    await expect(c.getByText("£166.00")).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Remove Arc table lamp, Sage" }));
    await expect(c.getByText("£77.00")).toBeVisible();
  },
};
const confirmOrder = fn();
export const CheckoutReview: Story = {
  render: () => (
    <Frame>
      <CheckoutReviewBlock
        items={seedItems}
        {...delivery}
        shipping={500}
        onConfirm={confirmOrder}
        terms="By placing your order, you agree to the shop’s terms of sale."
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    confirmOrder.mockClear();
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Place order" }));
    await expect(confirmOrder).toHaveBeenCalledTimes(1);
    await expect(within(canvasElement).queryByText("Order confirmed")).not.toBeInTheDocument();
  },
};

function Journey() {
  const [view, setView] = useState<"collection" | "product" | "cart" | "checkout">("collection");
  const [selected, setSelected] = useState(products[0]);
  const [items, setItems] = useState<CommerceCartItem[]>([]);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  function navigate(next: typeof view) {
    setView(next);
    setMessage("");
    requestAnimationFrame(() => panel.current?.focus());
  }
  function add({ product, option, quantity }: ProductDetailSelection) {
    const id = option ? `${product.id}-${option.id}` : product.id;
    const stock = Math.min(product.stock ?? 99, option?.stock ?? 99);
    const previous = items.find((item) => item.id === id)?.quantity ?? 0;
    const accepted = Math.min(quantity, Math.max(0, stock - previous));
    if (accepted === 0) {
      setMessage("You already have all available stock in your bag.");
      return;
    }
    setItems((current) =>
      current.some((item) => item.id === id)
        ? current.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + accepted } : item
          )
        : [...current, { ...product, id, stock, variant: option?.label, quantity: accepted }]
    );
    setConfirmed(false);
    setMessage(
      `${accepted} ${product.name}${option ? ` · ${option.label}` : ""} added to your demo bag.`
    );
  }
  return (
    <div className="min-h-screen bg-surface text-grey-900">
      <div className="bg-surface-muted px-5 py-2 text-center text-xs text-grey-600">
        Interactive preview · sample products · no real payment
      </div>
      <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-b border-surface-border px-5 py-5 md:px-10">
        <button
          type="button"
          onClick={() => navigate("collection")}
          className="min-h-11 rounded text-2xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-action-primary"
        >
          goodthings<span className="text-action-primary-text">.</span>
        </button>
        <nav aria-label="Shop" className="flex gap-3">
          <button
            type="button"
            aria-current={view === "collection" ? "page" : undefined}
            className={commerceControl}
            onClick={() => navigate("collection")}
          >
            Collection
          </button>
          <button
            type="button"
            aria-current={view === "cart" ? "page" : undefined}
            className={commerceControl}
            onClick={() => navigate("cart")}
          >
            Bag ({count})
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-14">
        <div ref={panel} tabIndex={-1} className="outline-none">
          {view === "collection" && (
            <>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-action-primary-text">
                Objects with a little more intention
              </p>
              <ProductCollectionBlock
                headingLevel="h1"
                products={products}
                description="Useful things. Considered details. A collection made to bring a little more joy to your everyday rituals."
                onSelectProduct={(product) => {
                  setSelected(product);
                  navigate("product");
                }}
                onAddToCart={(product) =>
                  add({
                    product,
                    quantity: 1,
                    option: product.id === "lamp" ? options[0] : undefined,
                  })
                }
              />
            </>
          )}
          {view === "product" && (
            <>
              <button
                type="button"
                className={`${commerceControl} mb-6`}
                onClick={() => navigate("collection")}
              >
                ← Back to collection
              </button>
              <ProductDetailBlock
                headingLevel="h1"
                product={selected}
                images={selected.id === "lamp" ? lampGallery : undefined}
                options={selected.id === "lamp" ? options : []}
                onAddToCart={add}
                deliveryNote="Standard delivery £5. Free on orders over £100. Demo prices include tax."
                details={[
                  { label: "Designed for", value: "Everyday use" },
                  { label: "Packaging", value: "Plastic-free" },
                ]}
              />
            </>
          )}
          {view === "cart" && (
            <ShoppingCartBlock
              headingLevel="h1"
              items={items}
              shipping={
                items.reduce((sum, item) => sum + item.price * item.quantity, 0) >= 10000 ? 0 : 500
              }
              totalsNote="Demo prices include tax. Free delivery on orders over £100."
              onContinueShopping={() => navigate("collection")}
              onQuantityChange={(id, quantity) => {
                setConfirmed(false);
                setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
              }}
              onRemoveItem={(id) => {
                setConfirmed(false);
                setItems(items.filter((item) => item.id !== id));
              }}
              onCheckout={() => {
                setConfirmed(false);
                navigate("checkout");
              }}
            />
          )}
          {view === "checkout" && (
            <CheckoutReviewBlock
              headingLevel="h1"
              items={items}
              {...delivery}
              shipping={
                items.reduce((sum, item) => sum + item.price * item.quantity, 0) >= 10000 ? 0 : 500
              }
              onEditCart={() => navigate("cart")}
              onConfirm={() => setConfirmed(true)}
              confirmLabel="Complete demo order"
              totalsNote="Example address and payment method. This preview does not take payment."
              confirmation={
                confirmed
                  ? {
                      title: "Demo order complete",
                      description:
                        "You’ve tried the complete shopping flow. No order or payment was submitted.",
                      reference: "DEMO-001",
                    }
                  : undefined
              }
            />
          )}
        </div>
        <p role="status" className="mt-6 text-sm text-action-primary-text">
          {message}
        </p>
      </main>
      <footer className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 border-t border-surface-border px-5 py-6 text-xs text-grey-600 md:px-10">
        <span>Good things, thoughtfully chosen.</span>
        <span>Four commerce blocks · Rayden UI</span>
      </footer>
    </div>
  );
}
export const FullJourney: Story = {
  render: () => <Journey />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Arc table lamp" }));
    await userEvent.click(c.getByRole("button", { name: "Add to bag" }));
    await userEvent.click(c.getByRole("button", { name: "Bag (1)" }));
    await userEvent.click(c.getByRole("button", { name: "Review checkout" }));
    await userEvent.click(c.getByRole("button", { name: "Complete demo order" }));
    await expect(c.getByRole("heading", { name: "Demo order complete" })).toBeVisible();
    // Leave an empty bag and the collection so visitors can try the flow themselves.
    await userEvent.click(c.getByRole("button", { name: "Bag (1)" }));
    await userEvent.click(c.getByRole("button", { name: "Remove Arc table lamp, Sage" }));
    await userEvent.click(c.getByRole("button", { name: "Collection" }));
  },
};
function Gallery() {
  return (
    <Frame>
      <header className="mb-12 border-b border-surface-border pb-8">
        <p className="mb-3 text-sm font-medium text-action-primary-text">
          Rayden UI · Commerce / Batch B
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">The everyday shop.</h1>
        <p className="mt-3 text-grey-600">
          Four reusable blocks. One considered shopping experience.
        </p>
        <a
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-action-primary-text underline underline-offset-4"
          href="?id=blocks-commerce--full-journey&viewMode=story"
        >
          Try the complete shopping flow →
        </a>
      </header>
      <div className="space-y-16">
        <ProductCollectionBlock products={products} />
        <div className="border-t border-surface-border pt-10">
          <DetailDemo />
        </div>
        <div className="border-t border-surface-border pt-10">
          <CartDemo />
        </div>
        <div className="border-t border-surface-border pt-10">
          <CheckoutReviewBlock items={seedItems} {...delivery} shipping={500} />
        </div>
      </div>
    </Frame>
  );
}
export const AllNewBlocks: Story = { render: () => <Gallery /> };
export const DarkGallery: Story = { globals: { theme: "dark" }, render: () => <Gallery /> };
export const CustomTheme: Story = {
  globals: { theme: "light" },
  render: () => (
    <div
      style={
        {
          "--color-action-primary": "#45654b",
          "--color-action-primary-hover": "#334e39",
          "--color-action-primary-text": "#39583f",
          "--color-surface-muted": "#eff3ed",
        } as CSSProperties
      }
    >
      <Journey />
    </div>
  ),
};
export const NarrowContainer: Story = {
  render: () => (
    <Frame narrow>
      <div className="space-y-12">
        <ProductCollectionBlock products={products} />
        <DetailDemo />
        <CartDemo />
        <CheckoutReviewBlock items={seedItems} {...delivery} shipping={500} />
      </div>
    </Frame>
  ),
};
export const EmptyAndErrorStates: Story = {
  render: () => (
    <Frame>
      <div className="space-y-12">
        <ProductCollectionBlock title="Empty collection" products={[]} />
        <ProductCollectionBlock
          products={[]}
          title="Collection unavailable"
          status="error"
          errorMessage="The collection is unavailable. Please try again later."
        />
        <ShoppingCartBlock items={[]} />
        <CheckoutReviewBlock
          items={seedItems}
          {...delivery}
          errorMessage="Payment was declined. Choose another payment method and try again."
        />
      </div>
    </Frame>
  ),
};
export const LoadingAndPending: Story = {
  render: () => (
    <Frame>
      <div className="space-y-12">
        <ProductCollectionBlock products={[]} status="loading" />
        <ProductDetailBlock product={products[0]} options={options} pending onAddToCart={fn()} />
        <CheckoutReviewBlock items={seedItems} {...delivery} pending onConfirm={fn()} />
      </div>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("button", { name: "Adding…" })).toBeDisabled();
    await expect(c.getByRole("button", { name: "Placing order…" })).toBeDisabled();
  },
};
export const StockLimit: Story = {
  render: () => (
    <Frame>
      <div className="space-y-12">
        <ProductDetailBlock product={products[3]} onAddToCart={fn()} />
        <ShoppingCartBlock items={[{ ...products[0], quantity: 9 }]} onCheckout={fn()} />
        <CheckoutReviewBlock items={[]} {...delivery} onConfirm={fn()} />
      </div>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole("button", { name: "Sold out" })).toBeDisabled();
    await expect(c.getByRole("button", { name: "Review checkout" })).toBeDisabled();
    await expect(c.getByRole("button", { name: "Place order" })).toBeDisabled();
  },
};
export const ZeroDecimalCurrency: Story = {
  render: () => (
    <Frame>
      <ShoppingCartBlock
        items={[{ ...products[1], price: 2400, quantity: 2 }]}
        currency="JPY"
        locale="en-GB"
        shipping={500}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("JP¥5,300")).toBeVisible();
  },
};

export const CompactCollection: Story = {
  render: () => (
    <Frame>
      <ProductCollectionBlock title="The everyday edit" products={products} layout="list" />
    </Frame>
  ),
};
export const ProductGallery: Story = {
  render: () => (
    <Frame>
      <DetailDemo />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const detail = c.getByRole("button", { name: /View image 2/ });
    await userEvent.click(detail);
    await expect(detail).toHaveAttribute("aria-pressed", "true");
    await expect(c.getByRole("img", { name: /Detail of the sage lamp/ })).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: /View image 1/ }));
  },
};
function DrawerExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="h-auto min-h-11" onClick={() => setOpen(true)}>
        Open shopping bag
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        showClose={false}
        aria-label="Shopping bag"
        blur={false}
        className="fixed inset-y-0 right-0 h-dvh max-h-dvh w-full max-w-[480px] rounded-none bg-surface dark:bg-surface"
      >
        <div className="mb-4 flex justify-end">
          <Button variant="text" className="h-auto min-h-11" onClick={() => setOpen(false)}>
            Close bag
          </Button>
        </div>
        <CartDemo stacked />
      </Modal>
    </>
  );
}
export const CartDrawer: Story = {
  render: () => (
    <Frame>
      <h1 className="mb-6 text-3xl font-semibold">Keep your place in the shop.</h1>
      <p className="mb-6 max-w-xl text-grey-600">
        The same cart, arranged for a side panel. Review your items and return to browsing.
      </p>
      <DrawerExample />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const trigger = c.getByRole("button", { name: "Open shopping bag" });
    await userEvent.click(trigger);
    const page = within(canvasElement.ownerDocument.body);
    const dialog = page.getByRole("dialog", { name: "Shopping bag" });
    await expect(dialog).toBeVisible();
    await userEvent.click(page.getByRole("button", { name: "Close bag" }));
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

const studioBlocks = [
  { id: "collection", name: "Collection", detail: "Discover & browse", number: "01" },
  { id: "product", name: "Product detail", detail: "Consider & choose", number: "02" },
  { id: "bag", name: "Shopping bag", detail: "Edit & review", number: "03" },
  { id: "checkout", name: "Checkout", detail: "Confirm & complete", number: "04" },
] as const;
function DesignStudio() {
  const [selected, setSelected] = useState<(typeof studioBlocks)[number]["id"]>("collection");
  const [theme, setTheme] = useState("light");
  const [narrow, setNarrow] = useState(false);
  const [alternative, setAlternative] = useState(false);
  const [state, setState] = useState("ready");
  const [chosenProduct, setChosenProduct] = useState(products[0]);
  const [items, setItems] = useState(seedItems);
  const [notice, setNotice] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const active = studioBlocks.find((block) => block.id === selected)!;
  const go = (next: typeof selected) => {
    setSelected(next);
    setState("ready");
    setAlternative(false);
    setNotice("");
    setConfirmed(false);
    requestAnimationFrame(() => preview.current?.focus({ preventScroll: true }));
  };
  return (
    <div
      className={`${theme === "dark" ? "dark" : "rayden-light"} min-h-screen bg-surface text-grey-900`}
    >
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5 border-b border-surface-border px-5 py-6 md:px-10">
        <div>
          <p className="text-sm font-semibold text-action-primary-text">Rayden / Commerce</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Considered, from browse to buy.
          </h1>
        </div>
        <a
          href="?id=blocks-commerce--full-journey&viewMode=story"
          className="inline-flex min-h-11 items-center rounded text-sm font-semibold text-action-primary-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-action-primary"
        >
          Try the complete shop ↗
        </a>
      </header>
      <main className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 md:px-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 lg:py-12">
        <aside>
          <nav
            aria-label="Commerce blocks"
            className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-1"
          >
            {studioBlocks.map((block) => (
              <button
                key={block.id}
                type="button"
                aria-pressed={selected === block.id}
                onClick={() => go(block.id)}
                className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-lg p-3 text-left focus-visible:outline-2 focus-visible:outline-action-primary ${selected === block.id ? "bg-surface-muted text-action-primary-text" : "text-grey-600 hover:bg-grey-50"}`}
              >
                <span className="pt-0.5 text-sm tabular-nums">{block.number}</span>
                <span>
                  <span className="block text-sm font-semibold">{block.name}</span>
                  <span className="mt-1 block text-sm text-grey-600">{block.detail}</span>
                </span>
              </button>
            ))}
          </nav>
          <p className="mt-6 hidden text-sm leading-relaxed text-grey-600 lg:block">
            Four connected patterns.
            <br />
            One shared design language.
          </p>
        </aside>
        <div className="min-w-0">
          <div className="mb-8 flex flex-wrap items-end gap-3 border-b border-surface-border pb-5">
            <label className="flex flex-col gap-2 text-sm text-grey-600">
              Appearance
              <select
                aria-label="Preview appearance"
                className={commerceControl}
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-grey-600">
              Width
              <select
                aria-label="Preview width"
                className={commerceControl}
                value={narrow ? "phone" : "full"}
                onChange={(e) => setNarrow(e.target.value === "phone")}
              >
                <option value="full">Available space</option>
                <option value="phone">Phone · 360px</option>
              </select>
            </label>
            {selected !== "checkout" && (
              <label className="flex flex-col gap-2 text-sm text-grey-600">
                Layout
                <select
                  aria-label="Block layout"
                  className={commerceControl}
                  value={alternative ? "alternative" : "default"}
                  onChange={(e) => setAlternative(e.target.value === "alternative")}
                >
                  <option value="default">
                    {selected === "collection" ? "Image grid" : "Side by side"}
                  </option>
                  <option value="alternative">
                    {selected === "collection" ? "Compact list" : "Stacked"}
                  </option>
                </select>
              </label>
            )}
            <label className="flex flex-col gap-2 text-sm text-grey-600">
              State
              <select
                aria-label="Preview state"
                className={commerceControl}
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setConfirmed(false);
                }}
              >
                <option value="ready">Ready</option>
                {(selected === "collection" || selected === "bag") && (
                  <option value="empty">Empty</option>
                )}
                <option value="loading">{selected === "collection" ? "Loading" : "Pending"}</option>
                <option value="error">Error</option>
              </select>
            </label>
          </div>
          <div
            ref={preview}
            tabIndex={-1}
            aria-label={`${active.name} preview`}
            className={`min-w-0 outline-none ${narrow ? "mx-auto max-w-[360px]" : "w-full"}`}
          >
            {selected === "collection" && (
              <ProductCollectionBlock
                title="The everyday edit."
                description="Useful objects, thoughtful details. A few good things to make your daily rituals a little better."
                products={state === "empty" ? [] : products}
                layout={alternative ? "list" : "grid"}
                status={state === "loading" ? "loading" : state === "error" ? "error" : "ready"}
                onRetry={() => setState("ready")}
                onSelectProduct={(product) => {
                  setChosenProduct(product);
                  go("product");
                }}
              />
            )}
            {selected === "product" && (
              <ProductDetailBlock
                product={chosenProduct}
                images={chosenProduct.id === "lamp" ? lampGallery : undefined}
                layout={alternative ? "stacked" : "split"}
                options={chosenProduct.id === "lamp" ? options : []}
                details={[
                  {
                    label: "Material",
                    value:
                      chosenProduct.id === "lamp" ? "Powder-coated steel" : "Made for everyday use",
                  },
                  { label: "Packaging", value: "Plastic-free" },
                ]}
                deliveryNote="Standard delivery £5. Free on orders over £100. Returns within 30 days."
                pending={state === "loading"}
                errorMessage={
                  state === "error" ? "We couldn’t update your bag. Please try again." : undefined
                }
                successMessage={notice}
                onAddToCart={({ product, option, quantity }) => {
                  const id = option ? `${product.id}-${option.id}` : product.id;
                  setItems((current) => {
                    const old = current.find((i) => i.id === id);
                    const stock = Math.min(product.stock ?? 99, option?.stock ?? 99);
                    return old
                      ? current.map((i) =>
                          i.id === id
                            ? { ...i, quantity: Math.min(i.quantity + quantity, stock) }
                            : i
                        )
                      : [...current, { ...product, id, variant: option?.label, quantity, stock }];
                  });
                  setNotice("Your demo bag is updated. Open Shopping bag to review.");
                }}
              />
            )}
            {selected === "bag" && (
              <ShoppingCartBlock
                items={state === "empty" ? [] : items}
                layout={alternative ? "stacked" : "split"}
                shipping={500}
                pending={state === "loading"}
                errorMessage={
                  state === "error"
                    ? "We couldn’t update your bag. Your items are still here."
                    : undefined
                }
                totalsNote="Delivery shown for the example address. Prices include tax."
                onQuantityChange={(id, quantity) =>
                  setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
                }
                onRemoveItem={(id) => setItems(items.filter((item) => item.id !== id))}
                onContinueShopping={() => go("collection")}
                onCheckout={() => {
                  setConfirmed(false);
                  go("checkout");
                }}
              />
            )}
            {selected === "checkout" && (
              <CheckoutReviewBlock
                items={items}
                {...delivery}
                shipping={500}
                onEditCart={() => go("bag")}
                onConfirm={() => setConfirmed(true)}
                confirmLabel="Complete demo order"
                pending={state === "loading"}
                errorMessage={
                  state === "error"
                    ? "Payment was declined. Please try another payment method."
                    : undefined
                }
                totalsNote="Sample address and payment details. No real payment is taken."
                confirmation={
                  confirmed
                    ? {
                        title: "Demo order complete",
                        description:
                          "Thank you for trying the flow. No order or payment was submitted.",
                        reference: "DEMO-001",
                      }
                    : undefined
                }
              />
            )}
          </div>
          <p className="mt-10 border-t border-surface-border pt-5 text-sm text-grey-600">
            Interactive examples · sample products and payment details
          </p>
        </div>
      </main>
    </div>
  );
}
export const DesignReview: Story = {
  render: () => <DesignStudio />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.selectOptions(c.getByLabelText("Block layout"), "alternative");
    await userEvent.click(c.getByRole("button", { name: "Arc table lamp" }));
    await expect(c.getByRole("heading", { name: "Arc table lamp" })).toBeVisible();
    await userEvent.selectOptions(c.getByLabelText("Preview width"), "phone");
    await userEvent.selectOptions(c.getByLabelText("Preview appearance"), "dark");
    await userEvent.click(c.getByRole("button", { name: /01 Collection/ }));
    await userEvent.selectOptions(c.getByLabelText("Preview appearance"), "light");
    await userEvent.selectOptions(c.getByLabelText("Preview width"), "full");
  },
};
