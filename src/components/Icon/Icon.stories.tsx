import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./Icon";
import { icons, type IconName } from "./icons";

const allNames = Object.keys(icons) as IconName[];

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    name: { control: "select", options: allNames },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "solid"] },
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: "star",
    size: "lg",
    variant: "outline",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <Icon name="star" size={s} />
          <span className="text-body-xs text-grey-500">{s}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-1">
        <Icon name="star" size={48} />
        <span className="text-body-xs text-grey-500">48px</span>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(["outline", "solid"] as const).map((v) => (
        <div key={v} className="flex flex-col items-center gap-1">
          <Icon name="heart" size="xl" variant={v} />
          <span className="text-body-xs text-grey-500">{v}</span>
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="bell" size="lg" color="var(--color-primary-400)" />
      <Icon name="bell" size="lg" color="var(--color-secondary-400)" />
      <Icon name="bell" size="lg" color="var(--color-success-400)" />
      <Icon name="bell" size="lg" color="var(--color-error-400)" />
      <Icon name="bell" size="lg" color="var(--color-warning-400)" />
      <Icon name="bell" size="lg" color="var(--color-grey-500)" />
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
      {allNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-grey-200 p-3"
        >
          <div className="flex gap-2">
            <Icon name={name} size="md" variant="outline" />
            <Icon
              name={name}
              size="md"
              variant="solid"
              className="text-grey-400"
            />
          </div>
          <span className="text-center text-caption-xs text-grey-500 break-all">
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};
