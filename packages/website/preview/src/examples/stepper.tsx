"use client";
import { useState, useSyncExternalStore } from "react";
import { Stepper, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
const steps = [
  { title: "Your idea", description: "Give the work a starting point." },
  { title: "Your team", description: "Choose who will help shape it." },
  { title: "Ready to begin", description: "Review the plan and move forward." },
];
const compactQuery = "(max-width: 560px)";
function subscribeToSize(update: () => void) {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}
const isCompact = () => window.matchMedia(compactQuery).matches;
export default function Example({ state = "default" }: { state?: string }) {
  const compact = useSyncExternalStore(subscribeToSize, isCompact, () => false);
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  return (
    <div style={{ width: "min(100%, 760px)", display: "grid", gap: 32 }}>
      <Stepper
        steps={complete ? steps.map((item) => ({ ...item, status: "completed" as const })) : steps}
        activeStep={complete ? undefined : step}
        orientation={state === "vertical" || compact ? "vertical" : "horizontal"}
        indicator="number"
      />
      <div>
        <h2 style={{ fontSize: 24 }}>{complete ? "The demo plan is ready." : steps[step].title}</h2>
        <p role="status" style={{ marginTop: 16 }}>
          {complete
            ? "No workspace was created. This is a local step-by-step preview."
            : steps[step].description}
        </p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {complete ? (
          <Button
            variant="secondary"
            onClick={() => {
              setStep(0);
              setComplete(false);
            }}
          >
            Start again
          </Button>
        ) : (
          <>
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Back
            </Button>
            <Button onClick={() => (step === 2 ? setComplete(true) : setStep(step + 1))}>
              {step === 2 ? "Finish demo" : "Continue"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
