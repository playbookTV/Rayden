import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
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

export const WithDisabled: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Archived", disabled: true },
      { label: "Detail", active: true },
    ],
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Products", href: "#" },
      { label: "Category", href: "#" },
      { label: "Subcategory", href: "#" },
      { label: "Item", active: true },
    ],
  },
};
