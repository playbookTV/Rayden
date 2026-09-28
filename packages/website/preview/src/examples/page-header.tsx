"use client";
import { useState } from "react";
import { PageHeaderBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [message, setMessage] = useState("Choose an action to try this project header.");
  const [approved, setApproved] = useState(false);
  const [recovered, setRecovered] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <PageHeaderBlock
        title="A new chapter for Northline."
        eyebrow="BRAND PROJECT"
        description="A considered identity for a fictional independent studio."
        breadcrumbs={[
          {
            id: "workspace",
            label: "Workspace",
            onClick: () => setMessage("Workspace selected in this demo."),
          },
          {
            id: "projects",
            label: "Projects",
            onClick: () => setMessage("Projects selected in this demo."),
          },
          { id: "northline", label: "Northline" },
        ]}
        status={{
          label: approved ? "Approved" : "In review",
          tone: approved ? "success" : "warning",
        }}
        meta={[
          { id: "owner", label: "Owner", value: "Avery Morgan" },
          { id: "due", label: "Due", value: "28 September 2026" },
        ]}
        actions={[
          {
            id: "approve",
            label: "Approve demo",
            priority: "primary",
            onClick: () => {
              setApproved(true);
              setMessage("Demo project approved locally.");
            },
          },
          {
            id: "share",
            label: "Share preview",
            onClick: () => setMessage("Sharing selected. No message or invitation was sent."),
          },
          {
            id: "archive",
            label: "Archive project",
            priority: "overflow",
            onClick: () => setMessage("Demo project archived locally."),
          },
          {
            id: "delete",
            label: "Delete project",
            priority: "overflow",
            unavailableReason: "Only the demo owner can delete projects.",
          },
        ]}
        variant={state === "plain" ? "plain" : "surface"}
        state={!recovered && (state === "loading" || state === "error") ? state : "default"}
        onRetry={() => setRecovered(true)}
      />
      <p role="status" style={{ marginTop: 32 }}>
        {message}
      </p>
    </div>
  );
}
