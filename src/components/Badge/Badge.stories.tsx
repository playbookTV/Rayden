import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const DotIcon = () => (
  <svg viewBox="0 0 12 12" fill="currentColor">
    <circle cx="6" cy="6" r="3" />
  </svg>
);

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["orange", "blue", "success", "warning", "error", "neutral", "disabled"],
    },
    type: { control: "select", options: ["filled", "accent", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    color: "orange",
    type: "filled",
    size: "sm",
  },
};

export const FilledColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge color="orange" type="filled">
        Orange
      </Badge>
      <Badge color="blue" type="filled">
        Blue
      </Badge>
      <Badge color="success" type="filled">
        Success
      </Badge>
      <Badge color="warning" type="filled">
        Warning
      </Badge>
      <Badge color="error" type="filled">
        Error
      </Badge>
      <Badge color="neutral" type="filled">
        Neutral
      </Badge>
      <Badge color="disabled" type="filled">
        Disabled
      </Badge>
    </div>
  ),
};

export const AccentColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge color="orange" type="accent">
        Orange
      </Badge>
      <Badge color="blue" type="accent">
        Blue
      </Badge>
      <Badge color="success" type="accent">
        Success
      </Badge>
      <Badge color="warning" type="accent">
        Warning
      </Badge>
      <Badge color="error" type="accent">
        Error
      </Badge>
      <Badge color="neutral" type="accent">
        Neutral
      </Badge>
      <Badge color="disabled" type="accent">
        Disabled
      </Badge>
    </div>
  ),
};

export const OutlineColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge color="orange" type="outline">
        Orange
      </Badge>
      <Badge color="blue" type="outline">
        Blue
      </Badge>
      <Badge color="success" type="outline">
        Success
      </Badge>
      <Badge color="warning" type="outline">
        Warning
      </Badge>
      <Badge color="error" type="outline">
        Error
      </Badge>
      <Badge color="neutral" type="outline">
        Neutral
      </Badge>
      <Badge color="disabled" type="outline">
        Disabled
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm" color="orange" type="filled">
        Small
      </Badge>
      <Badge size="md" color="orange" type="filled">
        Medium
      </Badge>
      <Badge size="lg" color="orange" type="filled">
        Large
      </Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge color="orange" type="filled" leadingIcon={<DotIcon />}>
        Leading
      </Badge>
      <Badge color="blue" type="accent" trailingIcon={<DotIcon />}>
        Trailing
      </Badge>
      <Badge color="success" type="outline" leadingIcon={<DotIcon />} trailingIcon={<DotIcon />}>
        Both
      </Badge>
    </div>
  ),
};
