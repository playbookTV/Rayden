"use client";
import { useState } from "react";
import { Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "grid", gap: 28, maxWidth: 420 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button
          variant="primary"
          disabled={state === "disabled"}
          onClick={() => setCount(count + 1)}
        >
          Create project
        </Button>
        <Button variant="secondary" disabled={state === "disabled"} onClick={() => setCount(0)}>
          Reset count
        </Button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Button variant="grey" onClick={() => setCount(count + 1)}>
          Save draft
        </Button>
        <Button variant="text" onClick={() => setCount(count + 1)}>
          Learn more
        </Button>
      </div>
      <p role="status">
        {count
          ? `${count} demo actions triggered.`
          : "Try a button. Every action stays in this preview."}
      </p>
    </div>
  );
}
