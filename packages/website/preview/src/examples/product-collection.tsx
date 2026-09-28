"use client";
import { useState } from "react";
import { ProductCollectionBlock, type CommerceProduct } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
const cover = (color: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320"><rect width="400" height="320" fill="#e8e1d7"/><rect x="128" y="46" width="150" height="232" rx="7" fill="${color}"/><path d="M145 46v232" stroke="#ffffff30" stroke-width="2"/><path d="M257 46v232" stroke="#bda480" stroke-width="5"/><path d="M169 98h64M169 110h40" stroke="#e8d8ba" stroke-width="2"/></svg>`
  );
const products: CommerceProduct[] = [
  {
    id: "graphite",
    name: "The everyday notebook",
    description: "Graphite · 160 pages",
    price: 1800,
    image: { src: cover("#33342f"), alt: "Graphite notebook" },
  },
  {
    id: "clay",
    name: "A book for bright ideas",
    description: "Clay · 160 pages",
    price: 1800,
    image: { src: cover("#a96d50"), alt: "Clay notebook" },
  },
  {
    id: "olive",
    name: "Room to think",
    description: "Olive · 240 pages",
    price: 2400,
    image: { src: cover("#666b50"), alt: "Olive notebook" },
  },
];
export default function Example({ state = "default" }: { state?: string }) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Choose a notebook or add one to the demo bag.");
  const [recovered, setRecovered] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <ProductCollectionBlock
        title="Good things begin on paper."
        description="A fictional stationery collection. No purchases are made."
        products={state === "empty" ? [] : products}
        layout={state === "list" ? "list" : "grid"}
        onSelectProduct={(product) =>
          setMessage(`${product.name}: ${product.description}. Demo product selected.`)
        }
        onAddToCart={(product) => {
          setCount(count + 1);
          setMessage(`${product.name} added to the demo bag.`);
        }}
        status={!recovered && (state === "loading" || state === "error") ? state : "ready"}
        onRetry={() => setRecovered(true)}
        currency="GBP"
      />
      <p role="status" style={{ marginTop: 24 }}>
        {count} items in the demo bag. {message}
      </p>
    </div>
  );
}
