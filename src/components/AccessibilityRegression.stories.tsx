import type { Meta, StoryObj } from "@storybook/react";
import { LoginBlock } from "../blocks/LoginBlock";
import { TableBlock } from "../blocks/TableBlock";
import { ProgressBar } from "./ProgressBar";
import { ProgressCircle } from "./ProgressCircle";
import { Banner } from "./Banner";
import { Badge } from "./Badge";
import { Stepper } from "./Stepper";
import { RaydenChart } from "./Chart";

// Asserts the specific axe rules the 2026-09-20 audit flagged stay clear:
// aria-hidden-focus, label, button-name, empty-table-header,
// aria-progressbar-name, role-img-alt and color-contrast.
export default {
  title: "Quality/Accessibility contracts",
  parameters: { a11y: { test: "error" }, layout: "padded" },
} satisfies Meta;
type Story = StoryObj;

// aria-hidden-focus: the reveal control used to sit in an aria-hidden slot
export const Login: Story = { render: () => <LoginBlock /> };

// label + button-name + empty-table-header
export const Table: Story = {
  render: () => (
    <TableBlock
      rows={[
        {
          id: "1",
          name: "Ada Lovelace",
          email: "ada@example.com",
          initials: "AL",
          amount: "$1,200.00",
          paymentType: "Card",
          date: "12 Jun 2023",
          time: "10:24 AM",
          status: "Paid",
          statusColor: "success",
        },
      ]}
      onRowAction={() => {}}
    />
  ),
};

// aria-progressbar-name
export const Progress: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <ProgressBar label="Storage used" value={42} />
      <ProgressBar value={60} aria-label="Sync progress" />
      <ProgressCircle value={70} label="Upload progress" />
      <ProgressCircle value={30} />
    </div>
  ),
};

// color-contrast across statuses and both emphases
export const Contrast: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["information", "success", "error", "warning", "feature", "opportunity"] as const).map(
        (s) => (
          <Banner key={s} status={s} emphasis="bold" title={`${s} bold`} onDismiss={() => {}} />
        )
      )}
      {(["information", "success", "error", "warning", "feature", "opportunity"] as const).map(
        (s) => (
          <Banner key={`${s}-subtle`} status={s} title={`${s} subtle`} onDismiss={() => {}} />
        )
      )}
      <div className="flex gap-2">
        <Badge color="orange" type="filled">
          Filled
        </Badge>
        <Badge color="orange" type="accent">
          Accent
        </Badge>
      </div>
      <Stepper
        steps={[{ title: "Plan" }, { title: "Build" }, { title: "Review" }]}
        activeStep={1}
      />
    </div>
  ),
};

// role-img-alt: the chart canvas had no accessible name and no data alternative
export const Chart: Story = {
  render: () => (
    <div className="w-full max-w-full max-w-[420px]">
      <RaydenChart
        type="bar"
        title="Monthly revenue"
        summary="Revenue rose steadily from January to March."
        height={220}
        data={{
          labels: ["Jan", "Feb", "Mar"],
          datasets: [{ label: "Revenue", data: [12, 19, 24] }],
        }}
      />
    </div>
  ),
};
