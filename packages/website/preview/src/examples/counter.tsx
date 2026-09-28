"use client";
import { useState } from "react";
import { Counter } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [quantity, setQuantity] = useState(2);
  return (
    <div style={{ width: "min(100%, 380px)", display: "grid", gap: 28 }}>
      <h2 style={{ fontSize: 24 }}>A little more, a little less.</h2>
      <p>Notebook quantity · between 1 and 5</p>
      <div>
        <Counter
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={5}
          shape={state === "pill" ? "pill" : "rounded"}
          disabled={state === "disabled"}
          aria-label="Notebook quantity"
        />
      </div>
      <p role="status">
        {quantity} notebooks · £{quantity * 18}.00 illustrative total.
      </p>
    </div>
  );
}
