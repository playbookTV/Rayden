"use client";
import { useState } from "react";
import { CheckoutReviewBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
const notebookImage =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200"><rect width="160" height="200" fill="#e8e1d7"/><rect x="38" y="28" width="92" height="146" rx="5" fill="#292824"/><path d="M49 29v144" stroke="#5b5850" stroke-width="2"/><path d="M117 29v144" stroke="#ba7044" stroke-width="4"/><path d="M67 65h34M67 73h23" stroke="#c6b99f"/></svg>'
  );
export default function Example({ state = "default" }: { state?: string }) {
  const [delivery, setDelivery] = useState(false);
  const [payment, setPayment] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <CheckoutReviewBlock
        title="One last look."
        description="A checkout review for a fictional order. No payment is collected."
        items={[
          {
            id: "notebook",
            name: "The everyday notebook",
            image: { src: notebookImage, alt: "Graphite notebook" },
            price: 1800,
            quantity,
            variant: "Graphite",
          },
        ]}
        deliveryAddress={[
          "Avery Morgan (demo)",
          "Example studio address",
          "London, United Kingdom",
        ]}
        deliveryMethod={delivery ? "Studio collection · free" : "Standard delivery · demo estimate"}
        paymentSummary={
          payment ? "Pay on collection · demonstration only" : "Demo card ending in 4242"
        }
        shipping={delivery ? 0 : 400}
        currency="GBP"
        onEditDelivery={() => setDelivery(!delivery)}
        onEditPayment={() => setPayment(!payment)}
        onEditCart={() => setQuantity(quantity === 1 ? 2 : 1)}
        onConfirm={() => setConfirmed(true)}
        confirmLabel="Confirm demo order"
        pending={state === "pending"}
        errorMessage={state === "error" ? "Example error: confirmation is unavailable." : undefined}
        confirmation={
          confirmed
            ? {
                title: "Demo review complete.",
                description: "No order was placed and no payment was taken.",
                reference: "DEMO-204",
              }
            : undefined
        }
        totalsNote="Illustrative totals only."
        terms="The edit actions switch local demo options. They do not change an actual order."
      />
    </div>
  );
}
