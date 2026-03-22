import type { Meta, StoryObj } from "@storybook/react";
import { ProgressCircle } from "./ProgressCircle";

const meta: Meta<typeof ProgressCircle> = {
  title: "Components/ProgressCircle",
  component: ProgressCircle,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["default", "segmented"] },
    showText: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
  args: {
    value: 50,
    size: "md",
  },
};

export const Segmented: Story = {
  args: {
    value: 50,
    size: "md",
    variant: "segmented",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <ProgressCircle value={75} size="xs" />
      <ProgressCircle value={75} size="sm" />
      <ProgressCircle value={75} size="md" />
      <ProgressCircle value={75} size="lg" />
      <ProgressCircle value={75} size="xl" />
    </div>
  ),
};

export const SegmentedAllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <ProgressCircle value={75} size="xs" variant="segmented" />
      <ProgressCircle value={75} size="sm" variant="segmented" />
      <ProgressCircle value={75} size="md" variant="segmented" />
      <ProgressCircle value={75} size="lg" variant="segmented" />
      <ProgressCircle value={75} size="xl" variant="segmented" />
    </div>
  ),
};

export const ProgressSteps: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={0} size="lg" />
      <ProgressCircle value={25} size="lg" />
      <ProgressCircle value={50} size="lg" />
      <ProgressCircle value={75} size="lg" />
      <ProgressCircle value={100} size="lg" />
    </div>
  ),
};

export const SegmentedSteps: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ProgressCircle value={0} size="lg" variant="segmented" />
      <ProgressCircle value={30} size="lg" variant="segmented" />
      <ProgressCircle value={50} size="lg" variant="segmented" />
      <ProgressCircle value={80} size="lg" variant="segmented" />
      <ProgressCircle value={100} size="lg" variant="segmented" />
    </div>
  ),
};

export const NoText: Story = {
  args: {
    value: 60,
    size: "lg",
    showText: false,
  },
};
