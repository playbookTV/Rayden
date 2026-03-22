import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["thin", "bold", "duo-tone", "buffering-thin", "buffering-bold", "dot", "juggling"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] },
    colorStyle: { control: "select", options: ["brand", "white"] },
    labelPosition: { control: "select", options: ["after", "before", "above", "below"] },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    label: "Loading...",
    type: "thin",
    size: "md",
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center">
      <Spinner type="thin" label="Thin" />
      <Spinner type="bold" label="Bold" />
      <Spinner type="duo-tone" label="Duo Tone" />
      <Spinner type="buffering-thin" label="Buffering Thin" />
      <Spinner type="buffering-bold" label="Buffering Bold" />
      <Spinner type="dot" label="Dot" />
      <Spinner type="juggling" label="Juggling" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
      <Spinner size="2xl" />
      <Spinner size="3xl" />
    </div>
  ),
};

export const LabelPositions: Story = {
  render: () => (
    <div className="flex gap-12 items-center">
      <Spinner label="After" labelPosition="after" />
      <Spinner label="Before" labelPosition="before" />
      <Spinner label="Above" labelPosition="above" />
      <Spinner label="Below" labelPosition="below" />
    </div>
  ),
};

export const WhiteStyle: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center bg-grey-900 p-8 rounded-xl">
      <Spinner type="thin" colorStyle="white" label="Thin" />
      <Spinner type="bold" colorStyle="white" label="Bold" />
      <Spinner type="duo-tone" colorStyle="white" label="Duo Tone" />
      <Spinner type="buffering-thin" colorStyle="white" label="Buffering" />
      <Spinner type="dot" colorStyle="white" label="Dot" />
      <Spinner type="juggling" colorStyle="white" label="Juggling" />
    </div>
  ),
};

export const NoLabel: Story = {
  args: {
    type: "bold",
    size: "lg",
  },
};

export const AllTypesLarge: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 items-center">
      <Spinner type="thin" size="xl" />
      <Spinner type="bold" size="xl" />
      <Spinner type="duo-tone" size="xl" />
      <Spinner type="buffering-thin" size="xl" />
      <Spinner type="buffering-bold" size="xl" />
      <Spinner type="dot" size="xl" />
      <Spinner type="juggling" size="xl" />
    </div>
  ),
};
