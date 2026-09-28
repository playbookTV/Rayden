"use client";
import { useState } from "react";
import { DatePicker } from "@raydenui/ui";
import "@raydenui/ui/styles.css";

export default function Example() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 8, 24));
  return (
    <div style={{ width: "min(100%, 360px)" }}>
      <DatePicker value={date} onChange={setDate} showFooter onClear={() => setDate(null)} />
      <p role="status" style={{ marginTop: 24 }}>
        Selected:{" "}
        {date
          ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
          : "No date"}
      </p>
    </div>
  );
}
