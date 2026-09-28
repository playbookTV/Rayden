"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [action, setAction] = useState("Choose a project action.");
  return (
    <div style={{ minHeight: 320, width: 300 }}>
      <DropdownMenu defaultOpen={state === "open"}>
        <DropdownMenuTrigger>Project actions ↓</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Workspace project</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setAction("Demo project duplicated.")}>
            Duplicate project
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAction("Demo link prepared.")}>
            Share project
          </DropdownMenuItem>
          <DropdownMenuItem
            destructive
            onSelect={() => setAction("Demo project archived. Reset to start again.")}
          >
            Archive project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p role="status" style={{ marginTop: 220 }}>
        {action}
      </p>
    </div>
  );
}
