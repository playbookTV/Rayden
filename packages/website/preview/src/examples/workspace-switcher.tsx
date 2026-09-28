"use client";
import { useState } from "react";
import { WorkspaceSwitcherBlock, type WorkspaceSwitcherItem } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
const workspaces: WorkspaceSwitcherItem[] = [
  { id: "studio", name: "Form & Field", detail: "Design studio · 8 members", initials: "FF" },
  { id: "personal", name: "Personal space", detail: "Your next good idea", initials: "AM" },
  {
    id: "archive",
    name: "Client archive",
    detail: "Previous collaborations",
    initials: "CA",
    unavailableReason: "Ask the owner for access.",
  },
];
export default function Example({ state = "default" }: { state?: string }) {
  const [current, setCurrent] = useState(workspaces[0]);
  const [recovered, setRecovered] = useState(false);
  return (
    <div style={{ width: "min(100%, 380px)", minHeight: 420 }}>
      <WorkspaceSwitcherBlock
        current={current}
        workspaces={state === "empty" ? [] : workspaces}
        onSelect={(id) => setCurrent(workspaces.find((workspace) => workspace.id === id)!)}
        defaultOpen={state !== "default"}
        filterThreshold={1}
        status={!recovered && (state === "loading" || state === "error") ? state : "idle"}
        onRetry={() => setRecovered(true)}
      />
      <p role="status" style={{ marginTop: 24 }}>
        Current workspace: {current.name}
      </p>
    </div>
  );
}
