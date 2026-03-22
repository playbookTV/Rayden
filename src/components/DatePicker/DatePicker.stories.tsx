import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["single", "range", "year"] },
    showFooter: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    value: new Date(2024, 11, 9),
  },
};

export const WithFooter: Story = {
  args: {
    value: new Date(2024, 11, 9),
    showFooter: true,
  },
};

export const DateRange: Story = {
  args: {
    mode: "range",
    rangeValue: [new Date(2024, 10, 15), new Date(2024, 11, 5)],
    showFooter: true,
  },
};

export const YearPicker: Story = {
  args: {
    mode: "year",
    value: new Date(2002, 0, 1),
    showFooter: true,
  },
};

function InteractiveDatePicker() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="flex flex-col gap-4 items-start">
      <p className="text-sm text-grey-500">Selected: {date ? date.toLocaleDateString() : "None"}</p>
      <DatePicker
        value={date}
        onChange={setDate}
        showFooter
        onDone={() => alert(`Done: ${date?.toLocaleDateString()}`)}
        onClear={() => setDate(null)}
      />
    </div>
  );
}

function InteractiveDateRangePicker() {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  return (
    <div className="flex flex-col gap-4 items-start">
      <p className="text-sm text-grey-500">
        Range: {range[0]?.toLocaleDateString() ?? "—"} to {range[1]?.toLocaleDateString() ?? "—"}
      </p>
      <DatePicker
        mode="range"
        rangeValue={range}
        onRangeChange={setRange}
        showFooter
        onClear={() => setRange([null, null])}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDatePicker />,
};

export const InteractiveRange: Story = {
  render: () => <InteractiveDateRangePicker />,
};

export const WithMinMax: Story = {
  args: {
    value: new Date(2024, 11, 15),
    minDate: new Date(2024, 11, 5),
    maxDate: new Date(2024, 11, 25),
    showFooter: true,
  },
};
