"use client";
import { useState } from "react";
import { FeatureOverviewBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [selected, setSelected] = useState("");
  const [recovered, setRecovered] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <FeatureOverviewBlock
        eyebrow="SPACE TO DO YOUR BEST WORK"
        title="Less juggling. More making."
        description="Three connected parts of a fictional team workspace."
        variant={state === "plain" ? "plain" : "card"}
        columns={3}
        features={[
          {
            id: "plan",
            title: "Make a clear plan",
            description: "Turn a loose idea into a small set of achievable steps.",
            icon: "calendar",
            cta: {
              label: "Explore planning",
              onClick: () => setSelected("Planning: organise milestones and choose the next step."),
            },
          },
          {
            id: "collaborate",
            title: "Keep everyone close",
            description: "Share context, ask a question, and keep feedback in one place.",
            icon: "users",
            cta: {
              label: "Explore collaboration",
              onClick: () => setSelected("Collaboration: collect feedback alongside the work."),
            },
          },
          {
            id: "deliver",
            title: "Finish with confidence",
            description: "See what is ready and what still needs a little attention.",
            icon: "check-circle",
            cta: {
              label: "Explore delivery",
              onClick: () =>
                setSelected("Delivery: review the checklist before handing work over."),
            },
          },
        ]}
        state={
          !recovered && (state === "loading" || state === "error" || state === "empty")
            ? state
            : "default"
        }
        onRetry={() => setRecovered(true)}
        emptyState={{
          title: "No features to show yet.",
          description: "Restore the demo capabilities to keep exploring.",
          cta: { label: "Show demo features", onClick: () => setRecovered(true) },
        }}
      />
      <p role="status" style={{ marginTop: 24 }}>
        {selected || "Choose a feature to see its demo details."}
      </p>
    </div>
  );
}
