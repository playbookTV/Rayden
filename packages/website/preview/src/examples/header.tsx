"use client";
import { useState } from "react";
import { HeaderBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [page, setPage] = useState("Overview");
  const [workspace, setWorkspace] = useState(0);
  const [message, setMessage] = useState("Choose a destination to try the header.");
  return (
    <div style={{ width: "100%", minHeight: 380 }}>
      <HeaderBlock
        variant={state === "search" ? 9 : state === "workspace" ? 10 : 1}
        logo={<strong>Form & Field</strong>}
        links={["Overview", "Projects", "Team"].map((label) => ({
          label,
          active: page === label,
          onClick: () => {
            setPage(label);
            setMessage(`${label} selected in this demo.`);
          },
        }))}
        actions={[
          {
            label: "New project",
            variant: "primary",
            onClick: () => setMessage("A local demo project was created."),
          },
        ]}
        announcement={{
          text: "A little room for good work.",
          linkLabel: "Take a look",
          onLinkClick: () => setMessage("Announcement opened in this demo."),
        }}
        searchPlaceholder="Search your workspace…"
        onSearch={(query) =>
          setMessage(query ? `Demo search: ${query}` : "Type to search the demo workspace.")
        }
        switcher={{ tabs: ["Studio", "Personal"], activeIndex: workspace, onChange: setWorkspace }}
      />
      <div style={{ padding: 24 }}>
        <h2 style={{ fontSize: 28 }}>{page}</h2>
        <p role="status" style={{ marginTop: 20 }}>
          {message}
        </p>
        {state === "workspace" && (
          <p style={{ marginTop: 12 }}>Workspace: {workspace === 0 ? "Studio" : "Personal"}</p>
        )}
      </div>
    </div>
  );
}
