import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M10 4v12M4 10h12" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "grey", "destructive", "text", "success", "warning", "info"],
    },
    appearance: { control: "select", options: ["solid", "outlined"] },
    size: { control: "select", options: ["sm", "lg"] },
    iconPosition: { control: "select", options: ["none", "leading", "trailing", "icon-only"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Label", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Label", variant: "secondary" },
};

export const Grey: Story = {
  args: { children: "Label", variant: "grey" },
};

export const GreyOutlined: Story = {
  args: { children: "Label", variant: "grey", appearance: "outlined" },
};

export const Destructive: Story = {
  args: { children: "Label", variant: "destructive" },
};

export const DestructiveOutlined: Story = {
  args: { children: "Label", variant: "destructive", appearance: "outlined" },
};

export const Text: Story = {
  args: { children: "Label", variant: "text" },
};

export const Large: Story = {
  args: { children: "Label", variant: "primary", size: "lg" },
};

export const WithLeadingIcon: Story = {
  args: {
    children: "Label",
    variant: "primary",
    icon: <PlusIcon />,
    iconPosition: "leading",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: "Label",
    variant: "primary",
    icon: <PlusIcon />,
    iconPosition: "trailing",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "primary",
    icon: <PlusIcon />,
    iconPosition: "icon-only",
  },
};

export const Disabled: Story = {
  args: { children: "Label", variant: "primary", disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="grey">Grey</Button>
        <Button variant="grey" appearance="outlined">Grey Outlined</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive" appearance="outlined">Destructive Outlined</Button>
        <Button variant="text">Text</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" size="lg">Primary Large</Button>
        <Button variant="secondary" size="lg">Secondary Large</Button>
        <Button variant="grey" size="lg">Grey Large</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" icon={<PlusIcon />} iconPosition="leading">Leading</Button>
        <Button variant="primary" icon={<PlusIcon />} iconPosition="trailing">Trailing</Button>
        <Button variant="primary" icon={<PlusIcon />} iconPosition="icon-only" />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="secondary" disabled>Disabled</Button>
        <Button variant="grey" disabled>Disabled</Button>
      </div>
    </div>
  ),
};
