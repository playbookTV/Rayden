"use client";
import { useState } from "react";
import { Alert, Button, type AlertState } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  const tone: AlertState = state === "default" ? "information" : (state as AlertState);
  return (
    <div style={{ width: "min(100%, 640px)" }}>
      {visible ? (
        <Alert
          variant="banner"
          state={tone}
          title={
            tone === "error"
              ? "This demo draft could not sync."
              : tone === "warning"
                ? "Your demo draft is still local."
                : tone === "success"
                  ? "Your demo draft is ready."
                  : "A little progress is worth saving."
          }
          description="Try an action or dismiss this message. Nothing is sent outside the preview."
          onClose={() => setVisible(false)}
          primaryAction={{
            label: "Review draft",
            onClick: () => setMessage("Draft selected for review in this demo."),
          }}
        />
      ) : (
        <Button variant="secondary" onClick={() => setVisible(true)}>
          Show message again
        </Button>
      )}
      <p role="status" style={{ marginTop: 24 }}>
        {message}
      </p>
    </div>
  );
}
