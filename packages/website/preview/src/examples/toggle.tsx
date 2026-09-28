"use client";
import { useState } from "react";
import { Toggle } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [focus, setFocus] = useState(true);
  const [sounds, setSounds] = useState(false);
  return (
    <div style={{ width: "min(100%, 420px)", display: "grid", gap: 28 }}>
      <h2 style={{ fontSize: 24 }}>A calmer workspace.</h2>
      <Toggle
        label="Focus mode"
        description="Keep nonessential notifications quiet."
        checked={focus}
        onChange={(event) => setFocus(event.target.checked)}
        disabled={state === "disabled"}
      />
      <Toggle
        label="Interface sounds"
        description="A little feedback for everyday actions."
        checked={sounds}
        onChange={(event) => setSounds(event.target.checked)}
        disabled={state === "disabled"}
      />
      <p role="status">
        Focus mode {focus ? "on" : "off"}. Sounds {sounds ? "on" : "off"}. Demo preferences only.
      </p>
    </div>
  );
}
