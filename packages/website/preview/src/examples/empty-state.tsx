"use client";
import { useState } from "react";
import { EmptyStateBlock } from "@raydenui/ui/blocks";
import { Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [created, setCreated] = useState(false);
  return (
    <div style={{ width: "min(100%, 620px)" }}>
      {created ? (
        <div>
          <h2 style={{ fontSize: 24 }}>Your first project is ready.</h2>
          <p role="status" style={{ margin: "16px 0 24px" }}>
            A demo project has been created in this preview.
          </p>
          <Button variant="secondary" onClick={() => setCreated(false)}>
            Show empty state again
          </Button>
        </div>
      ) : (
        <EmptyStateBlock
          illustration="project-list"
          illustrationColored={state !== "monochrome"}
          title="Your next idea belongs here."
          description="Start a project, give it a name, and make a little progress."
          variant={state === "inline" ? "inline" : "card"}
          action={{ label: "Create your first project", onClick: () => setCreated(true) }}
        />
      )}
    </div>
  );
}
