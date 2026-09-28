"use client";
import { useState } from "react";
import { Select, SelectOption } from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example({ state = "default" }: { state?: string }) {
  const [role, setRole] = useState("designer");
  return (
    <div style={{ width: "min(100%, 360px)", minHeight: 300 }}>
      <Select
        label="Your role"
        value={role}
        onValueChange={setRole}
        disabled={state === "disabled"}
        helperText="Choose the role that fits your day."
      >
        <SelectOption value="designer">Designer</SelectOption>
        <SelectOption value="developer">Developer</SelectOption>
        <SelectOption value="product">Product manager</SelectOption>
      </Select>
      <p role="status" style={{ marginTop: 24 }}>
        Selected role: {role}
      </p>
    </div>
  );
}
