"use client";
import { useState } from "react";
import { Checkbox } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [channels, setChannels] = useState(["Product updates"]);
  const names = ["Product updates", "Design notes", "Community news"];
  return (
    <div style={{ width: "min(100%, 400px)", display: "grid", gap: 24 }}>
      <h2 style={{ fontSize: 24 }}>Make your inbox yours.</h2>
      <Checkbox
        label="Select all updates"
        checked={channels.length === 3}
        indeterminate={channels.length > 0 && channels.length < 3}
        disabled={state === "disabled"}
        onChange={(event) => setChannels(event.target.checked ? names : [])}
      />
      {names.map((name) => (
        <Checkbox
          key={name}
          label={name}
          checked={channels.includes(name)}
          disabled={state === "disabled"}
          onChange={(event) =>
            setChannels(
              event.target.checked
                ? [...channels, name]
                : channels.filter((channel) => channel !== name)
            )
          }
        />
      ))}
      <p role="status">{channels.length} update types selected. Preferences stay in this demo.</p>
    </div>
  );
}
