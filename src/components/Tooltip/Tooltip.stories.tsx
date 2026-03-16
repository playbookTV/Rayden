import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
        "left-top",
        "left-center",
        "left-bottom",
        "right-top",
        "right-center",
        "right-bottom",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Light: Story = {
  args: {
    theme: "light",
    position: "top-left",
    title: "This is a tooltip",
    content:
      "Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand meaning, function.",
    onClose: () => {},
    primaryAction: { label: "Primary CTA", onClick: () => {} },
    secondaryAction: { label: "Secondary CTA", onClick: () => {} },
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
    position: "top-left",
    title: "This is a tooltip",
    content:
      "Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand meaning, function.",
    onClose: () => {},
    primaryAction: { label: "Primary CTA", onClick: () => {} },
    secondaryAction: { label: "Secondary CTA", onClick: () => {} },
  },
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <Tooltip position="top-left" content="Top left tooltip" title="Tooltip" />
      <Tooltip position="top-center" content="Top center tooltip" title="Tooltip" />
      <Tooltip position="top-right" content="Top right tooltip" title="Tooltip" />
      <Tooltip position="bottom-left" content="Bottom left tooltip" title="Tooltip" />
      <Tooltip position="bottom-center" content="Bottom center tooltip" title="Tooltip" />
      <Tooltip position="bottom-right" content="Bottom right tooltip" title="Tooltip" />
    </div>
  ),
};

export const NoTitle: Story = {
  args: {
    content: "Simple tooltip without a title.",
    onClose: () => {},
  },
};
