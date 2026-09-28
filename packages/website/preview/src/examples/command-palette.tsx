"use client";
import { useState } from "react";
import { CommandPaletteBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [message, setMessage] = useState("Search for a page or start a demo action.");
  const [recovered, setRecovered] = useState(false);
  return (
    <div style={{ width: "min(100%, 480px)" }}>
      <h2 style={{ fontSize: 24, marginBottom: 24 }}>A shortcut to your next step.</h2>
      <CommandPaletteBlock
        triggerLabel="Find a page or action"
        defaultOpen={state !== "default"}
        showAllWhenEmpty
        groups={[
          { id: "pages", label: "Workspace" },
          { id: "actions", label: "Actions" },
        ]}
        items={
          state === "empty"
            ? []
            : [
                {
                  id: "projects",
                  label: "Open projects",
                  description: "Your team's current work",
                  groupId: "pages",
                  keywords: ["work", "tasks"],
                  onSelect: () => setMessage("Projects selected in this demo."),
                },
                {
                  id: "settings",
                  label: "Workspace settings",
                  description: "Preferences for Form & Field",
                  groupId: "pages",
                  onSelect: () => setMessage("Settings selected in this demo."),
                },
                {
                  id: "new",
                  label: "Create a project",
                  description: "Make space for the next idea",
                  groupId: "actions",
                  onSelect: () => setMessage("A demo project was created."),
                },
                {
                  id: "billing",
                  label: "Manage billing",
                  groupId: "pages",
                  unavailableReason: "Workspace owner access required.",
                },
              ]
        }
        status={!recovered && (state === "loading" || state === "error") ? state : "idle"}
        onRetry={() => setRecovered(true)}
      />
      <p role="status" style={{ marginTop: 24 }}>
        {message}
      </p>
    </div>
  );
}
