"use client";
import { useState } from "react";
import { Button, Tooltip } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ padding: "70px 16px", textAlign: "center" }}>
      <Tooltip
        content="Save a draft in this preview only."
        placement="top"
        defaultOpen={state === "open"}
        delay={100}
      >
        <Button onClick={() => setSaved(true)}>Save draft</Button>
      </Tooltip>
      <p role="status" style={{ marginTop: 24 }}>
        {saved ? "Draft saved in this demo." : "Hover or focus the button for a little guidance."}
      </p>
    </div>
  );
}
