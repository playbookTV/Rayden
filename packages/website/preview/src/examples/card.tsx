"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Button,
  ProgressBar,
  type CardVariant,
} from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [progress, setProgress] = useState(60);
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ width: "min(100%, 440px)" }}>
      <Card variant={state as CardVariant}>
        <CardHeader
          title="A place for the next idea."
          subtitle="Northline · demo project"
          bordered
          actions={
            <Badge color={progress === 100 ? "success" : "warning"}>
              {progress === 100 ? "Ready" : "In progress"}
            </Badge>
          }
        />
        <CardBody>
          <p style={{ marginBottom: 24 }}>
            A considered identity, built one small decision at a time.
          </p>
          <ProgressBar label="Project checklist" value={progress} showPercentage />
        </CardBody>
        <CardFooter bordered align="between">
          <Button
            disabled={progress === 100}
            onClick={() => setProgress(Math.min(100, progress + 20))}
          >
            Complete a step
          </Button>
          <Button variant="text" onClick={() => setSaved(!saved)}>
            {saved ? "Saved" : "Save project"}
          </Button>
        </CardFooter>
      </Card>
      <p role="status" style={{ marginTop: 20 }}>
        {progress}% complete.{" "}
        {saved ? "Project saved locally in this demo." : "Changes stay in the preview."}
      </p>
    </div>
  );
}
