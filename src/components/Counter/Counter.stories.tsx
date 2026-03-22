import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Counter, NumberCounter } from "./Counter";

const counterMeta: Meta<typeof Counter> = {
  title: "Components/Counter",
  component: Counter,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    shape: { control: "select", options: ["rounded", "block", "pill"] },
    disabled: { control: "boolean" },
  },
};

export default counterMeta;
type Story = StoryObj<typeof Counter>;

export const Default: Story = {
  args: { defaultValue: 2 },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Counter defaultValue={2} size="sm" />
      <Counter defaultValue={2} size="md" />
      <Counter defaultValue={2} size="lg" />
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Counter defaultValue={2} shape="rounded" />
        <Counter defaultValue={2} shape="block" />
        <Counter defaultValue={2} shape="pill" />
      </div>
      <div className="flex items-center gap-4">
        <Counter defaultValue={2} shape="rounded" size="md" />
        <Counter defaultValue={2} shape="block" size="md" />
        <Counter defaultValue={2} shape="pill" size="md" />
      </div>
      <div className="flex items-center gap-4">
        <Counter defaultValue={2} shape="rounded" size="lg" />
        <Counter defaultValue={2} shape="block" size="lg" />
        <Counter defaultValue={2} shape="pill" size="lg" />
      </div>
    </div>
  ),
};

function InteractiveCounter() {
  const [val, setVal] = useState(5);
  return (
    <div className="flex flex-col gap-4 items-start">
      <p className="text-sm text-grey-500">Value: {val}</p>
      <Counter value={val} onChange={setVal} min={0} max={10} size="md" />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveCounter />,
};

export const WithMinMax: Story = {
  args: { defaultValue: 0, min: 0, max: 5, size: "md" },
};

export const NumberCounters: StoryObj<typeof NumberCounter> = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <NumberCounter value={99} size="sm" color="orange" />
        <NumberCounter value={99} size="md" color="orange" />
        <NumberCounter value={99} size="lg" color="orange" />
      </div>
      <div className="flex items-center gap-3">
        <NumberCounter value={99} size="sm" color="red" />
        <NumberCounter value={99} size="md" color="red" />
        <NumberCounter value={99} size="lg" color="red" />
      </div>
      <div className="flex items-center gap-3">
        <NumberCounter value={99} size="sm" color="grey" />
        <NumberCounter value={99} size="md" color="grey" />
        <NumberCounter value={99} size="lg" color="grey" />
      </div>
      <div className="flex items-center gap-3">
        <NumberCounter value={99} size="sm" color="white" />
        <NumberCounter value={99} size="md" color="white" />
        <NumberCounter value={99} size="lg" color="white" />
      </div>
    </div>
  ),
};
