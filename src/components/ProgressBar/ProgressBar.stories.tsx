import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "md", "lg"] },
    type: { control: "select", options: ["basic", "segmented"] },
    showPercentage: { control: "boolean" },
    percentagePosition: { control: "select", options: ["top", "bottom"] },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 50,
    label: "Progress",
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    value: 75,
    label: "Uploading...",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    value: 60,
    label: "Processing",
    size: "md",
  },
};

export const WithMetadata: Story = {
  args: {
    value: 30,
    label: "Uploading",
    metadata: ["3 of 10 files", "2 min left"],
    size: "lg",
  },
};

export const PercentageOnTop: Story = {
  args: {
    value: 65,
    label: "Progress",
    percentagePosition: "top",
    size: "lg",
  },
};

export const Segmented: Story = {
  args: {
    value: 50,
    label: "Progress",
    type: "segmented",
    size: "lg",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <ProgressBar value={50} label="Small (sm)" size="sm" />
      <ProgressBar value={50} label="Medium (md)" size="md" />
      <ProgressBar value={50} label="Large (lg)" size="lg" />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <ProgressBar value={50} label="Basic" type="basic" size="lg" />
      <ProgressBar value={50} label="Segmented" type="segmented" size="lg" />
    </div>
  ),
};

export const AllStages: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <ProgressBar value={0} label="0%" size="lg" />
      <ProgressBar value={25} label="25%" size="lg" />
      <ProgressBar value={50} label="50%" size="lg" />
      <ProgressBar value={75} label="75%" size="lg" />
      <ProgressBar value={100} label="100%" size="lg" />
    </div>
  ),
};

export const SegmentedStages: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      <ProgressBar value={0} label="0%" type="segmented" size="lg" />
      <ProgressBar value={30} label="30%" type="segmented" size="lg" />
      <ProgressBar value={50} label="50%" type="segmented" size="lg" />
      <ProgressBar value={80} label="80%" type="segmented" size="lg" />
      <ProgressBar value={100} label="100%" type="segmented" size="lg" />
    </div>
  ),
};
