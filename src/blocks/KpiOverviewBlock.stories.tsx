import { useState, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { KpiOverviewBlock, type KpiMetric, type KpiPeriod } from "./KpiOverviewBlock";

const meta: Meta<typeof KpiOverviewBlock> = {
  title: "Blocks/KpiOverview",
  component: KpiOverviewBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof KpiOverviewBlock>;

function Frame({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="mx-auto w-full max-w-[1136px]">{children}</div>;
}

const period: KpiPeriod = {
  label: "1–21 September 2026",
  comparisonLabel: "1–21 August 2026",
};

const metrics: KpiMetric[] = [
  {
    id: "revenue",
    label: "Net revenue",
    value: "£248,310",
    comparisonValue: "£221,004",
    change: { label: "+12.4%", direction: "up", sentiment: "positive" },
    description: "Driven by 41 new annual contracts in the UK and Ireland.",
    icon: "coins",
  },
  {
    id: "orders",
    label: "Completed orders",
    value: "3,184",
    comparisonValue: "3,266",
    change: { label: "−2.5%", direction: "down", sentiment: "negative" },
    description: "Fewer repeat orders from the two largest wholesale accounts.",
    icon: "cart-check",
  },
  {
    id: "churn",
    label: "Monthly churn",
    value: "1.8%",
    comparisonValue: "2.6%",
    // Falling churn is a `down` direction with a positive sentiment: the two
    // are separate so the badge never misreads the movement.
    change: { label: "−0.8 pts", direction: "down", sentiment: "positive" },
    description: "Retention calls reached 92% of at-risk accounts this period.",
    icon: "user-remove",
  },
  {
    id: "response",
    label: "Median first response",
    value: "48 min",
    comparisonValue: "47 min",
    change: { label: "+1 min", direction: "up", sentiment: "neutral" },
    description: "Within the 60-minute target every week of the period.",
    icon: "stopwatch",
  },
];

/* ─── Default ─────────────────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock period={period} metrics={metrics} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The period is stated as text, not left implicit.
    await expect(
      canvas.getByText("1–21 September 2026 · compared with 1–21 August 2026")
    ).toBeVisible();
    // Direction is available without colour.
    await expect(canvas.getAllByText("increased by").length).toBeGreaterThan(0);
    await expect(canvas.getAllByText("decreased by").length).toBeGreaterThan(0);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
  },
};

/* ─── Period selection ────────────────────────────────────────────── */
function PeriodHarness() {
  const [periodId, setPeriodId] = useState("sep");
  const periods = [
    { id: "sep", label: "This month to date" },
    { id: "aug", label: "Last full month" },
    { id: "q3", label: "Quarter to date" },
  ];
  const current: KpiPeriod =
    periodId === "sep"
      ? period
      : periodId === "aug"
        ? { label: "1–31 August 2026", comparisonLabel: "1–31 July 2026" }
        : { label: "1 July – 21 September 2026", comparisonLabel: "1 April – 21 June 2026" };
  return (
    <Frame>
      <KpiOverviewBlock
        period={current}
        metrics={metrics}
        periodOptions={periods}
        selectedPeriodId={periodId}
        onPeriodChange={setPeriodId}
      />
    </Frame>
  );
}

export const WithPeriodSelector: Story = {
  render: () => <PeriodHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText("Reporting period");
    await userEvent.selectOptions(select, "aug");
    await expect(canvas.getByText("1–31 August 2026 · compared with 1–31 July 2026")).toBeVisible();
  },
};

/* ─── Sparklines ──────────────────────────────────────────────────── */
/* Each chart carries a visually hidden data table, so the numbers are never
   canvas-only. */
export const WithTrendlines: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock
        period={period}
        metrics={metrics.slice(0, 2).map((metric, index) => ({
          ...metric,
          trend: {
            labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
            values: index === 0 ? [48, 57, 62, 81] : [820, 790, 806, 768],
          },
        }))}
      />
    </Frame>
  ),
};

/* ─── One metric ──────────────────────────────────────────────────── */
export const SingleMetric: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock title="Revenue" period={period} metrics={[metrics[0]]} />
    </Frame>
  ),
};

/* ─── A large set ─────────────────────────────────────────────────── */
export const TwelveMetrics: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock
        period={period}
        metrics={Array.from({ length: 12 }, (_, index) => ({
          ...metrics[index % metrics.length],
          id: `metric-${index}`,
          label: `${metrics[index % metrics.length].label} ${index + 1}`,
        }))}
      />
    </Frame>
  ),
};

/* ─── A metric that could not be computed ─────────────────────────── */
export const MetricUnavailable: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock
        period={period}
        metrics={[
          metrics[0],
          {
            id: "margin",
            label: "Gross margin",
            value: "—",
            unavailableReason:
              "Cost data for September has not been imported yet. This figure returns once the import finishes.",
          },
          { ...metrics[2], comparisonValue: undefined, change: undefined },
          metrics[3],
        ]}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // No misleading zero: the tile says why the figure is missing.
    await expect(canvas.getByText("Not available")).toBeVisible();
    await expect(canvas.getByText("No comparable figure for 1–21 August 2026")).toBeVisible();
  },
};

/* ─── Loading ─────────────────────────────────────────────────────── */
export const Loading: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock period={period} metrics={[]} status="loading" />
    </Frame>
  ),
};

/* ─── Error with recovery ─────────────────────────────────────────── */
export const LoadFailed: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock
        period={period}
        metrics={[]}
        status="error"
        errorMessage="The reporting service timed out after 30 seconds. Your period choice is unchanged."
        onRetry={fn()}
      />
    </Frame>
  ),
};

/* ─── Nothing configured ──────────────────────────────────────────── */
export const NoMetrics: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock period={period} metrics={[]} />
    </Frame>
  ),
};

/* ─── Drill-through action ────────────────────────────────────────── */
export const WithDrillThrough: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock period={period} metrics={metrics} onSelectMetric={fn()} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Each action names the metric it opens.
    await expect(
      canvas.getByRole("button", { name: "View details for Net revenue" })
    ).toBeVisible();
  },
};

/* ─── Long labels and large values ────────────────────────────────── */
export const LongLabelsAndValues: Story = {
  render: () => (
    <Frame>
      <KpiOverviewBlock
        title="Betriebskennzahlen im Überblick"
        period={{
          label: "1. bis 21. September 2026",
          comparisonLabel: "1. bis 21. August 2026",
        }}
        metrics={[
          {
            id: "a",
            label: "Durchschnittlicher Auftragswert je Vertriebsregion",
            value: "1.284.930.475,22 ₦",
            comparisonValue: "1.190.004.318,40 ₦",
            change: { label: "+7,9 %", direction: "up", sentiment: "positive" },
            description:
              "Getragen von Großaufträgen im Norden sowie von Nachbestellungen bestehender Kunden.",
          },
          {
            id: "b",
            label: "Bearbeitungsdauer bis zur ersten Rückmeldung",
            value: "3 Std. 42 Min.",
            comparisonValue: "4 Std. 05 Min.",
            change: { label: "−23 Min.", direction: "down", sentiment: "positive" },
          },
        ]}
      />
    </Frame>
  ),
};

/* ─── Themed surface ──────────────────────────────────────────────── */
/* A brand surface value is mode-specific: Rayden has no paired foreground
   role yet, so a light brand surface is scoped as an explicit light island
   (`rayden-light`). Without that scope, a light surface inside a dark
   document would keep the inverted, near-white grey foregrounds. */
export const ThemedSurface: Story = {
  render: () => (
    <div
      className="rayden-light w-full bg-surface-muted p-4"
      style={
        {
          "--color-surface": "#f2e9da",
          "--color-surface-border": "#e0d3bd",
          "--color-surface-border-strong": "#c8b393",
        } as CSSProperties
      }
    >
      <Frame>
        <KpiOverviewBlock period={period} metrics={metrics} />
      </Frame>
    </div>
  ),
};

/* ─── Narrow container ────────────────────────────────────────────── */
/* A 380px dashboard column at a desktop viewport: the metric grid drops to
   one column from the container width, not the viewport. */
export const NarrowContainer: Story = {
  render: () => (
    <div className="w-[380px] border border-dashed border-surface-border-strong p-2">
      <KpiOverviewBlock
        period={period}
        metrics={metrics}
        periodOptions={[
          { id: "sep", label: "This month to date" },
          { id: "aug", label: "Last full month" },
        ]}
        selectedPeriodId="sep"
        onPeriodChange={fn()}
      />
    </div>
  ),
};
