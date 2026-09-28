"use client";
import { useState } from "react";
import { ProductHeroBlock } from "@raydenui/ui/blocks";
import { Card, CardHeader, CardBody, ProgressBar, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [progress, setProgress] = useState(60);
  const [message, setMessage] = useState("");
  const [recovered, setRecovered] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <ProductHeroBlock
        eyebrow="FORM & FIELD"
        eyebrowBadge="Demo workspace"
        headline="Bring good work into focus."
        description="A little structure for your ideas, your team, and the things you want to make."
        primaryCta={{
          label: "Try the workspace",
          onClick: () => setMessage("Demo workspace opened. No account was created."),
        }}
        secondaryCta={{
          label: "See how it works",
          onClick: () =>
            setMessage("Complete a step in the example project to see its progress change."),
        }}
        note="An illustrative product hero built with real Rayden components."
        align={state === "centered" ? "center" : "start"}
        mediaSlot={
          state === "centered" ? undefined : (
            <Card variant="outlined">
              <CardHeader
                title="The next chapter"
                subtitle="A demo project, moving forward."
                bordered
              />
              <CardBody>
                <div style={{ display: "grid", gap: 24 }}>
                  <ProgressBar
                    value={progress}
                    label="Project checklist"
                    metadata={`${progress / 20} of 5 steps complete`}
                    showPercentage
                  />
                  <p>Small steps. A clearer path to done.</p>
                  <Button
                    variant="secondary"
                    disabled={progress === 100}
                    onClick={() => setProgress(Math.min(100, progress + 20))}
                  >
                    Complete a project step
                  </Button>
                </div>
              </CardBody>
            </Card>
          )
        }
        state={!recovered && (state === "loading" || state === "error") ? state : "default"}
        onRetry={() => setRecovered(true)}
      />
      <p role="status" style={{ marginTop: 24 }}>
        {message}
      </p>
    </div>
  );
}
