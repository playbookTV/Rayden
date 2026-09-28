"use client";
import { useState } from "react";
import { Pagination } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
const projects = [
  "Northline identity",
  "Studio journal",
  "Customer interviews",
  "Website refresh",
  "Onboarding flow",
  "Design principles",
  "Member directory",
  "Autumn campaign",
  "Product handbook",
];
export default function Example() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ width: "min(100%, 540px)", display: "grid", gap: 28 }}>
      <h2 style={{ fontSize: 24 }}>A few projects at a time.</h2>
      <ul style={{ display: "grid", gap: 18 }}>
        {projects.slice((page - 1) * 3, page * 3).map((project) => (
          <li
            key={project}
            style={{ paddingBottom: 18, borderBottom: "1px solid var(--color-surface-border)" }}
          >
            {project}
          </li>
        ))}
      </ul>
      <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
      <p role="status">
        Page {page} of 3 · showing projects {(page - 1) * 3 + 1}–{page * 3}.
      </p>
    </div>
  );
}
