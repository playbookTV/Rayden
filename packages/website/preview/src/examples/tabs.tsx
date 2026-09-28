"use client";
import { useState } from "react";
import { Tabs, Tab } from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [value, setValue] = useState("overview");
  const content: Record<string, string> = {
    overview: "Everything you need to start your next project.",
    activity: "Avery updated the project brief. Sam added a new task.",
    settings: "Your workspace preferences live here.",
  };
  return (
    <div style={{ width: "min(100%, 480px)" }}>
      <Tabs
        variant={state === "line" ? "line" : "segmented"}
        value={value}
        onValueChange={setValue}
      >
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
      </Tabs>
      <div
        role="region"
        aria-label={`${value} content`}
        style={{ padding: "32px 8px", minHeight: 140 }}
      >
        <h2 style={{ fontSize: 22, marginBottom: 12, textTransform: "capitalize" }}>{value}</h2>
        <p>{content[value]}</p>
      </div>
    </div>
  );
}
