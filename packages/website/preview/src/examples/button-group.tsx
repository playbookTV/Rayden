"use client";
import { useState } from "react";
import { ButtonGroup, ButtonGroupItem } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [view, setView] = useState("Week");
  return (
    <div style={{ width: "min(100%, 440px)", display: "grid", gap: 28 }}>
      <h2 style={{ fontSize: 24 }}>Choose your perspective.</h2>
      <ButtonGroup>
        {["Day", "Week", "Month"].map((label) => (
          <ButtonGroupItem
            key={label}
            active={view === label}
            disabled={state === "disabled"}
            onClick={() => setView(label)}
          >
            {label}
          </ButtonGroupItem>
        ))}
      </ButtonGroup>
      <p role="status">{view} view selected for this demo schedule.</p>
    </div>
  );
}
