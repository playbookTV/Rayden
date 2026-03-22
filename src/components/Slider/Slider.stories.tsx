import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider, RangeSlider } from "./Slider";

const sliderMeta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    showPercentage: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default sliderMeta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    value: 50,
    label: "Label",
    metadata: ["meta data", "meta data"],
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    value: 30,
    label: "Label",
    metadata: ["meta data", "meta data"],
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    value: 60,
    label: "Label",
    metadata: ["meta data", "meta data"],
    size: "md",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[375px]">
      <Slider value={50} label="Large (lg)" size="lg" metadata={["meta data", "meta data"]} />
      <Slider value={50} label="Medium (md)" size="md" metadata={["meta data", "meta data"]} />
      <Slider value={50} label="Small (sm)" size="sm" metadata={["meta data", "meta data"]} />
    </div>
  ),
};

export const AllStages: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[375px]">
      {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
        <Slider key={v} value={v} label="Label" metadata={["meta data", "meta data"]} />
      ))}
    </div>
  ),
};

function InteractiveSlider() {
  const [val, setVal] = useState(40);
  return (
    <div className="w-[375px]">
      <Slider value={val} onChange={setVal} label="Label" metadata={["meta data", "meta data"]} />
    </div>
  );
}

function InteractiveRangeSlider() {
  const [val, setVal] = useState<[number, number]>([20, 80]);
  return (
    <div className="w-[375px]">
      <RangeSlider value={val} onChange={setVal} label="Label" />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveSlider />,
};

export const Range: StoryObj<typeof RangeSlider> = {
  render: () => (
    <div className="flex flex-col gap-8 w-[375px]">
      <RangeSlider value={[10, 70]} label="Label" size="lg" />
      <RangeSlider value={[10, 70]} label="Label" size="md" />
      <RangeSlider value={[10, 70]} label="Label" size="sm" />
    </div>
  ),
};

export const InteractiveRange: StoryObj<typeof RangeSlider> = {
  render: () => <InteractiveRangeSlider />,
};
