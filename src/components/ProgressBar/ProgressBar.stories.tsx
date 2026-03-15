import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "lg"] },
    showPercentage: { control: "boolean" },
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

export const WithMetadata: Story = {
  args: {
    value: 30,
    label: "Uploading",
    metadata: "3 of 10 files",
    size: "lg",
  },
};

export const AllStages: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <ProgressBar value={0} label="0%" size="lg" />
      <ProgressBar value={25} label="25%" size="lg" />
      <ProgressBar value={50} label="50%" size="lg" />
      <ProgressBar value={75} label="75%" size="lg" />
      <ProgressBar value={100} label="100%" size="lg" />
    </div>
  ),
};
