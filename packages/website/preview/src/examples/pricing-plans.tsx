"use client";
import { useState } from "react";
import { PricingPlansBlock, type PricingPlansState } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [period, setPeriod] = useState("monthly");
  const [selection, setSelection] = useState("");
  return (
    <PricingPlansBlock
      eyebrow="DEMO WORKSPACE"
      title="A plan for your next chapter."
      description="Illustrative pricing for a fictional product. Rayden UI is free."
      period={period}
      onPeriodChange={setPeriod}
      periods={[
        { id: "monthly", label: "Monthly" },
        { id: "yearly", label: "Yearly", badge: "Save 20%" },
      ]}
      state={state as PricingPlansState}
      errorDescription="Example error: plans could not be loaded."
      plans={[
        {
          id: "solo",
          name: "Solo",
          description: "For your next good idea.",
          prices: {
            monthly: { amount: 12, currency: "GBP", unit: "/ month" },
            yearly: { amount: 115, currency: "GBP", unit: "/ year" },
          },
          features: [
            { id: "projects", label: "3 projects" },
            { id: "team", label: "1 editor" },
          ],
          cta: { label: "Choose Solo", onClick: () => setSelection("Solo") },
        },
        {
          id: "studio",
          name: "Studio",
          description: "Room to make things together.",
          highlighted: true,
          badge: "For teams",
          prices: {
            monthly: { amount: 29, currency: "GBP", unit: "/ month" },
            yearly: { amount: 278, currency: "GBP", unit: "/ year" },
          },
          features: [
            { id: "projects", label: "Unlimited projects" },
            { id: "team", label: "5 editors" },
          ],
          cta: { label: "Choose Studio", onClick: () => setSelection("Studio") },
        },
      ]}
      notice={
        selection
          ? {
              tone: "info",
              title: `${selection} selected in this demo.`,
              description: "No subscription or payment has been created.",
            }
          : undefined
      }
    />
  );
}
