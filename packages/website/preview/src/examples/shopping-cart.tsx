"use client";
import { useState } from "react";
import { ShoppingCartBlock, type CommerceCartItem } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";

const productImage = (drawing: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200"><rect width="160" height="200" fill="#e8e1d7"/>${drawing}</svg>`
  );
const notebookImage = productImage(
  '<rect x="38" y="28" width="92" height="146" rx="5" fill="#292824"/><path d="M49 29v144" stroke="#5b5850" stroke-width="2"/><path d="M117 29v144" stroke="#ba7044" stroke-width="4"/><path d="M67 65h34M67 73h23" stroke="#c6b99f"/>'
);
const pencilImage = productImage(
  '<g transform="rotate(18 80 100)"><path d="M53 38h12v115l-6 18-6-18z" fill="#b8794e"/><path d="M75 24h12v129l-6 18-6-18z" fill="#d4a477"/><path d="M97 45h12v108l-6 18-6-18z" fill="#45443f"/><path d="m56 162 3 9 3-9m16 0 3 9 3-9m16 0 3 9 3-9" fill="#292824"/></g>'
);

const initial: CommerceCartItem[] = [
  {
    id: "notebook",
    name: "Studio notebook",
    image: { src: notebookImage, alt: "Graphite notebook with a copper elastic band" },
    description: "A place for the next idea.",
    price: 1800,
    quantity: 1,
    variant: "Graphite",
    stock: 5,
  },
  {
    id: "pencils",
    name: "Sketching pencils",
    image: { src: pencilImage, alt: "Three drawing pencils" },
    description: "A set of three essentials.",
    price: 900,
    quantity: 2,
    stock: 8,
  },
];
export default function Example({ state = "default" }: { state?: string }) {
  const [items, setItems] = useState(state === "empty" ? [] : initial);
  const [message, setMessage] = useState("");
  return (
    <div>
      <ShoppingCartBlock
        title="Your bag"
        description="Thoughtful essentials for your workspace. Demo products only."
        items={items}
        currency="GBP"
        shipping={400}
        totalsNote="Illustrative totals. No payment will be taken."
        onQuantityChange={(id, quantity) =>
          setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
        }
        onRemoveItem={(id) => setItems(items.filter((item) => item.id !== id))}
        onContinueShopping={() => setItems(initial)}
        onCheckout={() => setMessage("Checkout preview only. No order has been placed.")}
      />
      <p role="status" style={{ marginTop: 20 }}>
        {message}
      </p>
    </div>
  );
}
