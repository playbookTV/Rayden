"use client";
import { useState } from "react";
import { Badge, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
const stages = [
  { label: "Draft", color: "neutral" },
  { label: "In review", color: "warning" },
  { label: "Approved", color: "success" },
] as const;
export default function Example({ state = "default" }: { state?: string }) {
  const [stage, setStage] = useState(0);
  return (
    <div style={{ width: "min(100%, 460px)", display: "grid", gap: 28 }}>
      <h2 style={{ fontSize: 24 }}>Give status a little clarity.</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {stages.map((item) => (
          <Badge
            key={item.label}
            color={item.color}
            type={state === "outline" ? "outline" : state === "filled" ? "filled" : "accent"}
          >
            {item.label}
          </Badge>
        ))}
      </div>
      <p role="status">Demo project status: {stages[stage].label}</p>
      <div>
        <Button onClick={() => setStage((stage + 1) % stages.length)}>Move to next status</Button>
      </div>
    </div>
  );
}
