import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const DashboardIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="11" y="3" width="6" height="6" rx="1" />
    <rect x="3" y="11" width="6" height="6" rx="1" />
    <rect x="11" y="11" width="6" height="6" rx="1" />
  </svg>
);

const sixItems = [
  { label: "Breadcrumb", href: "#", icon: <DashboardIcon /> },
  { label: "Breadcrumb", href: "#", icon: <DashboardIcon /> },
  { label: "Breadcrumb", href: "#", icon: <DashboardIcon /> },
  { label: "Breadcrumb", href: "#", icon: <DashboardIcon /> },
  { label: "Breadcrumb", href: "#", icon: <DashboardIcon /> },
  { label: "Breadcrumb", icon: <DashboardIcon />, active: true },
];

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    separator: { control: "select", options: ["chevron", "double-chevron", "slash"] },
    hasBorders: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Settings", href: "#" },
      { label: "Profile", active: true },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: sixItems,
    separator: "chevron",
  },
};

export const WithBorders: Story = {
  args: {
    items: sixItems,
    separator: "chevron",
    hasBorders: true,
  },
};

export const DoubleChevron: Story = {
  args: {
    items: sixItems,
    separator: "double-chevron",
  },
};

export const Slash: Story = {
  args: {
    items: sixItems,
    separator: "slash",
  },
};

export const WithTruncation: Story = {
  args: {
    items: [
      { label: "Home", href: "#", icon: <DashboardIcon /> },
      { label: "...", href: "#" },
      { label: "Current Page", icon: <DashboardIcon />, active: true },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Archived", disabled: true },
      { label: "Detail", active: true },
    ],
  },
};

export const AllSeparators: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Breadcrumb separator="chevron" items={sixItems} />
      <Breadcrumb separator="double-chevron" items={sixItems} />
      <Breadcrumb separator="slash" items={sixItems} />
      <Breadcrumb separator="chevron" hasBorders items={sixItems} />
      <Breadcrumb separator="double-chevron" hasBorders items={sixItems} />
      <Breadcrumb separator="slash" hasBorders items={sixItems} />
    </div>
  ),
};
