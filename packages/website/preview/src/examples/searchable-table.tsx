"use client";
import { useState } from "react";
import { SearchableTableBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";

const projects = [
  { id: "1", name: "Brand refresh", owner: "Avery Morgan", status: "In progress", due: "Oct 12" },
  { id: "2", name: "Customer portal", owner: "Sam Rivera", status: "In review", due: "Oct 18" },
  { id: "3", name: "Design system", owner: "Jordan Lee", status: "In progress", due: "Oct 24" },
  { id: "4", name: "Marketing site", owner: "Casey Blake", status: "Planned", due: "Nov 02" },
];
export default function Example({ state = "default" }: { state?: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div>
      <h2 style={{ fontSize: 24, marginBottom: 8 }}>Projects</h2>
      <p style={{ marginBottom: 28 }}>A clear view of what comes next.</p>
      <SearchableTableBlock
        rows={state === "empty" ? [] : projects}
        columns={[
          { key: "name", label: "Project", sortable: true },
          { key: "owner", label: "Owner", sortable: true },
          { key: "status", label: "Status" },
          { key: "due", label: "Due date" },
        ]}
        searchPlaceholder="Search projects…"
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
      />
      <p role="status" style={{ marginTop: 24 }}>
        {selected.length} projects selected. Search and sort run locally.
      </p>
    </div>
  );
}
