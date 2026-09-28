"use client";
import { useState } from "react";
import { Avatar, AvatarGroup, Button } from "@raydenui/ui";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [online, setOnline] = useState(true);
  return (
    <div style={{ width: "min(100%, 440px)", display: "grid", gap: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Avatar
          type={state === "icon" ? "icon" : "initials"}
          initials="AM"
          size="xl"
          status={online ? "online" : "offline"}
          statusLabel={online ? "Avery is available" : "Avery is away"}
        />
        <div>
          <h2 style={{ fontSize: 22 }}>Avery Morgan</h2>
          <p>Product designer · demo profile</p>
        </div>
      </div>
      <AvatarGroup max={expanded ? 4 : 2} size="lg">
        {["AM", "SR", "JL", "CB"].map((initials) => (
          <Avatar
            key={initials}
            type="initials"
            initials={initials}
            aria-label={`Demo collaborator ${initials}`}
          />
        ))}
      </AvatarGroup>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show fewer" : "Show all collaborators"}
        </Button>
        <Button variant="text" onClick={() => setOnline(!online)}>
          {online ? "Set away" : "Set available"}
        </Button>
      </div>
    </div>
  );
}
