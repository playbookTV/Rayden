"use client";
import { useState } from "react";
import { ProductDetailBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
const cover = (color: string) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#e8e1d7"/><rect x="160" y="76" width="280" height="448" rx="9" fill="${color}"/><path d="M187 77v446" stroke="#ffffff30" stroke-width="3"/><path d="M407 77v446" stroke="#bda480" stroke-width="7"/><path d="M228 170h120M228 191h80" stroke="#e8d8ba" stroke-width="3"/></svg>`
  );
export default function Example({ state = "default" }: { state?: string }) {
  const [message, setMessage] = useState("");
  return (
    <div style={{ width: "100%" }}>
      <ProductDetailBlock
        product={{
          id: "notebook",
          name: "The everyday notebook",
          description: "A quiet place for ideas that deserve a little room.",
          price: 1800,
          stock: state === "sold-out" ? 0 : 8,
        }}
        images={[
          { src: cover("#33342f"), alt: "Graphite notebook with a linen cover" },
          { src: cover("#a96d50"), alt: "Clay notebook with a linen cover" },
        ]}
        options={[
          { id: "graphite", label: "Graphite", stock: 5 },
          { id: "clay", label: "Clay", stock: 3 },
        ]}
        optionLabel="Cover colour"
        details={[
          { label: "Inside", value: "160 dotted pages" },
          { label: "Size", value: "A5 · 148 × 210 mm" },
          { label: "Finish", value: "Linen cover, lay-flat binding" },
        ]}
        deliveryNote="Fictional product. No order is placed."
        currency="GBP"
        layout={state === "stacked" ? "stacked" : "split"}
        pending={state === "pending"}
        errorMessage={
          state === "error" ? "Example error: the demo bag could not update." : undefined
        }
        successMessage={message}
        onAddToCart={({ option, quantity }) =>
          setMessage(
            `${quantity} ${option?.label || "Graphite"} notebook${quantity === 1 ? "" : "s"} added to this demo. No purchase made.`
          )
        }
      />
    </div>
  );
}
