"use client";
import { useState } from "react";
import { Breadcrumb, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
const locations = ["Workspace", "Projects", "Northline"];
export default function Example({ state = "default" }: { state?: string }) {
  const [current, setCurrent] = useState(2);
  return (
    <div style={{ width: "min(100%, 640px)", display: "grid", gap: 28 }}>
      <Breadcrumb
        separator={state === "slash" ? "slash" : "chevron"}
        hasBorders={state === "bordered"}
        items={locations
          .slice(0, current + 1)
          .map((label, index) => ({
            label,
            active: index === current,
            href: index < current ? `#breadcrumb-${index}` : undefined,
          }))}
        onClick={(event) => {
          const anchor = (event.target as HTMLElement).closest("a");
          if (anchor) {
            event.preventDefault();
            setCurrent(Number(anchor.hash.replace("#breadcrumb-", "")));
          }
        }}
      />
      <section id={`breadcrumb-${current}`}>
        <h2 style={{ fontSize: 28 }}>{locations[current]}</h2>
        <p role="status" style={{ marginTop: 16 }}>
          You are viewing the {locations[current].toLowerCase()} demo.
        </p>
      </section>
      <div>
        <Button variant="secondary" disabled={current === 2} onClick={() => setCurrent(2)}>
          Open Northline project
        </Button>
      </div>
    </div>
  );
}
