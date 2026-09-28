"use client";
import { useState } from "react";
import { Banner, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("");
  return (
    <div style={{ width: "100%" }}>
      {visible ? (
        <Banner
          title="A little more room for your ideas."
          description="Explore a new demo workspace layout."
          status={state === "warning" ? "warning" : "feature"}
          emphasis={state === "bold" ? "bold" : "subtle"}
          size="lg"
          buttonLabel="Explore the update"
          onButtonClick={() =>
            setMessage("Demo update opened. Your real workspace has not changed.")
          }
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <Button variant="secondary" onClick={() => setVisible(true)}>
          Show announcement
        </Button>
      )}
      <p role="status" style={{ marginTop: 28 }}>
        {message}
      </p>
    </div>
  );
}
