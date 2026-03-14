import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";

const UserIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
  </svg>
);

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    variant: { control: "select", options: ["input", "filter"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const InputChip: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip variant="input" icon={<UserIcon />} onClose={() => {}}>
        Label
      </Chip>
      <Chip variant="input" onClose={() => {}}>
        No Icon
      </Chip>
    </div>
  ),
};

export const FilterChip: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip variant="filter" icon={<UserIcon />} onDropdown={() => {}}>
        Filter
      </Chip>
      <Chip variant="filter" onDropdown={() => {}}>
        No Icon
      </Chip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip variant="input" icon={<UserIcon />} onClose={() => {}} disabled>
        Disabled Input
      </Chip>
      <Chip variant="filter" icon={<UserIcon />} onDropdown={() => {}} disabled>
        Disabled Filter
      </Chip>
    </div>
  ),
};
