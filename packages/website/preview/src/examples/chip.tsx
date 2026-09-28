"use client";
import { useState } from "react";
import { Chip, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
const initial = ["Brand design", "Research", "Prototyping"];
export default function Example({ state = "default" }: { state?: string }) {
  const [tags, setTags] = useState(initial);
  return (
    <div style={{ width: "min(100%, 480px)", display: "grid", gap: 24 }}>
      <h2 style={{ fontSize: 24 }}>Keep the right things in view.</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            disabled={state === "disabled"}
            onClose={() => setTags(tags.filter((value) => value !== tag))}
          >
            {tag}
          </Chip>
        ))}
      </div>
      <p role="status">{tags.length} project tags selected.</p>
      <div>
        <Button variant="secondary" onClick={() => setTags(initial)}>
          Restore tags
        </Button>
      </div>
    </div>
  );
}
