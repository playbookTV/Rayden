"use client";
import { useState } from "react";
import { Input } from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [name, setName] = useState("Avery Morgan");
  return (
    <div style={{ display: "grid", gap: 24, width: "min(100%, 400px)" }}>
      <Input
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        helperText="The name shown on your profile."
        disabled={state === "disabled"}
      />
      <Input
        label="Work email"
        type="email"
        placeholder="you@example.com"
        error={state === "error" ? "Enter a valid email address." : undefined}
        helperText="Use a demo address in this preview."
      />
      <p role="status">Profile preview: {name || "Your name"}</p>
    </div>
  );
}
