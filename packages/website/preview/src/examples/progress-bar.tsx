"use client";
import { useState } from "react";
import { Button, ProgressBar } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [value, setValue] = useState(40);
  return (
    <div style={{ width: "min(100%, 480px)", display: "grid", gap: 28 }}>
      <ProgressBar
        label="Your workspace checklist"
        value={value}
        type={state === "segmented" ? "segmented" : "basic"}
        metadata={`${value / 20} of 5 steps completed`}
        showPercentage
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button disabled={value === 100} onClick={() => setValue(Math.min(100, value + 20))}>
          Complete a step
        </Button>
        <Button variant="secondary" onClick={() => setValue(0)}>
          Start again
        </Button>
      </div>
      <p role="status">
        {value === 100
          ? "All five demo steps are complete."
          : "Progress updates when you complete a demo step."}
      </p>
    </div>
  );
}
