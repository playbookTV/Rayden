"use client";
import { useState } from "react";
import { Slider } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [value, setValue] = useState(60);
  return (
    <div style={{ width: "min(100%, 440px)", display: "grid", gap: 28 }}>
      <h2 style={{ fontSize: 24 }}>Find the right balance.</h2>
      <Slider
        label="Preview intensity"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={5}
        showPercentage
        disabled={state === "disabled"}
        metadata="Use the arrow keys for precise adjustments."
      />
      <p role="status">Intensity: {value}%</p>
    </div>
  );
}
