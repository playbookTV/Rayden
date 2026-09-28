"use client";
import { useState } from "react";
import { ProgressCircle, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [value, setValue] = useState(50);
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 28, textAlign: "center" }}>
      <h2 style={{ fontSize: 24 }}>Your workspace, taking shape.</h2>
      <ProgressCircle
        value={value}
        size="xl"
        variant={state === "segmented" ? "segmented" : "default"}
        label="Workspace setup progress"
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Button onClick={() => setValue(Math.min(100, value + 25))} disabled={value === 100}>
          Complete a setup step
        </Button>
        <Button variant="secondary" onClick={() => setValue(0)}>
          Restart
        </Button>
      </div>
      <p role="status">
        {value === 100 ? "Demo setup complete." : `${value / 25} of 4 demo setup steps complete.`}
      </p>
    </div>
  );
}
