"use client";
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [ascending, setAscending] = useState(true);
  const rows =
    state === "empty"
      ? []
      : [
          { name: "Design system", owner: "Avery", status: "In progress" },
          { name: "Marketing site", owner: "Sam", status: "In review" },
          { name: "Customer portal", owner: "Jordan", status: "Planned" },
        ].sort((a, b) => (ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Table aria-label="Projects">
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sortDirection={ascending ? "asc" : "desc"}
              onSort={() => setAscending(!ascending)}
            >
              Project
            </TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={3}>No projects yet. Create one to get started.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
