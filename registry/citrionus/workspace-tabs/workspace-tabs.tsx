"use client";

import { useState } from "react";
import { Tab, Tabs } from "@raydenui/ui";

const panels = {
  overview: { label: "Overview", text: "Your workspace overview goes here." },
  activity: { label: "Activity", text: "Your recent activity goes here." },
} as const;

/** Own and edit this composition. Tabs and Tab remain package-managed. */
export function WorkspaceTabs() {
  const [value, setValue] = useState<keyof typeof panels>("overview");
  const panel = panels[value];

  return (
    <section aria-label="Workspace">
      <Tabs
        variant="line"
        size="md"
        value={value}
        onValueChange={(next) => {
          if (next === "overview" || next === "activity") setValue(next);
        }}
      >
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
      </Tabs>
      <div role="tabpanel" aria-label={panel.label} tabIndex={0} style={{ paddingBlock: 24 }}>
        <p>{panel.text}</p>
      </div>
    </section>
  );
}
