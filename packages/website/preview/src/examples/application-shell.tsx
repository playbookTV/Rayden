"use client";
import { useState } from "react";
import { ApplicationShellBlock } from "@raydenui/ui/blocks";
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [active, setActive] = useState("Overview");
  const [count, setCount] = useState(3);
  return (
    <ApplicationShellBlock
      brand={<strong>Form & Field</strong>}
      navSections={[
        {
          id: "workspace",
          label: "Workspace",
          items: ["Overview", "Projects", "Team", "Settings"].map((label) => ({
            id: label,
            label,
            current: label === active,
            onClick: () => setActive(label),
          })),
        },
      ]}
      navStatus={state === "loading" ? "loading" : "idle"}
      sidebarFooter={<small>Demo workspace · Personal</small>}
      expandAt="sm"
      stickyTopBar={false}
    >
      <div style={{ padding: "16px 0", display: "grid", gap: 28 }}>
        <div>
          <p style={{ marginBottom: 8 }}>YOUR WORKSPACE</p>
          <h2 style={{ fontSize: 30, letterSpacing: "-.04em" }}>
            {active === "Overview" ? "A little room to do great work." : active}
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <p role="status">{count} projects in this demo workspace.</p>
          <Button onClick={() => setCount(count + 1)}>New project</Button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table aria-label="Workspace projects">
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Brand refresh</TableCell>
                <TableCell>In progress</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Website launch</TableCell>
                <TableCell>In review</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Customer portal</TableCell>
                <TableCell>Planned</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </ApplicationShellBlock>
  );
}
