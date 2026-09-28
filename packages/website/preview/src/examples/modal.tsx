"use client";
import { useState } from "react";
import { Button, Modal } from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [open, setOpen] = useState(state === "open");
  const [message, setMessage] = useState("No project changes have been made.");
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Archive project</Button>
      <p role="status" style={{ marginTop: 24 }}>
        {message}
      </p>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Archive this project?"
        description="This is an interactive demo. Nothing outside this preview will change."
        primaryLabel="Archive demo"
        onPrimaryClick={() => {
          setMessage("Demo project archived.");
          setOpen(false);
        }}
        secondaryLabel="Keep project"
        onSecondaryClick={() => setOpen(false)}
      />
    </div>
  );
}
