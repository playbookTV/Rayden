"use client";
import { useState } from "react";
import { KpiOverviewBlock } from "@raydenui/ui/blocks";
import "@raydenui/ui/styles.css";
export default function Example({ state = "default" }: { state?: string }) {
  const [period, setPeriod] = useState("week");
  const [selected, setSelected] = useState("");
  const [recovered, setRecovered] = useState(false);
  const weekly = period === "week";
  return (
    <div style={{ width: "100%" }}>
      <KpiOverviewBlock
        title="The shape of your progress."
        description="Illustrative workspace activity, with a clear comparison period."
        period={{
          label: weekly ? "18–24 September 2026" : "September 2026",
          comparisonLabel: weekly ? "11–17 September 2026" : "August 2026",
        }}
        periodOptions={[
          { id: "week", label: "This week" },
          { id: "month", label: "This month" },
        ]}
        selectedPeriodId={period}
        onPeriodChange={setPeriod}
        metrics={
          state === "empty"
            ? []
            : [
                {
                  id: "projects",
                  label: "Projects completed",
                  value: weekly ? "12" : "46",
                  comparisonValue: weekly ? "9" : "38",
                  change: { label: weekly ? "+3" : "+8", direction: "up", sentiment: "positive" },
                  description: "Finished and handed over.",
                },
                {
                  id: "reviews",
                  label: "Reviews awaiting feedback",
                  value: weekly ? "4" : "7",
                  comparisonValue: weekly ? "6" : "10",
                  change: { label: weekly ? "−2" : "−3", direction: "down", sentiment: "positive" },
                  description: "A shorter queue for the team.",
                },
                {
                  id: "contributors",
                  label: "Active contributors",
                  value: weekly ? "18" : "24",
                  comparisonValue: weekly ? "16" : "22",
                  change: { label: "+2", direction: "up", sentiment: "neutral" },
                  description: "People moving work forward.",
                },
              ]
        }
        onSelectMetric={setSelected}
        status={!recovered && (state === "loading" || state === "error") ? state : "idle"}
        errorMessage="Example error: reporting is unavailable."
        onRetry={() => setRecovered(true)}
        footer={
          <p role="status">
            {selected
              ? `Selected metric: ${selected}. Demo data only.`
              : "Select a metric to inspect the demo selection."}
          </p>
        }
      />
    </div>
  );
}
