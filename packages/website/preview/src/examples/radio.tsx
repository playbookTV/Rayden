"use client";
import { useState } from "react";
import { Radio } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [delivery, setDelivery] = useState("weekly");
  return (
    <fieldset style={{ width: "min(100%, 400px)", display: "grid", gap: 24 }}>
      <legend style={{ fontSize: 24, marginBottom: 24 }}>A rhythm that works for you.</legend>
      {[
        { value: "daily", label: "Daily digest", description: "A short update each morning." },
        { value: "weekly", label: "Weekly roundup", description: "The highlights, every Friday." },
        {
          value: "off",
          label: "Only the essentials",
          description: "Account and security messages.",
        },
      ].map((option) => (
        <Radio
          key={option.value}
          name="delivery"
          value={option.value}
          label={option.label}
          description={option.description}
          checked={delivery === option.value}
          disabled={state === "disabled"}
          onChange={() => setDelivery(option.value)}
        />
      ))}
      <p role="status">Selected: {delivery}. This demo sends no messages.</p>
    </fieldset>
  );
}
