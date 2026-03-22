import type { Meta, StoryObj } from "@storybook/react";
import { Stepper, LinearStepper, SegmentedStepper } from "./Stepper";
import type { StepItem } from "./Stepper";

const sampleSteps: StepItem[] = [
  { title: "Step Title", description: "Provide examples for clarity." },
  { title: "Step 2", description: "Provide examples for clarity." },
  { title: "Step 3", description: "Include images or diagrams if necessary." },
  { title: "Step 4", description: "Offer troubleshooting tips." },
  { title: "Step 5", description: "Conclude with a summary of key points." },
];

const verticalSteps: StepItem[] = [
  { title: "Step 1", description: "Explain your step here." },
  { title: "Step 2", description: "Provide examples for clarity." },
  { title: "Step 3", description: "Include images or diagrams if necessary." },
  { title: "Step 4", description: "Offer troubleshooting tips." },
  { title: "Step 5", description: "Conclude with a summary of key points." },
];

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    indicator: { control: "select", options: ["dot", "number", "icon"] },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Horizontal: Story = {
  args: {
    steps: sampleSteps,
    activeStep: 0,
    indicator: "dot",
  },
};

export const HorizontalWithNumbers: Story = {
  args: {
    steps: sampleSteps,
    activeStep: 2,
    indicator: "number",
  },
};

export const Vertical: Story = {
  args: {
    steps: verticalSteps,
    activeStep: 1,
    orientation: "vertical",
    indicator: "dot",
  },
};

export const VerticalWithNumbers: Story = {
  args: {
    steps: verticalSteps,
    activeStep: 3,
    orientation: "vertical",
    indicator: "number",
  },
};

export const AllSteps: Story = {
  render: () => (
    <div className="flex flex-col gap-12 w-full max-w-[800px]">
      <Stepper steps={sampleSteps} activeStep={0} indicator="dot" />
      <Stepper steps={sampleSteps} activeStep={1} indicator="dot" />
      <Stepper steps={sampleSteps} activeStep={2} indicator="dot" />
      <Stepper steps={sampleSteps} activeStep={3} indicator="dot" />
      <Stepper steps={sampleSteps} activeStep={4} indicator="dot" />
    </div>
  ),
};

export const Linear: StoryObj<typeof LinearStepper> = {
  render: () => (
    <div className="flex flex-col gap-8 w-[314px]">
      <LinearStepper currentStep={1} totalSteps={7} />
      <LinearStepper currentStep={3} totalSteps={7} />
      <LinearStepper currentStep={5} totalSteps={7} />
      <LinearStepper currentStep={7} totalSteps={7} />
    </div>
  ),
};

export const Segmented: StoryObj<typeof SegmentedStepper> = {
  render: () => (
    <div className="flex flex-col gap-8 w-[314px]">
      <SegmentedStepper currentStep={1} totalSteps={7} />
      <SegmentedStepper currentStep={3} totalSteps={7} />
      <SegmentedStepper currentStep={5} totalSteps={7} />
      <SegmentedStepper currentStep={7} totalSteps={7} />
    </div>
  ),
};

export const WithDisabled: Story = {
  args: {
    steps: [
      { title: "Step 1", description: "Completed", status: "completed" },
      { title: "Step 2", description: "Active", status: "active" },
      { title: "Step 3", description: "Incomplete" },
      { title: "Step 4", description: "Disabled", status: "disabled" },
    ],
    indicator: "number",
  },
};
